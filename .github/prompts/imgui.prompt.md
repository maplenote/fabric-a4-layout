# 📋 專案實作 Prompt：Fabric.js v7 模組化 A4 排版工具 (ES6 Class)

**角色設定**：
你是一位專精於 Canvas 圖形處理與現代 JavaScript (ES6+) 的前端架構師。

**專案目標**：
利用 `Fabric.js v7.1.0` 開發一個 **可重複呼叫的 JS Class 工具 (`FabricA4Layout`)**，用於網頁端 A4 圖片排版。此工具需具備 API 資料串接、圖片控制、特殊的版面流向切換（直向右排 / 橫向下排）以及完整的存取功能。

**環境設定**：

- **核心庫**：Fabric.js (https://github.com/fabricjs/fabric.js/) 目前最新版本 7.1.0 。
- **依賴**：原生 ES6+ (No jQuery, No external CSS frameworks)。

---

## 🛠️ 核心功能需求規格

### 1. 工具初始化與設定 (Configuration)

請建立一個 class `FabricA4Layout`，建構式 (Constructor) 需接受以下參數，設定後即不可修改：

- **頁面寬高設定**：允許使用者設定寬高 px 或 DPI

  - 若用 DPI 設定，預設值為`48`。
  - 可接受的 DPI 範圍為 `24` 至 `192` (含)。
  - **計算方式**：A4 紙張尺寸為 210mm x 297mm，換算成像素為 `(mm / 25.4) * DPI`。
    - _48 DPI 尺寸參考_：短邊 `397px`, 長邊 `561px`。
    - _96 DPI 尺寸參考_：短邊 `794px`, 長邊 `1122px`。
  - **注意事項**：DPI 設定會影響整個版面的尺寸計算精度與圖片解析度，送出時需一併傳給後端。

- **容器 ID**：指定 Canvas 渲染的 DOM ID。
- **初始版面方向**：`'portrait'` (直式) 或 `'landscape'` (橫式)。
- **API 設定**：圖片列表的 API Endpoint。
- **存檔設定**：設定存檔時是否包含 Base64 (預設 `false`，僅傳送 ID)。
- **圖片唯一性設定**：設定是否啟用圖片唯一性限制 (預設 `false`)。若為 `true`，則不允許重複加入同一張圖片。

### 2. 版面流向與動態計算 (Layout Engine)

請實作特殊的 A4 延伸邏輯（使用單一長 / 寬 Canvas 模擬）：

- **直式 A4 (Portrait Mode)**：

  - **定義**：A4 紙張直立擺放。
  - **固定高度**：`561px` (以 48dpi 為例)。
  - **寬度動態計算**：`(A4 寬度 397px + 頁面間距 4px) * 頁數`。
  - **延伸方向**：**向右增加頁數** (Horizontal Scroll)。
  - 背景繪製：在 Canvas 上繪製對應數量的直式白底矩形。

- **橫式 A4 (Landscape Mode)**：
  - **定義**：A4 紙張橫向擺放。
  - **固定寬度**：`561px` (以 48dpi 為例)。
  - **高度動態計算**：`(A4 寬度 397px + 頁面間距 4px) * 頁數`。
  - **延伸方向**：**向下增加頁數** (Vertical Scroll)。
  - 背景繪製：在 Canvas 上繪製對應數量的橫式白底矩形。

### 3. 圖片管理與唯一性控制 (Image Manager)

- **API 載入**：實作 `fetchImages()` 方法，從後端取得 JSON (包含 `id`, `thumbnail_base64`)。
- **UI 渲染**：在 Canvas 旁動態產生圖片列表 (Sidebar)。
- **唯一性邏輯 (Uniqueness)**：
- **依據設定決定行為**：

  - 若 **關閉唯一性** (預設)：
    - 允許同一個圖片 ID 被多次添加到畫布上。
    - 側邊欄圖片始終維持「可使用」狀態，不會變為 Disabled。
  - 若 **啟用唯一性** ：
    - **單一存在**：同一個圖片 ID 在畫布上只能出現一次。
    - **狀態同步**：
      - 當圖片被加到畫布時，側邊欄該圖片應變為「已使用」狀態 (Disabled/Grayed out)。
      - 當圖片從畫布被刪除時，側邊欄該圖片應恢復「可使用」狀態。

- **載入行為**：圖片拖曳或點擊加入時，需將 API 回傳的 Base64 轉為 Fabric Image，並將 `id` 寫入物件屬性。

### 4. 自訂控制項 (Custom Controls)

請覆寫 Fabric.js 預設的物件控制項 (Control Set)，為所有圖片物件加入以下客製化功能：

- **刪除按鈕**：

  - 在圖片選取框的 ** 右上角 (TR)** 額外增加一個控制點。
  - **外觀**：繪製一個簡單的「紅色圓形配白色 X」或類似的刪除圖示 (無需載入額外圖片，請用 Canvas Context 繪製)。
  - **行為**：點擊該控制點時，直接移除該圖片物件，並觸發「圖片列表」的狀態更新（將該圖片 ID 設回可用）。

- **強制等比縮放 (Lock Aspect Ratio)**：

  - **隱藏** 圖片上下左右中間的控制點 (`mt`, `mb`, `ml`, `mr`)。
  - **僅保留** 四個角落的控制點 (`tl`, `tr`, `bl`, `br`) 與旋轉軸 (`mtr`)。
  - 確保使用者無法對圖片進行非等比拉伸 (Stretching/Skewing)。

- **新增「灰階 / 彩色切換按鈕**：
  - **位置**：選取框的 **左上角 (TL)** (與刪除按鈕對稱)。
  - **外觀**：使用 Canvas Context 繪製一個「黑白對比圓形」或類似圖示，代表色彩切換。
  - **行為 (Toggle)**：
    - 點擊時檢查該圖片是否已套用 `Grayscale` 濾鏡。
    - 若 **無**：加入 `new fabric.Image.filters.Grayscale()` 並執行 `applyFilters()`。
    - 若 **有**：移除該濾鏡，恢復彩色，並執行 `applyFilters()`。
    - **狀態記憶**：在存檔與讀檔時，必須保留此圖片是「彩色」還是「灰階」的狀態 (可透過檢查 filters 陣列或自訂屬性來實作)。

### 5. 畫板旋轉與座標重算 (Rotation System)

實作 `toggleOrientation()` 方法，功能如下：

- **切換模式**：從「直式向右延伸」切換為「橫式向下延伸」，反之亦然。
- **全域旋轉**：
- 重新計算 Canvas 的總寬高。
- **所有圖片物件** 需順時針旋轉 90 度 (或是逆時針，視切換方向而定)。
- **座標轉換**：**這是最關鍵的部分**。必須重新計算每張圖片的 `left` 與 `top`，確保它們在視覺上相對於「原本所在的頁面」位置是正確的（模擬整張紙轉向的效果）。

### 6. 存取與修改 (Save & Load)

- **save (extraParams)**：

  - 接受一個物件 `extraParams` (例如 `{ page_pk: 123 }`)，這些參數需合併到輸出的 JSON 中。
  - 輸出格式需包含：Canvas 物件列表 (含圖片 ID, 座標, 旋轉)、`extraParams`。
  - 根據設定，** 移除 ** 圖片物件中的 `src` (Base64) 以減少傳輸量。

- **load (jsonData)**：
  - 接收後端回傳的完整 JSON。
  - 清空畫布，還原頁數、版面方向。
  - **還原圖片邏輯**：
    - 依據 `items` 中的 `img_id` 比對 `fetchImages()` 下載的圖片列表。
    - **若圖片存在列表中**：建立 Fabric Image 物件，還原座標、角度、濾鏡等設定，並**同步更新**側邊欄的圖片使用狀態 (若開啟唯一性，則標示為已使用)。
    - **若圖片不存在列表中** (例如圖片庫已刪除)：
      - **直接捨棄**該圖片物件，不加入畫布。
      - 觸發一個 UI 通知或錯誤訊息 Log，告知使用者「部分圖片因原始檔遺失而被自動移除」。

---

## 📝 輸出要求

請至少產生以下檔案的程式碼：

1. **`fabric.FabricA4Layout.js`** (放置到適合的資料夾，或者用 npm 插件管理元件後再合併編譯)：

- 包含完整的 `class FabricA4Layout`。
- 使用 ES6 語法 (Class, Arrow Functions, async/await)。
- 請加上詳細註解解釋「座標旋轉轉換」的數學邏輯。
- 編譯完成 `dist/js/fabric.FabricA4Layout.min.js`。

2. **`fabric.FabricA4Layout.sass`** (放置到適合的資料夾)：

- 基本樣式設定：
  - Canvas 容器樣式 (寬高、滾動條)。
  - 側邊欄圖片列表樣式 (圖片尺寸、已使用狀態)。
- 編譯完成 `dist/css/fabric.FabricA4Layout.min.css`。

3. **API demo**：

- 開發階段會把圖片放在 `uploads/` 資料夾下，請將這些圖片先轉成 API 要用的 base64 格式(需先壓縮變小張，再傳遞 base64 才能節省流量，基本上這是後端的工作)。
- 模擬一個簡單的後端 API，回傳圖片列表 JSON (包含 `id`, `thumbnail_base64`)。
- 提供一個範例 JSON 檔案 (e.g. `api/images.json`)。

4. **`index.html`**：

- 模擬 API 資料的 Mock Data。
- ** 實例化 `FabricA4Layout` 的範例程式碼 **，演示如何初始化、切換方向、存檔。

5. **`README.md`**：

- 專案說明、安裝指引、使用說明與 API 文件。
