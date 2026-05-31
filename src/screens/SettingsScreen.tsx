// =============================================================================
// SettingsScreen Component - grouped list with focused sub-views
// (profile, voice, reminders, backup & reset, about & privacy).
// =============================================================================

import { useRef, useState } from 'react';
import { speak, setGender } from '../services/AudioService';
import { backupFilename, exportData, importData, parseDataExport, serializeExport } from '../services/BackupService';
import { NotificationService } from '../services/NotificationService';
import {
  beginRedirectAuth,
  isDriveConfigured,
  REDIRECT_REQUIRED,
} from '../services/GoogleDriveService';
import { runDriveBackup, runDriveRestore } from '../services/driveActions';
import { openLink, shareApp } from '../utils/linkUtils';
import { SettingsRow } from '../components';
import type { Profile, VoiceGender } from '../types';

interface SettingsScreenProps {
  profile: Profile;
  voiceGender: VoiceGender;
  notifications: boolean;
  reminderTime: string;
  onVoice: (g: VoiceGender) => void;
  onSaveProfile: (p: Profile) => void | Promise<void>;
  onToggleNotifications: (on: boolean) => void;
  onChangeReminderTime: (time: string) => void;
  onImported: () => void;
  onBack: () => void;
  onResetProgress: () => void;
  onResetAll: () => void;
}

type View = 'list' | 'profile' | 'voice' | 'reminders' | 'backup' | 'about' | 'install';

const APP_VERSION = '2.0.0';
const BUG_URL = 'https://github.com/RahatHameed/schulfit/issues';

const shell: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  fontFamily: 'system-ui,sans-serif',
  padding: '16px 16px 40px',
};

const card: React.CSSProperties = {
  background: 'white',
  borderRadius: 20,
  padding: 20,
  marginBottom: 14,
  boxShadow: '0 2px 16px rgba(0,0,0,.12)',
};

const group: React.CSSProperties = {
  background: 'white',
  borderRadius: 18,
  overflow: 'hidden',
  marginBottom: 14,
  boxShadow: '0 2px 16px rgba(0,0,0,.12)',
};

const sectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: '#333',
  marginBottom: 12,
};

const actionBtn = (variant: 'primary' | 'subtle'): React.CSSProperties => ({
  width: '100%',
  background: variant === 'primary' ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f8f9fa',
  border: variant === 'primary' ? 'none' : '2px solid #e5e7eb',
  borderRadius: 12,
  padding: '12px',
  fontSize: 14,
  fontWeight: 800,
  color: variant === 'primary' ? 'white' : '#333',
  cursor: 'pointer',
  marginBottom: 10,
});

