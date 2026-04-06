// =============================================================================
// StatsScreen Component - Progress dashboard
// =============================================================================

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getLast7 } from '../utils/dateUtils';
import { CATS } from '../data/categories';

/**
 * Stats screen showing progress dashboard
 * @param {Object} props
 * @param {Object} props.profile - User profile
 * @param {Object} props.catProgress - Progress by category
 * @param {Array} props.dailyStats - Daily statistics
 * @param {Function} props.onBack - Callback to go back
 * @param {Function} props.onSettings - Callback to open settings
 */
export function StatsScreen({
  profile,
  catProgress,
  dailyStats,
  onBack,
  onSettings
}) {
  const last7 = getLast7(dailyStats);
  const allP = Object.values(catProgress);

  const totalSessions = allP.reduce((s, p) => s + p.sessions, 0);
  const totalQ = allP.reduce((s, p) => s + p.totalQuestions, 0);
  const totalC = allP.reduce((s, p) => s + p.totalCorrect, 0);
  const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
  const totalTime = dailyStats.reduce((s, d) => s + (d.timeSeconds || 0), 0);

  const fmtTime = (t) => {
    if (t < 60) return t + 's';
    if (t < 3600) return Math.floor(t / 60) + 'm';
    return Math.floor(t / 3600) + 'h ' + Math.floor((t % 3600) / 60) + 'm';
  };

  const playedCats = CATS.filter((c) => catProgress[c.id]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
        fontFamily: 'system-ui,sans-serif',
        padding: '16px 16px 32px'
      }}
    >
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,.2)',
              border: 'none',
              color: 'white',
              borderRadius: 10,
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Back
          </button>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 17
            }}
          >
            Progress Dashboard
          </div>
          <button
            onClick={onSettings}
            style={{
              background: 'rgba(255,255,255,.2)',
              border: 'none',
              color: 'white',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            ⚙️
          </button>
        </div>

        {/* Profile name */}
        {profile.kidName && (
          <div
            style={{
              background: 'rgba(255,255,255,.12)',
              borderRadius: 16,
              padding: '12px 16px',
              marginBottom: 14,
              color: 'white'
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800 }}>{profile.kidName}</div>
          </div>
        )}

        {/* Stats cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8,
            marginBottom: 14
          }}
        >
          {[
            ['Sessions', totalSessions, '🎯'],
            ['Questions', totalQ, '❓'],
            ['Accuracy', accuracy + '%', '✅'],
            ['Time', fmtTime(totalTime), '⏱']
          ].map((x) => (
            <div
              key={x[0]}
              style={{
                background: 'white',
                borderRadius: 14,
                padding: '12px 6px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,.1)'
              }}
            >
              <div style={{ fontSize: 20 }}>{x[2]}</div>
              <div
                style={{ fontSize: 18, fontWeight: 900, color: '#667eea', marginTop: 2 }}
              >
                {x[1]}
              </div>
              <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{x[0]}</div>
            </div>
          ))}
        </div>

        {/* Activity chart */}
        <div
          style={{
            background: 'white',
            borderRadius: 18,
            padding: '18px 14px',
            marginBottom: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,.1)'
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 12 }}>
            Activity - Last 7 Days
          </div>
          {last7.every((d) => d.Questions === 0) ? (
            <div
              style={{ textAlign: 'center', color: '#aaa', fontSize: 13, padding: '20px 0' }}
            >
              No activity yet - start practicing!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={last7} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Questions" fill="#667eea" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Correct" fill="#22C55E" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category progress */}
        {playedCats.length > 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: 18,
              padding: '18px 14px',
              boxShadow: '0 2px 12px rgba(0,0,0,.1)'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 12 }}>
              Category Progress
            </div>
            {playedCats
              .sort(
                (a, b) =>
                  catProgress[b.id].bestScore / catProgress[b.id].bestTotal -
                  catProgress[a.id].bestScore / catProgress[a.id].bestTotal
              )
              .map((c) => {
                const p = catProgress[c.id];
                const pct = Math.round((p.bestScore / p.bestTotal) * 100);
                const star = pct >= 80;
                return (
                  <div key={c.id} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                        {c.emoji} {c.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: star ? '#22C55E' : '#667eea',
                          fontWeight: 600
                        }}
                      >
                        {star ? '⭐ ' : ''}
                        {pct}%
                      </div>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: 8,
                        background: '#f0f0f0',
                        borderRadius: 4
                      }}
                    >
                      <div
                        style={{
                          width: pct + '%',
                          height: '100%',
                          background: star ? '#22C55E' : '#667eea',
                          borderRadius: 4,
                          transition: 'width .3s'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>
                      Best: {p.bestScore}/{p.bestTotal} - Sessions: {p.sessions}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
