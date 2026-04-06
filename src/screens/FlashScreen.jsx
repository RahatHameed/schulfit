// =============================================================================
// FlashScreen Component - Flashcard study mode
// =============================================================================

import React from 'react';
import { Owl, DotGrid, ShapeSVG } from '../components';
import { BG, CSS, B, CARD, SPK, MSPK, bdg } from '../constants/styles';
import { speak } from '../services/AudioService';
import { toG } from '../utils/germanUtils';
import { qSpeech } from '../services/QuizLogicService';

/**
 * Flashcard screen for studying items
 * @param {Object} props
 * @param {Object} props.cat - Current category
 * @param {Array} props.items - Items to study
 * @param {number} props.cardIdx - Current card index
 * @param {boolean} props.flipped - Whether card is flipped
 * @param {string} props.owlState - Current owl animation state
 * @param {Function} props.onBack - Navigate back callback
 * @param {Function} props.onFlip - Flip card callback
 * @param {Function} props.onPrev - Previous card callback
 * @param {Function} props.onNext - Next card callback
 */
export function FlashScreen({
  cat,
  items,
  cardIdx,
  flipped,
  owlState,
  onBack,
  onFlip,
  onPrev,
  onNext
}) {
  const fitem = items[cardIdx];
  if (!fitem) return null;

  const isPl = cat && cat.type === 'plural';
  const isCmp = cat && cat.type === 'comparison';
  const isMth = cat && cat.type === 'math';
  const isCF = cat && cat.type === 'colorfill';
  const isGd = cat && cat.type === 'guide';
  const isEO = cat && cat.type === 'evenodd';

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
              fontSize: 13
            }}
          >
            Back
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{cat.label}</div>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 11 }}>
              {cardIdx + 1} / {items.length}
            </div>
          </div>
          <Owl state={owlState} size={36} />
        </div>

        {/* Card */}
        <div onClick={onFlip} style={CARD}>
          {isGd && (
            <>
              {fitem.emoji && <div style={{ fontSize: 52, marginBottom: 8 }}>{fitem.emoji}</div>}
              <div style={{ fontSize: 18, fontWeight: 800, color: '#333' }}>{fitem.german}</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{fitem.english}</div>
              {flipped ? (
                fitem.phrases ? (
                  <div style={{ textAlign: 'left', width: '100%', maxHeight: 300, overflowY: 'auto' }}>
                    {fitem.phrases.map((ph, i) => (
                      <div
                        key={i}
                        onClick={(e) => { e.stopPropagation(); speak(ph.de); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 4px',
                          borderBottom: i < fitem.phrases.length - 1 ? '1px solid #f0f0f0' : 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>{ph.de}</div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{ph.en}</div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); speak(ph.de); }}
                          style={{ ...MSPK, marginLeft: 10 }}
                        >
                          🔊
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'left', width: '100%' }}>
                    {fitem.content.map((l, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 13,
                          padding: '5px 0',
                          borderBottom: i < fitem.content.length - 1 ? '1px solid #f0f0f0' : 'none',
                          color: '#444'
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div style={{ fontSize: 12, color: '#bbb', marginTop: 8 }}>
                  {fitem.phrases ? 'Tap to see phrases' : 'Tap to see tips'}
                </div>
              )}
            </>
          )}

          {isCF && (
            <>
              <ShapeSVG name={fitem.shape} fill={flipped ? fitem.hex : 'white'} size={150} />
              {flipped ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 800, color: fitem.hex, marginTop: 10 }}>
                    {fitem.german}
                  </div>
                  <div style={{ fontSize: 14, color: '#888' }}>{fitem.english}</div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: '#888', marginTop: 12 }}>
                  Tap to fill with color
                </div>
              )}
            </>
          )}

          {isCmp && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 8 }}>
                {qSpeech(fitem, cat)}
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <DotGrid count={fitem.numA} color="#667eea" />
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#667eea', marginTop: 4 }}>
                    {fitem.numA}
                  </div>
                </div>
                <div style={{ fontSize: 18, color: '#ccc', fontWeight: 900 }}>vs</div>
                <div style={{ textAlign: 'center' }}>
                  <DotGrid count={fitem.numB} color="#f5576c" />
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#f5576c', marginTop: 4 }}>
                    {fitem.numB}
                  </div>
                </div>
              </div>
              {flipped ? (
                <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800, color: '#22C55E' }}>
                  {fitem.cmpAnswer === 'ja' ? 'Ja' : 'Nein'}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#bbb', marginTop: 10 }}>Tap to reveal</div>
              )}
            </>
          )}

          {isMth && (
            <>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#333', marginBottom: 8 }}>
                {fitem.numA} {fitem.op} {fitem.numB} ={' '}
                {flipped ? (
                  <span style={{ color: '#22C55E' }}>{fitem.result}</span>
                ) : (
                  <span style={{ color: '#ccc' }}>?</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>
                {flipped ? 'Answer: ' + fitem.result : 'Tap to see answer'}
              </div>
            </>
          )}

          {isPl && (
            <>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                {Array.from({ length: flipped ? 3 : 1 }, (_, i) => (
                  <span key={i} style={{ fontSize: flipped ? 44 : 72 }}>{fitem.emoji}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={bdg('blue')}>Singular</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#333' }}>{fitem.german}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(fitem.german); }}
                  style={MSPK}
                >
                  🔊
                </button>
              </div>
              {flipped ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <span style={bdg('green')}>Plural</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#11998e' }}>
                    {fitem.plural}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(fitem.plural); }}
                    style={MSPK}
                  >
                    🔊
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#bbb', marginTop: 10 }}>Tap to see Plural</div>
              )}
            </>
          )}

          {isEO && (
            <>
              <div style={{ fontSize: 80, fontWeight: 900, color: '#667eea', fontFamily: 'monospace', lineHeight: 1 }}>
                {fitem.display}
              </div>
              {flipped ? (
                <div style={{ fontSize: 24, fontWeight: 900, color: '#22C55E', marginTop: 12 }}>
                  {fitem.german} ({fitem.english})
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#888', marginTop: 12 }}>Tap to reveal!</div>
              )}
            </>
          )}

          {!isGd && !isCF && !isCmp && !isMth && !isPl && !isEO && (
            <>
              <div
                style={{
                  fontSize: fitem.display ? 56 : 72,
                  fontWeight: fitem.display ? 900 : 'normal',
                  color: fitem.display ? '#667eea' : 'inherit',
                  fontFamily: fitem.display ? 'monospace' : 'inherit',
                  marginBottom: 4
                }}
              >
                {fitem.display || fitem.emoji}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#333' }}>
                {fitem.display ? toG(+fitem.display) : fitem.german}
              </div>
              {flipped ? (
                <div style={{ fontSize: 15, color: '#888', marginTop: 4 }}>{fitem.english}</div>
              ) : (
                <div style={{ fontSize: 12, color: '#bbb', marginTop: 8 }}>
                  Tap to see translation
                </div>
              )}
              {!fitem.display && (
                <button
                  onClick={(e) => { e.stopPropagation(); speak(fitem.german); }}
                  style={SPK}
                >
                  🔊
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            onClick={onPrev}
            disabled={cardIdx === 0}
            style={{
              ...B('rgba(255,255,255,.25)'),
              flex: 1,
              opacity: cardIdx === 0 ? 0.4 : 1
            }}
          >
            Prev
          </button>
          <button onClick={onNext} style={{ ...B('rgba(255,255,255,.25)'), flex: 1 }}>
            {cardIdx === items.length - 1 ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
