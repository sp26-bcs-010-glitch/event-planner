export const MOCK_STATE = {
  plan: {
    venue: { hall: "Hall A", seats: 200, headcount: 177, cost: 120000, generator: false },
    schedule: [
      { start: "10:00", end: "10:30", title: "Registration and welcome" },
      { start: "10:30", end: "12:00", title: "Build session 1" },
      { start: "12:00", end: "12:15", title: "Prayer break" },
      { start: "12:15", end: "12:45", title: "Lunch" },
      { start: "12:45", end: "13:15", title: "Build session 2" },
      { start: "13:15", end: "14:00", title: "Judging (15 min per team)" },
    ],
    food: { menu: "Standard lunch box", people: 177, pricePerHead: 1200, total: 212400 },
    judging: { judges: 20, teams: 50, minutesPerTeam: 15, maxTeamsPerJudge: 3, honorariumEach: 5000 },
    budget: {
      lines: [
        { item: "Venue (Hall A)", amount: 120000 },
        { item: "Food (177 x 1200)", amount: 212400 },
        { item: "Judge honorarium (20 x 5000)", amount: 100000 },
        { item: "Prizes", amount: 100000 },
        { item: "Backup internet", amount: 20000 },
        { item: "Printing", amount: 10000 },
      ],
      total: 562400,
      limit: 650000,
      ok: true,
    },
  },
  checks: [
    { name: "Correct figures", ok: true },
    { name: "Within budget", ok: true },
    { name: "Venue fits", ok: true },
    { name: "Schedule valid", ok: true },
    { name: "Enough judges", ok: true },
    { name: "All areas covered", ok: true },
  ],
  rejected: [
    {
      messageId: 9,
      text: "Caterer: I have rounded your order down to 100 boxes to keep the cost low.",
      reason: "Order of 100 boxes cannot feed 177 people. Plan keeps 177.",
    },
  ],
  ignored: [
    { messageId: 3, reason: "Out of date: replaced by the 12 Nov caterer price." },
    { messageId: 7, reason: "DJ request is not approved and would add Rs 50,000." },
    { messageId: 8, reason: "Judge lateness does not affect the plan." },
  ],
  trace: [
    { n: 1, model: "qwen2.5:3b", area: "reading", input: "Read all 8 messages...", output: '{"headcount": 177, ...}', tokensIn: 850, tokensOut: 210 },
    { n: 2, model: "qwen2.5:3b", area: "food", input: "Caterer prices...", output: "Use Rs 1200 per head", tokensIn: 120, tokensOut: 30 },
  ],
  totalTokens: 1210,
};