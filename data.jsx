/* data.jsx — Airtable fetch layer
   Fetches live data at load time. Exposes window.DATA_READY (a Promise).
   All other files read from window globals set when that promise resolves.
*/

const _AT_BASE  = 'appEgCbsF6WqbE00L';
const _AT_TOKEN = 'pat4CAmwCXz8nym0u.68a3330cec9f83ee61c393eed50daf4eaa210de6e9fc5c2e548a1410ade8f0fc';
const _TABLES = {
  competitions:   'tblwO8Lc3uJrLuDiy',
  scoresheets:    'tblFAowYjjrgiJ7VV',
  scheduleEvents: 'tbl0CgfVzcVa2i87k',
  documents:      'tbl6yVDDuOw4HwYoC',
};

// Fetch every record from a table, handling Airtable pagination automatically
async function _fetchAll(tableId) {
  const records = [];
  let offset = null;
  do {
    const url = `https://api.airtable.com/v0/${_AT_BASE}/${tableId}` +
      (offset ? `?offset=${encodeURIComponent(offset)}` : '');
    const res = await fetch(url, { headers: { Authorization: `Bearer ${_AT_TOKEN}` } });
    if (!res.ok) throw new Error(`Airtable ${tableId}: ${res.status}`);
    const data = await res.json();
    records.push(...data.records.map(r => r.fields));
    offset = data.offset || null;
  } while (offset);
  return records;
}

function _json(str) {
  if (!str) return null;
  try { return JSON.parse(str); } catch(e) { return null; }
}

// ============================================================
// SCHEDULE — Mon/Wed practices are generated client-side;
// everything else (open gyms, privates, special events,
// cancellations) comes from Airtable Schedule Events table.
// ============================================================
const _iso = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

function _buildSchedule(competitions, airtableEvents) {
  const events = [];

  // Regular Mon & Wed practices for the full season
  const seasonStart = new Date(2026, 4, 1);
  const seasonEnd   = new Date(2027, 4, 31);
  for (let d = new Date(seasonStart); d <= seasonEnd; d = new Date(d.getTime() + 86400000)) {
    const dow = d.getDay();
    if (dow === 1 || dow === 3) {
      events.push({ date: _iso(d), kind: 'practice', title: 'Practice', meta: '', time: '7 – 9pm' });
    }
  }

  // Airtable events: merge non-cancellations; track cancelled dates
  const cancelledDates = new Set();
  airtableEvents.forEach(f => {
    if (f.kind === 'cancelled') {
      cancelledDates.add(f.date);
    } else {
      events.push({
        date: f.date,
        kind: f.kind,
        title: f.title || '',
        meta: f.meta || '',
        time: f.time || '',
        ...(f.compId ? { compId: f.compId } : {}),
      });
    }
  });

  // Remove any Mon/Wed practice whose date was cancelled
  const filtered = events.filter(e => !(e.kind === 'practice' && cancelledDates.has(e.date)));

  // Add comp days + travel day from the competitions list
  competitions.forEach(c => {
    const d1 = new Date(c.date + 'T00:00:00');
    const travel = new Date(d1.getTime() - 86400000);
    const outbound = c.lucyItinerary?.flights?.outbound;
    filtered.push({
      date: _iso(travel), kind: 'travel', compId: c.id,
      title: `Travel → ${c.city.split(',')[0]}`,
      meta:  outbound ? `${outbound.from} → ${outbound.to}` : '',
      time:  outbound ? outbound.depart : '',
    });
    filtered.push({ date: c.date,    kind: 'comp', compId: c.id, title: `${c.name} · Day 1`, meta: 'Prelims',          time: '' });
    if (c.endDate) {
      filtered.push({ date: c.endDate, kind: 'comp', compId: c.id, title: `${c.name} · Day 2`, meta: 'Finals + Awards', time: '' });
    }
  });

  const kindOrder = { comp: 0, practice: 1, lucy: 2, opengym: 3, other: 4, travel: 5 };
  return filtered.sort((a, b) => {
    const dateDiff = a.date.localeCompare(b.date);
    if (dateDiff !== 0) return dateDiff;
    return (kindOrder[a.kind] ?? 99) - (kindOrder[b.kind] ?? 99);
  });
}

// ============================================================
// Transform Airtable field objects → app-expected shapes
// ============================================================

