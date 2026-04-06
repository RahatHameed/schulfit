import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('SchulFit App', () => {
  beforeEach(() => {
    localStorage.getItem.mockReset();
    localStorage.setItem.mockReset();
    localStorage.getItem.mockReturnValue(null);
  });

  describe('Initial Setup', () => {
    it('renders setup screen when no profile exists', async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('SchulFit')).toBeInTheDocument();
      }, { timeout: 3000 });
      expect(screen.getByText('German school prep for immigrant families')).toBeInTheDocument();
    });

    it('shows child name input field', async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('What is your child called?')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Profile Creation', () => {
    it('allows entering child name', async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g. Ali, Fatima, Sara...')).toBeInTheDocument();
      }, { timeout: 3000 });

      const nameInput = screen.getByPlaceholderText('e.g. Ali, Fatima, Sara...');
      fireEvent.change(nameInput, { target: { value: 'Anna' } });
      expect(nameInput.value).toBe('Anna');
    });

    it('navigates to welcome screen after profile setup', async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Start Learning!')).toBeInTheDocument();
      }, { timeout: 3000 });

      const nameInput = screen.getByPlaceholderText('e.g. Ali, Fatima, Sara...');
      fireEvent.change(nameInput, { target: { value: 'Anna' } });

      fireEvent.click(screen.getByText('Start Learning!'));

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, Anna/)).toBeInTheDocument();
      });
    });

    it('allows skipping profile setup', async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Skip for now')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Skip for now'));

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, Champ/)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('shows menu when Start Practicing is clicked', async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Start Practicing')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText("Anna's Topics")).toBeInTheDocument();
      });
    });
  });

  describe('Learning Categories', () => {
    const setupToMenu = async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Start Practicing')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText("Anna's Topics")).toBeInTheDocument();
      });
    };

    it('displays learning category sections', async () => {
      await setupToMenu();

      // Check for section headers
      expect(screen.getByText('Language and Vocabulary')).toBeInTheDocument();
      expect(screen.getByText('Numbers and Math')).toBeInTheDocument();
    });

    it('displays German category names', async () => {
      await setupToMenu();

      // Categories show German names with English subtitles
      expect(screen.getByText('Farben')).toBeInTheDocument();
      expect(screen.getByText('Formen')).toBeInTheDocument();
      expect(screen.getByText('Zahlen')).toBeInTheDocument();
    });
  });

  describe('Flash Card Mode', () => {
    const setupFlashCards = async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Start Practicing')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText('Farben')).toBeInTheDocument();
      });

      // Click the flash card button (🃏) for Colors category
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
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Start Practicing')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Start Practicing'));

      await waitFor(() => {
        expect(screen.getByText('Zahlen')).toBeInTheDocument();
      });

      // Click the quiz button (🎯) for Numbers category
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
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Progress Dashboard')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Progress Dashboard'));

      await waitFor(() => {
        // Header shows "Progress Dashboard" and user name is shown separately
        expect(screen.getAllByText('Progress Dashboard').length).toBeGreaterThan(0);
        expect(screen.getByText('Anna')).toBeInTheDocument();
      });
    });

    it('shows empty state when no activity', async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Progress Dashboard')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Progress Dashboard'));

      await waitFor(() => {
        expect(screen.getByText('No activity yet - start practicing!')).toBeInTheDocument();
      });
    });
  });

  describe('Settings', () => {
    it('navigates to settings screen', async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Settings'));

      await waitFor(() => {
        expect(screen.getByText('Voice Gender')).toBeInTheDocument();
      });
    });

    it('shows child nickname input in settings', async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('Settings'));

      await waitFor(() => {
        expect(screen.getByText('Child Nickname')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('Anna')).toBeInTheDocument();
    });
  });

  describe('About Screen', () => {
    it('navigates to about screen', async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'schulfit_profile') {
          return JSON.stringify({ kidName: 'Anna' });
        }
        return null;
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('About')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByText('About'));

      await waitFor(() => {
        expect(screen.getByText('About SchulFit')).toBeInTheDocument();
      });
    });
  });
});

describe('Category Data', () => {
  beforeEach(() => {
    localStorage.getItem.mockReset();
    localStorage.setItem.mockReset();
  });

  it('contains all expected German category names', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'schulfit_profile') {
        return JSON.stringify({ kidName: 'Test' });
      }
      return null;
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Start Practicing')).toBeInTheDocument();
    }, { timeout: 3000 });

    fireEvent.click(screen.getByText('Start Practicing'));

    await waitFor(() => {
      expect(screen.getByText('Farben')).toBeInTheDocument();
    });

    // Check German category names
    expect(screen.getByText('Formen')).toBeInTheDocument();
    expect(screen.getByText('Zahlen')).toBeInTheDocument();
    expect(screen.getByText('Tiere')).toBeInTheDocument();
  });
});
