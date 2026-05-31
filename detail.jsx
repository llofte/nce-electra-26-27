/* detail.jsx — Competition detail screen with tabbed inner views */

function CompDetail({ compId, onBack }) {
  const comp = COMPETITIONS.find(c => c.id === compId);
  const [tab, setTab] = usePersistentState(`ptr-detail-${compId}`, 'overview');

  if (!comp) return null;

  const startD = D.parse(comp.date);
  const endD   = D.parse(comp.endDate || comp.date);
  const daysOut = D.days(TODAY, startD);

  const tabs = [
    { id: 'overview', label: 'Info' },
    { id: 'sched',    label: 'Schedule' },
    { id: 'div',      label: 'Teams' },
  ];

  return (
    <div className="scr">
      <ScreenHeader
        title={comp.name}
        sub={`${comp.city} · ${D.mon(startD)} ${D.dom(startD)}–${D.dom(endD)}`}
        onBack={onBack}
      />

      {/* Hero strip for this comp */}
      <CompHero comp={comp} daysOut={daysOut}/>

      {/* Tab bar */}
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && <CompOverview comp={comp}/>}
      {tab === 'sched'    && <CompSchedule comp={comp}/>}
      {tab === 'div'      && <CompDivision comp={comp}/>}
    </div>
  );
}

