/* app.jsx — root, navigation, tweaks */

function IOSInstallPrompt() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = !/(CriOS|FxiOS|OPiOS|mercury|EdgiOS)/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;
  const [visible, setVisible] = React.useState(
    () => isIOS && isSafari && !isStandalone && !localStorage.getItem('pwa-dismissed')
  );

  const dismiss = () => {
    localStorage.setItem('pwa-dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  const DotsIcon = () => (
    <svg width="18" height="6" viewBox="0 0 18 6" fill="#5ac8fa" style={{ display:'inline',verticalAlign:'middle',margin:'0 2px 1px' }}>
      <circle cx="2" cy="3" r="2"/><circle cx="9" cy="3" r="2"/><circle cx="16" cy="3" r="2"/>
    </svg>
  );
  const ShareIcon = () => (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="#5ac8fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline',verticalAlign:'middle',margin:'0 2px 2px' }}>
      <path d="M8 1v10M4 5l4-4 4 4"/>
      <path d="M1 10v6a1 1 0 001 1h12a1 1 0 001-1v-6"/>
    </svg>
  );
  const ChevDownIcon = () => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="#5ac8fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline',verticalAlign:'middle',margin:'0 2px 1px' }}>
      <path d="M1 1l6 7 6-7"/>
    </svg>
  );

  const steps = [
    <span>Tap <DotsIcon/> in the bottom right corner of Safari</span>,
    <span>Tap <b style={{color:'var(--text)'}}>Share</b> <ShareIcon/></span>,
    <span>Tap <b style={{color:'var(--text)'}}>View More</b> <ChevDownIcon/></span>,
    <span>Tap <b style={{color:'var(--text)'}}>Add to Home Screen</b> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5ac8fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline',verticalAlign:'middle',margin:'0 2px 1px' }}><rect x="1" y="1" width="14" height="14" rx="3"/><path d="M8 5v6M5 8h6"/></svg></span>,
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={dismiss} style={{ position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.55)' }}/>
      {/* Sheet */}
      <div style={{ position:'fixed',bottom:0,left:0,right:0,zIndex:9999,background:'#1c180f',borderTop:'1px solid rgba(255,235,180,0.15)',borderRadius:'20px 20px 0 0',padding:'16px 22px calc(32px + env(safe-area-inset-bottom))',boxShadow:'0 -12px 40px rgba(0,0,0,0.6)' }}>
        {/* Handle */}
        <div style={{ width:36,height:4,borderRadius:2,background:'rgba(255,255,255,0.18)',margin:'0 auto 20px' }}/>
        {/* Header */}
        <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
          <img src="assets/electra-logo-black.png" style={{ width:48,height:48,borderRadius:12,flexShrink:0 }}/>
          <div>
            <div style={{ font:'700 17px/1.2 Manrope',color:'var(--text)' }}>Add to Home Screen</div>
            <div style={{ font:'400 13px/1.4 Manrope',color:'var(--text-dim)',marginTop:3 }}>Install for the best experience</div>
          </div>
        </div>
        {/* Steps */}
        <div style={{ display:'flex',flexDirection:'column',gap:14,marginBottom:22 }}>
          {steps.map((text, i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:14 }}>
              <div style={{ width:28,height:28,borderRadius:99,background:'var(--volt)',display:'grid',placeItems:'center',flexShrink:0 }}>
                <span style={{ font:'800 13px/1 "Barlow Condensed"',color:'#0a0907' }}>{i + 1}</span>
              </div>
              <div style={{ font:'400 14px/1.45 Manrope',color:'var(--text-dim)' }}>{text}</div>
            </div>
          ))}
        </div>
        {/* Dismiss */}
        <button onClick={dismiss} style={{ width:'100%',height:50,border:'1px solid rgba(255,235,180,0.18)',borderRadius:14,background:'transparent',color:'var(--text-dim)',font:'600 15px/1 Manrope',cursor:'pointer' }}>
          Not Now
        </button>
      </div>
    </>
  );
}

