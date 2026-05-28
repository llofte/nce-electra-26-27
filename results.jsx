/* results.jsx — Results list + Scoresheet detail */

// ============================================================
// RESULTS LIST SCREEN
// ============================================================
function ResultsScreen({ tweaks, onOpenScoresheet }) {
  // Past comps sorted by date
  const past = getCompetitions(tweaks)
    .filter(c => c.status === 'past')
    .sort((a, b) => a.date.localeCompare(b.date)); // oldest → newest

  if (past.length === 0) {
    const next = nextComp(tweaks);
    return (
      <div className="scr">
        <ScreenHeader title="Season Results" sub={`Electra · ${TEAM.season}`}/>
        <div className="empty-state">
          <div className="empty-icon">
            <Icon.Trophy s={56}/>
          </div>
          <div className="empty-ttl">No results yet</div>
          <div className="empty-sub">
            Scores and placements will appear after the first competition.
          </div>
          {next && (
            <div className="empty-meta">
              First comp: <b style={{ color: 'var(--volt)' }}>{next.name}</b>
              <span style={{ color: 'var(--text-faint)' }}> · {next.daysOut} {next.daysOut === 1 ? 'day' : 'days'} away</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Aggregates
  const avg = (past.reduce((s, c) => s + c.score, 0) / past.length).toFixed(2);
  const wins = past.filter(c => c.placement === 1).length;
  const podium = past.filter(c => c.placement <= 3).length;

  // For the list: newest first
  const pastDesc = [...past].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="scr">
      <ScreenHeader title="Season Results" sub={`Electra · ${TEAM.season}`}/>

      {/* season aggregate cards */}
      <div className="statrow">
        <div className="stat">
          <div className="l">Season Avg</div>
          <div className="v"><b>{avg}</b></div>
        </div>
        <div className="stat">
          <div className="l">1st Place</div>
          <div className="v"><b>{wins}</b><span style={{ fontSize: 14, color: 'var(--text-dim)' }}> wins</span></div>
        </div>
        <div className="stat">
          <div className="l">Podium</div>
          <div className="v"><b>{podium}</b><span style={{ fontSize: 14, color: 'var(--text-dim)' }}>/{past.length}</span></div>
        </div>
      </div>

      {/* trajectory mini chart — left=oldest, right=newest */}
      <div className="section">
        <h2><span className="title">Score Trajectory</span><span className="more">By comp</span></h2>
        <div className="card" style={{ padding: 14 }}>
          <ScoreSpark data={past.map(c => ({ x: c.short, y: c.score }))}/>
        </div>
      </div>

      {/* result rows */}
      <div className="section">
        <h2><span className="title">Comp Results</span><span className="more">{past.length} events</span></h2>
        {pastDesc.map(c => (
          <ResultRow key={c.id} comp={c} onOpen={() => c.hasScoresheet && onOpenScoresheet(c.id)}/>
        ))}
      </div>
    </div>
  );
}

function ResultRow({ comp, onOpen }) {
  const d1 = D.parse(comp.date);
  const d2 = comp.endDate ? D.parse(comp.endDate) : d1;
  const sameDay = comp.date === comp.endDate || !comp.endDate;
  const sameMonth = d1.getMonth() === d2.getMonth();
  const dateRange = sameDay
    ? `${D.mon(d1)} ${D.dom(d1)}`
    : sameMonth
      ? `${D.mon(d1)} ${D.dom(d1)}–${D.dom(d2)}`
      : `${D.mon(d1)} ${D.dom(d1)} – ${D.mon(d2)} ${D.dom(d2)}`;
  const place = comp.placement;
  const suf = place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th';
  return (
    <div className="comp-card result-card" onClick={onOpen}>
      <div className="date-block" style={{ background: 'var(--bg)', borderColor: 'var(--line)', padding: '6px 4px' }}>
        <div style={{ font: '400 30px/1 Anton', color: 'var(--volt)' }}>
          {place}<sup style={{ fontSize: 13 }}>{suf}</sup>
        </div>
        {comp.of && (
          <div className="eyebrow" style={{ marginTop: 4, fontSize: 9 }}>of {comp.of}</div>
        )}
      </div>
      <div className="info">
        <div className="rr-name">{comp.name}</div>
        <div className="rr-row2">{dateRange}</div>
        <div className="rr-row3">
          <Icon.Pin s={11}/> {comp.city}
        </div>
      </div>
      <div className="rr-score mono">{comp.score.toFixed(2)}</div>
      <div className="chev"><Icon.Chev/></div>
    </div>
  );
}

// ============================================================
// SCORE SPARK — tiny trajectory chart
// ============================================================
function ScoreSpark({ data }) {
  const W = 320, H = 96, P = 18;
  const min = Math.floor(Math.min(...data.map(d => d.y)) - 1);
  const max = Math.ceil(Math.max(...data.map(d => d.y)) + 1);
  const x = i => P + (i * (W - 2 * P)) / Math.max(1, data.length - 1);
  const y = v => H - P - ((v - min) / (max - min)) * (H - 2 * P);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.y)}`).join(' ');
  const area = `${path} L ${x(data.length - 1)} ${H - P} L ${x(0)} ${H - P} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="var(--volt)" stopOpacity="0.0"/>
        </linearGradient>
      </defs>
      {/* grid */}
      {[0, 0.5, 1].map(t => (
        <line key={t} x1={P} x2={W - P} y1={P + t * (H - 2 * P)} y2={P + t * (H - 2 * P)} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 3"/>
      ))}
      <path d={area} fill="url(#sg)"/>
      <path d={path} fill="none" stroke="var(--volt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.y)} r="3.5" fill="var(--bg)" stroke="var(--volt)" strokeWidth="1.6"/>
          <text x={x(i)} y={H - 4} fontSize="8.5" fill="rgba(245,240,227,0.55)" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="700" letterSpacing="0.08em">{d.x.toUpperCase()}</text>
          <text x={x(i)} y={y(d.y) - 8} fontSize="9" fill="var(--volt)" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700">{d.y.toFixed(1)}</text>
        </g>
      ))}
    </svg>
  );
}

