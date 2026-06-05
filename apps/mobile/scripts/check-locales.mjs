import en from "../src/locales/en.json" with { type: "json" };
import uz from "../src/locales/uz.json" with { type: "json" };
import ru from "../src/locales/ru.json" with { type: "json" };

function flatKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flatKeys(value, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

const locales = { en, uz, ru };
const base = flatKeys(en);
let failed = false;

for (const [code, data] of Object.entries(locales)) {
  if (code === "en") continue;
  const keys = new Set(flatKeys(data));
  const missing = base.filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !base.includes(k));
  if (missing.length) {
    failed = true;
    console.error(`[${code}] missing ${missing.length} key(s):`, missing.join(", "));
  }
  if (extra.length) {
    failed = true;
    console.error(`[${code}] extra ${extra.length} key(s):`, extra.join(", "));
  }
}

if (failed) {
  process.exit(1);
}

console.log(`Locales OK: en/uz/ru share ${base.length} translation keys.`);
