/* shared.jsx — common UI pieces */

// ─── icons (24x24, stroke) ───────────────────────────────────
const Icon = {
  Home:   ({ s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z"/></svg>,
  Cal:    ({ s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  Trophy: ({ s = 22 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* cup body */}
      <path d="M7 3h10v6a5 5 0 01-10 0V3z"/>
      {/* left handle */}
      <path d="M7 5H4v2a3 3 0 003 3"/>
      {/* right handle */}
      <path d="M17 5h3v2a3 3 0 01-3 3"/>
      {/* stem + base */}
      <path d="M12 14v4"/>
      <path d="M9 18h6v3H9z"/>
    </svg>
  ),
  Bolt:   ({ s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
  Bell:   ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 004 0"/></svg>,
  Chev:   ({ s = 18, dir = 'right' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'left' ? 'rotate(180deg)' : dir === 'down' ? 'rotate(90deg)' : dir === 'up' ? 'rotate(-90deg)' : 'none' }}><path d="M9 6l6 6-6 6"/></svg>,
  Pin:    ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7 7-12a7 7 0 00-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  Clock:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  Hotel:  ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14"/><path d="M9 9h2M9 13h2M13 9h2M13 13h2M10 21v-4h4v4"/></svg>,
  Car:    ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16h14l-1.5-6.5A2 2 0 0015.6 8H8.4a2 2 0 00-1.9 1.5L5 16zM5 16v3M19 16v3"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg>,
  Drive:  ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-7-7 18-2-8-9-3z"/></svg>,
  Doc:    ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h8l4 4v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><path d="M14 2v4h4M8 13h8M8 17h6"/></svg>,
  Dl:     ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>,
  Plane: ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>,
  External: ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6"/></svg>,
};

// ─── lightning bolt SVG — sharp, brand-accurate ──────────────
const LightningBolt = ({ size = 60, color = 'var(--volt)', glow = true, style }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 60 96" style={style}>
    <defs>
      {glow && <filter id="glo" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3"/>
      </filter>}
    </defs>
    {glow && <path filter="url(#glo)" opacity="0.7" fill={color} d="M38 0 L8 56 L26 56 L18 96 L52 38 L34 38 L42 0 Z"/>}
    <path fill={color} stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinejoin="round" d="M38 0 L8 56 L26 56 L18 96 L52 38 L34 38 L42 0 Z"/>
  </svg>
);

// ─── Brand mark ─────────────────────────────────────────────
function BrandMark() {
  return (
    <div className="brand-mark">
      <img src="assets/electra-logo.png" alt="Electra"/>
      <div>
        <div className="tag">NorCal Elite All-Stars</div>
        <div className="name"><b>Electra</b> · Level 2 Senior</div>
      </div>
    </div>
  );
}

// ─── Screen header with back button ─────────────────────────
function ScreenHeader({ title, sub, onBack, right }) {
  return (
    <div className="scr-hdr">
      {onBack && (
        <button className="back" onClick={onBack} aria-label="Back">
          <Icon.Chev dir="left"/>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ttl">{title}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── Bottom nav (4 tabs) ────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const items = [
    { id: 'home',     label: 'Home',     icon: Icon.Home },
    { id: 'calendar', label: 'Calendar', icon: Icon.Cal },
    { id: 'comps',    label: 'Comps',    icon: Icon.Bolt },
    { id: 'results',  label: 'Results',  icon: Icon.Trophy },
  ];
  return (
    <div className="nav">
      <div className="pill">
        {items.map(it => {
          const I = it.icon;
          return (
            <button key={it.id} onClick={() => setTab(it.id)} className={tab === it.id ? 'is-active' : ''}>
              <I/>
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Date helpers ───────────────────────────────────────────
const D = {
  parse: (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  },
  fmt: (d, opt) => d.toLocaleDateString('en-US', opt),
  dow: (d) => d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
  dom: (d) => d.getDate(),
  mon: (d) => d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  days: (a, b) => Math.round((b - a) / 86400000),
  same: (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(),
  startOfWeek: (d) => {
    const day = d.getDay(); // 0=Sun
    const x = new Date(d);
    x.setDate(d.getDate() - ((day + 6) % 7)); // Monday-first
    return x;
  },
  addDays: (d, n) => {
    const x = new Date(d);
    x.setDate(d.getDate() + n);
    return x;
  },
  range: (start, count) => Array.from({ length: count }, (_, i) => D.addDays(start, i)),
};

// Helpers that respect the "preSeason" tweak for previewing the empty state
function getCompetitions(tweaks) {
  if (tweaks?.preSeason) {
    return COMPETITIONS.map(c => ({ ...c, status: 'upcoming' }));
  }
  return COMPETITIONS;
}
function getEffectiveToday(tweaks) {
  if (tweaks?.preSeason) return new Date(2026, 8, 1); // Sep 1, 2026 (before first comp)
  return TODAY;
}

// Get the next upcoming comp from today (or pseudo-today in preSeason)
function nextComp(tweaks) {
  const today = getEffectiveToday(tweaks);
  return getCompetitions(tweaks)
    .filter(c => c.status === 'upcoming')
    .map(c => ({ ...c, daysOut: Math.max(0, D.days(today, D.parse(c.date))) }))
    .sort((a, b) => a.daysOut - b.daysOut)[0];
}

// Build countdown numbers relative to an arbitrary "today"
function countdownTo(targetISO, fromToday) {
  const today = fromToday || TODAY;
  const target = new Date(targetISO);
  const diff = target - today;
  const days  = Math.max(0, Math.floor(diff / 86400000));
  const hours = Math.max(0, Math.floor((diff / 3600000) % 24));
  return { days, hours };
}

// Persists state in sessionStorage so pull-to-refresh restores sub-tab position.
// Key should be unique per screen instance (e.g. include compId).
function usePersistentState(key, defaultValue) {
  const [state, setState] = React.useState(() => {
    const saved = sessionStorage.getItem(key);
    if (saved != null) { try { return JSON.parse(saved); } catch(e) {} }
    return defaultValue;
  });
  const set = React.useCallback((val) => {
    setState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      sessionStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);
  return [state, set];
}

Object.assign(window, {
  Icon, LightningBolt, AppHeader, BrandMark, ScreenHeader, BottomNav,
  D, nextComp, countdownTo,
  getCompetitions, getEffectiveToday,
  usePersistentState,
});
