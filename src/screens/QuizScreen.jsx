// =============================================================================
// QuizScreen Component - Quiz mode
// =============================================================================

import React from 'react';
import { Owl, Confetti, ShapeSVG, CmpCard, CmpAnswers } from '../components';
import { BG, CSS, B, CARD, SPK } from '../constants/styles';
import { CELEB } from '../constants/celebrations';
import { PAL } from '../data/colors';
import { speak } from '../services/AudioService';
import { toG } from '../utils/germanUtils';
import { correctVal, qSpeech } from '../services/QuizLogicService';
import { ResultsScreen } from './ResultsScreen';

/**
 * Quiz screen for answering questions
 * @param {Object} props
 * @param {Object} props.cat - Current category
 * @param {Array} props.items - Items to quiz
 * @param {number} props.idx - Current item index
 * @param {string} props.chosen - User's chosen answer
 * @param {number} props.score - Current score
 * @param {boolean} props.done - Whether quiz is complete
 * @param {boolean} props.celebrate - Whether to show celebration
 * @param {number} props.celebIdx - Celebration message index
 * @param {string} props.owlState - Current owl animation state
 * @param {Array} props.stableOpts - Answer options
 * @param {Object} props.catProgress - Category progress for results
 * @param {Array} props.dailyStats - Daily stats for results
 * @param {Function} props.onBack - Navigate back callback
 * @param {Function} props.onPick - Pick answer callback
 * @param {Function} props.onAdvance - Advance to next question callback
 * @param {Function} props.onSaveProgress - Save progress callback
 * @param {Function} props.onRetry - Retry quiz callback
 * @param {Function} props.onMenu - Go to menu callback
 */
