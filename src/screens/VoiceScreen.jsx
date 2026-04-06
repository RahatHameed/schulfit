// =============================================================================
// VoiceScreen Component - Voice recognition mode
// =============================================================================

import React from 'react';
import { Owl, Confetti, ShapeSVG, CmpCard, CmpAnswers } from '../components';
import { BG, CSS, B, CARD, SPK } from '../constants/styles';
import { CELEB } from '../constants/celebrations';
import { speak } from '../services/AudioService';
import { toG } from '../utils/germanUtils';
import { correctVal, qSpeech } from '../services/QuizLogicService';
import { ResultsScreen } from './ResultsScreen';

/**
 * Voice screen for speech recognition practice
 * @param {Object} props
 * @param {Object} props.cat - Current category
 * @param {Array} props.items - Items to practice
 * @param {number} props.idx - Current item index
 * @param {number} props.score - Current score
 * @param {boolean} props.done - Whether session is complete
 * @param {string} props.voiceRes - Voice result ('correct', 'wrong', or null)
 * @param {string} props.heard - What was heard from speech recognition
 * @param {boolean} props.listening - Whether mic is listening
 * @param {boolean} props.micOk - Whether mic is available
 * @param {boolean} props.celebrate - Whether to show celebration
 * @param {number} props.celebIdx - Celebration message index
 * @param {string} props.owlState - Current owl animation state
 * @param {Array} props.stableOpts - Answer options
 * @param {Object} props.catProgress - Category progress for results
 * @param {Array} props.dailyStats - Daily stats for results
 * @param {Function} props.onBack - Navigate back callback
 * @param {Function} props.onToggleMic - Toggle microphone callback
 * @param {Function} props.onPickVoice - Pick voice answer callback
 * @param {Function} props.onAdvance - Advance to next item callback
 * @param {Function} props.onRetryVoice - Retry voice input callback
 * @param {Function} props.onSaveProgress - Save progress callback
 * @param {Function} props.onRetry - Retry session callback
 * @param {Function} props.onMenu - Go to menu callback
 */
