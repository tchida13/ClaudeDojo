import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../src/data/questions/', import.meta.url).pathname;
const limits = { 'CCAO-F': 7, 'CCDV-F': 8, 'CCAR-F': 5, 'CCAR-P': 7 };
const scenarios = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const errors = [];
const ids = new Set();
let total = 0;

for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const qs = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const counts = {};
  for (const q of qs) {
    total++;
    const e = (m) => errors.push(`${f} ${q.id}: ${m}`);
    if (ids.has(q.id)) e('duplicate id');
    ids.add(q.id);
    if (!(q.exam in limits)) e('bad exam');
    if (!f.toLowerCase().startsWith(String(q.exam).toLowerCase())) e('exam/file mismatch');
    if (!Number.isInteger(q.domain) || q.domain < 1 || q.domain > limits[q.exam]) e('bad domain');
    counts[q.domain] = (counts[q.domain] ?? 0) + 1;
    for (const k of ['stem', 'explanation']) if (!q[k]?.ja?.trim() || !q[k]?.en?.trim()) e(`${k} missing ja/en`);
    if (!Array.isArray(q.options) || q.options.length < 4 || q.options.length > 6) e('options must be 4-6');
    const oids = (q.options ?? []).map((o) => o.id);
    if (new Set(oids).size !== oids.length) e('duplicate option ids');
    for (const o of q.options ?? []) if (!o.ja?.trim() || !o.en?.trim()) e(`option ${o.id} missing ja/en`);
    if (!Array.isArray(q.answer) || !q.answer.length || !q.answer.every((a) => oids.includes(a))) e('answer not in options');
    if (!['single', 'multiple'].includes(q.type)) e('bad type');
    if (q.type === 'single' && (q.answer?.length !== 1 || q.select !== 1)) e('single must have 1 answer & select=1');
    if (q.type === 'multiple' && (q.answer?.length < 2 || q.select !== q.answer?.length)) e('multiple: select must equal answer length (>=2)');
    if (q.exam === 'CCAR-F' && !scenarios.includes(q.scenarioId)) e('CCAR-F needs scenarioId S1-S6');
    if (q.exam !== 'CCAR-F' && q.scenarioId) e('scenarioId only for CCAR-F');
    for (const [k, v] of Object.entries(q.optionRationale ?? {})) {
      if (!oids.includes(k) || q.answer.includes(k)) e(`optionRationale key ${k} must be a wrong option`);
      if (!v.ja || !v.en) e(`optionRationale ${k} missing ja/en`);
    }
  }
  console.log(`${f}: ${qs.length} questions; by domain`, counts);
}
console.log(`total ${total}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('OK');
