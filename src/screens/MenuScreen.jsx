// =============================================================================
// MenuScreen Component - Category selection menu
// =============================================================================

import React from 'react';
import { Owl } from '../components';
import { BG, CSS, B } from '../constants/styles';
import { CATS } from '../data/categories';
import { GROUPS } from '../data/groups';
import { GRADS } from '../data/gradients';
import { MODES } from '../constants/modes';

/**
 * Menu screen for category and mode selection
 * @param {Object} props
 * @param {Object} props.profile - User profile
 * @param {string} props.owlState - Current owl animation state
 * @param {string} props.viewMode - Current view mode ('grid' or 'list')
 * @param {Object} props.catProgress - Category progress data
 * @param {Function} props.onHome - Navigate to home
 * @param {Function} props.onStats - Navigate to stats
 * @param {Function} props.onSettings - Navigate to settings
 * @param {Function} props.onToggleView - Toggle view mode
 * @param {Function} props.onGo - Start a mode with category (mode, category)
 */
export function MenuScreen({
  profile,
  owlState,
  viewMode,
  catProgress,
  onHome,
  onStats,
  onSettings,
  onToggleView,
  onGo
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        fontFamily: 'system-ui,sans-serif',
        padding: '16px 16px 32px'
      }}
    >
      <style>{CSS}</style>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 8 }}>
          <button
            onClick={onHome}
            style={{ ...B('rgba(255,255,255,.2)'), padding: '8px 12px', fontSize: 13 }}
          >
            Home
          </button>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 16
            }}
          >
            {profile.kidName ? profile.kidName + "'s Topics" : 'Topics'}
          </div>
          <Owl state={owlState} size={32} />
          <button
            onClick={onStats}
            style={{ ...B('rgba(255,255,255,.2)'), padding: '8px 10px', fontSize: 16 }}
          >
            📊
          </button>
          <button
            onClick={onSettings}
            style={{ ...B('rgba(255,255,255,.2)'), padding: '8px 10px', fontSize: 16 }}
          >
            ⚙️
          </button>
          <button
            onClick={onToggleView}
            style={{ ...B('rgba(255,255,255,.2)'), padding: '8px 10px', fontSize: 16 }}
          >
            {viewMode === 'list' ? '⊞' : '☰'}
          </button>
        </div>

        {/* Category groups */}
        {GROUPS.map((g) => {
          const cats = CATS.filter((c) => g.ids.includes(c.id));
          return (
            <div key={g.title} style={{ marginBottom: 20 }}>
              <div
                style={{
                  color: 'rgba(255,255,255,.65)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  paddingLeft: 4
                }}
              >
                {g.title}
              </div>

              {viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {cats.map((c) => {
                    const p = catProgress[c.id];
                    const pct = p ? Math.round((p.bestScore / p.bestTotal) * 100) : 0;
                    const star = p && pct >= 80;
                    const grad = GRADS[c.icon] || 'linear-gradient(135deg,#667eea,#764ba2)';

                    return (
                      <div
                        key={c.id}
                        style={{
                          borderRadius: 24,
                          overflow: 'hidden',
                          boxShadow: '0 8px 28px rgba(0,0,0,.25)'
                        }}
                      >
                        <div
                          style={{
                            background: grad,
                            padding: '28px 12px 18px',
                            textAlign: 'center',
                            position: 'relative',
                            minHeight: 170,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {star && (
                            <div
                              style={{ position: 'absolute', top: 10, right: 12, fontSize: 18 }}
                            >
                              ⭐
                            </div>
                          )}
                          <div style={{ fontSize: 70, lineHeight: 1, marginBottom: 10 }}>
                            {c.emoji || '📚'}
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 900,
                              color: 'white',
                              textShadow: '0 2px 8px rgba(0,0,0,.4)',
                              marginBottom: 3
                            }}
                          >
                            {c.label}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: 'rgba(255,255,255,.8)',
                              fontWeight: 500
                            }}
                          >
                            {c.sublabel}
                          </div>
                          {p && (
                            <div
                              style={{
                                width: '65%',
                                margin: '10px auto 0',
                                height: 4,
                                background: 'rgba(255,255,255,.3)',
                                borderRadius: 2
                              }}
                            >
                              <div
                                style={{
                                  width: pct + '%',
                                  height: '100%',
                                  background: 'white',
                                  borderRadius: 2
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div
                          style={{ background: 'white', padding: '10px', display: 'flex', gap: 6 }}
                        >
                          <button
                            onClick={() => onGo(MODES.flash, c)}
                            style={{
                              flex: 1,
                              background: '#f3f4f6',
                              border: 'none',
                              borderRadius: 10,
                              padding: '9px 0',
                              cursor: 'pointer',
                              fontSize: 20
                            }}
                          >
                            🃏
                          </button>
                          {!c.noQuiz && (
                            <>
                              <button
                                onClick={() => onGo(MODES.quiz, c)}
                                style={{
                                  flex: 1,
                                  background: '#fef2f2',
                                  border: 'none',
                                  borderRadius: 10,
                                  padding: '9px 0',
                                  cursor: 'pointer',
                                  fontSize: 20
                                }}
                              >
                                🎯
                              </button>
                              <button
                                onClick={() => onGo(MODES.voice, c)}
                                style={{
                                  flex: 1,
                                  background: '#f0fdf4',
                                  border: 'none',
                                  borderRadius: 10,
                                  padding: '9px 0',
                                  cursor: 'pointer',
                                  fontSize: 20
                                }}
                              >
                                🎤
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                cats.map((c) => {
                  const p = catProgress[c.id];
                  const pct = p ? Math.round((p.bestScore / p.bestTotal) * 100) : 0;
                  const star = p && pct >= 80;

                  return (
                    <div
                      key={c.id}
                      style={{
                        background: 'white',
                        borderRadius: 14,
                        padding: '12px 14px',
                        marginBottom: 8,
                        boxShadow: '0 2px 12px rgba(0,0,0,.1)'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 8
                        }}
                      >
                        <div style={{ fontSize: 28, marginRight: 4 }}>{c.emoji || '📚'}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{c.label}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{c.sublabel}</div>
                          {p && (
                            <div style={{ marginTop: 5 }}>
                              <div
                                style={{
                                  width: '100%',
                                  height: 4,
                                  background: '#f0f0f0',
                                  borderRadius: 2,
                                  marginBottom: 2
                                }}
                              >
                                <div
                                  style={{
                                    width: pct + '%',
                                    height: '100%',
                                    background: star ? '#22C55E' : '#667eea',
                                    borderRadius: 2,
                                    transition: 'width .3s'
                                  }}
                                />
                              </div>
                              <div
                                style={{ fontSize: 10, color: star ? '#22C55E' : '#888' }}
                              >
                                {star ? '⭐ ' : ''}
                                {p.bestScore}/{p.bestTotal} - {p.sessions} sessions
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          <button
                            onClick={() => onGo(MODES.flash, c)}
                            style={{
                              ...B('#667eea', '#764ba2'),
                              padding: '7px 9px',
                              fontSize: 14
                            }}
                          >
                            🃏
                          </button>
                          {!c.noQuiz && (
                            <>
                              <button
                                onClick={() => onGo(MODES.quiz, c)}
                                style={{
                                  ...B('#f5576c', '#f093fb'),
                                  padding: '7px 9px',
                                  fontSize: 14
                                }}
                              >
                                🎯
                              </button>
                              <button
                                onClick={() => onGo(MODES.voice, c)}
                                style={{
                                  ...B('#11998e', '#38ef7d'),
                                  padding: '7px 9px',
                                  fontSize: 14
                                }}
                              >
                                🎤
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