// ─── hero strip on detail ────────────────────────────────────
function CompHero({ comp, daysOut }) {
  const isComp = daysOut <= 7 && daysOut >= 0;
  return (
    <div style={{ margin: '0 var(--pad-x) 14px' }}>
      <div className="card grunge" style={{ padding: 14, position: 'relative', overflow: 'hidden' }}>
        <div className="chevron-bg"/>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--volt)' }}>
              {comp.status === 'past'
                ? `Final · Placed ${comp.placement}/8`
                : daysOut === 0 ? 'COMPETITION DAY'
                : daysOut < 0 ? 'Past'
                : `${daysOut} days out`}
            </div>
            <div style={{ font: '400 26px/1 Anton', textTransform: 'uppercase', marginTop: 6, color: 'var(--text)' }}>
              {comp.name}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-dim)', marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon.Pin/> {comp.venue || comp.city}
              </span>
              {comp.mat && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon.Bolt s={12}/> {comp.mat}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Overview tab ────────────────────────────────────────────
function CompOverview({ comp }) {
  const t = comp.travel;
  if (!t) {
    const hasVenue     = !!comp.venue;
    const hasItinerary = !!comp.lucyItinerary;
    const hasVarsity   = !!comp.varsityUrl;
    const varsityOnly  = hasVarsity && !hasVenue && !hasItinerary;
    return (
      <>
        {!hasVenue && !hasItinerary && !hasVarsity && (
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="card empty-mini">
              Comp details will be released closer to the event.
            </div>
          </div>
        )}
        {comp.lucyItinerary && (
          <div className="section" style={{ paddingTop: 12 }}>
            <h2><span className="title">Lucy's Itinerary</span></h2>
            {comp.lucyItinerary.flights && (
              <div className="card" style={{ padding: 14 }}>
                {comp.lucyItinerary.flights.outbound && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(93,175,255,0.13)', border: '1px solid rgba(93,175,255,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 20, lineHeight: 1 }}>🛫</div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '0 8px', alignItems: 'center' }}>
                      <div>
                        <div style={{ font: '800 12px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-faint)' }}>{comp.lucyItinerary.flights.outbound.date.split(' ')[0]}</div>
                        <div style={{ font: '700 16px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--text-dim)', marginTop: 4 }}>{comp.lucyItinerary.flights.outbound.date.split(' ')[1]}</div>
                      </div>
                      <div style={{ font: '400 26px/1 Anton', textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '.02em' }}>{comp.lucyItinerary.flights.outbound.from} → {comp.lucyItinerary.flights.outbound.to}</div>
                      <div style={{ font: '700 18px/1 "Barlow Condensed"', color: 'var(--text-dim)', letterSpacing: '.04em', textAlign: 'right' }}>{comp.lucyItinerary.flights.outbound.depart}</div>
                    </div>
                  </div>
                )}
                {comp.lucyItinerary.flights.outbound && comp.lucyItinerary.flights.ret && (
                  <div style={{ height: 1, background: 'var(--line)', margin: '12px 0' }}/>
                )}
                {comp.lucyItinerary.flights.ret && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(93,175,255,0.13)', border: '1px solid rgba(93,175,255,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 20, lineHeight: 1 }}>🛬</div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '0 8px', alignItems: 'center' }}>
                      <div>
                        <div style={{ font: '800 12px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-faint)' }}>{comp.lucyItinerary.flights.ret.date.split(' ')[0]}</div>
                        <div style={{ font: '700 16px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--text-dim)', marginTop: 4 }}>{comp.lucyItinerary.flights.ret.date.split(' ')[1]}</div>
                      </div>
                      <div style={{ font: '400 26px/1 Anton', textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '.02em' }}>{comp.lucyItinerary.flights.ret.from} → {comp.lucyItinerary.flights.ret.to}</div>
                      <div style={{ font: '700 18px/1 "Barlow Condensed"', color: 'var(--text-dim)', letterSpacing: '.04em', textAlign: 'right' }}>{comp.lucyItinerary.flights.ret.depart}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {comp.lucyItinerary.hotel && (
              <div className="card" style={{ padding: 14, marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(212,164,41,0.13)', border: '1px solid rgba(212,164,41,0.3)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>🏨</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: '700 16px/1.2 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em' }}>{comp.lucyItinerary.hotel.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>Check-in {comp.lucyItinerary.hotel.checkIn} · Check-out {comp.lucyItinerary.hotel.checkOut}</div>
                    {comp.lucyItinerary.hotel.distToVenue && <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>{comp.lucyItinerary.hotel.distToVenue} from venue</div>}
                  </div>
                </div>
                {comp.lucyItinerary.hotel.mapUrl && (
                  <a className="btn ghost block" href={comp.lucyItinerary.hotel.mapUrl} target="_blank" rel="noopener" style={{ marginTop: 10, textDecoration: 'none' }}>
                    <Icon.Drive/> Open in Maps
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        {comp.venue && (
          <div className="section" style={{ paddingTop: 12 }}>
            <h2><span className="title">Venue</span></h2>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(214,244,61,0.08)', border: '1px solid rgba(214,244,61,0.2)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>🏢</div>
                <div>
                  <div style={{ font: '700 15px/1.2 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em' }}>{comp.venue}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{comp.city}</div>
                </div>
              </div>
              <a className="btn ghost block" href={`https://maps.apple.com/?q=${encodeURIComponent(comp.venue + ', ' + comp.city)}`} target="_blank" rel="noopener" style={{ marginTop: 12, textDecoration: 'none' }}>
                <Icon.Drive/> Open in Maps
              </a>
            </div>
          </div>
        )}
        {comp.varsityUrl && (
          <div className="section" style={{ paddingTop: varsityOnly ? 0 : 12 }}>
            {!varsityOnly && <h2><span className="title">Learn More</span></h2>}
            <div className="card" style={{ padding: 14 }}>
              <a className="btn ghost block" href={comp.varsityUrl} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                <Icon.External/> View on Varsity.com
              </a>
            </div>
          </div>
        )}
        <div style={{ height: 24 }}/>
      </>
    );
  }
  const perfTime  = comp.performance && new Date(comp.performance);
  const perf2Time = comp.day2Performance && new Date(comp.day2Performance);
  const awardsTime= comp.awards && new Date(comp.awards);
  const isTwoDay  = !!comp.endDate && comp.endDate !== comp.date;
  const fmtTime = (d) => d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—';
  const fmtDow  = (d) => d ? d.toLocaleDateString('en-US', { weekday: 'short' }) : '';
  return (
    <>
      {/* 3-up KV row: Day 1 / Day 2 / Awards (or Perf / Awards for 1-day) */}
      <div className={`kvs ${isTwoDay ? 'three' : ''}`}>
        {isTwoDay ? (
          <>
            <div className="kv">
              <div className="k">Day 1 · {fmtDow(D.parse(comp.date))}</div>
              <div className="v" style={{ color: 'var(--volt)' }}>
                {fmtTime(perfTime)}
                <small style={{ color: 'var(--text-dim)' }}>Prelims · {comp.mat || 'Mat A'}</small>
              </div>
            </div>
            <div className="kv">
              <div className="k">Day 2 · {fmtDow(D.parse(comp.endDate))}</div>
              <div className="v" style={{ color: 'var(--volt)' }}>
                {fmtTime(perf2Time)}
                <small style={{ color: 'var(--text-dim)' }}>Finals · {comp.mat || 'Mat A'}</small>
              </div>
            </div>
            <div className="kv">
              <div className="k">Awards · {fmtDow(D.parse(comp.endDate))}</div>
              <div className="v">
                {awardsTime ? fmtTime(awardsTime) : '5:00pm'}
                <small style={{ color: 'var(--text-dim)' }}>Main floor</small>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="kv">
              <div className="k">Performance</div>
              <div className="v" style={{ color: 'var(--volt)' }}>
                {fmtTime(perfTime)}
                <small style={{ color: 'var(--text-dim)' }}>{fmtDow(D.parse(comp.date))} · {comp.mat || 'Mat A'}</small>
              </div>
            </div>
            <div className="kv">
              <div className="k">Awards</div>
              <div className="v">
                {awardsTime ? fmtTime(awardsTime) : '5:00pm'}
                <small style={{ color: 'var(--text-dim)' }}>Main floor</small>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lucy's Itinerary */}
      {comp.lucyItinerary && (
        <div className="section" style={{ paddingTop: 18 }}>
          <h2><span className="title">Lucy's Itinerary</span></h2>

          {comp.lucyItinerary.flights && (
            <div className="card" style={{ padding: 14 }}>
              {comp.lucyItinerary.flights.outbound && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(93,175,255,0.13)', border: '1px solid rgba(93,175,255,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 20, lineHeight: 1 }}>🛫</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '0 8px', alignItems: 'center' }}>
                    <div>
                      <div style={{ font: '800 12px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-faint)' }}>{comp.lucyItinerary.flights.outbound.date.split(' ')[0]}</div>
                      <div style={{ font: '700 16px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--text-dim)', marginTop: 4 }}>{comp.lucyItinerary.flights.outbound.date.split(' ')[1]}</div>
                    </div>
                    <div style={{ font: '400 26px/1 Anton', textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '.02em' }}>{comp.lucyItinerary.flights.outbound.from} → {comp.lucyItinerary.flights.outbound.to}</div>
                    <div style={{ font: '700 18px/1 "Barlow Condensed"', color: 'var(--text-dim)', letterSpacing: '.04em', textAlign: 'right' }}>{comp.lucyItinerary.flights.outbound.depart}</div>
                  </div>
                </div>
              )}
              {comp.lucyItinerary.flights.outbound && comp.lucyItinerary.flights.ret && (
                <div style={{ height: 1, background: 'var(--line)', margin: '12px 0' }}/>
              )}
              {comp.lucyItinerary.flights.ret && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(93,175,255,0.13)', border: '1px solid rgba(93,175,255,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 20, lineHeight: 1 }}>🛬</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '0 8px', alignItems: 'center' }}>
                    <div>
                      <div style={{ font: '800 12px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-faint)' }}>{comp.lucyItinerary.flights.ret.date.split(' ')[0]}</div>
                      <div style={{ font: '700 16px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--text-dim)', marginTop: 4 }}>{comp.lucyItinerary.flights.ret.date.split(' ')[1]}</div>
                    </div>
                    <div style={{ font: '400 26px/1 Anton', textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '.02em' }}>{comp.lucyItinerary.flights.ret.from} → {comp.lucyItinerary.flights.ret.to}</div>
                    <div style={{ font: '700 18px/1 "Barlow Condensed"', color: 'var(--text-dim)', letterSpacing: '.04em', textAlign: 'right' }}>{comp.lucyItinerary.flights.ret.depart}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {comp.lucyItinerary.hotel && (
            <div className="card" style={{ padding: 14, marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(212,164,41,0.13)', border: '1px solid rgba(212,164,41,0.3)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>
                  🏨
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: '700 16px/1.2 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em' }}>{comp.lucyItinerary.hotel.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>Check-in {comp.lucyItinerary.hotel.checkIn} · Check-out {comp.lucyItinerary.hotel.checkOut}</div>
                  {comp.lucyItinerary.hotel.distToVenue && <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>{comp.lucyItinerary.hotel.distToVenue} from venue</div>}
                </div>
              </div>
              {comp.lucyItinerary.hotel.mapUrl && (
                <a className="btn ghost block" href={comp.lucyItinerary.hotel.mapUrl} target="_blank" rel="noopener" style={{ marginTop: 10, textDecoration: 'none' }}>
                  <Icon.Drive/> Open in Maps
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hotel block → TTS link */}
      {t.ttsUrl && (
        <div className="section" style={{ paddingTop: 12 }}>
          <h2><span className="title">Hotel Block</span></h2>
          <div className="card" style={{ padding: 14 }}>
            <a href={t.ttsUrl} target="_blank" rel="noopener" className="btn ghost block" style={{ textDecoration: 'none' }}>
              🏨 Book through TTS
            </a>
          </div>
        </div>
      )}

      {/* Venue */}
      <div className="section" style={{ paddingTop: 12 }}>
        <h2><span className="title">Venue</span></h2>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(214,244,61,0.13)', border: '1px solid rgba(214,244,61,0.3)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>
              🏢
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: '700 16px/1.2 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em' }}>{comp.venue}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{t.drive} from airport</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 8 }}>
                <b style={{ color: 'var(--text)' }}>Parking:</b> {t.parking}
              </div>
            </div>
          </div>
          <button className="btn ghost block" style={{ marginTop: 12 }}>
            <Icon.Drive/> Open in Maps
          </button>
        </div>
        {t.spectators && (
          <div className="card" style={{ padding: 14, marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,170,50,0.13)', border: '1px solid rgba(255,170,50,0.3)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>🎟️</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: '700 16px/1.2 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 5 }}>Spectator Pass</div>
                <div style={{ fontSize: 14, color: 'var(--text-dim)' }}>{t.spectators.dayPrice} per day · {t.spectators.weekendPrice} per weekend</div>
              </div>
            </div>
            {t.spectators.ticketUrl && (
              <a className="btn ghost block" href={t.spectators.ticketUrl} target="_blank" rel="noopener" style={{ marginTop: 10, textDecoration: 'none' }}>
                <Icon.External/> Buy Tickets
              </a>
            )}
          </div>
        )}
      </div>

      {/* Learn More */}
      {comp.varsityUrl && (
        <div className="section" style={{ paddingTop: 12 }}>
          <h2><span className="title">Learn More</span></h2>
          <div className="card" style={{ padding: 14 }}>
            <a className="btn ghost block" href={comp.varsityUrl} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
              <Icon.External/> View on Varsity.com
            </a>
          </div>
        </div>
      )}
      <div style={{ height: 24 }}/>
    </>
  );
}

// ─── Schedule tab ─────────────────────────────────────────
function CompSchedule({ comp }) {
  if (!comp.schedule) {
    return (
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="card empty-mini">
          Day-of schedules will be released closer to the event.
        </div>
      </div>
    );
  }

  // Two-day schedule shape: { day1: [...], day2: [...] }
  const isTwoDay = !Array.isArray(comp.schedule) && (comp.schedule.day1 || comp.schedule.day2);
  if (isTwoDay) {
    const startD = D.parse(comp.date);
    const endD   = D.parse(comp.endDate || comp.date);
    return (
      <>
        <ScheduleDay
          label={`Day 1 · ${D.dow(startD)} ${D.mon(startD)} ${D.dom(startD)}`}
          rows={comp.schedule.day1 || []}
        />
        <div style={{ height: 24 }}/>
        <ScheduleDay
          label={`Day 2 · ${D.dow(endD)} ${D.mon(endD)} ${D.dom(endD)}`}
          rows={comp.schedule.day2 || []}
        />
      </>
    );
  }

  // Legacy flat schedule
  return <ScheduleDay rows={comp.schedule}/>;
}

function ScheduleDay({ label, rows }) {
  return (
    <div className="section" style={{ paddingTop: label ? 4 : 0 }}>
      {label && (
        <h2 style={{ marginBottom: 8 }}>
          <span className="title">{label}</span>
          <span className="more" style={{ color: 'var(--gold-soft)' }}>{rows.length} items</span>
        </h2>
      )}
      <div className="card" style={{ padding: '4px 12px' }}>
        {rows.map((s, i) => {
          const highlight = s.what.startsWith('PERFORMANCE') || s.what.startsWith('AWARDS');
          const isCall    = s.what.toLowerCase().includes('team call');
          const accent    = highlight ? 'var(--volt)' : isCall ? 'var(--gold-soft)' : 'var(--text)';
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '54px 1fr', gap: 10, alignItems: 'center',
              padding: '12px 0', borderTop: i === 0 ? 0 : '1px solid var(--line)',
            }}>
              <div className="mono" style={{ fontSize: 15, color: highlight ? 'var(--volt)' : isCall ? 'var(--gold-soft)' : 'var(--text-dim)', fontWeight: 700 }}>{s.t}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '700 15px/1.2 "Barlow Condensed"', letterSpacing: '.03em', textTransform: 'uppercase', color: accent }}>{s.what}</div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{s.who}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 24 }}/>
    </div>
  );
}

// ─── Docs tab ────────────────────────────────────────────
function CompDocs({ comp }) {
  if (!comp.docs || comp.docs.length === 0) {
    return (
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="card empty-mini">
          Documents will be added as they become available.
        </div>
      </div>
    );
  }
  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>From the Gym · {comp.docs.length} files</div>
      {comp.docs.map((d, i) => (
        <div key={i} className="doc-row">
          <div className="pdf-icon"/>
          <div className="info">
            <div className="nm">{d.name}</div>
            <div className="mt">{d.size} · Updated {d.updated}</div>
          </div>
          <div style={{ color: 'var(--volt)' }}>
            <Icon.Dl/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Division tab ───────────────────────────────────────
function CompDivision({ comp }) {
  if (!comp.division) {
    return (
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="card empty-mini">
          Division roster becomes available ~3 days before event.
        </div>
      </div>
    );
  }
  const hasTwoDay = comp.division.some(t => t.slot2);
  const [day, setDay] = React.useState('day1');
  const parseMin = (s) => {
    if (!s) return 9999;
    const m = s.match(/^(\d+):(\d+)(am|pm)$/i);
    if (!m) return 9999;
    let h = parseInt(m[1]), min = parseInt(m[2]), p = m[3].toLowerCase();
    if (p === 'pm' && h !== 12) h += 12;
    if (p === 'am' && h === 12) h = 0;
    return h * 60 + min;
  };
  const sorted = [...comp.division].sort((a, b) => {
    const ta = day === 'day2' ? parseMin(a.slot2 || a.slot) : parseMin(a.slot);
    const tb = day === 'day2' ? parseMin(b.slot2 || b.slot) : parseMin(b.slot);
    return ta - tb;
  });
  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ font: '800 18px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text)' }}>{TEAM.division}</div>
          <div style={{ font: '700 14px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--text-faint)', marginTop: 5 }}>{comp.division.length} Teams</div>
        </div>
        {hasTwoDay && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--line)', borderRadius: 10, padding: 2 }}>
            {['day1', 'day2'].map(d => (
              <button key={d} onClick={() => setDay(d)} style={{
                appearance: 'none', border: 'none', cursor: 'pointer',
                height: 36, paddingInline: 16, borderRadius: 8,
                background: day === d ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: day === d ? 'var(--text)' : 'var(--text-faint)',
                font: '800 15px/1 "Barlow Condensed"', letterSpacing: '.12em', textTransform: 'uppercase',
              }}>
                {d === 'day1' ? 'Day 1' : 'Day 2'}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="card" style={{ padding: 0 }}>
        {sorted.map((t, i) => (
          <div key={t.id || i} className={`team-row ${t.us ? 'us' : ''}`}>
            <div className="badge">{i + 1}</div>
            <div className="info">
              <div className="nm">{t.name}</div>
              <div className="gm">{t.gym}</div>
            </div>
            <div className="time">{day === 'day2' ? (t.slot2 || t.slot) : t.slot}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 24 }}/>
    </div>
  );
}

// ─── Live / Updates tab ─────────────────────────────────
function CompLive({ comp }) {
  const isUpcomingNear = comp.status === 'upcoming' && D.days(TODAY, D.parse(comp.date)) <= 7;
  if (!isUpcomingNear) {
    return (
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="card" style={{ padding: 16, color: 'var(--text-dim)', fontSize: 13, textAlign: 'center' }}>
          Live day-of updates fire here when the event is in progress.
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="card tint-volt" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="chip live"><span className="pulse"/> Day-Of Feed</span>
          <div style={{ flex: 1, fontSize: 14, color: 'var(--text-dim)' }}>
            Auto-refresh every 60s · {comp.division ? `${comp.division.length} teams in division` : ''}
          </div>
        </div>
      </div>
      <div className="live-list">
        {LIVE_FEED.map((f, i) => (
          <div key={i} className={`live-item ${f.us ? 'us' : ''}`}>
            <div className="t">{f.t}</div>
            <div className="body">{f.body}</div>
          </div>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { CompDetail });
