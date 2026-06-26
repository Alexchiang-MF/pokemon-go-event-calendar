# 交接文件 — Pokémon GO 活動行事曆總覽

> 給「下一個 session」用的操作手冊。看完這份就能直接幫使用者更新活動並部署。

---

## 1. 這是什麼

一個**部署在 GitHub Pages 的靜態網頁工具**,給寶可夢 GO 玩家(及其寶友)掌握活動,並含「飛人(GPS 跳點)環球座標表」。使用者每月會貼新的活動貼文,請你**更新資料 → 自動部署**。

- **線上網址(分享給寶友的就是這個)**:
  **https://alexchiang-mf.github.io/pokemon-go-event-calendar/**
- **GitHub repo**:`Alexchiang-MF/pokemon-go-event-calendar`(公開)
  - https://github.com/Alexchiang-MF/pokemon-go-event-calendar
- **本機資料夾**:`C:\Users\miaof\Desktop\AI2\pokemon go`

---

## 2. 檔案結構

| 檔案 | 用途 | 更新頻率 |
|------|------|----------|
| `index.html` | 網頁本體(UI + 全部 JS 邏輯)。**通常不用動** | 很少 |
| `events.js`  | **活動資料**(每月主要更新這支) | 每月/每次 |
| `hotspots.js`| **飛人全球座標**(28 個時區熱門點 + UTC 時差) | 幾乎不變 |
| `README.md`  | 使用者向的說明 | 少 |
| `handoff.md` | 本文件 | 視需要 |

網頁有兩個分頁:**📅 活動行事曆**(讀 events.js)、**✈️ 全球花點座標**(讀 hotspots.js)。

---

## 3. 標準作業流程(SOP):更新活動

使用者通常會「貼一整串活動貼文(FB 那種自由格式)」並說「更新/加入」。流程:

1. **判讀分類**:把每筆活動歸到下方 5 種 `type` 之一。
2. **編輯 `events.js`**:照既有格式新增/修改 `{ }` 物件(見第 4 節)。
   - 若某活動已存在(例如社群日先前是 placeholder),**更新那一筆,不要新增重複**。
   - 先前用過「活動待公布(日期)」當佔位卡;官方公布後**直接改寫該卡**。
3. **驗證語法**(務必做,避免 JS 壞掉整頁空白):見第 6 節。
4. **部署**:見第 5 節。
5. **線上驗證 + 回報**:抓線上 events.js 確認關鍵字存在、活動筆數合理,再回報使用者網址。

> 資料判讀原則:來源是自由格式,**由你(Claude)判讀最準**(地區限定括號、`*` 異色符號、跨行名單)。這是雙方講好的「方案 A」。

---

## 4. `events.js` 資料格式

```js
{
  title: "社群日:淚眼蜥",          // 必填
  type:  "community",              // 必填,見下表
  start: "2026-07-04 14:00",       // 必填 "YYYY-MM-DD HH:mm" 24h 台灣時間
  end:   "2026-07-04 17:00",       // 必填,同格式
  highlights: ["重點1", "重點2"],   // 選填,字串陣列(條列顯示)
  note: "補充說明一行"             // 選填(卡片底部斜體)
}
```

### type 對應(共 5 類,各有專屬顏色/篩選鈕)

| type | 中文標籤 | 涵蓋 |
|------|---------|------|
| `community` | 社群日 | Community Day |
| `raid` | 團體戰 | 五星 / 超級 / 暗影 / 極巨星期一 / 各種團戰日 |
| `dinner` | 晚餐約會 | 每週三 18:00–19:00 的「團戰時刻」(使用者要求獨立成一類) |
| `spotlight` | 聚焦時刻 | 每週四 Spotlight Hour |
| `special` | 季節/特殊 | 限時調查、週年、GO Fest、慶典等 |

### 時間慣例(原文常沒給精確時段時套用)