export function SettingsScreen({
  profile,
  voiceGender,
  notifications,
  reminderTime,
  onVoice,
  onSaveProfile,
  onToggleNotifications,
  onChangeReminderTime,
  onImported,
  onBack,
  onResetProgress,
  onResetAll,
}: SettingsScreenProps) {
  const [view, setView] = useState<View>('list');

  const [kidName, setKidName] = useState(profile.kidName || '');
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  // Backup state
  const fileRef = useRef<HTMLInputElement>(null);
  const [backupBusy, setBackupBusy] = useState<null | 'export' | 'import' | 'drive-up' | 'drive-down'>(null);
  const [backupMsg, setBackupMsg] = useState<string | null>(null);

  // Notification permission
  const [permission, setPermission] = useState<NotificationPermission>(
    NotificationService.isSupported() ? NotificationService.permission() : 'denied',
  );

  const errMsg = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

  const handleSave = async () => {
    await onSaveProfile({ kidName: kidName || 'Champ' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testVoice = (g: VoiceGender) => {
    onVoice(g);
    setTimeout(() => {
      setGender(g);
      speak('Hallo! Ich bin dein Assistent.');
    }, 100);
  };

  const toggleNotifications = async () => {
    const next = !notifications;
    if (next && NotificationService.isSupported() && NotificationService.permission() !== 'granted') {
      const result = await NotificationService.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        onToggleNotifications(false);
        return;
      }
    }
    onToggleNotifications(next);
  };

  const onShare = async () => {
    const r = await shareApp();
    if (r.success && r.method === 'clipboard') {
      setShareMsg('Link copied to clipboard');
      setTimeout(() => setShareMsg(null), 2500);
    }
  };

  // ---- Backup actions ----
  const doExport = async () => {
    setBackupBusy('export');
    setBackupMsg(null);
    try {
      const data = await exportData();
      const blob = new Blob([serializeExport(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backupFilename(data.exportedAt);
      a.click();
      URL.revokeObjectURL(url);
      setBackupMsg('Backup downloaded.');
    } catch (e) {
      setBackupMsg(errMsg(e, 'Export failed.'));
    } finally {
      setBackupBusy(null);
    }
  };

  const doImport = async (file: File) => {
    if (!window.confirm('Restoring will REPLACE all current data on this device. Continue?')) {
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setBackupBusy('import');
    setBackupMsg(null);
    try {
      await importData(parseDataExport(await file.text()));
      setBackupMsg('Data restored.');
      onImported();
    } catch (e) {
      setBackupMsg(errMsg(e, 'That backup file could not be read.'));
    } finally {
      setBackupBusy(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const doDriveBackup = async () => {
    setBackupBusy('drive-up');
    setBackupMsg(null);
    try {
      await runDriveBackup();
      setBackupMsg('Backed up to Google Drive.');
    } catch (e) {
      if (e instanceof Error && e.message === REDIRECT_REQUIRED) {
        beginRedirectAuth('backup');
        return;
      }
      setBackupMsg(errMsg(e, 'Google Drive backup failed.'));
    } finally {
      setBackupBusy(null);
    }
  };

  const doDriveRestore = async () => {
    if (!window.confirm('Restoring will REPLACE all current data on this device. Continue?')) return;
    setBackupBusy('drive-down');
    setBackupMsg(null);
    try {
      const ok = await runDriveRestore();
      if (!ok) setBackupMsg('No backup found in your Google Drive yet.');
      else {
        setBackupMsg('Data restored from Google Drive.');
        onImported();
      }
    } catch (e) {
      if (e instanceof Error && e.message === REDIRECT_REQUIRED) {
        beginRedirectAuth('restore');
        return;
      }
      setBackupMsg(errMsg(e, 'Google Drive restore failed.'));
    } finally {
      setBackupBusy(null);
    }
  };

  const notifSupported = NotificationService.isSupported();
  const notifBackground = NotificationService.supportsBackground();

  const Header = ({ title, onBackFn }: { title: string; onBackFn: () => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
      <button
        onClick={onBackFn}
        style={{
          background: 'rgba(255,255,255,.2)',
          border: 'none',
          color: 'white',
          borderRadius: 10,
          padding: '8px 14px',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Back
      </button>
      <div style={{ flex: 1, textAlign: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
        {title}
      </div>
      <div style={{ width: 58 }} />
    </div>
  );

  // ===========================================================================
  // Sub-views
  // ===========================================================================

  if (view === 'profile') {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <Header title="Child Nickname" onBackFn={() => setView('list')} />
          <div style={card}>
            <div style={sectionTitle}>Child Nickname</div>
            <input
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder="e.g. Ali, Fatima"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: 12,
              }}
            />
            <button onClick={handleSave} style={actionBtn('primary')}>
              {saved ? 'Saved!' : 'Save Name'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'voice') {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <Header title="Voice" onBackFn={() => setView('list')} />
          <div style={card}>
            <div style={{ ...sectionTitle, marginBottom: 6 }}>Voice Gender</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>
              Tap to switch and hear a sample.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([
                { g: 'female', label: 'Female', desc: 'Higher pitch' },
                { g: 'male', label: 'Male', desc: 'Lower pitch' },
              ] as const).map((x) => (
                <button
                  key={x.g}
                  onClick={() => testVoice(x.g)}
                  style={{
                    background: voiceGender === x.g ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f8f9fa',
                    border: `2px solid ${voiceGender === x.g ? '#667eea' : '#e5e7eb'}`,
                    borderRadius: 14,
                    padding: '14px 10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{voiceGender === x.g ? '🔊' : '🔈'}</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: voiceGender === x.g ? 'white' : '#333',
                      marginBottom: 2,
                    }}
                  >
                    {x.label}
                  </div>
                  <div style={{ fontSize: 11, color: voiceGender === x.g ? 'rgba(255,255,255,.8)' : '#888' }}>
                    {x.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'reminders') {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <Header title="Daily Reminder" onBackFn={() => setView('list')} />
          <div style={card}>
            <div style={sectionTitle}>Daily Reminder</div>
            {!notifSupported ? (
              <div style={{ fontSize: 12, color: '#888' }}>
                This browser doesn’t support notifications.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: '#444', fontWeight: 700 }}>Streak reminder</div>
                  <button
                    onClick={() => void toggleNotifications()}
                    aria-pressed={notifications}
                    style={{
                      width: 52,
                      height: 30,
                      borderRadius: 999,
                      border: 'none',
                      cursor: 'pointer',
                      background: notifications ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#d1d5db',
                      position: 'relative',
                      transition: 'background .2s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 3,
                        left: notifications ? 25 : 3,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'white',
                        transition: 'left .2s',
                      }}
                    />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 13, color: '#444', fontWeight: 700 }}>Time</div>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => onChangeReminderTime(e.target.value)}
                    disabled={!notifications}
                    style={{
                      padding: '8px 10px',
                      border: '2px solid #e5e7eb',
                      borderRadius: 10,
                      fontSize: 14,
                      opacity: notifications ? 1 : 0.5,
                    }}
                  />
                </div>

                {notifications && permission !== 'granted' && (
                  <div style={{ fontSize: 12, color: '#b45309', marginTop: 12 }}>
                    Allow notifications when prompted so reminders can appear.
                  </div>
                )}
                <div style={{ fontSize: 11, color: '#888', marginTop: 12, lineHeight: 1.5 }}>
                  {notifBackground
                    ? 'Reminders can appear even when SchulFit is closed (on supported browsers / installed app).'
                    : '⚠️ On this browser, reminders only appear while SchulFit is open. Install the app for background reminders.'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'backup') {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <Header title="Backup & Reset" onBackFn={() => setView('list')} />

          <div style={card}>
            <div style={sectionTitle}>Backup &amp; Restore</div>
            <button onClick={() => void doExport()} disabled={backupBusy != null} style={actionBtn('primary')}>
              {backupBusy === 'export' ? 'Exporting…' : '📄 Export backup (JSON)'}
            </button>
            <button onClick={() => fileRef.current?.click()} disabled={backupBusy != null} style={actionBtn('subtle')}>
              {backupBusy === 'import' ? 'Importing…' : '📂 Import backup (JSON)'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void doImport(f);
              }}
            />

            {isDriveConfigured() && (
              <>
                <button onClick={() => void doDriveBackup()} disabled={backupBusy != null} style={actionBtn('subtle')}>
                  {backupBusy === 'drive-up' ? 'Backing up…' : '☁️ Back up to Google Drive'}
                </button>
                <button onClick={() => void doDriveRestore()} disabled={backupBusy != null} style={actionBtn('subtle')}>
                  {backupBusy === 'drive-down' ? 'Restoring…' : '☁️ Restore from Google Drive'}
                </button>
              </>
            )}

            {backupMsg && (
              <div style={{ fontSize: 12, color: '#444', fontWeight: 700, marginTop: 4 }}>{backupMsg}</div>
            )}
          </div>

          <div style={card}>
            <div style={{ ...sectionTitle, marginBottom: 14 }}>Reset</div>
            <button
              onClick={onResetProgress}
              style={{
                width: '100%',
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: 12,
                padding: '12px',
                fontSize: 14,
                fontWeight: 700,
                color: '#856404',
                cursor: 'pointer',
                marginBottom: 10,
              }}
            >
              Reset Progress Only
            </button>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                style={{
                  width: '100%',
                  background: '#f8d7da',
                  border: '2px solid #dc3545',
                  borderRadius: 12,
                  padding: '12px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#721c24',
                  cursor: 'pointer',
                }}
              >
                Reset Everything
              </button>
            ) : (
              <div style={{ background: '#f8d7da', borderRadius: 12, padding: 14, border: '2px solid #dc3545' }}>
                <div style={{ fontSize: 13, color: '#721c24', fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>
                  Delete all data?
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setConfirmReset(false)}
                    style={{ flex: 1, background: '#6c757d', border: 'none', borderRadius: 10, padding: '10px', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onResetAll}
                    style={{ flex: 1, background: '#dc3545', border: 'none', borderRadius: 10, padding: '10px', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Yes Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'install') {
    const stepList: React.CSSProperties = {
      margin: '8px 0 0',
      paddingLeft: 20,
      fontSize: 13,
      color: '#555',
      lineHeight: 1.7,
    };
    const platformTitle: React.CSSProperties = {
      fontSize: 15,
      fontWeight: 800,
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    };
    return (
      <div style={shell}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <Header title="Install App" onBackFn={() => setView('list')} />

          <div style={card}>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
              Add SchulFit to your home screen to use it like a real app — full screen, works
              offline, and reminders work more reliably.
            </div>
          </div>

          <div style={card}>
            <div style={platformTitle}>🤖 Android (Chrome)</div>
            <ol style={stepList}>
              <li>Open SchulFit in Chrome.</li>
              <li>Tap the ⋮ menu (top right).</li>
              <li>Tap “Add to Home screen” or “Install app”.</li>
              <li>Tap “Install” to confirm.</li>
            </ol>
          </div>

          <div style={card}>
            <div style={platformTitle}>🍎 iPhone &amp; iPad (Safari)</div>
            <ol style={stepList}>
              <li>Open SchulFit in Safari (it must be Safari).</li>
              <li>Tap the Share button (the square with an arrow ↑).</li>
              <li>Scroll down and tap “Add to Home Screen”.</li>
              <li>Tap “Add” in the top corner.</li>
            </ol>
          </div>

          <div style={{ ...card, marginBottom: 0 }}>
            <div style={platformTitle}>💻 Computer (Chrome / Edge)</div>
            <ol style={stepList}>
              <li>Open SchulFit in your browser.</li>
              <li>Click the install icon in the address bar (a small ⊕ / monitor icon),
                or open the ⋮ menu → “Install SchulFit”.</li>
              <li>Click “Install”.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'about') {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <Header title="About & Privacy" onBackFn={() => setView('list')} />

          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#333', marginBottom: 4 }}>SchulFit</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
              German school-entry exam prep · v{APP_VERSION}
            </div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
              A free app that helps immigrant families in Germany prepare their children for the
              Einschulungsuntersuchung through playful practice. It is an educational aid, not an
              official assessment.
            </div>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Your privacy</div>
            <ul style={{ fontSize: 13, color: '#555', margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.5 }}>
              <li>Your data stays on this device — no account, no server.</li>
              <li>Google Drive backup is optional and goes only to your own Drive.</li>
              <li>Daily reminders are scheduled locally on your device.</li>
              <li>Voice practice uses your browser’s speech recognition (some browsers process audio on their servers).</li>
              <li>No ads, no analytics, no third-party tracking.</li>
            </ul>
            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener"
              style={{ display: 'inline-block', marginTop: 14, color: '#667eea', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}
            >
              Read the full privacy policy →
            </a>
          </div>

          <div style={group}>
            <SettingsRow icon="🐛" label="Report a bug" onClick={() => openLink(BUG_URL)} chevron={false} divider={false} />
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // Main list
  // ===========================================================================
  return (
    <div style={shell}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <Header title="Settings" onBackFn={onBack} />

        {/* Profile card */}
        <button
          onClick={() => setView('profile')}
          style={{ ...card, width: '100%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              color: 'white',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {(profile.kidName || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 17, color: '#333' }}>
              {profile.kidName || 'Champ'}
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>Edit nickname</div>
          </div>
          <span style={{ color: '#bbb', fontSize: 20 }}>›</span>
        </button>

        {/* Settings group */}
        <div style={group}>
          <SettingsRow
            icon="🔊"
            label="Voice"
            sublabel={voiceGender === 'male' ? 'Male' : 'Female'}
            onClick={() => setView('voice')}
          />
          <SettingsRow
            icon="🔔"
            label="Daily reminder"
            sublabel={notifications ? `On · ${reminderTime}` : 'Off'}
            onClick={() => setView('reminders')}
          />
          <SettingsRow icon="☁️" label="Backup & reset" onClick={() => setView('backup')} />
          <SettingsRow icon="📲" label="Install app" onClick={() => setView('install')} />
          <SettingsRow icon="ℹ️" label="About & privacy" onClick={() => setView('about')} divider={false} />
        </div>

        {/* Actions group */}
        <div style={group}>
          <SettingsRow icon="🔗" label="Share SchulFit" onClick={() => void onShare()} chevron={false} />
          <SettingsRow icon="🐛" label="Report a bug" onClick={() => openLink(BUG_URL)} chevron={false} divider={false} />
        </div>

        {shareMsg && (
          <div style={{ textAlign: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>{shareMsg}</div>
        )}
      </div>
    </div>
  );
}
