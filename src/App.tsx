// =============================================================================
// App.tsx - Main Application Component
// =============================================================================

import { useState, useRef, useEffect, useCallback } from 'react';

// Constants
import { MODES } from './constants/modes';
import { CELEB } from './constants/celebrations';

// Services
import { StorageService } from './services/StorageService';
import { setGender, setOwlCallback, speak, initVoices, playSound } from './services/AudioService';
import { getItems } from './services/DataGenerationService';
import { correctVal, qSpeech, buildOpts } from './services/QuizLogicService';
import { todayStr } from './utils/dateUtils';
import { normalize } from './utils/germanUtils';

// Hooks
import { usePwaUpdate, useDriveRedirect, useReminderScheduler } from './hooks';

// Components
import { UpdateBanner } from './components';

// Screens
import {
  LoadingScreen,
  SetupScreen,
  WelcomeScreen,
  MenuScreen,
  QuizScreen,
  FlashScreen,
  VoiceScreen,
  StatsScreen,
  SettingsScreen,
  AboutScreen,
  DeveloperScreen,
} from './screens';

import type {
  Cat,
  CatProgress,
  CatProgressEntry,
  ColorItem,
  DailyStat,
  Item,
  Mode,
  OwlState,
  Prefs,
  Profile,
  ViewMode,
  VoiceGender,
} from './types';

// Minimal Web Speech API shapes (not in the standard TS DOM lib).
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const DEFAULT_REMINDER_TIME = '18:00';

// =============================================================================
// Main App Component
// =============================================================================