// ============================================================
// SCORESHEET SCREEN — deep dive
// ============================================================
function ScoresheetScreen({ compId, onBack }) {
  const s = (typeof SCORESHEETS !== 'undefined' && SCORESHEETS[compId]) || SCORESHEET;
  const hasTwoDay = !!s.categories1;
  const pendingDay2 = !!s.pendingDay2;
  const activeTotals = pendingDay2 ? s.totals1 : s.totals;
  const [view, setView] = React.useState('breakdown'); // breakdown | leaderboard | compare
  const comp = COMPETITIONS.find(c => c.id === compId) || COMPETITIONS.find(c => c.id === s.compId);

  const tabs = [
    { id: 'breakdown',   label: 'Breakdown' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'compare',     label: 'Compare' },
  ];

  return (
    <div className="scr">
      <ScreenHeader
        title={comp.name + ' · Scoresheet'}
        sub={`${comp.city} · ${D.mon(D.parse(comp.date))} ${D.dom(D.parse(comp.date))} · L2 Senior Small`}
        onBack={onBack}
      />

      {/* big result card */}
      <div style={{ margin: '0 var(--pad-x) 14px' }}>
        <div className="card tint-volt grunge" style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
          <div className="chevron-bg"/>
          <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: '400 56px/1 Anton', color: 'var(--volt)' }}>{activeTotals.placement}<sup style={{ fontSize: 22 }}>{activeTotals.placement === 1 ? 'st' : activeTotals.placement === 2 ? 'nd' : activeTotals.placement === 3 ? 'rd' : 'th'}</sup></div>
              <div className="eyebrow" style={{ marginTop: 4 }}>of {activeTotals.of}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 14 }}>
              <div className="eyebrow" style={{ color: 'var(--gold-soft)' }}>{pendingDay2 ? 'Day 1 Score' : 'Event Score'}</div>
              <div className="mono" style={{ fontSize: 38, fontWeight: 700, color: 'var(--text)', marginTop: 2, lineHeight: 1 }}>{activeTotals.final.toFixed(2)}</div>
              {hasTwoDay && !pendingDay2 && (
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <div>
                    <div style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Day 1</div>
                    <div className="mono" style={{ fontSize: 15, color: 'var(--text-dim)', marginTop: 2 }}>{s.totals1.final.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Day 2</div>
                    <div className="mono" style={{ fontSize: 15, color: 'var(--text-dim)', marginTop: 2 }}>{s.totals.final.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={view === t.id ? 'on' : ''} onClick={() => setView(t.id)}>{t.label}</button>
        ))}
      </div>

      {view === 'breakdown'   && <ScoreBreakdown sheet={s}/>}
      {view === 'leaderboard' && <DivisionLeaderboard sheet={s}/>}
      {view === 'compare'     && <CompareView sheet={s}/>}
    </div>
  );
}

