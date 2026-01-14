# Fabric A4 Layout Tool

一個基於 **Fabric.js v7** 的模組化 A4 排版引擎。支援單一畫布模擬多頁排版、直/橫向切換、圖片拖曳、不重複檢查以及完整的存取功能。

**新增功能 (v1.1):**

* **自動縮放 (Auto Scale)**: 插入圖片時若超過 A4 尺寸，自動縮小至 95% 頁面大小 (預留出血邊)，未超過則維持原大。
* **流式排版 (Flow Layout)**: 自動偵測上一張圖片位置往下排列；若空間不足，自動新增頁面並排至新頁頂端。
* **預設灰階 (Default Grayscale)**: 可設定新圖片預設為黑白模式。

## 🚀 快速開始 (Quick Start)

### 1. 引入檔案 (Manual Include)

本專案為私人專案，請直接將 `dist/` 資料夾內的檔案複製到您的專案中。

由於本工具依賴 **Fabric.js v7**，請務必在使用前引入 Fabric.js。

```html
<!-- 1. 引入 Fabric.js v7 (必須) -->
<script src="https://cdn.jsdelivr.net/npm/fabric@7.1.0/dist/index.min.js"></script>

<!-- 2. 引入樣式 -->
<link rel="stylesheet" href="dist/css/fabric.FabricA4Layout.min.css">

<!-- 3. 引入本工具 (ES Module 方式) -->
<script type="module">
  import { FabricA4Layout } from './dist/js/fabric.FabricA4Layout.min.js';
  
  // 初始化...
</script>
```

或者使用 UMD 方式 (若非 Module 環境):

```html
<script src="dist/js/fabric.FabricA4Layout.min.js"></script>
<script>
  // FabricA4Layout 會掛載在 window 下 (視 Vite 設定而定，建議使用 ES Module)
</script>
```

### 2. HTML 結構

準備一個 Canvas 容器與操作按鈕：

```html
<div class="toolbar">
    <button id="btn-orientation">轉向</button>
    <button id="btn-save">存檔</button>
</div>

<div class="layout-container">
    <div id="image-sidebar" class="sidebar"></div> <!-- 圖片列表容器 -->
    <div class="canvas-wrapper">
        <canvas id="c"></canvas> <!-- 畫布 ID -->
    </div>
</div>
<!-- 狀態顯示與錯誤訊息 (可選) -->
<div id="status-display"></div>
<div id="error-display"></div>
```

### 3. 初始化

```javascript
const layout = new FabricA4Layout({
    canvasId: 'c',                // 畫布 DOM ID
    apiEndpoint: '/api/images',   // 圖片列表 API
    dpi: 48,                      // 設定解析度
    uniqueImages: false,          // 是否限制圖片不重複
    
    // 綁定 UI 按鈕 (傳入 DOM ID)
    buttons: {
        orientation: 'btn-orientation',
        save: 'btn-save',
        // ... 其他按鈕
    },
    
    // 指定訊息顯示位置 (傳入 DOM ID)
    statusDisplayId: 'status-display',
    errorDisplayId: 'error-display'
});

await layout.init();
```

---

## ⚙️ 初始化設定 (Configuration)

`new FabricA4Layout(config)` 接受以下參數：

| 參數 | 類型 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| `canvasId` | String | `required` | `<canvas>` 元素的 ID。 |
| `apiEndpoint` | String | `required` | 取得圖片列表的 API URL (GET)。 |
| `saveEndpoint`| String | `null` | (選填) 儲存佈局的後端 API URL (POST)。 |
| `dpi` | Number | `48` | 版面解析度，影響像素換算 (範圍 24-192)。 |
| `orientation` | String | `'portrait'` | 初始方向 `'portrait'` (直) 或 `'landscape'` (橫)。 |
| `uniqueImages` | Boolean | `false` | 若為 `true`，同一張圖片僅能被加入畫布一次。 |
| `defaultGrayscale` | Boolean | `false` | 若為 `true`，新加入的圖片自動套用灰階濾鏡。 |
| `saveWithBase64`| Boolean | `false` | 存檔時是否保留圖片的 Base64 資料 (建議 false 以減少傳輸量)。 |
| `data` | Object | `{}` | (選填) 自訂初始化資料，將隨存檔一起送出。 |
| `statusDisplayId`| String | `null` | 指定顯示狀態資訊 (頁數/尺寸) 的 DOM ID。 |
| `errorDisplayId` | String | `null` | 指定顯示錯誤或警告訊息的 DOM ID。 |
| `buttons` | Object | `{}` | UI 按鈕綁定設定 (見下節)。 |

### 按鈕綁定 (Button Binding)

透過 `buttons` 物件將您的 HTML 按鈕 ID 與功能綁定：

```javascript
buttons: {
    orientation: 'btn-rotate',   // 切換直/橫
    addPage: 'btn-add',          // 增加頁數
    removePage: 'btn-del',       // 減少頁數 (刪除末頁物件)
    refreshImages: 'btn-reload', // 重新讀取圖片列表
    save: 'btn-save',            // 觸發存檔 (需配合 onSave)
    load: 'btn-load',            // 觸發讀檔 (需配合 onLoad)
    settings: 'btn-config'       // (可選) 觸發設定彈窗
}
```

---

## 📡 API 資料規格

### 1. 圖片列表 API (`GET /api/images`)

後端需回傳以下 JSON 格式供側邊欄渲染：

```json
{
  "succ": true,
  "error": "",
  "data": [
    {
      "img_id": "101",
      "title": "sample.jpg",
      "url": "https://example.com/img.jpg", 
      "base64": "data:image/jpeg;base64,...",
      "original_width": 1200,
      "original_height": 800
    }
  ]
}
```

* **img_id**: 圖片唯一識別碼 (必須)。
* **url/base64**: 擇一提供，若都有則優先使用 `url`。
* **original_width/height**: **原始圖片像素寬高 (必須)**。系統將以此作為 DPI 換算的基準（預設為 96 DPI）。

### 2. 存檔格式 (`Save Layout`)

呼叫 `save(extraParams)` 後產出的 JSON 結構符合 `API_SPEC.md` 規範：

```json
{
  "data": { 
    "page_pk": "123", 
    "user_note": "急件" 
  },
  "page": {
    "orientation": "P",
    "dpi": 48,
    "width": 397,
    "height": 561,
    "pages": 1
  },
  "items": [
    {
      "seq_no": 1,
      "img_id": 101,
      "page_num": 1,
      "img_setting": {
        "is_grayscale": false,
        "now_width": 100,
        "now_height": 80,
        "left": 10.5,
        "top": 20.0,
        "angle": 0,
        "scaleX": 0.2,
        "scaleY": 0.2,
        "width": 500,
        "height": 400
      }
    }
  ]
}
```

### 3. 讀檔格式 (`Load Layout`)

`load(data)` 方法接受上述存檔格式的 JSON 物件。

* **來源匹配**: 系統會根據 `img_id` 自動從現有的圖片列表中匹配 `url` 或 `base64`。
* **重複檢查**: 若 `uniqueImages: true`，讀檔時會自動略過重複圖片。

---

## 🛠️ 開發與建置

本專案使用 Vite 進行開發與打包。

```bash
# 啟動開發伺服器
npm run dev

# 打包 Library (輸出至 dist/)
npm run build
```

---

## 🛠️ 開發工具說明

本專案由 Gemini CLI (Gemini 3 / auto model) + Vibe coding 開發，Thanks AI。
