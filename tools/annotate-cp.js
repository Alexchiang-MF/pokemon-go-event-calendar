/* =====================================================================
 *  annotate-cp.js  —  自動為 events.js 的寶可夢名稱補上 IV100 CP
 *  ---------------------------------------------------------------------
 *  用途:在 events.js 編輯好「新活動(名稱不含 CP)」後,於 repo 根目錄執行:
 *
 *      node tools/annotate-cp.js
 *
 *  會就地把 highlights / note 字串裡每個對得到的寶可夢名稱
 *  後面補上 (L20/L25)(查 iv100.js),並保留註解與格式。
 *  已標註過的(含 (數字/數字))會跳過,可重複執行(idempotent)。
 *  最後會列出「疑似名稱但對不到」的詞,方便你判斷是否要加別名。
 *
 *  注意:title / type / start / end 與註解行不會被改動。
 * ===================================================================== */
const fs = require('fs');

function loadConst(file, name) {
  return Function(fs.readFileSync(file, 'utf8') + '\nreturn ' + name + ';')();
}
const IV100 = loadConst('iv100.js', 'IV100');

const norm = x => x.replace(/[・\s]/g, '');
const map = {};
IV100.forEach(p => { map[norm(p.n)] = p; });

// 別名:活動常見寫法 -> iv100.js 的繁中名
const alias = {
  '大牙貍': '大牙狸',
  '帕路奇亞(起源形態)': '帕路奇亞(起源)',
  '帝牙盧卡(起源形態)': '帝牙盧卡(起源)',
  '騎拉帝納': '騎拉帝納(別種)',
  '龍捲雲': '龍捲雲(化身)',
  '雷電雲': '雷電雲(化身)',
  '土地雲': '土地雲(化身)',
  '眷戀雲': '眷戀雲(化身)',
  '蒼響(百戰勇者)': '蒼響(英雄)',
  '藏瑪然特(百戰勇者)': '藏瑪然特(英雄)',
  '暗影騎拉帝納(別種型態)': '騎拉帝納(別種)',
  '乘龍': '拉普拉斯',
  '米立龍(上弓姿勢)': '米立龍(下垂)',   // 三姿勢 CP 相同,一律對到已收錄的形態名
  '米立龍(下垂姿勢)': '米立龍(下垂)',
  '米立龍(平挺姿勢)': '米立龍(下垂)',
};
function look(name) {
  const k = alias[name] || name;
  if (map[norm(k)]) return map[norm(k)];
  const k3 = k.replace(/形態\)/g, ')'); // 「(化身形態)/(攻擊形態)…」-> 「(化身)/(攻擊)…」
  if (k3 !== k && map[norm(k3)]) return map[norm(k3)];
  const k2 = k.replace(/^(暗影|超極巨化|極巨化)/, ''); // 暗影/極巨化/超極巨化 用本體 CP
  if (k2 !== k && map[norm(k2)]) return map[norm(k2)];
  return null;
}

// 依頂層「、」切分(不切到 () 與 「」 內)
function splitTop(s) {
  const out = []; let d = 0, q = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') d++;
    else if (ch === ')') d = Math.max(0, d - 1);
    else if (ch === '「') q++;
    else if (ch === '」') q = Math.max(0, q - 1);
    if (ch === '、' && d === 0 && q === 0) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const isNameLike = /^[一-鿿・Ⅰ-ⅿＡ-ｚ♀♂]{2,9}$/;
const unmatched = {};

function annToken(tok) {
  if (!tok.trim()) return tok;
  if (/\(\d+\/\d+\)/.test(tok)) return tok; // 已標註
  const stars = (tok.match(/\*/g) || []).length;
  const star = '*'.repeat(stars);
  const s = tok.replace(/\*/g, '');
  const full = s.trim();
  let p = look(full);
  if (p) return full + '(' + p.l20 + '/' + p.l25 + ')' + star;
  const parens = (s.match(/\([^)]*\)/g) || []).join('');
  const core = s.replace(/\([^)]*\)/g, '').trim();
  p = look(core);
  if (p) return core + '(' + p.l20 + '/' + p.l25 + ')' + parens + star;
  if (isNameLike.test(core)) unmatched[core] = (unmatched[core] || 0) + 1;
  return tok;
}

function annStr(str) {
  let out = splitTop(str).map(annToken).join('、');
  out = out.replace(/「([^」]+)」(?!\(\d+\/\d+\))/g, (m, nm) => {
    const p = look(nm);
    return p ? '「' + nm + '」(' + p.l20 + '/' + p.l25 + ')' : m;
  });
  return out;
}

const raw = fs.readFileSync('events.js', 'utf8');
const lines = raw.split('\n');
let started = false, changed = 0;
const skipKey = /(^|\s)(title|type|start|end)\s*:/;
const out = lines.map(line => {
  if (!started) { if (/const\s+EVENTS\s*=/.test(line)) started = true; return line; }
  const t = line.trim();
  if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return line;
  if (skipKey.test(line)) return line;
  return line.replace(/"((?:[^"\\]|\\.)*)"/g, (m, content) => {
    const a = annStr(content);
    if (a !== content) changed++;
    return '"' + a + '"';
  });
});
fs.writeFileSync('events.js', out.join('\n'));

console.log('已標註字串數:', changed);
const um = Object.entries(unmatched).sort((a, b) => b[1] - a[1]);
if (um.length) {
  console.log('\n疑似名稱但對不到(多為敘述文字,可忽略;若是真名請加 alias):');
  um.forEach(([k, v]) => console.log('  ' + k + '  x' + v));
} else {
  console.log('沒有對不到的疑似名稱。');
}