export function VoiceScreen({
  cat,
  items,
  idx,
  score,
  done,
  voiceRes,
  heard,
  listening,
  micOk,
  celebrate,
  celebIdx,
  owlState,
  stableOpts,
  catProgress,
  dailyStats,
  onBack,
  onToggleMic,
  onPickVoice,
  onAdvance,
  onRetryVoice,
  onSaveProgress,
  onRetry,
  onMenu
}) {
  if (done) {
    return (
      <ResultsScreen
        score={score}
        total={items.length}
        catId={cat.id}
        catProgress={catProgress}
        dailyStats={dailyStats}
        onSave={onSaveProgress}
        onRetry={onRetry}
        onMenu={onMenu}
      />
    );
  }

  const vitem = items[idx];
  if (!vitem) return null;

  const isPl = cat && cat.type === 'plural';
  const isCmp = cat && cat.type === 'comparison';
  const isMth = cat && cat.type === 'math';
  const isCF = cat && cat.type === 'colorfill';
  const isEO = cat && cat.type === 'evenodd';

  const vcorrect = correctVal(vitem, cat);
  const vok = voiceRes === 'correct';
  const vbad = voiceRes === 'wrong';

  const onSpk = () => {
    speak(isCmp || isMth || isEO || isPl ? qSpeech(vitem, cat) : correctVal(vitem, cat));
  };

  const Overlay = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 999
      }}
    >
      <div className="celeb-pop">
        <div style={{ fontSize: 90, lineHeight: 1 }}>🎉</div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: 'white',
            textShadow: '0 3px 14px rgba(0,0,0,.5)'
          }}
        >
          {CELEB[celebIdx].de}
        </div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,.8)' }}>
          {CELEB[celebIdx].en}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        padding: 20,
        fontFamily: 'system-ui,sans-serif'
      }}
    >
      <style>{CSS}</style>
      {celebrate && <Overlay />}
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,.2)',
              border: 'none',
              color: 'white',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: 13,
              flexShrink: 0
            }}
          >
            Back
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{ background: 'rgba(255,255,255,.25)', height: 10, borderRadius: 5 }}
            >
              <div
                style={{
                  width: ((idx + 1) / items.length) * 100 + '%',
                  height: '100%',
                  background: '#22C55E',
                  borderRadius: 5,
                  transition: 'width .5s ease'
                }}
              />
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,.6)',
                fontSize: 10,
                textAlign: 'center',
                marginTop: 2
              }}
            >
              {idx + 1} / {items.length} - score {score}
            </div>
          </div>
          <Owl state={owlState} size={40} />
        </div>

        {/* Question card */}
        <div style={{ ...CARD, marginBottom: 16, cursor: 'default' }}>
          {isCF && (
            <>
              <ShapeSVG name={vitem.shape} fill={vok ? vitem.hex : 'white'} size={140} />
              <div style={{ marginTop: 10, fontSize: 16, fontWeight: 700, color: '#333' }}>
                Say: {vitem.german}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>({vitem.english})</div>
            </>
          )}

          {isCmp && <CmpCard item={vitem} onSpeak={onSpk} />}

          {isMth && (
            <>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#333' }}>
                {vitem.numA} {vitem.op} {vitem.numB} = ?
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                {toG(vitem.numA)} {vitem.op === '+' ? 'plus' : 'minus'} {toG(vitem.numB)}
              </div>
            </>
          )}

          {isPl && (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 6
                }}
              >
                {Array.from({ length: vitem.count || 1 }, (_, i) => (
                  <span key={i} style={{ fontSize: vitem.count > 1 ? 44 : 72 }}>
                    {vitem.emoji}
                  </span>
                ))}
              </div>
              <div
                style={{ fontSize: 15, color: '#333', fontWeight: 700, textAlign: 'center' }}
              >
                {vitem.count === 1
                  ? 'Ist ' + vitem.german + ' Einzahl oder Mehrzahl?'
                  : 'Sind ' + vitem.plural + ' Einzahl oder Mehrzahl?'}
              </div>
            </>
          )}

          {isEO && (
            <>
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 900,
                  color: '#667eea',
                  fontFamily: 'monospace',
                  lineHeight: 1
                }}
              >
                {vitem.display}
              </div>
              <div style={{ fontSize: 14, color: '#777', marginTop: 8, fontWeight: 600 }}>
                Gerade oder Ungerade?
              </div>
            </>
          )}

          {!isCF && !isCmp && !isMth && !isPl && !isEO && (
            <>
              <div
                style={{
                  fontSize: vitem.display ? 56 : 72,
                  fontWeight: vitem.display ? 900 : 'normal',
                  color: vitem.display ? '#667eea' : 'inherit',
                  fontFamily: vitem.display ? 'monospace' : 'inherit'
                }}
              >
                {vitem.display || vitem.emoji}
              </div>
              <div style={{ fontSize: 14, color: '#777', marginTop: 6 }}>Say in German:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#444' }}>
                {vitem.english}
              </div>
            </>
          )}

          <button onClick={onSpk} style={SPK}>
            🔊
          </button>
        </div>

        {/* Voice input section */}
        {!voiceRes && (
          <div>
            {micOk && (
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <button
                  onClick={onToggleMic}
                  style={{
                    display: 'block',
                    margin: '0 auto 8px',
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    border: 'none',
                    fontSize: 40,
                    cursor: 'pointer',
                    background: listening
                      ? 'linear-gradient(135deg,#f5576c,#f093fb)'
                      : 'white',
                    boxShadow: listening
                      ? '0 0 0 14px rgba(255,255,255,.25)'
                      : '0 4px 20px rgba(0,0,0,.2)',
                    transition: 'all .2s'
                  }}
                >
                  {listening ? '🎙️' : '🎤'}
                </button>
                <div style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  {listening ? 'Listening…' : 'Tap to speak'}
                </div>
              </div>
            )}

            {!micOk && (
              <div
                style={{
                  background: 'rgba(255,200,0,.2)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginBottom: 12,
                  color: 'white',
                  fontSize: 13,
                  textAlign: 'center'
                }}
              >
                Mic not available - tap answer below!
              </div>
            )}

            {/* Fallback answer options */}
            <div
              style={{
                background: 'rgba(255,255,255,.12)',
                borderRadius: 14,
                padding: 12
              }}
            >
              <div
                style={{
                  color: 'rgba(255,255,255,.7)',
                  fontSize: 12,
                  marginBottom: 10,
                  textAlign: 'center'
                }}
              >
                {micOk ? 'Or tap:' : 'Tap the correct answer:'}
              </div>

              {isCF && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                    justifyContent: 'center'
                  }}
                >
                  {stableOpts.map((c) => (
                    <button
                      key={c.german}
                      onClick={() => onPickVoice(c.german)}
                      title={c.german}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: c.hex,
                        border: '3px solid rgba(255,255,255,.5)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              )}

              {isCmp && (
                <CmpAnswers item={vitem} correct={vcorrect} chosen={null} onPick={onPickVoice} />
              )}

              {!isCF && !isCmp && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {stableOpts.map((val, vi) => (
                    <button
                      key={vi}
                      onClick={() => onPickVoice(val)}
                      style={{
                        background: 'white',
                        border: '2px solid #eee',
                        borderRadius: 12,
                        padding: '12px 6px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div
                        style={{
                          fontSize: isPl || isEO ? 18 : isMth ? 26 : 14,
                          fontWeight: 700
                        }}
                      >
                        {val}
                      </div>
                      {isEO && (
                        <div style={{ fontSize: 10, color: '#aaa' }}>
                          {val === 'Gerade' ? 'Even' : 'Odd'}
                        </div>
                      )}
                      {isPl && (
                        <div style={{ fontSize: 10, color: '#aaa' }}>
                          {val === vitem.german ? 'Singular' : 'Plural'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result section */}
        {voiceRes && (
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 24,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 52 }}>{vok ? '🎉' : '😅'}</div>
            <div
              style={{ fontSize: 20, fontWeight: 800, color: vok ? '#28a745' : '#dc3545' }}
            >
              {vok ? 'Sehr gut!' : 'Not quite!'}
            </div>
            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>
              {vok ? '(Very good!)' : '(Try again)'}
            </div>
            {heard && (
              <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>
                I heard: {heard}
              </div>
            )}
            {vbad && (
              <div style={{ fontSize: 14, color: '#555', marginBottom: 10 }}>
                Correct: {vcorrect}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              {vbad && (
                <button onClick={onRetryVoice} style={{ ...B('#667eea', '#764ba2'), flex: 1 }}>
                  Try Again
                </button>
              )}
              <button
                onClick={onAdvance}
                style={{
                  ...B(vok ? '#22C55E' : '#f5576c', vok ? '#38ef7d' : undefined),
                  flex: 1
                }}
              >
                {idx < items.length - 1 ? 'Next' : 'Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
