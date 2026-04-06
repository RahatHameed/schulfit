// =============================================================================
// App.jsx - Main Application Component (Refactored)
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';

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
  AboutScreen
} from './screens';

// =============================================================================
// Main App Component
// =============================================================================

export default function App() {
  // Core state
  const [mode, setMode] = useState(MODES.loading);
  const [profile, setProfile] = useState({ kidName: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [voiceGender, setVoiceGender] = useState('female');
  const [catProgress, setCatProgress] = useState({});
  const [dailyStats, setDailyStats] = useState([]);
  const [prevMode, setPrevMode] = useState(MODES.menu);
  const [tutStep, setTutStep] = useState(-1);
  const [owlState, setOwlState] = useState('idle');

  // Quiz/session state
  const [cat, setCat] = useState(null);
  const [items, setItems] = useState([]);
  const [stableOpts, setStableOpts] = useState([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [voiceRes, setVoiceRes] = useState(null);
  const [heard, setHeard] = useState('');
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(true);
  const [celebrate, setCelebrate] = useState(false);
  const [celebIdx, setCelebIdx] = useState(0);

  // Refs
  const recRef = useRef(null);
  const celebTimer = useRef(null);
  const sessionStart = useRef(null);

  // Derived state
  const isPl = cat && cat.type === 'plural';
  const isCmp = cat && cat.type === 'comparison';
  const isMth = cat && cat.type === 'math';
  const isEO = cat && cat.type === 'evenodd';

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
    (async () => {
      try {
        const p = await StorageService.get('profile');
        const prefs = await StorageService.get('prefs');
        const prog = await StorageService.get('allProgress');
        const daily = await StorageService.get('dailyStats');

        if (p) setProfile(p);
        if (prefs?.view) setViewMode(prefs.view);
        if (prefs?.voice) {
          setVoiceGender(prefs.voice);
          setGender(prefs.voice);
        }
        if (prog) setCatProgress(prog);
        if (daily) setDailyStats(daily);

        if (p?.kidName) {
          setMode(MODES.welcome);
          if (!prefs?.tutorialDone) setTutStep(0);
        } else {
          setMode(MODES.setup);
        }
      } catch (e) {
        setMode(MODES.setup);
      }
    })();
  }, []);

  // =============================================================================
  // Actions
  // =============================================================================

  const completeTut = async () => {
    setTutStep(-1);
    const p = (await StorageService.get('prefs')) || {};
    p.tutorialDone = true;
    await StorageService.set('prefs', p);
  };

  const changeVoice = async (g) => {
    setVoiceGender(g);
    setGender(g);
    const p = (await StorageService.get('prefs')) || {};
    p.voice = g;
    await StorageService.set('prefs', p);
  };

  const toggleView = async () => {
    const v = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(v);
    const p = (await StorageService.get('prefs')) || {};
    p.view = v;
    await StorageService.set('prefs', p);
  };

  const saveProfile = async (p) => {
    setProfile(p);
    await StorageService.set('profile', p);
  };

  const openSettings = (from) => {
    setPrevMode(from);
    setMode(MODES.settings);
  };

  const trigCelebrate = () => {
    clearTimeout(celebTimer.current);
    setCelebIdx(Math.floor(Math.random() * CELEB.length));
    setCelebrate(true);
    celebTimer.current = setTimeout(() => setCelebrate(false), 1400);
  };

  const go = (m, c) => {
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
    const wasOk = chosen !== null ? chosen === correctVal(items[idx], cat) : voiceRes === 'correct';
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

  const saveProgress = async (catId, sc, tot, cpSnap, dsSnap) => {
    const today = todayStr();
    const np = { ...cpSnap };
    const ex = np[catId] || { sessions: 0, bestScore: 0, bestTotal: 1, totalCorrect: 0, totalQuestions: 0 };
    np[catId] = {
      sessions: ex.sessions + 1,
      bestScore: Math.max(ex.bestScore, sc),
      bestTotal: tot,
      totalCorrect: ex.totalCorrect + sc,
      totalQuestions: ex.totalQuestions + tot,
      lastPlayed: today
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
        sessions: nd[di].sessions + 1,
        timeSeconds: (nd[di].timeSeconds || 0) + el
      };
    } else {
      nd.push({ date: today, questions: tot, correct: sc, sessions: 1, timeSeconds: el });
    }
    const s = nd.sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 30);
    setDailyStats(s);
    await StorageService.set('dailyStats', s);
  };

  const pickAnswer = (val) => {
    if (chosen) return;
    setChosen(val);
    const ok = val === correctVal(items[idx], cat);
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

  const pickVoice = (val) => {
    if (voiceRes) return;
    const ok = val === correctVal(items[idx], cat);
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
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
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
      const target = normalize(correctVal(items[idx], cat));
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
    } catch (e) {
      setMicOk(false);
    }
  };

  // =============================================================================
  // Render
  // =============================================================================

  if (mode === MODES.loading) return <LoadingScreen />;

  if (mode === MODES.setup)
    return (
      <SetupScreen
        onSave={async (p) => {
          await saveProfile(p);
          setMode(MODES.welcome);
          setTutStep(0);
        }}
      />
    );

  if (mode === MODES.about) return <AboutScreen onBack={() => setMode(MODES.welcome)} />;

  if (mode === MODES.stats)
    return (
      <StatsScreen
        profile={profile}
        catProgress={catProgress}
        dailyStats={dailyStats}
        onBack={() => setMode(MODES.menu)}
        onSettings={() => openSettings(MODES.stats)}
      />
    );

  if (mode === MODES.settings)
    return (
      <SettingsScreen
        profile={profile}
        voiceGender={voiceGender}
        onVoice={changeVoice}
        onSaveProfile={saveProfile}
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
    );

  if (mode === MODES.welcome)
    return (
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
    );

  if (mode === MODES.menu)
    return (
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
    );

  if (mode === MODES.quiz)
    return (
      <QuizScreen
        cat={cat}
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
        onRetry={() => go(MODES.quiz, cat)}
        onMenu={() => setMode(MODES.menu)}
      />
    );

  if (mode === MODES.flash)
    return (
      <FlashScreen
        cat={cat}
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
    );

  if (mode === MODES.voice)
    return (
      <VoiceScreen
        cat={cat}
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
        onRetry={() => go(MODES.voice, cat)}
        onMenu={() => setMode(MODES.menu)}
      />
    );

  return null;
}
