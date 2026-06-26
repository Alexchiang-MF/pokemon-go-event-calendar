# Pokémon GO 活動行事曆總覽

一頁掌握社群日、團體戰、聚焦時刻、季節/特殊活動,並可部署到線上分享連結給其他寶友。

## 檔案結構

| 檔案 | 用途 |
|------|------|
| `index.html` | 網頁本體(介面 + 程式邏輯),不用改 |
| `events.js`  | **唯一要維護的檔案** — 在這裡新增/修改活動 |
| `README.md`  | 本說明 |

## 怎麼更新活動

打開 `events.js`,照範例新增一筆 `{ ... }`,存檔後重新整理網頁即可。
類型只能填:`community`(社群日)、`raid`(團體戰)、`spotlight`(聚焦時刻)、`special`(季節/特殊)。
時間格式:`"YYYY-MM-DD HH:mm"`,用台灣時間。過期活動會自動變灰排到最後。

## 本機預覽

直接用瀏覽器打開 `index.html` 即可(雙擊檔案)。

## 部署到線上(取得可分享的網址)

三種免費方案,擇一即可。資料更新後重新上傳/推送就會更新。

### 方案 A:Netlify Drop(最簡單,免帳號技術)
1. 前往 <https://app.netlify.com/drop>
2. 把整個 `pokemon go` 資料夾拖進網頁
3. 立刻得到一個網址,把連結分享給寶友
4. 之後要更新,改完 `events.js` 後在該站台的 Deploys 頁面再拖一次即可

### 方案 B:GitHub Pages(適合長期維護)
1. 建立一個 GitHub repo,把這三個檔案上傳
2. Settings → Pages → Source 選 `main` 分支、根目錄
3. 取得 `https://<帳號>.github.io/<repo>/` 網址
4. 之後 `git push` 即自動更新

### 方案 C:Vercel
1. 前往 <https://vercel.com>,Import 這個資料夾或 GitHub repo
2. 不需任何設定,直接 Deploy
3. 取得網址分享

## 自訂

- 想換配色:改 `index.html` 最上方 `:root` 裡的 CSS 變數
- 想改標題/說明:改 `index.html` 的 `<header>` 區塊
