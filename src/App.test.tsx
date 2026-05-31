import { describe, it, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// localStorage is mocked with vi.fn() in test/setup.ts — expose the typed mocks.
const getItem = localStorage.getItem as unknown as Mock;
const setItem = localStorage.setItem as unknown as Mock;

describe('SchulFit App', () => {
  beforeEach(() => {
    getItem.mockReset();
    setItem.mockReset();
    getItem.mockReturnValue(null);
  });

  // Helper: from the initial "choose" gate, enter the new-profile form.
  const gotoNewProfile = async () => {
    render(<App />);
    await waitFor(
      () => {
        expect(screen.getByText('✨ New child — set up')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    fireEvent.click(screen.getByText('✨ New child — set up'));
  };

  describe('Initial Setup', () => {
    it('renders setup screen when no profile exists', async () => {
      render(<App />);
      await waitFor(
        () => {
          expect(screen.getByText('SchulFit')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
      expect(screen.getByText('German school prep for immigrant families')).toBeInTheDocument();
    });

    it('offers a restore path for returning families', async () => {
      render(<App />);
      await waitFor(
        () => {
          expect(screen.getByText('↩️ I already have data')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('shows child name input field', async () => {
      await gotoNewProfile();
      await waitFor(() => {
        expect(screen.getByText('What is your child called?')).toBeInTheDocument();
      });
    });
  });

  describe('Profile Creation', () => {
    it('allows entering child name', async () => {
      await gotoNewProfile();
      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g. Ali, Fatima, Sara...')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('e.g. Ali, Fatima, Sara...') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'Anna' } });
      expect(nameInput.value).toBe('Anna');
    });

    it('navigates to welcome screen after profile setup', async () => {
      await gotoNewProfile();
      await waitFor(() => {
        expect(screen.getByText('Start Learning!')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('e.g. Ali, Fatima, Sara...') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'Anna' } });

      fireEvent.click(screen.getByText('Start Learning!'));

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, Anna/)).toBeInTheDocument();
      });
    });

    it('allows skipping profile setup', async () => {
      await gotoNewProfile();
      await waitFor(() => {
        expect(screen.getByText('Skip for now')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Skip for now'));

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, Champ/)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('shows menu when Start Practicing is clicked', async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Start Practicing')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText("Anna's Topics")).toBeInTheDocument();
      });
    });
  });

  describe('Learning Categories', () => {
    const setupToMenu = async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Start Practicing')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText("Anna's Topics")).toBeInTheDocument();
      });
    };

    it('displays learning category sections', async () => {
      await setupToMenu();

      expect(screen.getByText('Language and Vocabulary')).toBeInTheDocument();
      expect(screen.getByText('Numbers and Math')).toBeInTheDocument();
    });

    it('displays German category names', async () => {
      await setupToMenu();

      expect(screen.getByText('Farben')).toBeInTheDocument();
      expect(screen.getByText('Formen')).toBeInTheDocument();
      expect(screen.getByText('Zahlen')).toBeInTheDocument();
    });
  });

  describe('Flash Card Mode', () => {
    const setupFlashCards = async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Start Practicing')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText('Farben')).toBeInTheDocument();
      });

      const flashCardButtons = screen.getAllByText('🃏');
      fireEvent.click(flashCardButtons[0]);
    };

    it('displays flash card with card counter', async () => {
      await setupFlashCards();

      await waitFor(() => {
        expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument();
      });
    });

    it('has navigation buttons', async () => {
      await setupFlashCards();

      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      expect(screen.getByText('Prev')).toBeInTheDocument();
    });
  });

  describe('Quiz Mode', () => {
    const setupQuiz = async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Start Practicing')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText('Zahlen')).toBeInTheDocument();
      });

      const quizButtons = screen.getAllByText('🎯');
      fireEvent.click(quizButtons[0]);
    };

    it('displays question progress', async () => {
      await setupQuiz();

      await waitFor(() => {
        expect(screen.getByText(/\d+ \/ \d+ - score \d+/)).toBeInTheDocument();
      });
    });

    it('has a back button', async () => {
      await setupQuiz();

      await waitFor(() => {
        expect(screen.getByText('Back')).toBeInTheDocument();
      });
    });
  });

  describe('Statistics', () => {
    it('navigates to stats screen', async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Progress Dashboard')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Progress Dashboard'));

      await waitFor(() => {
        expect(screen.getAllByText('Progress Dashboard').length).toBeGreaterThan(0);
        expect(screen.getByText('Anna')).toBeInTheDocument();
      });
    });

    it('shows empty state when no activity', async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Progress Dashboard')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Progress Dashboard'));

      await waitFor(() => {
        expect(screen.getByText('No activity yet - start practicing!')).toBeInTheDocument();
      });
    });
  });

  describe('Settings', () => {
    it('navigates to settings screen', async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Settings')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Settings'));

      await waitFor(() => {
        expect(screen.getByText('Backup & reset')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Voice'));

      await waitFor(() => {
        expect(screen.getByText('Voice Gender')).toBeInTheDocument();
      });
    });

    it('shows child nickname input in settings', async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('Settings')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('Settings'));

      await waitFor(() => {
        expect(screen.getByText('Edit nickname')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Edit nickname'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g. Ali, Fatima')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('Anna')).toBeInTheDocument();
    });
  });

  describe('About Screen', () => {
    it('navigates to about screen', async () => {
      getItem.mockImplementation((key: string) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText('About')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText('About'));

      await waitFor(() => {
        expect(screen.getByText('About SchulFit')).toBeInTheDocument();
      });
    });
  });
});

describe('Category Data', () => {
  beforeEach(() => {
    getItem.mockReset();
    setItem.mockReset();
  });

  it('contains all expected German category names', async () => {
    getItem.mockImplementation((key: string) => {
      if (key === 'schulfit_profile') {
        return JSON.stringify({ kidName: 'Test' });
      }
      return null;
    });

    render(<App />);

    await waitFor(
      () => {
        expect(screen.getByText('Start Practicing')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    fireEvent.click(screen.getByText('Start Practicing'));

    await waitFor(() => {
      expect(screen.getByText('Farben')).toBeInTheDocument();
    });

    expect(screen.getByText('Formen')).toBeInTheDocument();
    expect(screen.getByText('Zahlen')).toBeInTheDocument();
    expect(screen.getByText('Tiere')).toBeInTheDocument();
  });
});