function _transformCompetitions(fields) {
  return fields
    .map(f => {
      const comp = {
        id:           f.id,
        name:         f.name,
        short:        f.short,
        venue:        f.venue,
        city:         f.city,
        date:         f.date,
        endDate:      f.endDate || null,
        status:       f.status,
        hasScoresheet: f.hasScoresheet || false,
      };
      if (f.placement)       comp.placement       = f.placement;
      if (f.of)              comp.of              = f.of;
      if (f.score)           comp.score           = f.score;
      if (f.varsityUrl)      comp.varsityUrl      = f.varsityUrl;
      if (f.mat)             comp.mat             = f.mat;
      if (f.performance)     comp.performance     = f.performance;
      if (f.day2Performance) comp.day2Performance = f.day2Performance;
      if (f.awards)          comp.awards          = f.awards;

      const travel        = _json(f.travel);
      const lucyItinerary = _json(f.lucyItinerary);
      const day1Schedule  = _json(f.day1Schedule);
      const day2Schedule  = _json(f.day2Schedule);
      const docs          = _json(f.docs);
      const division      = _json(f.divisionTeams);

      if (travel)        comp.travel        = travel;
      if (lucyItinerary) comp.lucyItinerary = lucyItinerary;
      if (day1Schedule || day2Schedule) {
        comp.schedule = {};
        if (day1Schedule) comp.schedule.day1 = day1Schedule;
        if (day2Schedule) comp.schedule.day2 = day2Schedule;
      }
      if (docs)     comp.docs     = docs;
      if (division) comp.division = division;

      return comp;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

function _transformScoresheets(fields) {
  const map = {};
  fields.forEach(f => {
    const sheet = {
      compId:      f.compId,
      pendingDay2: f.pendingDay2 || false,
      totals1: {
        raw:        f.raw1   || 0,
        deductions: f.ded1   || 0,
        final:      f.final1 || 0,
        placement:  f.place1 || 0,
        of:         f.of1    || 0,
      },
      categories1:  _json(f.categories1)  || [],
      deductions1:  [],
      leaderboard:  _json(f.leaderboard)  || [],
    };

    // Day 2 totals only if data exists
    if (f.raw2) {
      sheet.totals = {
        raw:        f.raw2   || 0,
        deductions: f.ded2   || 0,
        final:      f.final2 || 0,
        placement:  f.place2 || 0,
        of:         f.of2    || 0,
      };
      sheet.categories  = _json(f.categories2) || [];
      sheet.deductions  = [];
    }

    const deductionCards = _json(f.deductionCards);
    if (deductionCards) sheet.deductionCards = deductionCards;

    if (f.sectionNotesBuilding || f.sectionNotesTumbling) {
      sheet.sectionNotes = {
        building: f.sectionNotesBuilding || '',
        tumbling: f.sectionNotesTumbling || '',
      };
    }

    map[f.compId] = sheet;
  });
  return map;
}

// ============================================================
// Static globals (never change mid-season)
// ============================================================
const ATHLETE = {
  name:     'Lucy',
  team:     'Electra',
  division: 'L2 Senior Small',
};

const TEAM = {
  gym:      'NorCal Elite All-Stars',
  location: 'San Jose, CA',
  team:     'Electra',
  division: 'Level 2 Senior Small',
  coach:    'Coach Tay & Coach Reagan',
  season:   '2026–27',
};

const SEASON_MONTHS = (() => {
  const months = [];
  for (let i = 0; i < 13; i++) months.push(new Date(2026, 4 + i, 1));
  return months;
})();

// ============================================================
// Bootstrap — fetch everything, set window globals, resolve
// ============================================================
window.DATA_READY = (async () => {
  const [compFields, sheetFields, eventFields, docFields] = await Promise.all([
    _fetchAll(_TABLES.competitions),
    _fetchAll(_TABLES.scoresheets),
    _fetchAll(_TABLES.scheduleEvents),
    _fetchAll(_TABLES.documents),
  ]);

  const COMPETITIONS = _transformCompetitions(compFields);
  const SCORESHEETS  = _transformScoresheets(sheetFields);
  const SCHEDULE     = _buildSchedule(COMPETITIONS, eventFields);

  const COMP_BY_DATE = {};
  COMPETITIONS.forEach(c => {
    COMP_BY_DATE[c.date] = c.id;
    if (c.endDate) COMP_BY_DATE[c.endDate] = c.id;
  });

  // Keep SCORESHEET / SCORESHEET_BCB for backward compat with any direct refs
  const SCORESHEET     = SCORESHEETS['volt-2026'] || null;
  const SCORESHEET_BCB = SCORESHEETS['bcb-2026']  || null;

  const DOCUMENTS = [...docFields].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  Object.assign(window, {
    TODAY: new Date(),
    ATHLETE, TEAM, SEASON_MONTHS,
    COMPETITIONS, SCORESHEETS, SCORESHEET, SCORESHEET_BCB,
    SCHEDULE, COMP_BY_DATE,
    DOCUMENTS,
  });
})();
