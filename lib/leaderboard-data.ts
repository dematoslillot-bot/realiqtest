// Country IQ leaderboard data
// IQ averages based on published cross-national studies (Lynn & Becker 2019, etc.)
// Test counts are realistic estimates based on internet penetration × population

export type Region = "Asia" | "Europe" | "Americas" | "Oceania" | "Africa & Middle East";

export interface CountryEntry {
  rank: number;
  flag: string;
  name: string;
  code: string;          // ISO 3166-1 alpha-2
  avgIQ: number;
  tests: number;
  region: Region;
}

// Timezone → country code mapping for auto-detection
export const TIMEZONE_TO_CODE: Record<string, string> = {
  // Americas
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US",
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Winnipeg": "CA",
  "America/Halifax": "CA", "America/St_Johns": "CA",
  "America/Mexico_City": "MX", "America/Monterrey": "MX", "America/Merida": "MX",
  "America/Sao_Paulo": "BR", "America/Fortaleza": "BR", "America/Manaus": "BR",
  "America/Argentina/Buenos_Aires": "AR", "America/Argentina/Cordoba": "AR",
  "America/Bogota": "CO", "America/Lima": "PE", "America/Santiago": "CL",
  "America/Caracas": "VE", "America/Guayaquil": "EC",
  // Europe
  "Europe/London": "GB", "Europe/Dublin": "IE",
  "Europe/Paris": "FR", "Europe/Zurich": "CH",
  "Europe/Berlin": "DE", "Europe/Vienna": "AT",
  "Europe/Amsterdam": "NL", "Europe/Brussels": "BE",
  "Europe/Madrid": "ES", "Europe/Lisbon": "PT",
  "Europe/Rome": "IT", "Europe/Athens": "GR",
  "Europe/Warsaw": "PL", "Europe/Prague": "CZ",
  "Europe/Budapest": "HU", "Europe/Bucharest": "RO",
  "Europe/Stockholm": "SE", "Europe/Oslo": "NO",
  "Europe/Helsinki": "FI", "Europe/Copenhagen": "DK",
  "Europe/Moscow": "RU", "Europe/Kyiv": "UA",
  "Europe/Sofia": "BG",
  // Asia
  "Asia/Shanghai": "CN", "Asia/Beijing": "CN", "Asia/Chongqing": "CN",
  "Asia/Tokyo": "JP", "Asia/Osaka": "JP",
  "Asia/Seoul": "KR",
  "Asia/Taipei": "TW",
  "Asia/Singapore": "SG",
  "Asia/Hong_Kong": "HK",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Mumbai": "IN",
  "Asia/Jakarta": "ID", "Asia/Makassar": "ID", "Asia/Jayapura": "ID",
  "Asia/Manila": "PH",
  "Asia/Bangkok": "TH",
  "Asia/Ho_Chi_Minh": "VN", "Asia/Hanoi": "VN",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Karachi": "PK", "Asia/Lahore": "PK",
  "Asia/Tehran": "IR",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Jerusalem": "IL", "Asia/Tel_Aviv": "IL",
  "Asia/Istanbul": "TR",
  // Oceania
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
  "Australia/Perth": "AU", "Australia/Adelaide": "AU",
  "Pacific/Auckland": "NZ",
  // Africa
  "Africa/Cairo": "EG",
  "Africa/Lagos": "NG",
  "Africa/Johannesburg": "ZA",
};

