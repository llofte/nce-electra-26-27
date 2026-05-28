/* app.jsx — root, navigation, tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "split",
  "density": "comfortable",
  "preSeason": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Route: { tab: 'home'|'calendar'|'comps'|'results', screen?: 'compDetail'|'scoresheet', id? }
  const [route, setRoute] = React.useState({ tab: 'home' });

  // Scale the iOS device frame to fit the viewport so the bottom nav stays visible
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const recalc = () => {
      const padV = 32, padH = 24;
      const sH = (window.innerHeight - padV) / 874;
      const sW = (window.innerWidth - padH) / 402;
      setScale(Math.min(1, sH, sW));
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

  return (
    <>
      <div className="ios-host" style={{ '--ios-scale': scale }}>
        <IOSDevice dark width={402} height={874}>
          <div className="app">
            <div className="scroll" key={route.tab + (route.screen || '')}>
              {body}
            </div>
            <BottomNav tab={route.tab} setTab={(tab) => setRoute({ tab })}/>
          </div>
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
