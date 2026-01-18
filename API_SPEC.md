# FabricA4Layout API 規格文件

本文件定義 `FabricA4Layout` 前端元件與後端伺服器進行版面資料存檔 (`Save Layout`) 時的 JSON 資料交換格式。

## 1. 存檔介面 (Save Layout)

* **方向**：前端 (Frontend) -> 後端 (Backend)
* **用途**：將目前的 A4 排版狀態、圖片位置與自訂參數傳送給後端儲存。
* **格式**：JSON Object

### 1.1 JSON Payload 結構

```json
{
  "data": {
    "page_pk": "123",
    "user_note": "急件"
  },
  "page": {
    "orientation": "L",
    "dpi": 48,
    "width": 397,
    "height": 561,
    "margin": 5,
    "pages": 2
  },
  "items": [
    {
      "seq_no": 1,
      "img_id": 101,
      "page_num": 1,
      "img_setting": {
        "is_grayscale": false,
        "type": "image",
        "left": 150.5,
        "top": 300.0,
        "angle": 90,
        "scaleX": 0.5,
        "scaleY": 0.5,
        "width": 800,
        "height": 600,
        "originX": "center",
        "originY": "center"
      }
    }
  ]
}
```

---

### 1.2 欄位詳細定義

#### 根物件 (Root Object)

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `data` | Object | 是 | **額外自訂參數**。<br>存放 `FabricA4Layout.save(extraParams)` 傳入的額外商業邏輯資料 (如 `order_id`, `memo` 等)。後端可直接將其拆解存入對應欄位。 |
| `page` | Object | 是 | **全域版面設定**。描述整份文件的 A4 規格與方向。 |
| `items` | Array | 是 | **圖片物件列表**。每一筆代表畫布上的一個圖片物件。 |

#### Page 物件 (`page`)

| 欄位 | 類型 | 範例 | 說明 |
| :--- | :--- | :--- | :--- |
| `orientation` | String | `"L"` | `L`: 橫向 (Landscape)<br>`P`: 直向 (Portrait) |
| `dpi` | Number | `48` | 版面 DPI 設定 (影響 px 計算)。 |
| `width` | Number | `397` | 單頁 A4 的像素寬度 (計算公式: `210mm / 25.4 * dpi`)。 |
| `height` | Number | `561` | 單頁 A4 的像素高度 (計算公式: `297mm / 25.4 * dpi`)。 |
| `margin` | Number | `5` | **頁面出血/邊距 (mm)**。<br>影響圖片自動排版的邊界。換算 px 公式: `Math.round((mm / 25.4) * dpi)`。 |
| `pages` | Number | `1` | 目前文件總頁數。 |

#### Items 物件 (`items`)

| 欄位 | 類型 | 範例 | 說明 |
| :--- | :--- | :--- | :--- |
| `seq_no` | Number | `1` | **序號** (1-based)。<br>通常對應前端陣列順序。若需嚴格的圖層堆疊順序，建議參考 `img_setting.z-index`。 |
| `img_id` | Number/String | `101` | **圖片關聯 ID** (對應 DB `ATTRID`)。<br>原始圖片庫的唯一識別碼。 |
| `page_num` | Number | `1` | **所屬頁碼** (1-based)。<br>前端根據圖片中心點座標自動計算該圖片落在哪一頁。 |
| `img_setting` | Object | - | **Fabric 物件詳細屬性**。<br>對應 DB `IMGSETTING` 欄位 (建議轉為 JSON String 儲存)。 |

#### Img Setting 物件 (`img_setting`)

此物件包含 Fabric.js 標準屬性與專案自訂屬性。

**A. 自訂與計算屬性**

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `is_grayscale` | Boolean | **灰階狀態**。<br>`true`: 已套用灰階濾鏡; `false`: 彩色原圖。 |

**B. Fabric.js 標準幾何屬性**

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `type` | String | 固定為 `"image"`。 |
| `left` | Number | **相對中心點 X 座標 (px)**。<br>⚠️ **重要**：此座標是相對於**該頁 (`page_num`) 左上角**的中心點位置。 |
| `top` | Number | **相對中心點 Y 座標 (px)**。<br>⚠️ **重要**：此座標是相對於**該頁 (`page_num`) 左上角**的中心點位置。 |
| `angle` | Number | **旋轉角度**。<br>依需求僅接受 90 的倍數 (0, 90, 180, 270)。 |
| `scaleX` | Number | X 軸縮放比例 (通常與 `scaleY` 相同，因鎖定等比縮放)。 |
| `scaleY` | Number | Y 軸縮放比例。 |
| `width` | Number | 原始圖片寬度 (px)。 |
| `height` | Number | 原始圖片高度 (px)。 |
| `originX` | String | 強制設定為 `"center"`。 |
| `originY` | String | 強制設定為 `"center"`。 |

## 2. 業務邏輯備註

