/* screens.jsx — Home, Calendar, Comps list, Results list */

// ============================================================
// HERO COMPONENTS
// ============================================================

// Next-comp hero (always shown when a future comp exists)
function HeroComp({ comp, daysOut, onOpen }) {
  return (
    <div className="hero-next grunge" onClick={onOpen}>
      <div className="chevron-bg"/>
      <div className="hn-content">
        <div className="hn-eyebrow">
          {daysOut === 0 ? 'COMPETITION DAY' : `${daysOut} ${daysOut === 1 ? 'day' : 'days'} out`}
        </div>
        <div className="hn-ttl">{comp.name}</div>
        <div className="hn-sub">{comp.city}</div>
      </div>
    </div>
  );
}

// Agenda-style hero (default when no comp is imminent)
function HeroAgenda() {
  const todays = SCHEDULE.filter(e => e.date === '2026-03-02');
  return (
    <div className="hero-agenda grunge">
      <div className="stripe-bg"/>
      <div className="label">Mon · Mar 2 · {ATHLETE.team}</div>
      <div className="ttl">Today: <b>Full-out</b><br/>Practice 5:30P</div>
      <div className="sub">{TEAM.location} · Lucy + 23 teammates</div>
    </div>
  );
}

// ============================================================
// HOME SCREEN
// ============================================================
function HomeScreen({ tweaks, onOpenComp, onTab }) {
  // Respect preSeason tweak (preview empty-state)
  const allComps = getCompetitions(tweaks);
  const today    = getEffectiveToday(tweaks);

  // Next upcoming comp (always shown if one exists)
  const next = (() => {
    const c = allComps
      .filter(c => c.status === 'upcoming')
      .map(c => ({ ...c, daysOut: Math.max(0, D.days(today, D.parse(c.date))) }))
      .sort((a, b) => a.daysOut - b.daysOut)[0];
    return c || null;
  })();

  const upcoming = allComps.filter(c => c.status === 'upcoming').slice(0, 3);

  // Past comps → most recent first
  const past = allComps
    .filter(c => c.status === 'past')
    .sort((a, b) => b.date.localeCompare(a.date));

  const hasPast = past.length > 0;

  // Last result block
  const last = past[0];
  const ord = (p) => p === 1 ? 'st' : p === 2 ? 'nd' : p === 3 ? 'rd' : 'th';
  const lastPlace = last ? { ordShort: `${last.placement}${ord(last.placement)}`, of: last.of } : null;

  const seasonAvg = hasPast
    ? (past.reduce((s, c) => s + c.score, 0) / past.length).toFixed(2)
    : null;

  // Total performances: most comps = 2 days = 2 performances
  const totalPerfs = past.reduce((n, c) => n + (c.endDate && c.endDate !== c.date ? 2 : 1), 0);

  // this week's remaining events
  const startWeek = D.startOfWeek(today);
  const weekEvents = SCHEDULE
    .filter(e => {
      const d = D.parse(e.date);
      return d >= today && d < D.addDays(startWeek, 7);
    })
    .slice(0, 4);

  const todayDow = (() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  })();
  const todayDate = (() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  })();

  return (
    <div className="scr">
      <div style={{ position: 'relative' }}>
        <BrandMark/>
        <div style={{ position: 'absolute', top: 10, right: 'var(--pad-x)', textAlign: 'right' }}>
          <div style={{ font: '800 13px/1 "Barlow Condensed"', letterSpacing: '.18em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>{todayDow}</div>
          <div style={{ font: '800 21px/1 "Barlow Condensed"', letterSpacing: '.06em', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: 4 }}>{todayDate}</div>
        </div>
      </div>

      {next && <HeroComp comp={next} daysOut={next.daysOut} onOpen={() => onOpenComp(next.id)}/>}

      {/* Stats — hidden until the first comp has results */}
      {hasPast && (
        <div className="statrow">
          <div className="stat">
            <div className="l">Last Result</div>
            <div className="v"><b>{lastPlace.ordShort}</b><span style={{ fontSize: 16, color: 'var(--text-dim)' }}> / {lastPlace.of}</span></div>
          </div>
          <div className="stat">
            <div className="l">Season Avg</div>
            <div className="v">{seasonAvg}</div>
          </div>
          <div className="stat">
            <div className="l">Performances</div>
            <div className="v">{totalPerfs}</div>
          </div>
        </div>
      )}

      {/* This week glance */}
      <div className="section">
        <h2>
          <span className="title">This Week</span>
          <span className="more" onClick={() => onTab('calendar')} style={{ cursor: 'pointer' }}>Full Calendar →</span>
        </h2>
        <div>
          {weekEvents.map((e, i) => {
            const d = D.parse(e.date);
            return (
              <div key={i} className="day-row">
                <div className={`date ${D.same(d, TODAY) ? 'today' : ''}`}>
                  <div className="dow">{D.dow(d)}</div>
                  <div className="dom">{D.dom(d)}</div>
                </div>
                <div className="events">
                  <div className={`ev ${e.kind}`}>
                    <div className="what">
                      <div className="ttl">{e.title}</div>
                      {e.meta && <div className="meta">{e.meta}</div>}
                    </div>
                    <div className="time">{e.time}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming comps */}
      <div className="section">
        <h2>
          <span className="title">Upcoming Comps</span>
          <span className="more" onClick={() => onTab('comps')} style={{ cursor: 'pointer' }}>All →</span>
        </h2>
        {upcoming.map(c => <CompCard key={c.id} comp={c} onOpen={() => onOpenComp(c.id)}/>)}
      </div>

      {/* Documents — from standalone Documents table */}
      {typeof DOCUMENTS !== 'undefined' && DOCUMENTS.length > 0 && (
        <div className="section">
          <h2><span className="title">Documents</span></h2>
          {DOCUMENTS.map((d, i) => (
            <a key={i} className="doc-row" href={d.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
              <div className="pdf-icon"/>
              <div className="info">
                <div className="nm">{d.name}</div>
                {d.updatedDate && <div className="mt">Updated {d.updatedDate}</div>}
              </div>
              <div style={{ color: 'var(--volt)' }}><Icon.External s={16}/></div>
            </a>
          ))}
        </div>
      )}

      <div style={{ height: 24 }}/>
    </div>
  );
}

// ============================================================
// COMP CARD (list-style)
// ============================================================
function CompCard({ comp, onOpen }) {
  const d = D.parse(comp.date);
  const days = D.days(TODAY, d);
  const near = days >= 0 && days <= 7;
  return (
    <div className={`comp-card ${near ? 'near' : ''}`} onClick={onOpen}>
      <div className="date-block">
        <div className="mo">{D.mon(d)}</div>
        <div className="day">{D.dom(d)}</div>
      </div>
      <div className="info">
        <div className="name">
          {comp.name}
        </div>
        <div className="loc">
          <Icon.Pin s={11}/> {comp.city}
          {days >= 0 && days <= 30 && <> · <span style={{ color: 'var(--volt)', fontWeight: 700 }}>{days === 0 ? 'TODAY' : `${days}d`}</span></>}
        </div>
      </div>
      <div className="chev">
        <Icon.Chev/>
      </div>
    </div>
  );
}

// ============================================================
// RESULT CARD — used on home (most recent past comp w/ scoresheet)
// ============================================================
function ResultCard() {
  const past = COMPETITIONS
    .filter(c => c.status === 'past' && c.hasScoresheet)
    .sort((a, b) => b.date.localeCompare(a.date));
  const c = past[0];
  if (!c) {
    return (
      <div className="card" style={{ padding: 16, color: 'var(--text-dim)', fontSize: 13, textAlign: 'center' }}>
        No results yet this season.
      </div>
    );
  }
  const d = D.parse(c.date);
  const place = c.placement;
  const suf = place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th';

  // pull leader info from scoresheet if available
  let behind = null;
  if (SCORESHEET.compId === c.id && place > 1) {
    const leader = SCORESHEET.leaderboard.find(t => t.rank === 1);
    if (leader) behind = { name: leader.name, score: leader.score, gap: (leader.score - c.score).toFixed(2) };
  }

  return (
    <div className="card tint-volt" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div style={{ font: '400 50px/1 Anton', color: 'var(--volt)' }}>{place}<sup style={{ fontSize: 20 }}>{suf}</sup></div>
        <div className="eyebrow" style={{ marginTop: 6 }}>of {c.of}</div>
      </div>
      <div style={{ flex: 1, borderLeft: '1px solid var(--line)', paddingLeft: 16 }}>
        <div className="eyebrow" style={{ color: 'var(--gold-soft)' }}>{c.name} · {D.mon(d)} {D.dom(d)}</div>
        <div style={{ font: '700 16px/1.2 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--text)', marginTop: 6 }}>
          Final score <span className="mono" style={{ color: 'var(--volt)' }}>{c.score.toFixed(2)}</span>
        </div>
        {behind && (
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
            {behind.gap} behind 1st · {behind.name}, {behind.score.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CALENDAR SCREEN — month pager + week agenda
// ============================================================
function CalendarScreen({ onOpenComp }) {
  // Active month index into SEASON_MONTHS (May 2026 = 0 .. May 2027 = 12)
  const todayIdx = React.useMemo(() => {
    for (let i = 0; i < SEASON_MONTHS.length; i++) {
      const m = SEASON_MONTHS[i];
      if (m.getFullYear() === TODAY.getFullYear() && m.getMonth() === TODAY.getMonth()) return i;
    }
    return 0;
  }, []);

  const [activeIdx, setActiveIdx] = React.useState(todayIdx);
  const trackRef = React.useRef(null);
  const syncing = React.useRef(false);

  // Build date → events map
  const byDate = React.useMemo(() => {
    const map = {};
    SCHEDULE.forEach(e => (map[e.date] ||= []).push(e));
    return map;
  }, []);

  // Programmatic scroll when activeIdx changes via buttons
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncing.current = true;
    el.scrollTo({ left: activeIdx * el.clientWidth, behavior: 'instant' });
    const t = setTimeout(() => { syncing.current = false; }, 450);
    return () => clearTimeout(t);
  }, [activeIdx]);

  // Detect manual horizontal scroll → update activeIdx
  const onScroll = () => {
    if (syncing.current) return;
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  const activeMonth = SEASON_MONTHS[activeIdx];
  const canPrev = activeIdx > 0;
  const canNext = activeIdx < SEASON_MONTHS.length - 1;
  const onCurrentMonth = activeIdx === todayIdx;

  // Handler for tapping a comp/travel event — accepts direct compId or falls back to date lookup
  const tapComp = (iso, compId) => {
    const cid = compId || COMP_BY_DATE[iso];
    if (cid) onOpenComp(cid);
  };

  return (
    <div className="scr">
      <ScreenHeader title="Season Calendar" sub="May 2026 – May 2027"/>

      {/* Month switcher */}
      <div className="cal-monthbar">
        <button
          className="mb-arr"
          onClick={() => canPrev && setActiveIdx(activeIdx - 1)}
          aria-label="Previous month"
          disabled={!canPrev}
        >
          <Icon.Chev dir="left"/>
        </button>
        <div className="mb-name">
          {activeMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button
          className={`mb-today ${onCurrentMonth ? 'is-current' : ''}`}
          onClick={() => setActiveIdx(todayIdx)}
          disabled={onCurrentMonth}
          aria-label="Jump to today"
        >
          Today
        </button>
        <button
          className="mb-arr"
          onClick={() => canNext && setActiveIdx(activeIdx + 1)}
          aria-label="Next month"
          disabled={!canNext}
        >
          <Icon.Chev/>
        </button>
      </div>

      {/* Horizontal pager of month grids */}
      <div className="cal-track" ref={trackRef} onScroll={onScroll}>
        {SEASON_MONTHS.map((m, i) => (
          <div key={i} className="cal-page">
            <MonthGrid month={m} byDate={byDate}/>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="cal-legend">
        <span><i className="dot comp"/> Comp</span>
        <span><i className="dot practice"/> Practice</span>
        <span><i className="dot travel"/> Travel</span>
        <span><i className="dot opengym"/> Gym</span>
        <span><i className="dot lucy"/> Lucy</span>
        <span><i className="dot other"/> Other</span>
      </div>

      {/* Week-by-week agenda for the active month (key forces remount per month) */}
      <MonthAgenda
        key={activeIdx}
        month={activeMonth}
        byDate={byDate}
        isCurrentMonth={onCurrentMonth}
        onTapComp={tapComp}
      />
      <div style={{ height: 24 }}/>
    </div>
  );
}

// ─── Month grid (7×6 cells with dots) ───────────────────
function MonthGrid({ month, byDate }) {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(1 - firstOfMonth.getDay()); // Sunday on or before

  // Build 6 weeks (42 days) of cells
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }

  const _iso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // dot order so comp/lucy dots show before practice (most-important first)
  const DOT_PRIORITY = { comp: 0, lucy: 1, travel: 2, event: 3, opengym: 4, practice: 5 };

  return (
    <div className="month-grid">
      {['S','M','T','W','T','F','S'].map((d, i) => (
        <div key={'h'+i} className="mg-dow">{d}</div>
      ))}
      {cells.map((d, i) => {
        const inMonth = d.getMonth() === month.getMonth();
        const isToday = D.same(d, TODAY);
        const events = byDate[_iso(d)] || [];
        // dedupe by kind
        const kinds = [...new Set(events.map(e => e.kind))]
          .sort((a, b) => (DOT_PRIORITY[a] ?? 99) - (DOT_PRIORITY[b] ?? 99));
        return (
          <div key={i} className={`mg-cell${inMonth ? '' : ' out'}${isToday ? ' today' : ''}`}>
            <div className="mg-dn">{d.getDate()}</div>
            <div className="mg-dots">
              {kinds.slice(0, 4).map((k, di) => <span key={di} className={`dot ${k}`}/>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Month agenda (week-by-week list with accordion) ──
function MonthAgenda({ month, byDate, isCurrentMonth, onTapComp }) {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastOfMonth  = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // Walk week starts (Sun) overlapping this month
  const weeks = [];
  let cur = new Date(firstOfMonth);
  cur.setDate(1 - firstOfMonth.getDay()); // first Sunday on/before first of month
  while (cur <= lastOfMonth) {
    weeks.push(new Date(cur));
    cur = new Date(cur.getTime() + 7 * 86400000);
  }

  const _iso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Default open state:
  //  - in current month: only the week containing TODAY is expanded
  //  - in other months: all weeks expanded
  const initOpen = React.useMemo(() => {
    const o = {};
    weeks.forEach((ws, wi) => {
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      if (isCurrentMonth) {
        o[wi] = TODAY >= ws && TODAY <= we;
      } else {
        o[wi] = true;
      }
    });
    return o;
  }, [month, isCurrentMonth]);

  const [open, setOpen] = React.useState(initOpen);
  const toggle = (wi) => setOpen(s => ({ ...s, [wi]: !s[wi] }));

  return (
    <>
      {weeks.map((ws, wi) => {
        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(ws);
          d.setDate(ws.getDate() + i);
          return d;
        });
        const we = days[6];

        // count events in this week
        const weekEvents = days.reduce((n, d) => n + (byDate[_iso(d)]?.length || 0), 0);
        const isOpen = !!open[wi];

        return (
          <div key={wi} className="section week-section">
            <h2 className="week-hdr" onClick={() => toggle(wi)}>
              <span className="title">
                Week of {D.mon(ws)} {D.dom(ws)}
              </span>
              <span className="week-meta">
                {!isOpen && weekEvents > 0 && (
                  <span className="week-count">{weekEvents} {weekEvents === 1 ? 'event' : 'events'}</span>
                )}
                <Icon.Chev dir={isOpen ? 'up' : 'down'}/>
              </span>
            </h2>
            <div style={{ overflow: 'hidden', maxHeight: isOpen ? 2000 : 0, transition: 'max-height 0.22s ease' }}>
              {days.map((d, di) => {
                const events = byDate[_iso(d)] || [];
                const isInMonth = d.getMonth() === month.getMonth();
                const isToday = D.same(d, TODAY);
                return (
                  <div key={di} className={`day-row ${events.length === 0 ? 'empty' : ''} ${!isInMonth ? 'out-of-month' : ''}`}>
                    <div className={`date ${isToday ? 'today' : ''}`}>
                      <div className="dow">{D.dow(d)}</div>
                      <div className="dom">{D.dom(d)}</div>
                    </div>
                    <div className="events">
                      {events.length === 0
                        ? <span>— rest day —</span>
                        : events.map((e, i) => {
                            const isLinked = e.kind === 'comp' || !!e.compId;
                            return (
                              <div key={i} className={`ev ${e.kind}`}
                                   onClick={isLinked ? () => onTapComp(_iso(d), e.compId) : undefined}
                                   style={{ cursor: isLinked ? 'pointer' : 'default' }}>
                                <div className="what">
                                  <div className="ttl">{e.title}</div>
                                  {e.meta && <div className="meta">{e.meta}</div>}
                                </div>
                                {e.time && <div className="time">{e.time}</div>}
                              </div>
                            );
                          })
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ============================================================
// COMPS LIST SCREEN
// ============================================================
function CompsScreen({ tweaks, onOpenComp }) {
  const allComps = getCompetitions(tweaks);
  const upcoming = allComps.filter(c => c.status === 'upcoming');
  const past     = allComps.filter(c => c.status === 'past');
  return (
    <div className="scr">
      <ScreenHeader title="Season Events" sub={`${TEAM.team} · ${TEAM.season}`}/>

      <div className="section">
        <h2>
          <span className="title">Upcoming · {upcoming.length}</span>
          <span className="more" style={{ color: 'var(--text-faint)' }}>Sorted by date</span>
        </h2>
        {upcoming.map(c => <CompCard key={c.id} comp={c} onOpen={() => onOpenComp(c.id)}/>)}
      </div>

      {past.length > 0 && (
        <div className="section">
          <h2>
            <span className="title">Past · {past.length}</span>
            <span className="more" style={{ color: 'var(--text-faint)' }}>This season</span>
          </h2>
          {past.map(c => (
            <div key={c.id} className="comp-card" onClick={() => onOpenComp(c.id)}>
              <div className="date-block">
                <div className="mo">{D.mon(D.parse(c.date))}</div>
                <div className="day">{D.dom(D.parse(c.date))}</div>
              </div>
              <div className="info">
                <div className="name">{c.name}</div>
                <div className="loc">
                  <Icon.Pin s={11}/> {c.city} · <span className="mono" style={{ color: 'var(--volt)' }}>{c.score}</span> ·
                  <span style={{ color: 'var(--gold-soft)', fontWeight: 700 }}> {c.placement === 1 ? '1st' : c.placement === 2 ? '2nd' : c.placement === 3 ? '3rd' : `${c.placement}th`}{c.of ? ` / ${c.of}` : ''}</span>
                </div>
              </div>
              <div className="chev"><Icon.Chev/></div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 24 }}/>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, HeroComp, HeroAgenda, CompCard, ResultCard,
  CalendarScreen, CompsScreen,
});