- 團戰輪替(週期):當日 `10:00` 開始,結束日「隔天 `10:00`」結束。
- 團戰時刻 / 極巨星期一 / 晚餐約會 / 聚焦時刻:`18:00–19:00`。
- 社群日:`14:00–17:00`。
- 多日特殊活動:`10:00` 起、`20:00` 止(沒明講時)。
- `*` 代表「有機會遇到異色(色違)」,保留在名稱後。
- 「當地時間」型活動(各時區各自 10–20)以台灣時間呈現,並在 `note` 註明「當地時間」。

> 大量名單(如 GO Fest 前哨日 60+ 隻傳說)使用者要求**逐一列出**,依屬性分組成多個 highlights 行(三神鳥/三聖獸/神柱/雲系/究極異獸…),不要只寫摘要。

---

## 5. 部署步驟(GitHub Pages)

在資料夾內依序執行(PowerShell 或 Bash 皆可)。**commit 作者固定用以下身分**,並一律附 Co-Authored-By。

```bash
git add -A
git -c user.name="Alexchiang-MF" -c user.email="miaofang0814@gmail.com" commit -m "更新訊息

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push
```

- `gh` CLI 已登入,**作用中帳號 = Alexchiang-MF**(具 repo 權限)。Pages 已啟用(main 分支根目錄),**推送後約 1–2 分鐘自動重建**,網址不變。
- 等待 + 驗證可用:

```bash
# 等 Pages 建置完成
gh api repos/Alexchiang-MF/pokemon-go-event-calendar/pages/builds/latest --jq '.status'   # 'built' 即完成
```

> 提醒使用者:線上更新後在瀏覽器按 **Ctrl+F5** 強制重整才看得到變化(快取)。

---

## 6. 驗證 events.js / hotspots.js 語法(部署前必做)

`const EVENTS`/`const HOTSPOTS` 是 block-scope,直接 eval 後在外層讀不到 → 要把統計**併進同一段 eval 字串**。範例(寫成暫存 `_check.js` 跑完即刪):

```js
const fs = require('fs');
const src = fs.readFileSync('events.js', 'utf8');
const out = eval(src + ';({ total: EVENTS.length, byType: EVENTS.reduce((a,e)=>{a[e.type]=(a[e.type]||0)+1;return a;},{}) })');
console.log(JSON.stringify(out, null, 1));
```

```powershell
node _check.js; Remove-Item _check.js -Force
```

> 注意:PowerShell 內聯 `node -e "..."` 容易把引號吃掉,**用暫存檔最穩**。

---

## 7. `hotspots.js`(飛人座標)說明

- 28 個熱門點,每點有 `offset`(該地夏季 UTC 時差,可含 .5)。
- 換算公式(程式自動算):**台灣時間 = 當地時間 − offset + 8**。
- 飛人分頁讓使用者選「當地活動時段」(預設 10–20 / 14–17 / 18–19,或自訂),全表自動換算台灣時間並排序、座標點擊複製。
- 換算已對過官方對照圖,**逐列吻合**。
- **季節提醒**:目前 offset 為 **2026 年 7 月夏令值**。約 11 月歐美轉冬令時,部分時差會差 1 小時,屆時需更新 `hotspots.js`。
- 座標複製格式為 `緯度,經度`(無空格)。若使用者定位 App 需要別種格式,改 `index.html` 內 `copy-btn` 的 `data-coord` 來源即可。

---

## 8. 目前內容快照(截至最後一次更新)

- 活動總計 **51 筆**:團體戰 29 · 晚餐約會 9 · 季節特殊 8 · 聚焦時刻 4 · 社群日 1。
- 已含:7 月完整團戰輪替、晚餐約會、聚焦時刻、淚眼蜥社群日、盔甲鳥團戰日(6/27)、週年皮卡丘慶典、維羅博士生日調查、遙想天空等。
- commit 歷史:初版 → 晚餐約會獨立 → 飛人分頁 → 6-7 月活動。

---

## 9. 與使用者的關鍵約定

- 使用者是**飛人**(會 GPS 跳點),所以飛人座標分頁是重點功能,務必維護。
- 更新走**方案 A**:使用者貼原文 → 你判讀更新 → 你**自動部署** → 回報網址。
- 回應一律用**繁體中文(zh-TW)**。
- 部署是使用者明確授權的例行動作,可直接執行(public repo、既有流程)。