export function QuizScreen({
  cat,
  items,
  idx,
  chosen,
  score,
  done,
  celebrate,
  celebIdx,
  owlState,
  stableOpts,
  catProgress,
  dailyStats,
  onBack,
  onPick,
  onAdvance,
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

  const item = items[idx];
  if (!item) return null;

  const isPl = cat && cat.type === 'plural';
  const isCmp = cat && cat.type === 'comparison';
  const isMth = cat && cat.type === 'math';
  const isCF = cat && cat.type === 'colorfill';
  const isEO = cat && cat.type === 'evenodd';

  const correct = correctVal(item, cat);
  const chosenHex = isCF && chosen ? PAL.find((c) => c.german === chosen) : null;

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
        <div style={{ ...CARD, marginBottom: 14, cursor: 'default' }}>
          {isCF && (
            <>
              <ShapeSVG
                name={item.shape}
                fill={chosen && chosenHex ? chosenHex.hex : 'white'}
                size={148}
              />
              <div style={{ marginTop: 10, fontSize: 17, fontWeight: 700, color: '#333' }}>
                Color it {item.german}!
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>({item.english})</div>
            </>
          )}

          {isCmp && <CmpCard item={item} onSpeak={() => speak(qSpeech(item, cat))} />}

          {isMth && (
            <>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#333' }}>
                {item.numA} {item.op} {item.numB} = ?
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                {toG(item.numA)} {item.op === '+' ? 'plus' : 'minus'} {toG(item.numB)}
              </div>
              <button onClick={() => speak(qSpeech(item, cat))} style={SPK}>
                🔊
              </button>
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
                  marginBottom: 8
                }}
              >
                {Array.from({ length: item.count || 1 }, (_, i) => (
                  <span key={i} style={{ fontSize: item.count > 1 ? 44 : 72 }}>
                    {item.emoji}
                  </span>
                ))}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: '#333',
                  marginTop: 4,
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                {item.count === 1
                  ? 'Ist ' + item.german + ' Einzahl oder Mehrzahl?'
                  : 'Sind ' + item.plural + ' Einzahl oder Mehrzahl?'}
              </div>
              <button onClick={() => speak(qSpeech(item, cat))} style={SPK}>
                🔊
              </button>
            </>
          )}

          {isEO && (
            <>
              <div
                style={{
                  fontSize: 90,
                  fontWeight: 900,
                  color: '#667eea',
                  fontFamily: 'monospace',
                  lineHeight: 1
                }}
              >
                {item.display}
              </div>
              <div style={{ fontSize: 14, color: '#555', marginTop: 10, fontWeight: 600 }}>
                Gerade oder Ungerade?
              </div>
              <button onClick={() => speak(qSpeech(item, cat))} style={SPK}>
                🔊
              </button>
            </>
          )}

          {!isCF && !isCmp && !isMth && !isPl && !isEO && (
            <>
              <div
                style={{
                  fontSize: item.display ? 56 : 72,
                  fontWeight: item.display ? 900 : 'normal',
                  color: item.display ? '#667eea' : 'inherit',
                  fontFamily: item.display ? 'monospace' : 'inherit',
                  marginBottom: 4
                }}
              >
                {item.display || item.emoji}
              </div>
              <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                What is this in German?
              </div>
              {item.english && (
                <div style={{ fontSize: 13, fontStyle: 'italic', color: '#888', marginTop: 2 }}>
                  {item.english}
                </div>
              )}
              <button onClick={() => speak(correctVal(item, cat))} style={SPK}>
                🔊
              </button>
            </>
          )}
        </div>

        {/* Answer options */}
        {isCF && (
          <>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'center',
                background: 'rgba(255,255,255,.12)',
                borderRadius: 18,
                padding: 16,
                marginBottom: 12
              }}
            >
              {stableOpts.map((c) => {
                const isC = c.german === correct;
                const isS = c.german === chosen;
                return (
                  <button
                    key={c.german}
                    onClick={() => onPick(c.german)}
                    title={c.german}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: c.hex,
                      cursor: 'pointer',
                      border: `4px solid ${
                        chosen
                          ? isC
                            ? '#22C55E'
                            : isS
                            ? '#EF4444'
                            : 'rgba(255,255,255,.4)'
                          : 'rgba(255,255,255,.4)'
                      }`,
                      transform: chosen && isS ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.15s',
                      boxShadow: '0 3px 10px rgba(0,0,0,.25)'
                    }}
                  />
                );
              })}
            </div>
            {chosen && (
              <div
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 12
                }}
              >
                {chosen === correct
                  ? 'Correct! ' + item.german + ' = ' + item.english
                  : 'It is ' + item.german + ' (' + item.english + ')'}
              </div>
            )}
          </>
        )}

        {isCmp && (
          <CmpAnswers item={item} correct={correct} chosen={chosen} onPick={onPick} />
        )}

        {isMth && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 12
            }}
          >
            {stableOpts.map((val) => {
              const isC = val === correct;
              const isS = val === chosen;
              return (
                <button
                  key={val}
                  onClick={() => onPick(val)}
                  style={{
                    background: chosen ? (isC ? '#d4edda' : isS ? '#f8d7da' : 'white') : 'white',
                    border: `2px solid ${
                      chosen ? (isC ? '#28a745' : isS ? '#dc3545' : '#eee') : '#eee'
                    }`,
                    borderRadius: 14,
                    padding: '16px 8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#333' }}>{val}</div>
                </button>
              );
            })}
          </div>
        )}

        {isPl && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {[
              { label: 'Singular', val: item.german },
              { label: 'Plural', val: item.plural }
            ].map((x) => {
              const isC = x.val === correct;
              const isS = x.val === chosen;
              return (
                <button
                  key={x.val}
                  onClick={() => onPick(x.val)}
                  style={{
                    flex: 1,
                    background: chosen ? (isC ? '#d4edda' : isS ? '#f8d7da' : 'white') : 'white',
                    border: `3px solid ${
                      chosen ? (isC ? '#28a745' : isS ? '#dc3545' : '#ddd') : '#ddd'
                    }`,
                    borderRadius: 16,
                    padding: '14px 8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{x.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#333' }}>{x.val}</div>
                </button>
              );
            })}
          </div>
        )}

        {isEO && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {stableOpts.map((val) => {
              const isC = val === correct;
              const isS = val === chosen;
              return (
                <button
                  key={val}
                  onClick={() => onPick(val)}
                  style={{
                    flex: 1,
                    background: chosen ? (isC ? '#d4edda' : isS ? '#f8d7da' : 'white') : 'white',
                    border: `3px solid ${
                      chosen ? (isC ? '#28a745' : isS ? '#dc3545' : '#ddd') : '#ddd'
                    }`,
                    borderRadius: 16,
                    padding: '16px 8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#333' }}>{val}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {val === 'Gerade' ? 'Even' : 'Odd'}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!isCF && !isCmp && !isMth && !isPl && !isEO && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 12
            }}
          >
            {stableOpts.map((val) => {
              const isC = val === correct;
              const isS = val === chosen;
              const o = items.find((i) => i.german === val);
              return (
                <button
                  key={val}
                  onClick={() => onPick(val)}
                  style={{
                    background: chosen ? (isC ? '#d4edda' : isS ? '#f8d7da' : 'white') : 'white',
                    border: `2px solid ${
                      chosen ? (isC ? '#28a745' : isS ? '#dc3545' : '#eee') : '#eee'
                    }`,
                    borderRadius: 14,
                    padding: '12px 8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{val}</div>
                  {o && o.english && (
                    <div style={{ fontSize: 11, color: '#aaa' }}>{o.english}</div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Next button */}
        {chosen !== null && (
          <button
            onClick={onAdvance}
            style={{ ...B('#22C55E'), width: '100%', padding: 14, fontSize: 15 }}
          >
            {idx < items.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