export default function App() {
  // Core state
  const [mode, setMode] = useState<Mode>(MODES.loading);
  const [profile, setProfile] = useState<Profile>({ kidName: '' });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('female');
  const [catProgress, setCatProgress] = useState<CatProgress>({});
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [prevMode, setPrevMode] = useState<Mode>(MODES.menu);
  const [tutStep, setTutStep] = useState(-1);
  const [owlState, setOwlState] = useState<OwlState>('idle');

  // Preferences (reminders)
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);

  // Quiz/session state
  const [cat, setCat] = useState<Cat | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [stableOpts, setStableOpts] = useState<(string | ColorItem)[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [voiceRes, setVoiceRes] = useState<'correct' | 'wrong' | null>(null);
  const [heard, setHeard] = useState('');
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(true);
  const [celebrate, setCelebrate] = useState(false);
  const [celebIdx, setCelebIdx] = useState(0);

  // Refs
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const celebTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStart = useRef<number | null>(null);

  // PWA auto-update + Drive redirect resume + daily reminder scheduling
  const { needRefresh, reload } = usePwaUpdate();

  // =============================================================================
  // Data loading
  // =============================================================================

  const loadData = useCallback(async () => {
    try {
      const p = await StorageService.get<Profile>('profile');
      const prefs = await StorageService.get<Prefs>('prefs');
      const prog = await StorageService.get<CatProgress>('allProgress');
      const daily = await StorageService.get<DailyStat[]>('dailyStats');

      if (p) setProfile(p);
      if (prefs?.view) setViewMode(prefs.view);
      if (prefs?.voice) {
        setVoiceGender(prefs.voice);
        setGender(prefs.voice);
      }
      setNotifications(prefs?.notifications !== false); // default on
      setReminderTime(prefs?.reminderTime || DEFAULT_REMINDER_TIME);
      if (prog) setCatProgress(prog);
      if (daily) setDailyStats(daily);

      if (p?.kidName) {
        setMode(MODES.welcome);
        if (!prefs?.tutorialDone) setTutStep(0);
      } else {
        setMode(MODES.setup);
      }
    } catch {
      setMode(MODES.setup);
    }
  }, []);

  useDriveRedirect(loadData);
  useReminderScheduler(notifications, reminderTime, dailyStats);

  // =============================================================================
  // Effects
  // =============================================================================

  // Build options when index/category changes
  useEffect(() => {
    if (items[idx] && cat) {
      setStableOpts(buildOpts(items[idx], cat, items));
    }
  }, [idx, cat, items]);

  // Set owl callback
  useEffect(() => {
    setOwlCallback(setOwlState);
    return () => setOwlCallback(null);
  }, []);

  // Update voice gender
  useEffect(() => {
    setGender(voiceGender);
  }, [voiceGender]);

  // Initialize voices
  useEffect(() => {
    initVoices();
  }, []);

  // Speak question when index changes in quiz/voice mode
  useEffect(() => {
    if ((mode === MODES.quiz || mode === MODES.voice) && items[idx] && cat) {
      const t = setTimeout(() => speak(qSpeech(items[idx], cat)), 500);
      return () => clearTimeout(t);
    }
  }, [idx, mode, items, cat]);

  // Load data on mount
  useEffect(() => {
    void loadData();
  }, [loadData]);

  // =============================================================================
  // Actions
  // =============================================================================

  const updatePrefs = async (patch: Partial<Prefs>) => {
    const p = (await StorageService.get<Prefs>('prefs')) || {};
    await StorageService.set('prefs', { ...p, ...patch });
  };

  const completeTut = async () => {
    setTutStep(-1);
    await updatePrefs({ tutorialDone: true });
  };

  const changeVoice = async (g: VoiceGender) => {
    setVoiceGender(g);
    setGender(g);
    await updatePrefs({ voice: g });
  };

  const toggleView = async () => {
    const v: ViewMode = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(v);
    await updatePrefs({ view: v });
  };

  const changeNotifications = async (on: boolean) => {
    setNotifications(on);
    await updatePrefs({ notifications: on });
  };

  const changeReminderTime = async (time: string) => {
    setReminderTime(time);
    await updatePrefs({ reminderTime: time });
  };

  const saveProfile = async (p: Profile) => {
    setProfile(p);
    await StorageService.set('profile', p);
  };

  const openSettings = (from: Mode) => {
    setPrevMode(from);
    setMode(MODES.settings);
  };

  const trigCelebrate = () => {
    if (celebTimer.current) clearTimeout(celebTimer.current);
    setCelebIdx(Math.floor(Math.random() * CELEB.length));
    setCelebrate(true);
    celebTimer.current = setTimeout(() => setCelebrate(false), 1400);
  };

  const go = (m: Mode, c: Cat) => {
    sessionStart.current = Date.now();
    const its = getItems(c);
    setCat(c);
    setItems(its);
    setIdx(0);
    setChosen(null);
    setScore(0);
    setDone(false);
    setVoiceRes(null);
    setHeard('');
    setMicOk(true);
    setCardIdx(0);
    setFlipped(false);
    setCelebrate(false);
    setOwlState('idle');
    setMode(m);
  };

  const advance = () => {
    const wasOk =
      chosen !== null ? chosen === correctVal(items[idx] ?? null, cat) : voiceRes === 'correct';
    playSound(wasOk ? 'correct' : 'wrong');
    setCelebrate(false);
    setOwlState('idle');

    if (idx < items.length - 1) {
      setIdx((i) => i + 1);
      setChosen(null);
      setVoiceRes(null);
      setHeard('');
    } else {
      setDone(true);
    }
  };

  const saveProgress = async (
    catId: string,
    sc: number,
    tot: number,
    cpSnap: CatProgress,
    dsSnap: DailyStat[],
  ) => {
    const today = todayStr();
    const np: CatProgress = { ...cpSnap };
    const ex: CatProgressEntry =
      np[catId] || { sessions: 0, bestScore: 0, bestTotal: 1, totalCorrect: 0, totalQuestions: 0 };
    np[catId] = {
      sessions: ex.sessions + 1,
      bestScore: Math.max(ex.bestScore, sc),
      bestTotal: tot,
      totalCorrect: ex.totalCorrect + sc,
      totalQuestions: ex.totalQuestions + tot,
      lastPlayed: today,
    };
    setCatProgress(np);
    await StorageService.set('allProgress', np);

    const el = Math.round((Date.now() - (sessionStart.current || Date.now())) / 1000);
    const nd = dsSnap.slice();
    const di = nd.findIndex((d) => d.date === today);
    if (di >= 0) {
      nd[di] = {
        ...nd[di],
        questions: nd[di].questions + tot,
        correct: nd[di].correct + sc,
        sessions: (nd[di].sessions || 0) + 1,
        timeSeconds: (nd[di].timeSeconds || 0) + el,
      };
    } else {
      nd.push({ date: today, questions: tot, correct: sc, sessions: 1, timeSeconds: el });
    }
    const s = nd.sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 30);
    setDailyStats(s);
    await StorageService.set('dailyStats', s);
  };

  const pickAnswer = (val: string) => {
    if (chosen) return;
    setChosen(val);
    const ok = val === correctVal(items[idx] ?? null, cat);
    playSound(ok ? 'correct' : 'wrong');
    if (ok) {
      setScore((s) => s + 1);
      trigCelebrate();
      setOwlState('happy');
      setTimeout(() => setOwlState('idle'), 1000);
    } else {
      setOwlState('sad');
      setTimeout(() => setOwlState('idle'), 1500);
    }
  };

  const pickVoice = (val: string) => {
    if (voiceRes) return;
    const ok = val === correctVal(items[idx] ?? null, cat);
    setVoiceRes(ok ? 'correct' : 'wrong');
    setHeard(val);
    playSound(ok ? 'correct' : 'wrong');
    if (ok) {
      setScore((s) => s + 1);
      trigCelebrate();
      setOwlState('happy');
      setTimeout(() => setOwlState('idle'), 1000);
    } else {
      setOwlState('sad');
      setTimeout(() => setOwlState('idle'), 1500);
    }
  };

  const toggleMic = () => {
    if (listening) {
      if (recRef.current) recRef.current.stop();
      setListening(false);
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setMicOk(false);
      return;
    }
    const r = new SR();
    r.lang = 'de-DE';
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed') setMicOk(false);
    };
    r.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((a) => a.transcript);
      const target = normalize(correctVal(items[idx] ?? null, cat));
      const ok = alts.some((a) => normalize(a) === target || normalize(a).includes(target));
      setHeard(alts[0]);
      setVoiceRes(ok ? 'correct' : 'wrong');
      playSound(ok ? 'correct' : 'wrong');
      if (ok) {
        setScore((s) => s + 1);
        trigCelebrate();
        setOwlState('happy');
        setTimeout(() => setOwlState('idle'), 1000);
      } else {
        setOwlState('sad');
        setTimeout(() => setOwlState('idle'), 1500);
      }
    };
    recRef.current = r;
    try {
      r.start();
    } catch {
      setMicOk(false);
    }
  };

  // =============================================================================
  // Render
  // =============================================================================

  const banner = needRefresh ? <UpdateBanner onReload={reload} /> : null;

  if (mode === MODES.loading) return <LoadingScreen />;

  if (mode === MODES.setup)
    return (
      <>
        <SetupScreen
          onSave={async (p) => {
            await saveProfile(p);
            setMode(MODES.welcome);
            setTutStep(0);
          }}
          onRestored={() => void loadData()}
        />
        {banner}
      </>
    );

  if (mode === MODES.about)
    return (
      <>
        <AboutScreen
          onBack={() => setMode(MODES.welcome)}
          onDeveloper={() => setMode(MODES.developer)}
        />
        {banner}
      </>
    );

  if (mode === MODES.developer)
    return (
      <>
        <DeveloperScreen onBack={() => setMode(MODES.about)} />
        {banner}
      </>
    );

  if (mode === MODES.stats)
    return (
      <>
        <StatsScreen
          profile={profile}
          catProgress={catProgress}
          dailyStats={dailyStats}
          onBack={() => setMode(MODES.menu)}
          onSettings={() => openSettings(MODES.stats)}
        />
        {banner}
      </>
    );

  if (mode === MODES.settings)
    return (
      <>
        <SettingsScreen
          profile={profile}
          voiceGender={voiceGender}
          notifications={notifications}
          reminderTime={reminderTime}
          onVoice={changeVoice}
          onSaveProfile={saveProfile}
          onToggleNotifications={(on) => void changeNotifications(on)}
          onChangeReminderTime={(t) => void changeReminderTime(t)}
          onImported={() => void loadData()}
          onBack={() => setMode(prevMode)}
          onResetProgress={async () => {
            setCatProgress({});
            setDailyStats([]);
            await StorageService.set('allProgress', {});
            await StorageService.set('dailyStats', []);
          }}
          onResetAll={async () => {
            await StorageService.set('profile', null);
            await StorageService.set('prefs', null);
            await StorageService.set('allProgress', {});
            await StorageService.set('dailyStats', []);
            setMode(MODES.setup);
          }}
        />
        {banner}
      </>
    );

  if (mode === MODES.welcome)
    return (
      <>
        <WelcomeScreen
          profile={profile}
          owlState={owlState}
          tutStep={tutStep}
          onTutNext={() => {
            if (tutStep < 5) setTutStep((t) => t + 1);
            else completeTut();
          }}
          onTutSkip={completeTut}
          onStart={() => setMode(MODES.menu)}
          onStats={() => setMode(MODES.stats)}
          onSettings={() => openSettings(MODES.welcome)}
          onAbout={() => setMode(MODES.about)}
          onShowTutorial={() => setTutStep(0)}
        />
        {banner}
      </>
    );

  if (mode === MODES.menu)
    return (
      <>
        <MenuScreen
          profile={profile}
          owlState={owlState}
          viewMode={viewMode}
          catProgress={catProgress}
          onHome={() => setMode(MODES.welcome)}
          onStats={() => setMode(MODES.stats)}
          onSettings={() => openSettings(MODES.menu)}
          onToggleView={toggleView}
          onGo={go}
        />
        {banner}
      </>
    );

  if (mode === MODES.quiz)
    return (
      <>
        <QuizScreen
          cat={cat!}
          items={items}
          idx={idx}
          chosen={chosen}
          score={score}
          done={done}
          celebrate={celebrate}
          celebIdx={celebIdx}
          owlState={owlState}
          stableOpts={stableOpts}
          catProgress={catProgress}
          dailyStats={dailyStats}
          onBack={() => setMode(MODES.menu)}
          onPick={pickAnswer}
          onAdvance={advance}
          onSaveProgress={saveProgress}
          onRetry={() => cat && go(MODES.quiz, cat)}
          onMenu={() => setMode(MODES.menu)}
        />
        {banner}
      </>
    );

  if (mode === MODES.flash)
    return (
      <>
        <FlashScreen
          cat={cat!}
          items={items}
          cardIdx={cardIdx}
          flipped={flipped}
          owlState={owlState}
          onBack={() => setMode(MODES.menu)}
          onFlip={() => setFlipped((f) => !f)}
          onPrev={() => {
            if (cardIdx > 0) {
              setCardIdx(cardIdx - 1);
              setFlipped(false);
            }
          }}
          onNext={() => {
            if (cardIdx < items.length - 1) {
              setCardIdx(cardIdx + 1);
              setFlipped(false);
            } else {
              setMode(MODES.menu);
            }
          }}
        />
        {banner}
      </>
    );

  if (mode === MODES.voice)
    return (
      <>
        <VoiceScreen
          cat={cat!}
          items={items}
          idx={idx}
          score={score}
          done={done}
          voiceRes={voiceRes}
          heard={heard}
          listening={listening}
          micOk={micOk}
          celebrate={celebrate}
          celebIdx={celebIdx}
          owlState={owlState}
          stableOpts={stableOpts}
          catProgress={catProgress}
          dailyStats={dailyStats}
          onBack={() => setMode(MODES.menu)}
          onToggleMic={toggleMic}
          onPickVoice={pickVoice}
          onAdvance={advance}
          onRetryVoice={() => {
            setVoiceRes(null);
            setHeard('');
          }}
          onSaveProgress={saveProgress}
          onRetry={() => cat && go(MODES.voice, cat)}
          onMenu={() => setMode(MODES.menu)}
        />
        {banner}
      </>
    );

  return banner;
}
