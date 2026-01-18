import { Control as z, filters as H, util as M, Canvas as B, FabricImage as T, Rect as W, Point as _ } from "fabric";
const k = {
  status: {
    setting: "設定:",
    dpi: "DPI",
    pages: "頁數:",
    orientation: "方向:",
    portrait: "直式",
    landscape: "橫式",
    size: "A4尺寸:",
    margin: "出血(mm):",
    grayscale: "灰階預設:",
    on: "開啟",
    off: "關閉"
  },
  error: {
    fetchFailed: "API 讀取失敗",
    readError: "讀取圖片錯誤:",
    listUpdated: "圖片列表已更新，並已自動移除A4範圍外的圖片",
    canvasCleared: "A4已清空",
    noData: "無可讀取的佈局資料",
    skipped: "已略過重複圖片:",
    removedFromCanvas: "已從A4移除圖片"
  },
  confirm: {
    clearCanvas: "確定要清空A4上的所有圖片嗎？",
    removeImage: `此圖片已在A4上。是否要移除它？
(這能幫助您找回迷失的圖片)`
  }
}, A = (a, s, i, e, t) => {
  a.save(), a.translate(s, i), a.rotate(M.degreesToRadians(t.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "#F44336", a.fill(), a.lineWidth = 2, a.strokeStyle = "white", a.beginPath(), a.moveTo(-24 / 4, -24 / 4), a.lineTo(24 / 4, 24 / 4), a.moveTo(24 / 4, -24 / 4), a.lineTo(-24 / 4, 24 / 4), a.stroke(), a.restore();
}, L = new z({
  x: 0.5,
  y: -0.5,
  // Top Right
  offsetY: 16,
  offsetX: -16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, s) => {
    const i = s.target, e = i.canvas;
    return e.remove(i), i.imageId && e.fire("object:custom:delete", { target: i }), e.requestRenderAll(), !0;
  },
  render: A
}), R = (a, s, i, e, t) => {
  a.save(), a.translate(s, i), a.rotate(M.degreesToRadians(t.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.lineWidth = 1, a.strokeStyle = "#333", a.stroke(), a.beginPath(), a.arc(0, 0, 24 / 2, -Math.PI / 2, Math.PI / 2, !1), a.fillStyle = "black", a.fill(), a.restore();
}, Y = new z({
  x: -0.5,
  y: 0.5,
  // Bottom Left
  offsetY: -16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, s) => {
    const i = s.target, e = i.canvas;
    return e.setCursor("wait"), setTimeout(() => {
      i.filters.some((n) => n.type === "Grayscale") ? i.filters = i.filters.filter((n) => n.type !== "Grayscale") : i.filters.push(new H.Grayscale()), i.applyFilters(), e.setCursor("default"), e.requestRenderAll();
    }, 50), !0;
  },
  render: R
}), $ = (a, s, i, e, t) => {
  a.save(), a.translate(s, i), a.rotate(M.degreesToRadians(t.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.strokeStyle = "#2196F3", a.lineWidth = 2, a.beginPath(), a.arc(0, 0, 24 / 4, 0, Math.PI * 1.5, !1), a.stroke(), a.fillStyle = "#2196F3", a.beginPath(), a.moveTo(24 / 4, -24 / 8), a.lineTo(24 / 4 + 4, 0), a.lineTo(24 / 4 - 4, 0), a.fill(), a.restore();
}, X = new z({
  x: -0.5,
  y: -0.5,
  // Top Left
  offsetY: 16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "crosshair",
  mouseUpHandler: (a, s) => {
    const i = s.target, e = i.canvas, t = i.angle || 0;
    return i.set("angle", (t + 90) % 360), i.setCoords(), e.requestRenderAll(), !0;
  },
  render: $
});
class F {
  constructor(s) {
    var e, t, n;
    this.config = {
      dpi: 48,
      width: 210,
      // mm
      height: 297,
      // mm
      pageMargin: 5,
      // mm (Default 5mm margin/bleed)
      orientation: "portrait",
      saveWithBase64: !1,
      uniqueImages: !1,
      defaultGrayscale: !1,
      saveEndpoint: null,
      data: {},
      buttons: {},
      // Map of action -> buttonId
      statusDisplayId: null,
      errorDisplayId: null,
      locale: {},
      ...s
    }, this.t = {
      status: { ...k.status, ...((e = this.config.locale) == null ? void 0 : e.status) || {} },
      error: { ...k.error, ...((t = this.config.locale) == null ? void 0 : t.error) || {} },
      confirm: { ...k.confirm, ...((n = this.config.locale) == null ? void 0 : n.confirm) || {} }
    }, this.config.dpi < 24 && (this.config.dpi = 24), this.config.dpi > 192 && (this.config.dpi = 192);
    const i = (o) => Math.round(o / 25.4 * this.config.dpi);
    this.pageWidthPx = i(this.config.width), this.pageHeightPx = i(this.config.height), this.pageMarginPx = i(this.config.pageMargin), this.gap = 4, this.canvasId = this.config.canvasId, this.canvas = null, this.images = [], this.pageCount = 1, this.orientation = this.config.orientation;
  }
  async init() {
    this.canvas = new B(this.canvasId, {
      preserveObjectStacking: !0,
      selection: !0,
      enableRetinaScaling: !1
    }), this.setupLayout(), await this.fetchImages(), this.setupEvents(), this.bindControls(), this.updateStatusDisplay(), this.canvas.on("after:render", (s) => this._renderBleedOverlay(s.ctx)), this.canvas.requestRenderAll();
  }
  _renderBleedOverlay(s) {
    if (!this.canvas) return;
    s.save();
    const i = this.canvas.viewportTransform;
    s.transform(i[0], i[1], i[2], i[3], i[4], i[5]);
    const e = this.pageMarginPx, t = this.pageWidthPx, n = this.pageHeightPx, o = this.gap;
    s.fillStyle = "rgba(189, 189, 255, 0.2)", s.beginPath();
    for (let r = 0; r < this.pageCount; r++) {
      let d, h, l, c;
      this.orientation === "portrait" ? (d = r * (t + o), h = 0, l = t, c = n) : (d = 0, h = r * (n + o), l = n, c = t), s.rect(d, h, l, c), s.rect(d + e, h + e, l - 2 * e, c - 2 * e);
    }
    s.fill("evenodd"), s.restore();
  }
  bindControls() {
    const s = this.config.buttons, i = (e, t) => {
      if (e) {
        const n = document.getElementById(e);
        if (n) {
          const o = n.cloneNode(!0);
          n.parentNode.replaceChild(o, n), o.onclick = t;
        }
      }
    };
    if (i(s.orientation, () => {
      this.toggleOrientation(), this.updateStatusDisplay();
    }), i(s.addPage, () => {
      this.addPage(), this.updateStatusDisplay();
    }), i(s.removePage, () => {
      this.removePage(), this.updateStatusDisplay();
    }), i(s.refreshImages, async () => {
      this.cleanupOutOfBounds(), await this.fetchImages(), this.showError(this.t.error.listUpdated, !0);
    }), i(s.clearCanvas, () => {
      confirm(this.t.confirm.clearCanvas) && (this.clearCanvas(), this.showError(this.t.error.canvasCleared, !0));
    }), s.save) {
      const e = document.getElementById(s.save);
      if (e) {
        const t = e.cloneNode(!0);
        e.parentNode.replaceChild(t, e), t.onclick = () => {
          const n = this.save();
          this.config.onSave && this.config.onSave(n);
        };
      }
    }
    if (s.load) {
      const e = document.getElementById(s.load);
      if (e) {
        const t = e.cloneNode(!0);
        e.parentNode.replaceChild(t, e), t.onclick = async () => {
          let n = null;
          if (this.config.onLoad && (n = this.config.onLoad()), n) {
            const o = await this.load(n);
            this.updateStatusDisplay(), o.skipped && o.skipped.length > 0 && this.showError(`${this.t.error.skipped} ${o.skipped.join(", ")}`);
          } else
            this.showError(this.t.error.noData);
        };
      }
    }
    if (s.settings && this.config.onSettingsClick) {
      const e = document.getElementById(s.settings);
      if (e) {
        const t = e.cloneNode(!0);
        e.parentNode.replaceChild(t, e), t.onclick = this.config.onSettingsClick;
      }
    }
  }
  showError(s, i = !1) {
    if (this.config.errorDisplayId) {
      const e = document.getElementById(this.config.errorDisplayId);
      e && (e.style.display = "block", e.innerText = s, e.style.backgroundColor = i ? "#e8f5e9" : "#ffebee", e.style.color = i ? "#2e7d32" : "#c62828", e.style.borderColor = i ? "#a5d6a7" : "#ef9a9a", setTimeout(() => {
        e.style.display = "none";
      }, 5e3));
    } else
      console.log(i ? "Info:" : "Error:", s), i || alert(s);
  }
  updateStatusDisplay() {
    if (this.config.statusDisplayId) {
      const s = document.getElementById(this.config.statusDisplayId);
      if (s && this.canvas) {
        const i = this.canvas.getWidth(), e = this.canvas.getHeight(), t = this.orientation === "portrait" ? this.t.status.portrait : this.t.status.landscape;
        s.innerHTML = `
                <strong>${this.t.status.setting}</strong> ${this.t.status.dpi} ${this.config.dpi} | 
                <strong>${this.t.status.pages}</strong> ${this.pageCount} | 
                <strong>${this.t.status.orientation}</strong> ${t} | 
                <strong>${this.t.status.size}</strong> ${i} x ${e} px |
                <strong>${this.t.status.margin}</strong> ${this.config.pageMargin} |
                <strong>${this.t.status.grayscale}</strong> ${this.config.defaultGrayscale ? this.t.status.on : this.t.status.off}
            `;
      }
    }
  }
  async fetchImages() {
    try {
      const s = await fetch(this.config.apiEndpoint);
      if (!s.ok) throw new Error(this.t.error.fetchFailed);
      const i = await s.json();
      if (i.succ === !1)
        throw new Error(i.error || this.t.error.fetchFailed);
      this.images = i.data || [], this.renderSidebar();
    } catch (s) {
      console.error(this.t.error.readError, s), this.showError(`${this.t.error.fetchFailed}: ${s.message}`), this.images = [], this.renderSidebar();
    }
  }
  renderSidebar() {
    const s = document.getElementById("image-sidebar");
    s && (s.innerHTML = "", this.images.forEach((i) => {
      const e = document.createElement("div");
      e.className = "image-item", e.dataset.id = i.img_id;
      const t = this.config.uniqueImages && this.isImageOnCanvas(i.img_id);
      e.onclick = () => {
        t ? confirm(this.t.confirm.removeImage) && (this.canvas.getObjects().filter((d) => d.imageId === i.img_id).forEach((d) => this.canvas.remove(d)), this.updateSidebarStatus(i.img_id, !1), this.showError(this.t.error.removedFromCanvas, !0)) : this.addImageToCanvas(i.img_id);
      }, t && (e.classList.add("disabled"), e.title = "已在A4上 (點擊可移除)", e.style.cursor = "help");
      const n = document.createElement("img");
      n.src = i.url || i.base64, n.draggable = !1;
      const o = document.createElement("span");
      o.className = "label", o.innerText = i.title || i.img_id, e.appendChild(n), e.appendChild(o), s.appendChild(e);
    }));
  }
  isImageOnCanvas(s) {
    return this.canvas.getObjects().some((i) => i.imageId === s);
  }
  updateSidebarStatus(s, i) {
    this.config.uniqueImages && this.renderSidebar();
  }
  async addImageToCanvas(s) {
    if (this.config.uniqueImages && this.isImageOnCanvas(s)) return;
    const i = this.images.find((u) => u.img_id === s);
    if (!i) return;
    const e = i.url || i.base64, t = await T.fromURL(e);
    t.set({
      imageId: s,
      cornerSize: 10,
      transparentCorners: !1,
      originX: "center",
      originY: "center"
    });
    const o = this.config.dpi / 96;
    let r = 1, d = 1;
    i.original_width && i.original_height && t.width > 0 && t.height > 0 ? (r = i.original_width / t.width * o, d = i.original_height / t.height * o) : (r = o, d = o), t.scaleX = r, t.scaleY = d, this.config.defaultGrayscale && (t.filters.push(new H.Grayscale()), t.applyFilters()), this.setupCustomControls(t);
    const h = this.orientation === "portrait", l = h ? this.pageWidthPx : this.pageHeightPx, c = h ? this.pageHeightPx : this.pageWidthPx, p = l - this.pageMarginPx * 2, f = c - this.pageMarginPx * 2;
    if (t.getScaledWidth() > p || t.getScaledHeight() > f) {
      const u = Math.min(p / t.getScaledWidth(), f / t.getScaledHeight());
      t.scaleX *= u, t.scaleY *= u;
    }
    let g = this.pageCount - 1;
    const v = ((u) => this.canvas.getObjects().filter((y) => !y.isBackground).filter((y) => {
      const C = y.getCenterPoint();
      if (h) {
        const I = u * (l + this.gap), O = I + l;
        return C.x >= I && C.x < O;
      } else {
        const I = u * (c + this.gap), O = I + c;
        return C.y >= I && C.y < O;
      }
    }))(g);
    let m = 0;
    const w = this.pageMarginPx;
    if (v.length > 0) {
      let u = 0;
      v.forEach((S) => {
        let y = 0;
        if (h)
          y = S.top + S.getScaledHeight() / 2;
        else {
          const C = g * (c + this.gap);
          y = S.top - C + S.getScaledHeight() / 2;
        }
        y > u && (u = y);
      }), m = u + this.gap;
    } else
      m = w;
    m + t.getScaledHeight() > c - this.pageMarginPx && (this.addPage(), g++, m = w);
    let b, E;
    if (h)
      b = g * (l + this.gap) + this.pageMarginPx + t.getScaledWidth() / 2, E = m + t.getScaledHeight() / 2;
    else {
      const u = g * (c + this.gap);
      b = this.pageMarginPx + t.getScaledWidth() / 2, E = u + m + t.getScaledHeight() / 2;
    }
    t.set({ left: b, top: E }), this.canvas.add(t), this.canvas.setActiveObject(t), this.updateSidebarStatus(s, !0);
  }
  setupCustomControls(s) {
    delete s.controls.ml, delete s.controls.mr, delete s.controls.mt, delete s.controls.mb, delete s.controls.mtr, s.controls.deleteControl = L, s.controls.grayscaleControl = Y, s.controls.rotate90Control = X;
  }
  setupLayout() {
    let s, i;
    const e = this.canvas.getObjects().filter((t) => t.isBackground);
    if (this.canvas.remove(...e), this.orientation === "portrait") {
      const t = this.pageWidthPx, n = this.pageHeightPx;
      i = n, s = (t + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: s, height: i },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new W({
          left: o * (t + this.gap),
          top: 0,
          width: t,
          height: n,
          fill: "white",
          stroke: "#999",
          strokeWidth: 1,
          selectable: !1,
          evented: !1,
          isBackground: !0,
          hoverCursor: "default",
          originX: "left",
          originY: "top"
        });
        this.canvas.add(r), this.canvas.sendObjectToBack(r);
      }
    } else {
      const t = this.pageHeightPx, n = this.pageWidthPx;
      s = t, i = (n + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: s, height: i },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new W({
          left: 0,
          top: o * (n + this.gap),
          width: t,
          height: n,
          fill: "white",
          stroke: "#999",
          strokeWidth: 1,
          selectable: !1,
          evented: !1,
          isBackground: !0,
          hoverCursor: "default",
          originX: "left",
          originY: "top"
        });
        this.canvas.add(r), this.canvas.sendObjectToBack(r);
      }
    }
    this.canvas.calcOffset(), this.canvas.requestRenderAll();
  }
  toggleOrientation() {
    const s = this.orientation;
    this.orientation = s === "portrait" ? "landscape" : "portrait", this.canvas.getObjects().filter((e) => !e.isBackground).forEach((e) => {
      const t = e.getCenterPoint();
      let n = 0, o = 0, r = 0;
      const d = this.pageWidthPx, h = this.pageHeightPx;
      if (s === "portrait")
        n = Math.floor(t.x / (d + this.gap)), o = t.x - n * (d + this.gap), r = t.y;
      else {
        const g = d;
        n = Math.floor(t.y / (g + this.gap)), o = t.x, r = t.y - n * (g + this.gap);
      }
      let l, c;
      s === "portrait" ? (l = h - r, c = o, e.angle = (e.angle || 0) + 90) : (l = r, c = h - o, e.angle = (e.angle || 0) - 90);
      let p, f;
      this.orientation === "portrait" ? (p = n * (d + this.gap) + l, f = c) : (p = l, f = n * (d + this.gap) + c), e.setPositionByOrigin(new _(p, f), "center", "center"), e.setCoords();
    }), this.setupLayout();
  }
  setupEvents() {
    this.canvas.on("object:custom:delete", (s) => {
      s.target && s.target.imageId && this.updateSidebarStatus(s.target.imageId, !1);
    });
  }
  save(s = {}) {
    const i = this.canvas.getObjects().filter((r) => !r.isBackground), e = [], t = this.pageWidthPx, n = this.pageHeightPx, o = this.gap;
    return i.forEach((r, d) => {
      const h = r.getCenterPoint();
      let l = 1, c = 0, p = 0;
      if (this.orientation === "portrait") {
        const g = Math.floor(h.x / (t + o));
        l = g + 1, c = h.x - g * (t + o), p = h.y;
      } else {
        const g = t, P = Math.floor(h.y / (g + o));
        l = P + 1, c = h.x, p = h.y - P * (g + o);
      }
      const f = {
        type: "image",
        originX: "center",
        originY: "center",
        left: c,
        top: p,
        angle: r.angle || 0,
        width: r.width,
        height: r.height,
        scaleX: r.scaleX || 1,
        scaleY: r.scaleY || 1,
        is_grayscale: r.filters.some((g) => g.type === "Grayscale")
      };
      e.push({
        seq_no: d + 1,
        img_id: r.imageId,
        page_num: l,
        img_setting: f
      });
    }), {
      data: { ...this.config.data, ...s },
      page: {
        orientation: this.orientation,
        dpi: this.config.dpi,
        width: this.orientation === "portrait" ? t : n,
        height: this.orientation === "portrait" ? n : t,
        margin: this.config.pageMargin,
        pages: this.pageCount
      },
      items: e
    };
  }
  async saveToBackend(s = {}) {
    const i = this.save(s);
    if (!this.config.saveEndpoint)
      throw new Error("No saveEndpoint configured.");
    try {
      const e = await fetch(this.config.saveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(i)
      });
      if (!e.ok)
        throw new Error(`HTTP error! status: ${e.status}`);
      const t = await e.json();
      if (t.succ === !1)
        throw new Error(t.error || "Server reported failure.");
      return t;
    } catch (e) {
      throw console.error("Save failed:", e), e;
    }
  }
  async load(s) {
    if (!s) return { success: !1, message: "No data" };
    let i = s;
    if ("succ" in s) {
      if (s.succ === !1)
        return { success: !1, message: s.error || "Unknown error from API data" };
      s.data && (i = s.data);
    }
    const e = i;
    this.canvas.clear(), this.orientation = e.page && e.page.orientation || e.orientation || "portrait", this.pageCount = e.page && e.page.pages || e.pageCount || 1, e.page && typeof e.page.margin < "u" ? this.config.pageMargin = e.page.margin : typeof e.margin < "u" && (this.config.pageMargin = e.margin);
    const t = (p) => Math.round(p / 25.4 * this.config.dpi);
    this.pageMarginPx = t(this.config.pageMargin), this.setupLayout();
    const n = e.items || [], o = /* @__PURE__ */ new Set(), r = [], d = e.page && e.page.dpi || e.dpi || this.config.dpi, h = this.config.dpi / d, l = this.pageWidthPx;
    this.pageHeightPx;
    const c = this.gap;
    for (const p of n) {
      const f = p.img_id, g = p.img_setting || {};
      if (this.config.uniqueImages && o.has(f)) {
        const v = this.images.find((w) => w.img_id === f), m = v ? v.title || v.img_id : f;
        r.push(m);
        continue;
      }
      const P = this.images.find((v) => v.img_id === f);
      if (P) {
        o.add(f);
        const v = (p.page_num || 1) - 1;
        let m = 0, w = 0;
        if (this.orientation === "portrait")
          m = (g.left || 0) + v * (l + c), w = g.top || 0;
        else {
          const y = l;
          m = g.left || 0, w = (g.top || 0) + v * (y + c);
        }
        let b = g.scaleX || 1, E = g.scaleY || 1;
        if (Math.abs(h - 1) > 1e-4) {
          const y = (g.left || 0) * h, C = (g.top || 0) * h;
          if (this.orientation === "portrait")
            m = y + v * (l + c), w = C;
          else {
            const I = l;
            m = y, w = C + v * (I + c);
          }
          b *= h, E *= h;
        }
        const u = P.url || P.base64, S = await T.fromURL(u);
        S.set({
          left: m,
          top: w,
          angle: g.angle || 0,
          scaleX: b,
          scaleY: E,
          originX: "center",
          originY: "center",
          imageId: f,
          cornerSize: 10,
          transparentCorners: !1
        }), g.is_grayscale && (S.filters.push(new H.Grayscale()), S.applyFilters()), this.setupCustomControls(S), this.canvas.add(S), this.updateSidebarStatus(f, !0);
      } else
        console.warn(`Image ID ${f} not found in API. Skipping.`);
    }
    return this.canvas.requestRenderAll(), { success: !0, skipped: r };
  }
  addPage() {
    this.pageCount++, this.setupLayout();
  }
  removePage() {
    if (this.pageCount > 1) {
      const s = this.pageWidthPx, i = this.pageHeightPx, e = this.pageCount - 1;
      let t, n, o, r;
      if (this.orientation === "portrait")
        t = e * (s + this.gap), n = 0, o = s, r = i;
      else {
        const l = i, c = s;
        t = 0, n = e * (c + this.gap), o = l, r = c;
      }
      const d = this.canvas.getObjects().filter((l) => !l.isBackground), h = [];
      d.forEach((l) => {
        const c = l.getCenterPoint();
        c.x >= t && c.x <= t + o && c.y >= n && c.y <= n + r && h.push(l);
      }), h.forEach((l) => {
        l.imageId && this.updateSidebarStatus(l.imageId, !1), this.canvas.remove(l);
      }), this.pageCount--, this.setupLayout();
    }
  }
  enforceUniqueness() {
    if (!this.config.uniqueImages) return;
    const s = this.canvas.getObjects().filter((t) => !t.isBackground), i = /* @__PURE__ */ new Set(), e = [];
    return s.forEach((t) => {
      t.imageId && (i.has(t.imageId) ? e.push(t) : i.add(t.imageId));
    }), e.forEach((t) => {
      this.canvas.remove(t);
    }), this.canvas.requestRenderAll(), e.length;
  }
  cleanupOutOfBounds() {
    const s = this.canvas.getObjects().filter((t) => !t.isBackground), i = this.canvas.getWidth(), e = this.canvas.getHeight();
    s.forEach((t) => {
      const n = t.getCenterPoint();
      (n.x < -50 || n.x > i + 50 || n.y < -50 || n.y > e + 50) && (this.canvas.remove(t), t.imageId && this.updateSidebarStatus(t.imageId, !1));
    }), this.canvas.requestRenderAll();
  }
  clearCanvas() {
    this.canvas.getObjects().filter((i) => !i.isBackground).forEach((i) => {
      this.canvas.remove(i), i.imageId && this.updateSidebarStatus(i.imageId, !1);
    }), this.canvas.requestRenderAll();
  }
  destroy() {
    this.canvas && (this.canvas.dispose(), this.canvas = null);
  }
}
export {
  F as FabricA4Layout
};