function TopNav({ tab, setTab }) {
  const items = [
    { id: 'home',     label: 'Home',     icon: Icon.Home },
    { id: 'calendar', label: 'Calendar', icon: Icon.Cal },
    { id: 'comps',    label: 'Comps',    icon: Icon.Bolt },
    { id: 'results',  label: 'Results',  icon: Icon.Trophy },
  ];
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:30, height:52, display:'flex', background:'rgba(14,11,7,0.94)', backdropFilter:'blur(16px) saturate(160%)', WebkitBackdropFilter:'blur(16px) saturate(160%)', borderBottom:'1px solid var(--line)' }}>
      {items.map(it => {
        const I = it.icon;
        const active = tab === it.id;
        return (
          <button key={it.id} onClick={() => setTab(it.id)} style={{ flex:1, appearance:'none', border:'none', borderBottom:`2px solid ${active ? 'var(--volt)' : 'transparent'}`, background: active ? 'rgba(214,244,61,0.05)' : 'transparent', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, color: active ? 'var(--volt)' : 'var(--text-dim)', cursor:'pointer', font:'800 11px/1 "Barlow Condensed"', letterSpacing:'.14em', textTransform:'uppercase', transition:'color .15s, background .15s', paddingBottom:2 }}>
            <I s={20}/>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "split",
  "density": "comfortable",
  "preSeason": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Route: { tab: 'home'|'calendar'|'comps'|'results', screen?: 'compDetail'|'scoresheet', id? }
  const [route, setRoute] = React.useState(() => {
    const saved = sessionStorage.getItem('ptr-route');
    if (saved) { sessionStorage.removeItem('ptr-route'); try { return JSON.parse(saved); } catch(e) {} }
    return { tab: 'home' };
  });
  const routeRef = React.useRef(route);
  React.useEffect(() => { routeRef.current = route; }, [route]);

  // On a real phone, render native full-screen. On desktop, render the phone frame.
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= 480);

  // True when running as an installed PWA (home screen), false when opened in a browser tab
  const isInstalled = React.useMemo(() =>
    window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
  , []);

  // Pull-to-refresh
  const pullVal = React.useRef(0);
  const [pullProgress, setPullProgress] = React.useState(0); // 0–1.4 pulling, 1.5+ = loading

  // Scale the iOS device frame to fit the viewport (desktop only)
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const recalc = () => {
      const mobile = window.innerWidth <= 480;
      setIsMobile(mobile);
      document.body.dataset.mobile = mobile ? '1' : '';
      if (!mobile) {
        const padV = 32, padH = 24;
        const sH = (window.innerHeight - padV) / 874;
        const sW = (window.innerWidth - padH) / 402;
        setScale(Math.min(1, sH, sW));
      }
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);

  // Apply palette + density to body so CSS variables flip
  React.useEffect(() => {
    document.body.dataset.palette = t.palette;
    document.body.dataset.density = t.density;
  }, [t.palette, t.density]);

  // Swipe right from left edge to go back (only when a detail screen is open)
  React.useEffect(() => {
    if (!isMobile) return;
    let startX = null, startY = null;
    const EDGE = 32;      // px from left edge that activates the gesture
    const THRESHOLD = 72; // px rightward travel to trigger back

    const onStart = (e) => {
      if (!routeRef.current.screen) return;
      if (e.touches[0].clientX > EDGE) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = Math.abs(e.changedTouches[0].clientY - startY);
      startX = null; startY = null;
      if (dx > THRESHOLD && dy < dx) setRoute(r => ({ tab: r.tab }));
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchend',   onEnd);
    };
  }, [isMobile]);

  // Pull-to-refresh gesture (document-level, works on any tab)
  React.useEffect(() => {
    if (!isMobile) return;
    let startY = null;
    let active = false;
    const THRESHOLD = 68;

    const onStart = (e) => {
      const el = e.target.closest('.scroll');
      if (!el || el.scrollTop > 2) return;
      startY = e.touches[0].clientY;
      active = false;
    };
    const onMove = (e) => {
      if (startY === null) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) { startY = null; pullVal.current = 0; setPullProgress(0); return; }
      active = true;
      pullVal.current = Math.min(dy / THRESHOLD, 1.4);
      setPullProgress(pullVal.current);
    };
    const onEnd = () => {
      if (active && pullVal.current >= 1) {
        pullVal.current = 1.5;
        setPullProgress(1.5);
        sessionStorage.setItem('ptr-route', JSON.stringify(routeRef.current));
        setTimeout(() => window.location.reload(), 400);
      } else {
        pullVal.current = 0;
        setPullProgress(0);
      }
      startY = null;
      active = false;
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove,  { passive: true });
    document.addEventListener('touchend',   onEnd,  { passive: true });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove',  onMove);
      document.removeEventListener('touchend',   onEnd);
    };
  }, [isMobile]);

  const goTab    = (tab) => setRoute({ tab });
  const openComp = (id)  => setRoute(r => ({ ...r, screen: 'compDetail', id }));
  const openScore = (id) => setRoute(r => ({ ...r, screen: 'scoresheet', id }));
  const back      = ()   => setRoute(r => ({ tab: r.tab }));

  // What screen to render
  let body;
  if (route.screen === 'compDetail') {
    body = <CompDetail compId={route.id} onBack={back}/>;
  } else if (route.screen === 'scoresheet') {
    body = <ScoresheetScreen compId={route.id} onBack={back}/>;
  } else if (route.tab === 'home') {
    body = <HomeScreen tweaks={t} onOpenComp={openComp} onTab={goTab}/>;
  } else if (route.tab === 'calendar') {
    body = <CalendarScreen onOpenComp={openComp}/>;
  } else if (route.tab === 'comps') {
    body = <CompsScreen tweaks={t} onOpenComp={openComp}/>;
  } else if (route.tab === 'results') {
    body = <ResultsScreen tweaks={t} onOpenScoresheet={openScore}/>;
  }

  const scrollKey = route.tab + (route.screen || '');

  // Installed PWA + desktop frame: bottom nav
  const appInner = (
    <div className="app">
      <div className="scroll" key={scrollKey}>
        {body}
      </div>
      <BottomNav tab={route.tab} setTab={(tab) => setRoute({ tab })}/>
    </div>
  );

  // Browser (not installed): top nav, no bottom nav
  const webAppInner = (
    <div className="app">
      <TopNav tab={route.tab} setTab={(tab) => setRoute({ tab })}/>
      <div className="scroll" style={{ paddingTop: 66, paddingBottom: 20 }} key={scrollKey}>
        {body}
      </div>
    </div>
  );

  if (isMobile) {
    const isWebMode = !isInstalled;
    const p = Math.min(pullProgress, 1);
    const indicatorTop = isWebMode
      ? `calc(52px + ${p * 54 - 38}px)`
      : `calc(env(safe-area-inset-top, 0px) + ${p * 54 - 38}px)`;
    return (
      <>
        {isWebMode ? webAppInner : appInner}
        <IOSInstallPrompt/>
        {pullProgress > 0 && (
          <div style={{ position:'fixed', top:indicatorTop, left:0, right:0, zIndex:300, display:'flex', justifyContent:'center', pointerEvents:'none' }}>
            <div style={{ width:34, height:34, borderRadius:17, background:'var(--bg-card)', border:'1px solid var(--line-strong)', boxShadow:'0 2px 10px rgba(0,0,0,0.5)', display:'grid', placeItems:'center' }}>
              {pullProgress >= 1.5
                ? <div className="ptr-spin" style={{ width:16, height:16, borderRadius:8, border:'2px solid var(--volt)', borderTopColor:'transparent' }}/>
                : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--volt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform:`rotate(${p * 180}deg)`, transition:'transform 0.06s' }}>
                    <path d="M7 2v10M3 6l4-4 4 4"/>
                  </svg>
              }
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="ios-host" style={{ '--ios-scale': scale }}>
        <IOSDevice dark width={402} height={874}>
          {appInner}
        </IOSDevice>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakSelect
            label="Mode"
            value={t.palette}
            onChange={v => setTweak('palette', v)}
            options={[
              { value: 'split', label: 'Split (Gold + Volt accent)' },
              { value: 'volt',  label: 'Volt-heavy (Electra dom.)' },
              { value: 'gold',  label: 'Gold-heavy (NorCal dom.)' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Density">
          <TweakRadio
            label="Layout"
            value={t.density}
            onChange={v => setTweak('density', v)}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact',     label: 'Compact' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Preview">
          <TweakToggle
            label="Pre-season (no results yet)"
            value={t.preSeason}
            onChange={v => setTweak('preSeason', v)}
          />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.4, padding: '0 12px' }}>
            Shows the app as it would look <b style={{ color: 'rgba(255,255,255,0.8)' }}>before the first competition</b>: empty stats, empty results tab.
          </div>
        </TweakSection>

        <TweakSection label="Quick jump">
          <TweakButton
            label="→ Battle by the Bay"
            onClick={() => setRoute({ tab: 'comps', screen: 'compDetail', id: 'bbb-2026' })}
          />
          <TweakButton
            label="→ Volt Open scoresheet"
            onClick={() => setRoute({ tab: 'results', screen: 'scoresheet', id: 'volt-2026' })}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