const RAW: Omit<CountryEntry, "rank">[] = [
  { flag:"🇸🇬", name:"Singapore",       code:"SG", avgIQ:108, tests:41200, region:"Asia" },
  { flag:"🇭🇰", name:"Hong Kong",       code:"HK", avgIQ:108, tests:28600, region:"Asia" },
  { flag:"🇹🇼", name:"Taiwan",          code:"TW", avgIQ:106, tests:31400, region:"Asia" },
  { flag:"🇰🇷", name:"South Korea",     code:"KR", avgIQ:106, tests:54300, region:"Asia" },
  { flag:"🇨🇳", name:"China",           code:"CN", avgIQ:105, tests:89200, region:"Asia" },
  { flag:"🇯🇵", name:"Japan",           code:"JP", avgIQ:105, tests:62100, region:"Asia" },
  { flag:"🇫🇮", name:"Finland",         code:"FI", avgIQ:101, tests:14800, region:"Europe" },
  { flag:"🇳🇱", name:"Netherlands",     code:"NL", avgIQ:101, tests:22400, region:"Europe" },
  { flag:"🇨🇭", name:"Switzerland",     code:"CH", avgIQ:101, tests:18200, region:"Europe" },
  { flag:"🇮🇹", name:"Italy",           code:"IT", avgIQ:100, tests:38700, region:"Europe" },
  { flag:"🇩🇪", name:"Germany",         code:"DE", avgIQ:100, tests:47300, region:"Europe" },
  { flag:"🇦🇹", name:"Austria",         code:"AT", avgIQ:100, tests:12600, region:"Europe" },
  { flag:"🇸🇪", name:"Sweden",          code:"SE", avgIQ:100, tests:17900, region:"Europe" },
  { flag:"🇬🇧", name:"United Kingdom",  code:"GB", avgIQ:100, tests:58400, region:"Europe" },
  { flag:"🇮🇪", name:"Ireland",         code:"IE", avgIQ:100, tests:11200, region:"Europe" },
  { flag:"🇧🇪", name:"Belgium",         code:"BE", avgIQ:99,  tests:14600, region:"Europe" },
  { flag:"🇩🇰", name:"Denmark",         code:"DK", avgIQ:99,  tests:9800,  region:"Europe" },
  { flag:"🇳🇴", name:"Norway",          code:"NO", avgIQ:99,  tests:11400, region:"Europe" },
  { flag:"🇨🇿", name:"Czech Republic",  code:"CZ", avgIQ:99,  tests:13900, region:"Europe" },
  { flag:"🇦🇺", name:"Australia",       code:"AU", avgIQ:99,  tests:34600, region:"Oceania" },
  { flag:"🇵🇱", name:"Poland",          code:"PL", avgIQ:99,  tests:24100, region:"Europe" },
  { flag:"🇳🇿", name:"New Zealand",     code:"NZ", avgIQ:99,  tests:9400,  region:"Oceania" },
  { flag:"🇨🇦", name:"Canada",          code:"CA", avgIQ:99,  tests:41800, region:"Americas" },
  { flag:"🇫🇷", name:"France",          code:"FR", avgIQ:98,  tests:42300, region:"Europe" },
  { flag:"🇺🇸", name:"United States",   code:"US", avgIQ:98,  tests:134700,region:"Americas" },
  { flag:"🇭🇺", name:"Hungary",         code:"HU", avgIQ:98,  tests:11700, region:"Europe" },
  { flag:"🇱🇺", name:"Luxembourg",      code:"LU", avgIQ:97,  tests:3100,  region:"Europe" },
  { flag:"🇮🇱", name:"Israel",          code:"IL", avgIQ:97,  tests:16800, region:"Africa & Middle East" },
  { flag:"🇺🇦", name:"Ukraine",         code:"UA", avgIQ:97,  tests:18400, region:"Europe" },
  { flag:"🇷🇺", name:"Russia",          code:"RU", avgIQ:97,  tests:46200, region:"Europe" },
  { flag:"🇪🇸", name:"Spain",           code:"ES", avgIQ:97,  tests:36900, region:"Europe" },
  { flag:"🇷🇴", name:"Romania",         code:"RO", avgIQ:94,  tests:12800, region:"Europe" },
  { flag:"🇻🇳", name:"Vietnam",         code:"VN", avgIQ:94,  tests:21600, region:"Asia" },
  { flag:"🇧🇬", name:"Bulgaria",        code:"BG", avgIQ:94,  tests:8200,  region:"Europe" },
  { flag:"🇵🇹", name:"Portugal",        code:"PT", avgIQ:93,  tests:13200, region:"Europe" },
  { flag:"🇲🇾", name:"Malaysia",        code:"MY", avgIQ:92,  tests:18700, region:"Asia" },
  { flag:"🇬🇷", name:"Greece",          code:"GR", avgIQ:92,  tests:12100, region:"Europe" },
  { flag:"🇦🇷", name:"Argentina",       code:"AR", avgIQ:90,  tests:19400, region:"Americas" },
  { flag:"🇹🇭", name:"Thailand",        code:"TH", avgIQ:90,  tests:22300, region:"Asia" },
  { flag:"🇨🇱", name:"Chile",           code:"CL", avgIQ:90,  tests:10600, region:"Americas" },
  { flag:"🇹🇷", name:"Turkey",          code:"TR", avgIQ:89,  tests:28400, region:"Africa & Middle East" },
  { flag:"🇮🇩", name:"Indonesia",       code:"ID", avgIQ:85,  tests:31200, region:"Asia" },
  { flag:"🇦🇪", name:"UAE",             code:"AE", avgIQ:85,  tests:9800,  region:"Africa & Middle East" },
  { flag:"🇵🇪", name:"Peru",            code:"PE", avgIQ:85,  tests:8900,  region:"Americas" },
  { flag:"🇨🇴", name:"Colombia",        code:"CO", avgIQ:84,  tests:14300, region:"Americas" },
  { flag:"🇵🇰", name:"Pakistan",        code:"PK", avgIQ:84,  tests:16400, region:"Asia" },
  { flag:"🇮🇷", name:"Iran",            code:"IR", avgIQ:84,  tests:14800, region:"Africa & Middle East" },
  { flag:"🇲🇽", name:"Mexico",          code:"MX", avgIQ:88,  tests:26700, region:"Americas" },
  { flag:"🇵🇭", name:"Philippines",     code:"PH", avgIQ:83,  tests:18900, region:"Asia" },
  { flag:"🇪🇬", name:"Egypt",           code:"EG", avgIQ:82,  tests:12400, region:"Africa & Middle East" },
  { flag:"🇮🇳", name:"India",           code:"IN", avgIQ:82,  tests:67300, region:"Asia" },
  { flag:"🇧🇷", name:"Brazil",          code:"BR", avgIQ:87,  tests:42100, region:"Americas" },
  { flag:"🇸🇦", name:"Saudi Arabia",    code:"SA", avgIQ:81,  tests:11200, region:"Africa & Middle East" },
  { flag:"🇿🇦", name:"South Africa",    code:"ZA", avgIQ:77,  tests:9600,  region:"Africa & Middle East" },
  { flag:"🇳🇬", name:"Nigeria",         code:"NG", avgIQ:78,  tests:12800, region:"Africa & Middle East" },
];

// Sort by avgIQ descending, assign ranks
export const LEADERBOARD: CountryEntry[] = RAW
  .sort((a, b) => b.avgIQ - a.avgIQ || b.tests - a.tests)
  .map((c, i) => ({ ...c, rank: i + 1 }));

export const TOTAL_TESTS = LEADERBOARD.reduce((s, c) => s + c.tests, 0);

export function getCountryByCode(code: string): CountryEntry | undefined {
  return LEADERBOARD.find(c => c.code === code);
}

export function detectCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_TO_CODE[tz] || "";
  } catch {
    return "";
  }
}
