# Fabric A4 排版工具開發計畫 (Development Plan)

## 1. 系統架構設計

本專案採用 **模組化純前端架構**，將核心邏輯封裝於單一 class 中，透過組態設定驅動行為。

### 1.1 目錄結構
```
fabric-a4-layout/
├── src/
│   ├── js/
│   │   └── fabric.FabricA4Layout.js  # 核心邏輯 (View + Model + Controller)
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

1.  **建構區 (Constructor)**: 參數驗證、DPI 換算、初始狀態設定。
2.  **初始化區 (Init)**: Fabric Canvas 實例化（關閉 Retina 縮放以確保 1:1 精確度）、事件綁定入口 (`bindControls`)。
3.  **資源區 (Resource)**: `fetchImages()` 負責讀取符合規格的 JSON 並進行資料正規化。
4.  **UI 渲染區 (Render)**: 
    - `renderSidebar()` 負責側邊欄 DOM 操作與狀態更新。
    - `updateStatusDisplay()` / `showError()` 負責資訊反饋。
5.  **畫布操作區 (Canvas Ops)**:
    -   `addImageToCanvas()`: 圖片實例化、屬性設定與**自訂控制項注入**。
    -   `setupLayout()`: 背景頁面繪製（白色實心矩形帶邊框）、Canvas 尺寸動態更新與 `calcOffset`。
    -   `addPage()` / `removePage()`: 動態調整總頁數，移除頁面時自動清理物件。
6.  **邏輯演算區 (Logic)**:
    -   `toggleOrientation()`: 採用 **中心點座標映射 (Center-point Mapping)** 演算法，確保物件在旋轉時相對於紙張的視覺位置一致。
    -   `enforceUniqueness()`: 掃描畫布並移除重複物件。
7.  **自訂控制項區 (Extensions)**:
    -   `setupCustomControls()`: 針對個別物件注入按鈕。
    -   **配置**: Rotate 90 (TL), Delete (TR), Grayscale (BL)。
    -   **優化項目**: 採用「內縮 (Inset)」定位，擴大點擊判定區 (28x28) 並增加實心底色。
8.  **持久化區 (Persistence)**: 
    -   `save()`: 序列化畫布狀態。
    -   `load()`: 反序列化，包含重複圖片檢查與略過機制。
9.  **銷毀區 (Cleanup)**: `destroy()` 負責釋放 Fabric 資源，支援畫布重置。

---

## 2. 實作策略

### 2.1 座標系統與旋轉模擬
-   **策略**: 採用「中心點映射」邏輯。
-   **基準點**: 全域強制使用 `originX: 'left', originY: 'top'` 以符合排版直覺。

### 2.2 影像處理與優化
-   **效能**: 濾鏡應用（如灰階）採用 `setTimeout` 非同步處理，並在處理期間變換滑鼠游標為 `wait`，提供良好的 UX 反饋。
-   **高解析度支援**: 針對高 DPI 螢幕，強制設定 `enableRetinaScaling: false` 以確保 CSS 像素與畫布像素 1:1 匹配，解決版面偏移問題。

### 2.3 高度可配置性 (Configurability)
-   **UI 解耦**: 透過 `config.buttons` 映射按鈕 ID，不強制依賴特定 HTML 結構。
-   **反饋機制**: 支援 `errorDisplayId` 與 `statusDisplayId`，將內部狀態輸出至外部 DOM。

---

## 3. 開發階段 (Phases)

*   **Phase 1: 基礎建設 (Infrastructure)** - [Done]
    *   Vite & SASS 環境、CSS Reset。

*   **Phase 2: 核心排版引擎 (Layout Core)** - [Done]
    *   多頁背景繪製、DPI 動態換算、頁面增減。

*   **Phase 3: 圖片與互動 (Interactions)** - [Done]
    *   符合規格的 API 串接、側邊欄、唯一性限制。

*   **Phase 4: 進階控制 (Advanced Controls)** - [Done]
    *   Rotate 90 (TL), Delete (TR), Grayscale (BL) 內縮控制項實作。

*   **Phase 5: 旋轉與座標轉換 (Rotation Algo)** - [Done]
    *   中心點映射演算法驗證。

*   **Phase 6: 系統設定與重置 (System)** - [Done]
    *   Settings 彈窗實作、DPI/PX 同步換算、Canvas 銷毀與重啟。
    *   不重複限制整合至設定中。

*   **Phase 7: 元件封裝 (Encapsulation)** - [Done]
    *   實作 `bindControls` 與 Config 介面，提升元件重用性。
