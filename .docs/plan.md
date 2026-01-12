# Fabric A4 排版工具開發計畫 (Development Plan)

## 1. 系統架構設計

本專案採用 **模組化純前端架構**，將核心邏輯封裝於單一 class 中，透過組態設定驅動行為。

### 1.1 目錄結構
```
fabric-a4-layout/
├── src/
│   ├── js/
│   │   ├── fabric.FabricA4Layout.js  # 核心邏輯 (View + Model + Controller)
│   │   └── locale.js                 # 預設語系檔
│   └── scss/
│       └── fabric.FabricA4Layout.scss # 樣式定義與 CSS Reset
├── api/
│   └── images.json                   # 靜態模擬資料 (符合 API_SPEC.md)
├── dist/                             # 建置產出 (Library Mode)
├── index.html                        # 演示頁面 (包含設定對話框)
└── vite.config.js                    # 建置設定
```

### 1.2 模組職責劃分 (`FabricA4Layout` Class)

為避免程式碼過於龐雜，類別內部方法依功能劃分區域：

1.  **建構區 (Constructor)**: 參數驗證、DPI 換算、初始狀態設定、語系合併。
2.  **初始化區 (Init)**: Fabric Canvas 實例化（關閉 Retina 縮放）、事件綁定入口 (`bindControls`)。
3.  **資源區 (Resource)**: `fetchImages()` 負責讀取 API、正規化資料並更新側邊欄。
4.  **UI 渲染區 (Render)**: 
    - `renderSidebar()` 負責側邊欄 DOM 操作與互動邏輯 (Click-to-Add/Remove)。
    - `updateStatusDisplay()` / `showError()` 負責資訊反饋 (支援 DOM ID 指定)。
5.  **畫布操作區 (Canvas Ops)**:
    -   `addImageToCanvas()`: 圖片實例化、自訂控制項注入、自動縮放(95% Fit)、自動流式排版(Flow Layout)與自動換頁。
    -   `setupLayout()`: 背景頁面繪製、Canvas 尺寸更新。
    -   `addPage()` / `removePage()`: 動態調整總頁數。
    -   `clearCanvas()` / `cleanupOutOfBounds()`: 清理畫布物件。
6.  **邏輯演算區 (Logic)**:
    -   `toggleOrientation()`: 中心點座標映射演算法。
    -   `enforceUniqueness()`: 移除重複物件。
7.  **自訂控制項區 (Extensions)**:
    -   `setupCustomControls()`: 注入 Rotate 90 (TL), Delete (TR), Grayscale (BL) 按鈕。
    -   **設定**: 支援 `defaultGrayscale` 組態，新增圖片自動套用灰階濾鏡。
    -   **優化**: 內縮定位、實心底色、游標反饋。
8.  **持久化區 (Persistence)**: `save()` 與 `load()`。
9.  **銷毀區 (Cleanup)**: `destroy()` 釋放資源。

---

## 2. 實作策略

### 2.1 座標系統與旋轉模擬
-   **策略**: 採用「中心點映射」邏輯。
-   **基準點**: 全域強制使用 `originX: 'left', originY: 'top'`。

### 2.2 高度可配置性 (Configurability)
-   **UI 解耦**: 透過 `config.buttons` 映射按鈕 ID，支援 `refreshImages` 與 `clearCanvas`。
-   **反饋機制**: 支援 `errorDisplayId` 與 `statusDisplayId`。
-   **國際化**: 支援 `config.locale` 覆蓋預設文字。

---

## 3. 開發階段 (Phases)

*   **Phase 1: 基礎建設 (Infrastructure)** - [Done]
    *   Vite & SASS 環境、CSS Reset。

*   **Phase 2: 核心排版引擎 (Layout Core)** - [Done]
    *   多頁背景繪製、DPI 動態換算、頁面增減。

*   **Phase 3: 圖片與互動 (Interactions)** - [Done]
    *   API 串接、側邊欄、唯一性限制 (含側邊欄移除功能)。
    *   更新圖片 (含自動清理)。

*   **Phase 4: 進階控制 (Advanced Controls)** - [Done]
    *   Rotate 90 (TL), Delete (TR), Grayscale (BL) 內縮控制項。

*   **Phase 5: 旋轉與座標轉換 (Rotation Algo)** - [Done]
    *   中心點映射演算法。

*   **Phase 6: 系統設定與重置 (System)** - [Done]
    *   Settings 彈窗、不重複限制整合、清除畫布功能。

*   **Phase 7: 元件封裝與語系 (Encapsulation)** - [Done]
    *   實作 `bindControls`、Config 介面與 i18n 語系檔。