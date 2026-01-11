# Fabric A4 排版工具任務清單 (Task Checklist)

## Phase 1: 環境與基礎架構
- [x] 初始化專案 (package.json, vite.config.js)
- [x] 建立目錄結構 (src, api, dist)
- [x] 實作全域 CSS Reset 與 Flexbox 佈局優化
- [x] 建立 FabricA4Layout Class 骨架

## Phase 2: 版面引擎 (Layout Engine)
- [x] 實作 `init()` 與 Canvas 實例化 (禁用 Retina Scaling)
- [x] 實作 `setupLayout()`: 支援白色背景頁面與邊框
- [x] 實作 `addPage()` 與 `removePage()` (含物件清理)

## Phase 3: 圖片管理 (Image Manager)
- [x] 實作 `fetchImages()`: 支援 `API_SPEC.md` JSON 格式
- [x] 實作 `renderSidebar()`: 圖片預覽、點擊加入/移除
- [x] 實作 `addImageToCanvas()`: 固定 `left/top` 基準點
- [x] **Update**: 實作更新圖片列表與自動清理畫布外物件

## Phase 4: 自訂控制項 (Advanced Controls)
- [x] **UI**: 實作「內縮式 (Inset)」控制項定位
- [x] **UX**: 擴大點擊區域 (28x28) 與實心底色繪製
- [x] **Delete (TR)**: 物件刪除與狀態同步 (修正先移除再通知邏輯)
- [x] **Grayscale (BL)**: 非同步濾鏡處理與 `wait` 游標
- [x] **Rotate 90 (TL)**: 順時針固定角度旋轉

## Phase 5: 旋轉與座標系統
- [x] 實作 `toggleOrientation()` 方法
- [x] **Algorithm**: 實作中心點映射旋轉演算法
- [x] **Fix**: 強制 `originX: 'left', originY: 'top'` 定位邏輯

## Phase 6: 持久化與系統設定
- [x] 實作 `save()` / `load()` (含重複檢查與顯示檔名)
- [x] **Feature**: 實作「⚙️ 畫布設定」彈窗 (DPI/PX/不重複限制)
- [x] 實作 `clearCanvas()` 清除所有圖片
- [x] 實作 `destroy()` 資源回收機制

## Phase 7: 整合與文件
- [x] 更新 `index.html` (UI 重構、設定彈窗、錯誤顯示區)
- [x] 實作 `bindControls` 綁定機制與 Config 擴充
- [x] 實作 `locale.js` 語系抽離與支援
- [x] 更新 `.docs/` 文件與 `README.md`