// ─── Breakdown tab ──────────────────────────────────────
function ScoreBreakdown({ sheet }) {
  const hasTwoDay = !!sheet.categories1;
  const pendingDay2 = !!sheet.pendingDay2;
  const [day, setDay] = React.useState(hasTwoDay ? 'day1' : 'day2');
  const activeCats = (hasTwoDay && day === 'day1') ? sheet.categories1 : (sheet.categories || sheet.categories1);
  const cats = activeCats;
  const dedCards = hasTwoDay && day === 'day1' ? (sheet.deductionCards1 || []) : (sheet.deductionCards || []);
  const switchDay = (d) => setDay(d);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--pad-x) 10px' }}>
        <div className="eyebrow">Category Breakdown</div>
        {hasTwoDay && !pendingDay2 && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--line)', borderRadius: 10, padding: 2 }}>
            {['day1', 'day2'].map(d => (
              <button key={d} onClick={() => switchDay(d)} style={{ appearance: 'none', border: 'none', cursor: 'pointer', height: 36, paddingInline: 14, borderRadius: 8, background: day === d ? 'rgba(255,255,255,0.14)' : 'transparent', color: day === d ? 'var(--text)' : 'var(--text-faint)', font: '800 13px/1 "Barlow Condensed"', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                {d === 'day1' ? 'Day 1' : 'Day 2'}
              </button>
            ))}
          </div>
        )}
      </div>

      {[
        { label: 'Building',        ids: ['stunts', 'pyramid', 'tosses'], sectionQuote: sheet.sectionNotes?.building },
        { label: 'Tumbling',        ids: ['st', 'rt', 'jumps'],          sectionQuote: sheet.sectionNotes?.tumbling },
        { label: 'Overall Routine', ids: ['rc', 'ft', 'dance', 'show'] },
      ].map((group, gi) => {
        const groupCats = cats.filter(c => group.ids.includes(c.id));
        if (groupCats.length === 0) return null;
        return (
          <div key={group.label} style={{ marginTop: gi > 0 ? 20 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px var(--pad-x) 10px' }}>
              <div style={{ width: 3, alignSelf: 'stretch', background: 'var(--volt)', borderRadius: 2, flexShrink: 0 }}/>
              <div style={{ font: '400 24px/1 Anton', letterSpacing: '.02em', textTransform: 'uppercase', color: 'var(--text)' }}>{group.label}</div>
            </div>
            <div className="score-grid">
              {groupCats.map(c => {
                const score = c.d + (c.e || 0) + (c.dod?.score || 0) + (c.max?.score || 0);
                const pct = (score / c.of) * 100;
                const subScores = [
                  { name: 'Difficulty',          score: c.d,         of: c.d_of   },
                  c.e   ? { name: 'Execution',            score: c.e,         of: c.e_of   } : null,
                  c.dod ? { name: 'Degree of Difficulty', score: c.dod.score, of: c.dod.of } : null,
                  c.max ? { name: 'Maximum Difficulty',   score: c.max.score, of: c.max.of } : null,
                ].filter(Boolean);
                const showSubs = subScores.length > 1;
                return (
                  <div key={c.id} className="cat-row">
                    <div>
                      <div className="cat-name">{c.name}</div>
                    </div>
                    <div></div>
                    <div>
                      <div className="cat-score">
                        <span style={{ color: 'var(--volt)' }}>{score.toFixed(2)}</span>
                        <span className="cat-of"> /{c.of}</span>
                      </div>
                    </div>

                    {/* full-width main bar */}
                    <div style={{ gridColumn: '1 / -1', marginTop: 6, marginBottom: showSubs ? 0 : 8 }}>
                      <div className="cat-bar">
                        <i style={{ width: pct + '%' }}/>
                      </div>
                    </div>

                    {/* expanded score breakdown */}
                    {(showSubs || !!c.notes) && (
                      <div style={{ gridColumn: '1 / -1', marginTop: 10, paddingTop: 6, borderTop: '1px solid var(--line)' }}>
                        {showSubs && subScores.map((item, i) => {
                          const trackPct = item.of != null ? (item.of / c.of) * 100 : 100;
                          const fillPct  = item.of != null ? (item.score / item.of) * 100 : 100;
                          return (
                            <div key={i} style={{ padding: '7px 0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                                <div style={{ font: '800 10px/1 "Barlow Condensed"', letterSpacing: '.14em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{item.name}</div>
                                <div className="mono" style={{ fontSize: 12 }}>
                                  <b>{item.score.toFixed(2)}</b>
                                  {item.of != null && <span style={{ color: 'var(--text-faint)', fontSize: 10 }}>/{item.of}</span>}
                                </div>
                              </div>
                              <div style={{ height: 4, borderRadius: 99 }}>
                                <div style={{ width: trackPct + '%', height: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                                  <i style={{ position: 'absolute', inset: 0, width: fillPct + '%', background: 'var(--gold)', borderRadius: 99 }}/>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {c.notes && (
                          <div style={{ marginTop: showSubs ? 8 : 0, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11.5, color: 'var(--text-dim)', borderLeft: '2px solid var(--gold)', whiteSpace: 'pre-line' }}>
                            <span style={{ color: 'var(--gold)', fontSize: 13 }}>“</span>{c.notes}<span style={{ color: 'var(--gold)', fontSize: 13 }}>”</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {group.sectionQuote && (
                <div className="cat-row" style={{ cursor: 'default' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="cat-name">{group.label} Creativity</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                    <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11.5, color: 'var(--text-dim)', borderLeft: '2px solid var(--gold)', whiteSpace: 'pre-line' }}>
                      <span style={{ color: 'var(--gold)', fontSize: 13 }}>"</span>{group.sectionQuote}<span style={{ color: 'var(--gold)', fontSize: 13 }}>"</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {dedCards.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px var(--pad-x) 10px' }}>
            <div style={{ width: 3, alignSelf: 'stretch', background: '#ff5555', borderRadius: 2, flexShrink: 0 }}/>
            <div style={{ font: '400 24px/1 Anton', letterSpacing: '.02em', textTransform: 'uppercase', color: 'var(--text)' }}>Deductions</div>
          </div>
          <div style={{ padding: '0 var(--pad-x)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dedCards.map((ded, i) => {
              const isWarn = ded.type === 'warning';
              const accent = isWarn ? '#ffb040' : '#ff5555';
              return (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 12, background: isWarn ? 'rgba(255,176,64,0.07)' : 'rgba(255,85,85,0.07)', border: `1px solid ${isWarn ? 'rgba(255,176,64,0.22)' : 'rgba(255,85,85,0.22)'}`, borderRadius: 10 }}>
                  <div style={{ width: 46, height: 46, flexShrink: 0, alignSelf: 'flex-start', background: isWarn ? 'rgba(255,176,64,0.15)' : 'rgba(255,85,85,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isWarn
                      ? <span style={{ fontSize: 20, lineHeight: 1, color: accent }}>⚠</span>
                      : <span style={{ font: '700 12px/1.1 "JetBrains Mono"', color: accent, textAlign: 'center' }}>−{ded.amount.toFixed(2)}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: '800 11px/1 "Barlow Condensed"', letterSpacing: '.14em', textTransform: 'uppercase', color: accent, marginBottom: 7 }}>{ded.name}</div>
                    <div style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 7, fontSize: 11.5, color: 'var(--text-dim)', borderLeft: `2px solid ${accent}`, whiteSpace: 'pre-line' }}>
                      <span style={{ color: accent, fontSize: 13 }}>"</span>{ded.note}<span style={{ color: accent, fontSize: 13 }}>"</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ height: 24 }}/>

    </>
  );
}

// ─── Division leaderboard tab ──────────────────────────
function DivisionLeaderboard({ sheet }) {
  const hasTwoDay = !!sheet.categories1;
  const pendingDay2 = !!sheet.pendingDay2;
  const dashCell = (
    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
      <div style={{ color: 'var(--text-faint)', fontFamily: '"JetBrains Mono"', fontSize: 13 }}>—</div>
      <div style={{ height: 12 }}/>
    </td>
  );
  return (
    <div style={{ padding: '0 var(--pad-x) 8px' }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>L2 Senior Small · {sheet.leaderboard.length} teams</div>
      <div className="card" style={{ padding: '4px 0' }}>
        <table className="lb" style={{ fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: 10 }}>#</th>
              <th>Team</th>
              {hasTwoDay && <th style={{ textAlign: 'center' }}>D1</th>}
              {hasTwoDay && <th style={{ textAlign: 'center' }}>D2</th>}
              <th className="r" style={{ paddingRight: 10 }}>{hasTwoDay ? 'Final' : 'Score'}</th>
            </tr>
          </thead>
          <tbody>
            {sheet.leaderboard.map(t => {
              const d2Raw = (hasTwoDay && !pendingDay2) ? (t.score + t.deductions).toFixed(2) : null;
              return (
                <tr key={t.rank} className={t.us ? 'us' : ''}>
                  <td style={{ paddingLeft: 10 }}>
                    <span className={`rank r${t.rank}`}>{t.rank}</span>
                  </td>
                  <td>
                    <div className="tname">{t.name}</div>
                    <div className="tgym">{t.gym}</div>
                  </td>
                  {hasTwoDay && (
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <div className="mono" style={{ fontSize: 12, color: t.us ? 'var(--volt)' : 'var(--text-dim)' }}>{t.score1.toFixed(2)}</div>
                      <div style={{ height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.deductions1 > 0 && <span className="mono" style={{ fontSize: 9.5, color: '#ff8484' }}>−{t.deductions1.toFixed(2)}</span>}
                      </div>
                    </td>
                  )}
                  {hasTwoDay && (pendingDay2 ? dashCell :
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <div className="mono" style={{ fontSize: 12, color: t.us ? 'var(--volt)' : 'var(--text-dim)' }}>{d2Raw}</div>
                      <div style={{ height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.deductions > 0 && <span className="mono" style={{ fontSize: 9.5, color: '#ff8484' }}>−{t.deductions.toFixed(2)}</span>}
                      </div>
                    </td>
                  )}
                  {pendingDay2 ? dashCell :
                    <td className="r" style={{ paddingRight: 10, verticalAlign: 'middle' }}>
                      <div className="score" style={{ color: t.us ? 'var(--volt)' : 'var(--text)' }}>{t.score.toFixed(2)}</div>
                      {hasTwoDay
                        ? <div style={{ height: 12 }}/>
                        : t.deductions > 0 && <div className="mono" style={{ fontSize: 9.5, color: '#ff8484' }}>−{t.deductions.toFixed(2)}</div>
                      }
                    </td>
                  }
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Compare view (us vs picked competitor) ───────────
function CompareView({ sheet }) {
  const us = sheet.leaderboard.find(t => t.us);
  const others = sheet.leaderboard.filter(t => !t.us);
  const [pickId, setPick] = React.useState(others[0].name);
  const them = others.find(t => t.name === pickId) || others[0];
  const [day, setDay] = React.useState('day2');

  const hasTwoDay = !!sheet.categories1;
  const pendingDay2 = !!sheet.pendingDay2;
  const activeDay = pendingDay2 ? 'day1' : day;
  const cats = (hasTwoDay && activeDay === 'day1') ? sheet.categories1 : (sheet.categories || sheet.categories1);
  const usScoreForDay   = (hasTwoDay && activeDay === 'day1') ? us.score1   : us.score;
  const themScoreForDay = (hasTwoDay && activeDay === 'day1') ? them.score1 : them.score;
  const dayTotals    = (hasTwoDay && activeDay === 'day1') ? sheet.totals1 : (sheet.totals || sheet.totals1);
  const theirDayDed = (hasTwoDay && activeDay === 'day1') ? them.deductions1 : them.deductions;
  const theirDayPS  = (hasTwoDay && activeDay === 'day1') ? them.score1 : them.score;
  const theirDayRS  = (theirDayPS + theirDayDed);

  return (
    <>
      <div style={{ padding: '0 var(--pad-x) 10px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Compare vs</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {others.map(t => (
            <button key={t.name} onClick={() => setPick(t.name)} className="chip" style={{
              cursor: 'pointer', appearance: 'none',
              padding: '11px 14px',
              background: pickId === t.name ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
              color: pickId === t.name ? 'var(--text)' : 'var(--text-dim)',
              borderColor: pickId === t.name ? 'rgba(255,255,255,0.35)' : 'var(--line)',
            }}>{t.name}</button>
          ))}
        </div>
      </div>

      <div className="cmp-grid">
        <div className="cmp us">
          <div className="label">{pendingDay2 ? 'Day 1 ' : ''}Rank #{us.rank}</div>
          <div className="nm">Electra</div>
          <div className="sc mono">{us.score.toFixed(2)}</div>
        </div>
        <div className="cmp">
          <div className="label">{pendingDay2 ? 'Day 1 ' : ''}Rank #{them.rank}</div>
          <div className="nm">{them.name}</div>
          <div className="sc mono" style={{ color: 'var(--text-dim)' }}>{them.score.toFixed(2)}</div>
        </div>
      </div>

      {/* per-category bar compare */}
      <div className="section" style={{ paddingTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ font: '800 18px/1 "Barlow Condensed"', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text)' }}>
            By Category
            <span style={{ font: '700 10px/1 "Barlow Condensed"', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--volt)', marginLeft: 8 }}>vs {them.name}</span>
          </div>
          {hasTwoDay && !pendingDay2 && (
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--line)', borderRadius: 10, padding: 2, flexShrink: 0 }}>
              {['day1', 'day2'].map(d => (
                <button key={d} onClick={() => setDay(d)} style={{ appearance: 'none', border: 'none', cursor: 'pointer', height: 32, paddingInline: 12, borderRadius: 8, background: activeDay === d ? 'rgba(255,255,255,0.14)' : 'transparent', color: activeDay === d ? 'var(--text)' : 'var(--text-faint)', font: '800 11px/1 "Barlow Condensed"', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                  {d === 'day1' ? 'D1' : 'D2'}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Day summary row */}
        <div style={{ padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0 }}>
            {/* Electra side */}
            <div style={{ paddingRight: 12 }}>
              <div style={{ font: '700 10px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--volt)', marginBottom: 7 }}>Electra</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {[['RS', dayTotals.raw.toFixed(2)], ['DED', dayTotals.deductions === 0 ? '0' : '−' + dayTotals.deductions.toFixed(2)], ['PS', dayTotals.final.toFixed(2)]].map(([lbl, val]) => (
                  <div key={lbl}>
                    <div style={{ font: '700 8px/1 "Barlow Condensed"', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--volt)', opacity: 0.6 }}>{lbl}</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--volt)', marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div style={{ background: 'var(--line)', margin: '0 0' }}/>
            {/* Competitor side */}
            <div style={{ paddingLeft: 12 }}>
              <div style={{ font: '700 10px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 7 }}>{them.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {[['RS', theirDayRS.toFixed(2)], ['DED', theirDayDed === 0 ? '0' : '−' + theirDayDed.toFixed(2)], ['PS', theirDayPS.toFixed(2)]].map(([lbl, val]) => (
                  <div key={lbl}>
                    <div style={{ font: '700 8px/1 "Barlow Condensed"', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-dim)', opacity: 0.6 }}>{lbl}</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 9 }}>
          {cats.map(c => {
            const ours = c.judges.reduce((s, j) => s + j.s, 0) / c.judges.length;
            const factor = themScoreForDay / usScoreForDay;
            const theirs = Math.min(c.of, ours * factor * (0.94 + (c.id.charCodeAt(0) % 12) / 100));
            const oursPct  = (ours   / c.of) * 100;
            const theirPct = (theirs / c.of) * 100;
            const better = ours >= theirs;
            // Competitor sub-scores (for legend numbers only)
            const theirSub = (hasTwoDay && activeDay === 'day1') ? them.catSub1?.[c.id] : them.catSub?.[c.id];
            const theirDod = theirSub?.dod != null ? theirSub.dod : (c.dod ? theirs * (c.dod.score / ours) : 0);
            const theirMax = theirSub?.max != null ? theirSub.max : (c.max ? theirs * (c.max.score / ours) : 0);
            const theirDe  = Math.max(0, theirs - theirDod - theirMax);
            const deRatio  = c.d / (c.d + (c.e || 0));
            const theirD   = theirDe * deRatio;
            const theirE   = c.e ? theirDe * (1 - deRatio) : 0;
            return (
              <div key={c.id} style={{ padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ font: '700 12px/1 "Barlow Condensed"', textTransform: 'uppercase', letterSpacing: '.04em' }}>{c.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: better ? 'var(--volt)' : '#ff8484' }}>
                    {better ? '+' : ''}{(ours - theirs).toFixed(2)}
                  </div>
                </div>
                {/* Electra bar — single solid */}
                <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 36px', gap: 6, alignItems: 'center', marginTop: 6 }}>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--volt)', fontWeight: 700 }}>{ours.toFixed(2)}</div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: oursPct + '%', background: 'var(--volt)', borderRadius: 99 }}/>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-faint)', textAlign: 'right' }}>/{c.of}</div>
                </div>
                {/* Electra legend */}
                {(c.e || c.dod) && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 3, paddingLeft: 42, alignItems: 'center' }}>
                    <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--volt)' }}>
                      D <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--volt)', fontWeight: 700 }}>{c.d.toFixed(2)}</b>
                    </span>
                    {c.e && (
                      <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--volt)' }}>
                        E <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--volt)', fontWeight: 700 }}>{c.e.toFixed(2)}</b>
                      </span>
                    )}
                    {c.dod && (
                      <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--volt)' }}>
                        DOD <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--volt)', fontWeight: 700 }}>{c.dod.score.toFixed(2)}</b>
                      </span>
                    )}
                    {c.max && (
                      <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--volt)' }}>
                        MAX <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--volt)', fontWeight: 700 }}>{c.max.score.toFixed(2)}</b>
                      </span>
                    )}
                  </div>
                )}
                {/* Competitor bar — single solid */}
                <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 36px', gap: 6, alignItems: 'center', marginTop: 4 }}>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 700 }}>{theirs.toFixed(2)}</div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: theirPct + '%', background: 'rgba(255,255,255,0.28)', borderRadius: 99 }}/>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-faint)', textAlign: 'right' }}>/{c.of}</div>
                </div>
                {/* Competitor legend */}
                {(c.e || c.dod) && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 3, paddingLeft: 42, alignItems: 'center' }}>
                    <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                      D <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--text-dim)', fontWeight: 700 }}>{theirD.toFixed(2)}</b>
                    </span>
                    {c.e && (
                      <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                        E <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--text-dim)', fontWeight: 700 }}>{theirE.toFixed(2)}</b>
                      </span>
                    )}
                    {theirDod > 0 && (
                      <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                        DOD <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--text-dim)', fontWeight: 700 }}>{theirDod.toFixed(2)}</b>
                      </span>
                    )}
                    {theirMax > 0 && (
                      <span style={{ font: '700 9px/1 "Barlow Condensed"', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                        MAX <b style={{ fontFamily: '"JetBrains Mono"', fontSize: 9.5, color: 'var(--text-dim)', fontWeight: 700 }}>{theirMax.toFixed(2)}</b>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ResultsScreen, ScoresheetScreen });
