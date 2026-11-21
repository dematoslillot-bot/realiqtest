// Countries offered in the test form, with ISO 3166-1 alpha-2 codes.
// Scores are stored with the 2-letter code so the country leaderboard can group them.
export const COUNTRY_LIST: { code: string; name: string }[] = [
  ["AF","Afghanistan"],["AL","Albania"],["DZ","Algeria"],["AR","Argentina"],["AU","Australia"],["AT","Austria"],
  ["BD","Bangladesh"],["BY","Belarus"],["BE","Belgium"],["BO","Bolivia"],["BR","Brazil"],["BG","Bulgaria"],
  ["KH","Cambodia"],["CA","Canada"],["CL","Chile"],["CN","China"],["CO","Colombia"],["HR","Croatia"],
  ["CZ","Czech Republic"],["DK","Denmark"],["EC","Ecuador"],["EG","Egypt"],["ET","Ethiopia"],["FI","Finland"],
  ["FR","France"],["DE","Germany"],["GH","Ghana"],["GR","Greece"],["GT","Guatemala"],["HU","Hungary"],
  ["IN","India"],["ID","Indonesia"],["IR","Iran"],["IQ","Iraq"],["IE","Ireland"],["IL","Israel"],["IT","Italy"],
  ["JP","Japan"],["JO","Jordan"],["KE","Kenya"],["KR","South Korea"],["MY","Malaysia"],["MX","Mexico"],
  ["MA","Morocco"],["NL","Netherlands"],["NZ","New Zealand"],["NG","Nigeria"],["NO","Norway"],["PK","Pakistan"],
  ["PE","Peru"],["PH","Philippines"],["PL","Poland"],["PT","Portugal"],["RO","Romania"],["RU","Russia"],
  ["SA","Saudi Arabia"],["RS","Serbia"],["SG","Singapore"],["ZA","South Africa"],["ES","Spain"],["LK","Sri Lanka"],
  ["SE","Sweden"],["CH","Switzerland"],["TW","Taiwan"],["TH","Thailand"],["TR","Turkey"],["UA","Ukraine"],
  ["AE","United Arab Emirates"],["GB","United Kingdom"],["US","United States"],["VE","Venezuela"],["VN","Vietnam"],
].map(([code, name]) => ({ code, name }));

const BY_CODE = new Map(COUNTRY_LIST.map(c => [c.code, c.name]));
const BY_NAME = new Map(COUNTRY_LIST.map(c => [c.name.toLowerCase(), c.code]));

// Older scores were saved as the first 3 letters of the country name in capitals ("SPA").
// Map those back to a code when the prefix is unique.
const LEGACY_PREFIX = (() => {
  const count = new Map<string, number>();
  for (const c of COUNTRY_LIST) { const p = c.name.slice(0, 3).toUpperCase(); count.set(p, (count.get(p) || 0) + 1); }
  const m = new Map<string, string>();
  for (const c of COUNTRY_LIST) { const p = c.name.slice(0, 3).toUpperCase(); if (count.get(p) === 1) m.set(p, c.code); }
  return m;
})();

export function countryName(code: string): string {
  return BY_CODE.get(code) || code;
}

export function codeFromName(name: string): string {
  return BY_NAME.get((name || "").toLowerCase()) || "";
}

/** Normalise whatever is stored in the scores table to a 2-letter code ("" if unknown). */
export function normaliseCountry(raw: string): string {
  const v = (raw || "").trim().toUpperCase();
  if (v.length === 2 && BY_CODE.has(v)) return v;
  if (v.length === 3 && LEGACY_PREFIX.has(v)) return LEGACY_PREFIX.get(v)!;
  return "";
}

export function flag(code: string) {
  if (!code || code.length !== 2) return "🌍";
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join("");
}

export interface CountryStat { code: string; name: string; avg: number; count: number }

export const MIN_TESTS_FOR_RANK = 3;

/** Average IQ per country from raw score rows. */
export function aggregateCountries(rows: { country: string; score: number }[]): CountryStat[] {
  const acc = new Map<string, { sum: number; n: number }>();
  for (const r of rows) {
    const code = normaliseCountry(r.country);
    if (!code || !Number.isFinite(r.score)) continue;
    const a = acc.get(code) || { sum: 0, n: 0 };
    a.sum += r.score; a.n += 1; acc.set(code, a);
  }
  return [...acc.entries()]
    .map(([code, a]) => ({ code, name: countryName(code), avg: Math.round((a.sum / a.n) * 10) / 10, count: a.n }))
    .sort((x, y) => y.avg - x.avg || y.count - x.count);
}
