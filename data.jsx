/* data.jsx — Electra parent-hub data
   Season: May 2026 – May 2027
   TODAY = Jan 10, 2027 (Cali Classic Showcase is 6 days out)
*/

const TODAY = new Date(2027, 0, 10); // Jan 10, 2027

const ATHLETE = {
  name: 'Lucy',
  team: 'Electra',
  division: 'L2 Senior Small',
  parent: 'M.',
};

const TEAM = {
  gym: 'NorCal Elite All-Stars',
  location: 'San Jose, CA',
  team: 'Electra',
  division: 'Level 2 Senior Small',
  coach: 'Coach Tay & Coach Reagan',
  season: '2026–27',
};

// ============================================================
// SCHEDULE — generated for the full season
// ============================================================

const _iso = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

function _buildSchedule() {
  const events = [];
  const seasonStart = new Date(2026, 4, 1);   // May 1, 2026
  const seasonEnd   = new Date(2027, 4, 31);  // May 31, 2027

  // Practices every Mon & Wed
  for (let d = new Date(seasonStart); d <= seasonEnd; d = new Date(d.getTime() + 86400000)) {
    const dow = d.getDay();
    if (dow === 1 || dow === 3) {
      events.push({ date: _iso(d), kind: 'practice', title: 'Practice', meta: '', time: '5:30 – 8:30pm' });
    }
  }

  // Saturday practice the weekend before each comp
  const satPractices = [
    '2026-10-10', '2026-11-07', '2026-12-05',
    '2027-01-09', '2027-02-06', '2027-03-06',
    '2027-04-10', '2027-04-24',
  ];
  satPractices.forEach(date => events.push({
    date, kind: 'practice', title: 'Saturday Practice',
    meta: 'Pre-comp full-out', time: '10:00am – 1:00pm',
  }));

  // 1 open gym per month
  [
    { date: '2026-05-22', meta: 'All teams · drop in' },
    { date: '2026-06-19', meta: 'All teams · drop in' },
    { date: '2026-07-17', meta: 'Summer skills' },
    { date: '2026-08-21', meta: 'All teams · drop in' },
    { date: '2026-09-18', meta: 'All teams · drop in' },
    { date: '2026-10-23', meta: 'Flexibility focus' },
    { date: '2026-11-20', meta: 'All teams · drop in' },
    { date: '2026-12-18', meta: 'Last open gym of 2026' },
    { date: '2027-01-22', meta: 'All teams · drop in' },
    { date: '2027-02-20', meta: 'All teams · drop in' },
    { date: '2027-03-19', meta: 'Flexibility focus' },
    { date: '2027-04-23', meta: 'Pre-finals open gym' },
    { date: '2027-05-15', meta: 'Off-season prep' },
  ].forEach(o => events.push({
    date: o.date, kind: 'opengym', title: 'Open Gym', meta: o.meta, time: '6:00 – 8:00pm',
  }));

  // Lucy tumbling private — 1/mo
  [
    '2026-05-13', '2026-06-10', '2026-07-15', '2026-08-12', '2026-09-09',
    '2026-10-14', '2026-11-11', '2026-12-09',
    '2027-01-13', '2027-02-10', '2027-03-10', '2027-04-14', '2027-05-12',
  ].forEach(date => events.push({
    date, kind: 'lucy', title: 'Lucy Tumbling Private',
    meta: 'with Coach Dom', time: '4:00 – 5:00pm',
  }));

  // Lucy stunting private — 1/mo
  [
    '2026-05-27', '2026-06-24', '2026-07-29', '2026-08-26', '2026-09-23',
    '2026-10-28', '2026-11-25', '2026-12-30',
    '2027-01-27', '2027-02-24', '2027-03-31', '2027-04-28', '2027-05-26',
  ].forEach(date => events.push({
    date, kind: 'lucy', title: 'Lucy Stunting Private',
    meta: 'with Coach Reagan', time: '4:00 – 5:00pm',
  }));

  // Team photos — one per season
  events.push({
    date: '2026-09-19', kind: 'other', title: 'Team Photos',
    meta: 'Full uniform · hair & makeup is athlete choice · arrive extra early for small group photos',
    time: '5:00 – 7:00pm',
  });

  // Comp days + travel day before each
  const comps = [
    { id: 'bbb-2026',    d1: '2026-10-17', d2: '2026-10-18', name: 'Battle by the Bay',     city: 'Oakland, CA' },
    { id: 'bcb-2026',    d1: '2026-11-14', d2: '2026-11-15', name: 'Bay City Brawl',        city: 'Daly City, CA' },
    { id: 'volt-2026',   d1: '2026-12-12', d2: '2026-12-13', name: 'Volt Open',             city: 'San Jose, CA' },
    { id: 'ccs-2027',    d1: '2027-01-16', d2: '2027-01-17', name: 'Cali Classic Showcase', city: 'Anaheim, CA' },
    { id: 'ssw-2027',    d1: '2027-02-13', d2: '2027-02-14', name: 'Spirit Showdown West',  city: 'San Diego, CA' },
    { id: 'ccc-2027',    d1: '2027-03-13', d2: '2027-03-14', name: 'California Classic',    city: 'Anaheim, CA' },
    { id: 'wn-2027',     d1: '2027-04-17', d2: '2027-04-18', name: 'Western Nationals',     city: 'Las Vegas, NV' },
    { id: 'worlds-2027', d1: '2027-05-01', d2: '2027-05-02', name: 'Worlds Bid Comp',       city: 'Orlando, FL' },
  ];
  comps.forEach(c => {
    // Travel day (day before)
    const d1 = new Date(c.d1 + 'T00:00:00');
    const travel = new Date(d1.getTime() - 86400000);
    events.push({
      date: _iso(travel), kind: 'travel', compId: c.id,
      title: `Travel → ${c.city.split(',')[0]}`,
      meta: '', time: '',
    });
    events.push({ date: c.d1, kind: 'comp', compId: c.id, title: `${c.name} · Day 1`, meta: 'Prelims', time: '' });
    events.push({ date: c.d2, kind: 'comp', compId: c.id, title: `${c.name} · Day 2`, meta: 'Finals + Awards', time: '' });
  });

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

const SCHEDULE = _buildSchedule();

// ============================================================
// COMPETITIONS — season events with results + travel detail
// ============================================================
const COMPETITIONS = [
  // PAST
  {
    id: 'bbb-2026',
    name: 'Battle by the Bay',
    short: 'BBB',
    venue: 'Oakland Convention Center',
    city: 'Oakland, CA',
    date: '2026-10-17',
    endDate: '2026-10-18',
    status: 'past',
    placement: 1,
    of: 8,
    score: 92.78,
    hasScoresheet: false,
  },
  {
    id: 'bcb-2026',
    name: 'Bay City Brawl',
    short: 'Bay City Brawl',
    venue: 'Cow Palace',
    city: 'Daly City, CA',
    date: '2026-11-14',
    endDate: '2026-11-15',
    status: 'past',
    placement: 3,
    of: 9,
    score: 88.95,
    hasScoresheet: true,
  },
  {
    id: 'volt-2026',
    name: 'Volt Open',
    short: 'Volt Open',
    venue: 'SAP Center',
    city: 'San Jose, CA',
    date: '2026-12-12',
    endDate: '2026-12-13',
    status: 'past',
    placement: 5,
    of: 9,
    score: 95.60,
    hasScoresheet: true,
  },

  // UPCOMING — Cali Classic Showcase is the imminent one (6 days out)
  {
    id: 'ccs-2027',
    name: 'Cali Classic Showcase',
    short: 'Cali Classic',
    venue: 'Anaheim Convention Center',
    city: 'Anaheim, CA',
    date: '2027-01-16',
    endDate: '2027-01-17',
    status: 'upcoming',
    varsityUrl: 'https://varsity.com/events/cali-classic-showcase-2027',
    mat: 'Mat A',
    performance: '2027-01-16T14:18:00',
    day2Performance: '2027-01-17T11:45:00',
    awards: '2027-01-17T17:00:00',
    travel: {
      hotel: 'Sheraton Park at the Anaheim Resort',
      hotelAddr: '1855 S Harbor Blvd, Anaheim CA 92802',
      hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=Sheraton+Park+at+the+Anaheim+Resort',
      ttsUrl: 'https://travelteamsports.com/event/cali-classic-2027',
      checkIn: 'Fri 1/15 after 3pm',
      checkOut: 'Sun 1/17 by 12pm',
      parking: '$22/day valet · $14 self-park (Garage East)',
      drive: '~12 min',
      spectators: {
        dayPrice: '$20',
        weekendPrice: '$50',
        ticketUrl: 'https://varsity.com/events/cali-classic-showcase-2027/tickets',
      },
    },
    lucyItinerary: {
      flights: {
        outbound: { airline: 'Southwest', flight: 'WN 234', from: 'SJC', to: 'SNA', date: 'Fri 1/15', depart: '2:10pm', arrive: '3:30pm' },
        ret:      { airline: 'Southwest', flight: 'WN 998', from: 'SNA', to: 'SJC', date: 'Sun 1/17', depart: '7:45pm', arrive: '9:00pm' },
      },
      hotel: {
        name: 'Sheraton Park at the Anaheim Resort',
        confNum: 'M-NCE2027-LE',
        checkIn: 'Fri 1/15',
        checkOut: 'Sun 1/17',
        distToVenue: '~10 min walk',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sheraton+Park+at+the+Anaheim+Resort',
      },
    },
    schedule: {
      day1: [
        { t: '07:00', what: 'Team call · lobby check-in', who: 'Coaches Tay & Reagan' },
        { t: '08:30', what: 'Hair & makeup', who: 'Hotel Suite 1204' },
        { t: '11:00', what: 'Walk-through (closed)', who: 'Warm-up room C' },
        { t: '13:30', what: 'Stretch & warm-up', who: 'Warm-up mat 3' },
        { t: '14:18', what: 'PERFORMANCE — Mat A', who: 'Electra · L2 Senior Small · Prelims' },
        { t: '15:00', what: 'Team photo', who: 'Lobby step-and-repeat' },
        { t: '17:00', what: 'Team dinner', who: 'Pacific Catch · 1pp meal voucher' },
      ],
      day2: [
        { t: '08:00', what: 'Team call · hotel lobby', who: 'Coaches Tay & Reagan' },
        { t: '09:00', what: 'Hair & makeup touch-up', who: 'Hotel Suite 1204' },
        { t: '10:30', what: 'Stretch & warm-up', who: 'Warm-up mat 3' },
        { t: '11:45', what: 'PERFORMANCE — Mat A', who: 'Electra · L2 Senior Small · Finals' },
        { t: '13:00', what: 'Team lunch + recovery', who: 'Hotel ballroom' },
        { t: '17:00', what: 'AWARDS CEREMONY', who: 'Main floor · full team' },
      ],
    },
    docs: [
      { name: 'CCS 2027 — Final Itinerary',     size: '412 KB', updated: 'Jan 8' },
      { name: 'Packing List & Uniform Check',   size: '88 KB',  updated: 'Jan 2' },
      { name: 'Hotel Group Block Confirmation', size: '120 KB', updated: 'Dec 28' },
      { name: 'Athlete Waiver — Travel Comp',   size: '64 KB',  updated: 'Dec 20' },
      { name: 'Parent Cheering Section Map',    size: '210 KB', updated: 'Jan 5' },
    ],
    division: [
      { id: 'electra',   us: true, name: 'Electra',   gym: 'NorCal Elite · San Jose',   slot: '2:18pm', slot2: '11:45am' },
      { id: 'lightning',           name: 'Lightning',  gym: 'Bay City All-Stars',         slot: '2:24pm', slot2: '11:39am' },
      { id: 'onyx',                name: 'Onyx',       gym: 'Pacific Storm',              slot: '2:30pm', slot2: '11:33am' },
      { id: 'royals',              name: 'Royals',     gym: 'Golden State Spirit',        slot: '2:36pm', slot2: '11:27am' },
      { id: 'crystals',            name: 'Crystals',   gym: 'Coastal Cheer Co.',          slot: '2:42pm', slot2: '11:21am' },
      { id: 'voltage',             name: 'Voltage',    gym: 'Summit Cheer',               slot: '2:48pm', slot2: '11:15am' },
      { id: 'cobalt',              name: 'Cobalt',     gym: 'Premier Athletics West',     slot: '2:54pm', slot2: '11:09am' },
      { id: 'edge',                name: 'Edge',       gym: 'East Bay Elite',             slot: '3:00pm', slot2: '11:03am' },
    ],
  },
  {
    id: 'ssw-2027',
    name: 'Spirit Showdown West',
    short: 'Spirit Showdown',
    venue: 'San Diego Convention Center',
    city: 'San Diego, CA',
    date: '2027-02-13',
    endDate: '2027-02-14',
    status: 'upcoming',
    docs: [
      { name: 'SSW Pre-Travel Packet', size: '380 KB', updated: 'Jan 9' },
    ],
  },
  {
    id: 'ccc-2027',
    name: 'California Classic',
    short: 'Cali Classic',
    venue: 'Anaheim Convention Center',
    city: 'Anaheim, CA',
    date: '2027-03-13',
    endDate: '2027-03-14',
    status: 'upcoming',
  },
  {
    id: 'wn-2027',
    name: 'Western Nationals',
    short: 'Western Nats',
    venue: 'Las Vegas Convention Center',
    city: 'Las Vegas, NV',
    date: '2027-04-17',
    endDate: '2027-04-18',
    status: 'upcoming',
    crown: true,
  },
  {
    id: 'worlds-2027',
    name: 'Worlds Bid Comp',
    short: 'Worlds',
    venue: 'ESPN Wide World of Sports',
    city: 'Orlando, FL',
    date: '2027-05-01',
    endDate: '2027-05-02',
    status: 'upcoming',
    crown: true,
  },
];

// Map iso date string → competition id (used by calendar to deep-link comp cells)
const COMP_BY_DATE = {};
COMPETITIONS.forEach(c => {
  COMP_BY_DATE[c.date] = c.id;
  if (c.endDate) COMP_BY_DATE[c.endDate] = c.id;
});

// ============================================================
// SCORESHEET — for "Volt Open" (most recent past comp with a scoresheet)
// ============================================================
const SCORESHEET = {
  compId: 'volt-2026',
  comp: 'Volt Open',
  city: 'San Jose, CA',
  date: '2026-12-13',
  division: 'L2 Senior Small',
  // ── Day 1 (Prelims) — RS 47.50 · DED 0 · PS 95.00 · 6th/9 ─
  totals1: {
    raw: 95.00,
    deductions: 0,
    final: 95.00,
    placement: 6,
    of: 9,
  },
  categories1: [
    { id: 'stunts',  name: 'Stunt',                   of: 10.0, d: 4.50, e: 3.73, d_of: 4.5, e_of: 4.0, judges: [{ n: 'Judge 1', s: 9.55 }, { n: 'Judge 2', s: 9.57 }, { n: 'Judge 3', s: 9.60 }], dod: { of: 0.8, score: 0.72 }, max: { of: 0.7, score: 0.62 }, notes: 'Top Person – Minor break in control during transition with legs not locked out on single leg stunts variations' },
    { id: 'pyramid', name: 'Pyramid',                  of:  8.0, d: 3.77, e: 3.70, d_of: 4.0, e_of: 4.0, judges: [{ n: 'Judge 1', s: 7.45 }, { n: 'Judge 2', s: 7.47 }, { n: 'Judge 3', s: 7.49 }], notes: 'Excellent control maintained throughout with stunts remaining strong and clean.' },
    { id: 'tosses',  name: 'Toss',            of:  4.0, d: 2.00, e: 1.87, d_of: 2.0, e_of: 2.0, judges: [{ n: 'Judge 1', s: 3.85 }, { n: 'Judge 2', s: 3.87 }, { n: 'Judge 3', s: 3.89 }], notes: 'Good height and control; strong landings' },
    { id: 'st',      name: 'Standing Tumbling',        of:  8.0, d: 3.00, e: 3.72, d_of: 3.0, e_of: 4.0, judges: [{ n: 'Judge 1', s: 7.57 }, { n: 'Judge 2', s: 7.59 }, { n: 'Judge 3', s: 7.61 }], dod: { of: 1.0, score: 0.87 }, notes: 'Body Control - Several athletes are leading knees and have flexed feet in back walkover skills.' },
    { id: 'rt',      name: 'Running Tumbling',         of:  8.0, d: 3.00, e: 3.75, d_of: 3.0, e_of: 4.0, judges: [{ n: 'Judge 1', s: 7.60 }, { n: 'Judge 2', s: 7.62 }, { n: 'Judge 3', s: 7.64 }], dod: { of: 0.5, score: 0.45 }, max: { of: 0.5, score: 0.42 }, notes: 'Body Control - Athletes ar not engaging leg muscles and pointed toes in back walkover skills creating bent knees when skill is being performed. Ensure athletes are driving with hips and straight legs in front walkover skills.' },
    { id: 'jumps',   name: 'Jumps',                    of:  4.0, d: 2.00, e: 1.97, d_of: 2.0, e_of: 2.0, judges: [{ n: 'Judge 1', s: 3.95 }, { n: 'Judge 2', s: 3.97 }, { n: 'Judge 3', s: 3.99 }], notes: 'Arm Placement - Not all arms are uniformed in hurdlers\nLeg Placement - Lack of flexibility causing low front leg placement in hurdlers. Lack if hip rotation in toe touch skills.' },
    { id: 'rc',      name: 'Routine Creativity',       of:  2.0, d: 1.80, d_of: 2.0, judges: [{ n: 'Judge 1', s: 1.79 }, { n: 'Judge 2', s: 1.80 }, { n: 'Judge 3', s: 1.81 }], notes: 'Rushed routine, maintain a steady pace and all move through those pathways seamlessly. Running noted with athletes from the right side into background work and rushing into right side of after stunt group work. Nice job with those visual elements from rippling of stunt groups to background work at the beginning with structure work to background work during jumps.' },
    { id: 'ft',      name: 'Formations & Transitions', of:  2.0, d: 2.00, d_of: 2.0, judges: [{ n: 'Judge 1', s: 1.99 }, { n: 'Judge 2', s: 2.00 }, { n: 'Judge 3', s: 2.00 }], notes: 'no obvious issues were noted.' },
    { id: 'dance',   name: 'Dance',                    of:  2.0, d: 0.88, e: 0.85, d_of: 1.0, e_of: 1.0, judges: [{ n: 'Judge 1', s: 1.72 }, { n: 'Judge 2', s: 1.73 }, { n: 'Judge 3', s: 1.74 }], notes: 'Fast paced transition into dance but control rushing those motions as some are being cut short of their precise placement. Single arm motion varies as well as synchronization is off. Watch motions as you move from one formation to the next.' },
    { id: 'show',    name: 'Showmanship',              of:  2.0, d: 1.88, d_of: 2.0, judges: [{ n: 'Judge 1', s: 1.87 }, { n: 'Judge 2', s: 1.88 }, { n: 'Judge 3', s: 1.89 }], notes: 'Engaging routine filled with confidence. Eye contact fades at times along with those facials. Energy starts off nicely then it fades and appears at the end of dance. Consistency is the key.' },
  ],
  deductions1: [],
  // ── Day 2 (Finals) — RS 47.80 · DED 0 · PS 95.60 · 5th/9 ──
  totals: {
    raw: 95.60,
    deductions: 0,
    final: 95.60,
    placement: 5,
    of: 9,
  },
  categories: [
    { id: 'stunts',  name: 'Stunt',                   of: 10.0, d: 4.50, e: 3.75, d_of: 4.5, e_of: 4.0, judges: [{ n: 'Judge 1', s: 9.60 }, { n: 'Judge 2', s: 9.63 }, { n: 'Judge 3', s: 9.67 }], dod: { of: 0.8, score: 0.74 }, max: { of: 0.7, score: 0.64 }, notes: 'Top Person – Minor break in control during transition with legs not locked out on single leg stunts variations' },
    { id: 'pyramid', name: 'Pyramid',                  of:  8.0, d: 3.80, e: 3.80, d_of: 4.0, e_of: 4.0, judges: [{ n: 'Judge 1', s: 7.58 }, { n: 'Judge 2', s: 7.60 }, { n: 'Judge 3', s: 7.62 }], notes: 'Excellent control maintained throughout with stunts remaining strong and clean.' },
    { id: 'tosses',  name: 'Toss',            of:  4.0, d: 2.00, e: 1.88, d_of: 2.0, e_of: 2.0, judges: [{ n: 'Judge 1', s: 3.86 }, { n: 'Judge 2', s: 3.88 }, { n: 'Judge 3', s: 3.90 }], notes: 'Both tosses hit; max difficulty landed clean' },
    { id: 'st',      name: 'Standing Tumbling',        of:  8.0, d: 3.00, e: 3.78, d_of: 3.0, e_of: 4.0, judges: [{ n: 'Judge 1', s: 7.64 }, { n: 'Judge 2', s: 7.66 }, { n: 'Judge 3', s: 7.68 }], dod: { of: 1.0, score: 0.88 }, notes: 'Body Control - Several athletes are leading knees and have flexed feet in back walkover skills.' },
    { id: 'rt',      name: 'Running Tumbling',         of:  8.0, d: 3.00, e: 3.78, d_of: 3.0, e_of: 4.0, judges: [{ n: 'Judge 1', s: 7.65 }, { n: 'Judge 2', s: 7.67 }, { n: 'Judge 3', s: 7.70 }], dod: { of: 0.5, score: 0.46 }, max: { of: 0.5, score: 0.43 }, notes: 'Body Control - Athletes ar not engaging leg muscles and pointed toes in back walkover skills creating bent knees when skill is being performed. Ensure athletes are driving with hips and straight legs in front walkover skills.' },
    { id: 'jumps',   name: 'Jumps',                    of:  4.0, d: 2.00, e: 1.93, d_of: 2.0, e_of: 2.0, judges: [{ n: 'Judge 1', s: 3.91 }, { n: 'Judge 2', s: 3.93 }, { n: 'Judge 3', s: 3.95 }], notes: 'Arm Placement - Not all arms are uniformed in hurdlers\nLeg Placement - Lack of flexibility causing low front leg placement in hurdlers. Lack if hip rotation in toe touch skills.' },
    { id: 'rc',      name: 'Routine Creativity',       of:  2.0, d: 1.83, d_of: 2.0, judges: [{ n: 'Judge 1', s: 1.82 }, { n: 'Judge 2', s: 1.83 }, { n: 'Judge 3', s: 1.84 }], notes: 'Rushed routine, maintain a steady pace and all move through those pathways seamlessly. Running noted with athletes from the right side into background work and rushing into right side of after stunt group work. Nice job with those visual elements from rippling of stunt groups to background work at the beginning with structure work to background work during jumps.' },
    { id: 'ft',      name: 'Formations & Transitions', of:  2.0, d: 1.97, d_of: 2.0, judges: [{ n: 'Judge 1', s: 1.96 }, { n: 'Judge 2', s: 1.97 }, { n: 'Judge 3', s: 1.98 }], notes: 'no obvious issues were noted.' },
    { id: 'dance',   name: 'Dance',                    of:  2.0, d: 0.90, e: 0.88, d_of: 1.0, e_of: 1.0, judges: [{ n: 'Judge 1', s: 1.77 }, { n: 'Judge 2', s: 1.78 }, { n: 'Judge 3', s: 1.79 }], notes: 'Fast paced transition into dance but control rushing those motions as some are being cut short of their precise placement. Single arm motion varies as well as synchronization is off. Watch motions as you move from one formation to the next.' },
    { id: 'show',    name: 'Showmanship',              of:  2.0, d: 1.85, d_of: 2.0, judges: [{ n: 'Judge 1', s: 1.84 }, { n: 'Judge 2', s: 1.85 }, { n: 'Judge 3', s: 1.86 }], notes: 'Engaging routine filled with confidence. Eye contact fades at times along with those facials. Energy starts off nicely then it fades and appears at the end of dance. Consistency is the key.' },
  ],
  deductions: [],
  sectionNotes: {
    building: 'Strong use of multipole creative elements throughout the routine with a consistent pace and flow.',
    tumbling: 'Good use of variety in patterns to highlight tumbling skills performed. Some skills lacked clarity which took away from visual effect.',
  },
  deductionCards: [
    { type: 'deduction', name: 'Athlete Fall', amount: 0.15, note: 'center athlete fell during BHS during pyramid' },
    { type: 'warning', name: 'Building Out of Level', note: 'VT 1:32 – Lacks required spotter' },
    { type: 'warning', name: 'Building Out of Level', note: 'VT 1:42 – Lacked required spotter' },
    { type: 'warning', name: 'Building Out of Level', note: 'VT 2:17 – Lacks required spotter' },
  ],
  // Leaderboard — ranked by 2-day event score (ES)
  // Day 1 = Prelims, Day 2 = Finals. All teams hit full DOD/MAX bonuses
  // except California Storm Day 2 (dropped stunt DOD skill, 0.20/0.80).
  leaderboard: [
    { rank: 1, name: 'Royal Heirs',   gym: 'Fierce Cheer Elite',       score: 97.82, deductions: 0.25, score1: 97.80, deductions1: 0,
      catSub:  { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
    { rank: 2, name: 'VICIOUS',       gym: 'WC Fame Allstars',         score: 97.73, deductions: 0,    score1: 96.38, deductions1: 0.75,
      catSub:  { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
    { rank: 3, name: 'Turquoise',     gym: 'Almaden Spirit',           score: 96.33, deductions: 1.00, score1: 97.00, deductions1: 0,
      catSub:  { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
    { rank: 4, name: 'Heat',          gym: 'Champion Cheer Athletics', score: 96.13, deductions: 0,    score1: 95.87, deductions1: 0,
      catSub:  { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
    { rank: 5, name: 'Electra',       gym: 'NorCal Elite · S.J.',      score: 95.60, deductions: 0,    score1: 95.00, deductions1: 0, us: true },
    { rank: 6, name: 'Pink Diamonds', gym: 'West Coast Icons',         score: 96.00, deductions: 0,    score1: 93.07, deductions1: 2.00,
      catSub:  { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
    { rank: 7, name: 'Firestorm',     gym: 'Las Vegas Elements',       score: 96.07, deductions: 0,    score1: 91.82, deductions1: 2.25,
      catSub:  { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
    { rank: 8, name: 'HEAT',          gym: 'Univ All Stars',           score: 93.75, deductions: 0.25, score1: 94.00, deductions1: 0,
      catSub:  { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
    { rank: 9, name: 'HEAT',          gym: 'California Storm',         score: 85.88, deductions: 3.25, score1: 97.62, deductions1: 0.25,
      catSub:  { stunts: { dod: 0.20, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } },
      catSub1: { stunts: { dod: 0.80, max: 0.70 }, st: { dod: 1.00 }, rt: { dod: 0.50, max: 0.50 } } },
  ],
};

// ============================================================
// SCORESHEET — Bay City Brawl (2-day event · Day 1 complete · Day 2 pending)
// ============================================================
const SCORESHEET_BCB = {
  compId: 'bcb-2026',
  comp: 'Bay City Brawl',
  city: 'Daly City, CA',
  date: '2026-11-14',
  division: 'L2 Senior Small',
  pendingDay2: true,  // Day 1 complete; Day 2 has not been scored yet
  // ── Day 1 (Prelims) — RS 44.60 · DED 0.25 · PS 88.95 · 3rd/9 ──
  totals1: {
    raw: 89.20,
    deductions: 0.25,
    final: 88.95,
    placement: 3,
    of: 9,
  },
  categories1: [
    { id: 'stunts',  name: 'Stunt',                   of: 10.0, d: 4.20, e: 3.40, d_of: 4.5, e_of: 4.0, judges: [{n:'Judge 1',s:8.83},{n:'Judge 2',s:8.85},{n:'Judge 3',s:8.87}], dod: {of:0.8,score:0.65}, max: {of:0.7,score:0.60} },
    { id: 'pyramid', name: 'Pyramid',                  of:  8.0, d: 3.70, e: 3.62, d_of: 4.0, e_of: 4.0, judges: [{n:'Judge 1',s:7.30},{n:'Judge 2',s:7.32},{n:'Judge 3',s:7.34}] },
    { id: 'tosses',  name: 'Toss',            of:  4.0, d: 1.85, e: 1.75, d_of: 2.0, e_of: 2.0, judges: [{n:'Judge 1',s:3.58},{n:'Judge 2',s:3.60},{n:'Judge 3',s:3.62}] },
    { id: 'st',      name: 'Standing Tumbling',        of:  8.0, d: 3.00, e: 3.22, d_of: 3.0, e_of: 4.0, judges: [{n:'Judge 1',s:7.08},{n:'Judge 2',s:7.10},{n:'Judge 3',s:7.12}], dod: {of:1.0,score:0.88} },
    { id: 'rt',      name: 'Running Tumbling',         of:  8.0, d: 3.00, e: 3.12, d_of: 3.0, e_of: 4.0, judges: [{n:'Judge 1',s:6.98},{n:'Judge 2',s:7.00},{n:'Judge 3',s:7.02}], dod: {of:0.5,score:0.47}, max: {of:0.5,score:0.41} },
    { id: 'jumps',   name: 'Jumps',                    of:  4.0, d: 1.75, e: 1.77, d_of: 2.0, e_of: 2.0, judges: [{n:'Judge 1',s:3.50},{n:'Judge 2',s:3.52},{n:'Judge 3',s:3.54}] },
    { id: 'rc',      name: 'Routine Creativity',       of:  2.0, d: 1.82, d_of: 2.0, judges: [{n:'Judge 1',s:1.81},{n:'Judge 2',s:1.82},{n:'Judge 3',s:1.83}] },
    { id: 'ft',      name: 'Formations & Transitions', of:  2.0, d: 1.88, d_of: 2.0, judges: [{n:'Judge 1',s:1.87},{n:'Judge 2',s:1.88},{n:'Judge 3',s:1.89}] },
    { id: 'dance',   name: 'Dance',                    of:  2.0, d: 0.87, e: 0.85, d_of: 1.0, e_of: 1.0, judges: [{n:'Judge 1',s:1.71},{n:'Judge 2',s:1.72},{n:'Judge 3',s:1.73}] },
    { id: 'show',    name: 'Showmanship',              of:  2.0, d: 1.79, d_of: 2.0, judges: [{n:'Judge 1',s:1.78},{n:'Judge 2',s:1.79},{n:'Judge 3',s:1.80}] },
  ],
  // Category sums: 8.85+7.32+3.60+7.10+7.00+3.52+1.82+1.88+1.72+1.79 = 44.60 → RS 44.60 · raw 89.20 ✓
  deductions1: [{ reason: 'Out of bounds', amount: 0.25 }],
  // Provisional leaderboard — Day 1 standings (Day 2 not yet played)
  // score/deductions mirror score1/deductions1 for CompareView compatibility
  leaderboard: [
    { rank: 1, name: 'Reign',     gym: 'Bay City Allstars',      score1: 92.15, deductions1: 0,    score: 92.15, deductions: 0,
      catSub1: { stunts: { dod: 0.72, max: 0.65 }, st: { dod: 0.92 }, rt: { dod: 0.49, max: 0.45 } } },
    { rank: 2, name: 'Ice',       gym: 'Pacific Wave Cheer',     score1: 90.48, deductions1: 0,    score: 90.48, deductions: 0,
      catSub1: { stunts: { dod: 0.71, max: 0.63 }, st: { dod: 0.90 }, rt: { dod: 0.48, max: 0.44 } } },
    { rank: 3, name: 'Electra',   gym: 'NorCal Elite · S.J.',    score1: 88.95, deductions1: 0.25, score: 88.95, deductions: 0.25, us: true },
    { rank: 4, name: 'Voltage',   gym: 'Summit Cheer',           score1: 88.12, deductions1: 0,    score: 88.12, deductions: 0,
      catSub1: { stunts: { dod: 0.65, max: 0.58 }, st: { dod: 0.86 }, rt: { dod: 0.47, max: 0.41 } } },
    { rank: 5, name: 'Gold Rush', gym: 'Golden State Spirit',    score1: 87.63, deductions1: 0,    score: 87.63, deductions: 0,
      catSub1: { stunts: { dod: 0.63, max: 0.55 }, st: { dod: 0.85 }, rt: { dod: 0.46, max: 0.40 } } },
    { rank: 6, name: 'Storm',     gym: 'East Bay Elite',         score1: 86.20, deductions1: 0,    score: 86.20, deductions: 0,
      catSub1: { stunts: { dod: 0.60, max: 0.52 }, st: { dod: 0.83 }, rt: { dod: 0.45, max: 0.39 } } },
    { rank: 7, name: 'Emerald',   gym: 'Coastal Cheer Co.',      score1: 84.55, deductions1: 0,    score: 84.55, deductions: 0,
      catSub1: { stunts: { dod: 0.58, max: 0.50 }, st: { dod: 0.80 }, rt: { dod: 0.44, max: 0.38 } } },
    { rank: 8, name: 'Nitro',     gym: 'Premier Athletics West', score1: 83.90, deductions1: 0,    score: 83.90, deductions: 0,
      catSub1: { stunts: { dod: 0.55, max: 0.48 }, st: { dod: 0.78 }, rt: { dod: 0.43, max: 0.37 } } },
    { rank: 9, name: 'Blaze',     gym: 'Bay Area Allstars',      score1: 81.25, deductions1: 2.00, score: 81.25, deductions: 2.00,
      catSub1: { stunts: { dod: 0.60, max: 0.52 }, st: { dod: 0.82 }, rt: { dod: 0.45, max: 0.40 } } },
  ],
};

// Map compId → scoresheet
const SCORESHEETS = {
  'volt-2026': SCORESHEET,
  'bcb-2026':  SCORESHEET_BCB,
};

// ============================================================
// SEASON RANGE — for calendar
// ============================================================
const SEASON_MONTHS = (() => {
  const months = [];
  for (let i = 0; i < 13; i++) {
    months.push(new Date(2026, 4 + i, 1)); // May 2026 → May 2027
  }
  return months;
})();

Object.assign(window, {
  TODAY, ATHLETE, TEAM, SCHEDULE, COMPETITIONS, SCORESHEET, SCORESHEET_BCB, SCORESHEETS,
  COMP_BY_DATE, SEASON_MONTHS,
});