1. **座標儲存策略 (Relative Coordinates)**：
    * 前端 Canvas 是一個巨大的長條 (直向向右延伸 / 橫向向下延伸)。
    * 但在存檔時，`img_setting.left` 與 `img_setting.top` **必須被正規化**為單頁內的座標。
    * *公式範例 (直向向右排)*：
        * `page_index = floor(obj.left / (page_width + gap))`
        * `saved_left = obj.left - (page_index * (page_width + gap))`
        * `page_num = page_index + 1`

2. **堆疊順序 (Z-Index)**：
    * Fabric.js 的渲染順序取決於物件在 `canvas._objects` 陣列中的順序。
    * `seq_no` 與 `z-index` 應保持一致。建議後端在讀取時，依照 `z-index` 小到大 (或 `seq_no`) 對 `items` 進行排序，再依序將物件 `add` 到 Canvas 上，即可還原正確的遮擋關係。

3. **旋轉限制**：
    * 雖然 Fabric.js 支援任意角度，但本規範限制 `angle` 僅接受 0, 90, 180, 270 度，以符合一般文件排版需求。

4. **DPI 一致性**：
    * `page.dpi` 參數必須與專案初始化設定一致。前端載入圖片時，需確保 `now_width/height` 在該 DPI 下呈現的物理尺寸 (mm) 是正確的。

## 3. 圖片列表介面 (Image List)

* **方向**：前端 (Frontend) <- 後端 (Backend)
* **用途**：取得圖片庫列表供前端選用。
* **API**：`GET /api/images`
* **格式**：JSON Object

### 3.1 JSON Response 結構

```json
{
  "succ": true,
  "error": "",
  "data": [
    {
      "img_id": 101,
      "title": "sample_01.jpg",
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "url": "https://example.com/images/sample_01.jpg",
      "original_width": 1200,
      "original_height": 800
    },
    {
      "img_id": 102,
      "title": "sample_02.png",
      "base64": "data:image/png;base64,iVBORw0KGgoAAA...",
      "url": null,
      "original_width": 800,
      "original_height": 800
    }
  ]
}
```

### 3.2 欄位詳細定義

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `succ` | Boolean | **成功標記**。<br>`true`: 成功; `false`: 失敗。 |
| `error` | String | **錯誤訊息**。<br>若 `succ` 為 `false`，此欄位回傳錯誤原因。 |
| `data` | Array | **圖片列表資料**。 |
| `data[].img_id` | Number/String | **圖片唯一識別碼**。<br>若後端未回傳此欄位，前端將使用 MD5(url) 作為 Fallback ID。 |
| `data[].title` | String | **圖片標題**。 |
| `data[].base64` | String | **Base64 編碼字串**。<br>長邊 Max 500px。與 `url` 擇一提供。 |
| `data[].url` | String | **圖片 URL**。<br>與 `base64` 擇一提供。若使用 URL，需設定 `crossOrigin: 'anonymous'`。 |
| `data[].original_width` | Number | **原始寬度 (px)**。 |
| `data[].original_height` | Number | **原始高度 (px)**。 |

## 4. 讀取排版介面 (Load Layout)

* **方向**：前端 (Frontend) <- 後端 (Backend)
* **用途**：透過儲存的資料還原畫布內容。
* **API**：`GET /api/layout/{page_pk}`
* **格式**：JSON Object

### 4.1 JSON Response 結構

此結構包含標準回應標頭，`data` 欄位內容與 **1. 存檔介面 (Save Layout)** 的 Payload 一致。

```json
{
  "succ": true,
  "error": "",
  "data": {
    "data": {
        "page_pk": "123",
        "user_note": "急件"
    },
    "page": {
        "orientation": "L",
        "dpi": 48,
        "width": 397,
        "height": 561,
        "margin": 5,
        "pages": 2
    },
    "items": [
        {
        "seq_no": 1,
        "img_id": 101,
        "page_num": 1,
        "img_setting": {
            "is_grayscale": false,
            "type": "image",
            "left": 150.5,
            "top": 300.0,
            "angle": 90,
            "scaleX": 0.5,
            "scaleY": 0.5,
            "width": 800,
            "height": 600,
            "originX": "center",
            "originY": "center"
        }
        }
    ]
  }
}
```

### 4.2 還原邏輯備註

1. **來源圖片匹配**：前端需透過 `img_id` 到已經載入的「圖片列表 (API #3)」中尋找對應的圖片來源 (`base64` 或 `url`)。
2. **圖片遺失處理**：若 `img_id` 在圖片列表中找不到，則視為該圖片已過期或被刪除。
    * **行為**：**不予顯示**該圖片，直接濾除，並在 UI 上顯示錯誤訊息提醒使用者「部分圖片已失效並自動移除」。
3. **座標還原**：`img_setting.left/top` 為相對中心點座標，需加上 `(page_num - 1) * (page_size + gap)` 還原為 Canvas 絕對座標。
4. **堆疊順序**：建議依 `items` 陣列順序依序加入畫布 (最後一個在最上層)。
