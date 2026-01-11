# Fabric A4 排版工具任務清單 (Task Checklist)

## Phase 1: 環境與基礎架構
- [x] 初始化專案 (package.json, vite.config.js)
- [x] 建立目錄結構 (src, api, dist)
- [x] 實作全域 CSS Reset 與 Flexbox 佈局優化
- [x] 建立 FabricA4Layout Class 骨架

## Phase 2: 版面引擎 (Layout Engine)
- [x] 實作 `init()` 與 Canvas 實例化
- [x] **Fix**: 禁用 Retina Scaling 以修正 HighDPI 顯示問題
- [x] 實作 `setupLayout()`: 支援白色背景頁面與邊框
- [x] 實作 `addPage()` 與 `removePage()` 動態調整頁數 (含自動刪除物件)

## Phase 3: 圖片管理 (Image Manager)
- [x] 實作 `fetchImages()`: 支援 `API_SPEC.md` JSON 格式
- [x] 實作 `renderSidebar()`: 圖片預覽列表
- [x] 實作 `addImageToCanvas()`: 固定 `left/top` 基準點
- [x] **Update**: 實作圖片不重複限制 (設定整合、載入檢查)

## Phase 4: 自訂控制項 (Advanced Controls)
- [x] **UI**: 實作「內縮式 (Inset)」控制項定位
- [x] **UX**: 擴大點擊區域 (28x28) 與實心底色繪製
- [x] **Delete (TR)**: 物件刪除與狀態同步
- [x] **Grayscale (BL)**: 非同步濾鏡處理與 `wait` 游標
- [x] **Rotate 90 (TL)**: 順時針固定角度旋轉

## Phase 5: 旋轉與座標系統
- [x] 實作 `toggleOrientation()` 方法
- [x] **Algorithm**: 實作中心點映射旋轉演算法
- [x] **Fix**: 強制 `originX: 'left', originY: 'top'` 定位邏輯

## Phase 6: 持久化與系統設定
- [x] 實作 `save()` / `load()`
- [x] **Feature**: 實作「⚙️ 畫布設定」彈窗與同步換算 (DPI/PX)
- [x] 實作 `destroy()` 資源回收機制

## Phase 7: 整合與文件
- [x] 更新 `index.html` 演示頁面 (中文化、狀態顯示、錯誤訊息區塊)
- [x] 實作 `bindControls` 綁定機制
- [x] 建立 `.docs/` 規格開發文件 (Spec, Plan, Task)
- [x] 生成 `GEMINI.md` 專案上下文文件
