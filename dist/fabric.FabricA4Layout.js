import { Control as _, filters as H, util as z, Canvas as W, FabricImage as M, Rect as T, Point as B } from "fabric";
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
}, L = (a, t, i, e, s) => {
  a.save(), a.translate(t, i), a.rotate(z.degreesToRadians(s.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "#F44336", a.fill(), a.lineWidth = 2, a.strokeStyle = "white", a.beginPath(), a.moveTo(-24 / 4, -24 / 4), a.lineTo(24 / 4, 24 / 4), a.moveTo(24 / 4, -24 / 4), a.lineTo(-24 / 4, 24 / 4), a.stroke(), a.restore();
}, A = new _({
  x: 0.5,
  y: -0.5,
  // Top Right
  offsetY: 16,
  offsetX: -16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, t) => {
    const i = t.target, e = i.canvas;
    return e.remove(i), i.imageId && e.fire("object:custom:delete", { target: i }), e.requestRenderAll(), !0;
  },
  render: L
}), R = (a, t, i, e, s) => {
  a.save(), a.translate(t, i), a.rotate(z.degreesToRadians(s.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.lineWidth = 1, a.strokeStyle = "#333", a.stroke(), a.beginPath(), a.arc(0, 0, 24 / 2, -Math.PI / 2, Math.PI / 2, !1), a.fillStyle = "black", a.fill(), a.restore();
}, Y = new _({
  x: -0.5,
  y: 0.5,
  // Bottom Left
  offsetY: -16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, t) => {
    const i = t.target, e = i.canvas;
    return e.setCursor("wait"), setTimeout(() => {
      i.filters.some((n) => n.type === "Grayscale") ? i.filters = i.filters.filter((n) => n.type !== "Grayscale") : i.filters.push(new H.Grayscale()), i.applyFilters(), e.setCursor("default"), e.requestRenderAll();
    }, 50), !0;
  },
  render: R
}), $ = (a, t, i, e, s) => {
  a.save(), a.translate(t, i), a.rotate(z.degreesToRadians(s.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.strokeStyle = "#2196F3", a.lineWidth = 2, a.beginPath(), a.arc(0, 0, 24 / 4, 0, Math.PI * 1.5, !1), a.stroke(), a.fillStyle = "#2196F3", a.beginPath(), a.moveTo(24 / 4, -24 / 8), a.lineTo(24 / 4 + 4, 0), a.lineTo(24 / 4 - 4, 0), a.fill(), a.restore();
}, X = new _({
  x: -0.5,
  y: -0.5,
  // Top Left
  offsetY: 16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "crosshair",
  mouseUpHandler: (a, t) => {
    const i = t.target, e = i.canvas, s = i.angle || 0;
    return i.set("angle", (s + 90) % 360), i.setCoords(), e.requestRenderAll(), !0;
  },
  render: $
});
class F {
  constructor(t) {
    var e, s, n;
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
      ...t
    }, this.t = {
      status: { ...k.status, ...((e = this.config.locale) == null ? void 0 : e.status) || {} },
      error: { ...k.error, ...((s = this.config.locale) == null ? void 0 : s.error) || {} },
      confirm: { ...k.confirm, ...((n = this.config.locale) == null ? void 0 : n.confirm) || {} }
    }, this.config.dpi < 24 && (this.config.dpi = 24), this.config.dpi > 192 && (this.config.dpi = 192);
    const i = (o) => Math.round(o / 25.4 * this.config.dpi);
    this.pageWidthPx = i(this.config.width), this.pageHeightPx = i(this.config.height), this.pageMarginPx = i(this.config.pageMargin), this.gap = 4, this.canvasId = this.config.canvasId, this.canvas = null, this.images = [], this.pageCount = 1, this.orientation = this.config.orientation, this._layoutPending = !1, this._layoutPromise = null;
  }
  async init() {
    this.canvas = new W(this.canvasId, {
      preserveObjectStacking: !0,
      selection: !0,
      enableRetinaScaling: !1
    }), this.setupLayout(), await this.fetchImages(), this.setupEvents(), this.bindControls(), this.updateStatusDisplay(), this.canvas.on("after:render", (t) => this._renderBleedOverlay(t.ctx)), this.canvas.requestRenderAll();
  }
  _renderBleedOverlay(t) {
    if (!this.canvas) return;
    t.save();
    const i = this.canvas.viewportTransform;
    t.transform(i[0], i[1], i[2], i[3], i[4], i[5]);
    const e = this.pageMarginPx, s = this.pageWidthPx, n = this.pageHeightPx, o = this.gap;
    t.fillStyle = "rgba(189, 189, 255, 0.2)", t.beginPath();
    for (let r = 0; r < this.pageCount; r++) {
      let f, c, g, l;
      if (this.orientation === "portrait")
        f = r * (s + o), c = 0, g = s, l = n;
      else {
        const d = n, p = s;
        f = 0, c = r * (p + o), g = d, l = p;
      }
      t.rect(f, c, g, l), t.rect(f + e, c + e, g - 2 * e, l - 2 * e);
    }
    t.fill("evenodd"), t.restore();
  }
  _beginLayoutCycle() {
    this.canvas && (this._layoutPending = !0, this._layoutPromise = new Promise((t) => {
      const i = () => {
        this.canvas.off("after:render", i), this._layoutPending = !1, t();
      };
      this.canvas.on("after:render", i);
    }));
  }
  _waitForLayout() {
    return !this._layoutPending || !this._layoutPromise ? Promise.resolve() : this._layoutPromise;
  }
  bindControls() {
    const t = this.config.buttons, i = (e, s) => {
      if (e) {
        const n = document.getElementById(e);
        if (n) {
          const o = n.cloneNode(!0);
          n.parentNode.replaceChild(o, n), o.onclick = s;
        }
      }
    };
    if (i(t.orientation, () => {
      this.toggleOrientation(), this.updateStatusDisplay();
    }), i(t.addPage, () => {
      this.addPage(), this.updateStatusDisplay();
    }), i(t.removePage, () => {
      this.removePage(), this.updateStatusDisplay();
    }), i(t.refreshImages, async () => {
      await this._waitForLayout(), this.cleanupOutOfBounds(), await this.fetchImages(), this.showError(this.t.error.listUpdated, !0);
    }), i(t.clearCanvas, () => {
      confirm(this.t.confirm.clearCanvas) && (this.clearCanvas(), this.showError(this.t.error.canvasCleared, !0));
    }), t.save) {
      const e = document.getElementById(t.save);
      if (e) {
        const s = e.cloneNode(!0);
        e.parentNode.replaceChild(s, e), s.onclick = () => {
          const n = this.save();
          this.config.onSave && this.config.onSave(n);
        };
      }
    }
    if (t.load) {
      const e = document.getElementById(t.load);
      if (e) {
        const s = e.cloneNode(!0);
        e.parentNode.replaceChild(s, e), s.onclick = async () => {
          let n = null;
          if (this.config.onLoad && (n = this.config.onLoad()), n) {
            const o = await this.load(n);
            this.updateStatusDisplay(), o.skipped && o.skipped.length > 0 && this.showError(`${this.t.error.skipped} ${o.skipped.join(", ")}`);
          } else
            this.showError(this.t.error.noData);
        };
      }
    }
    if (t.settings && this.config.onSettingsClick) {
      const e = document.getElementById(t.settings);
      if (e) {
        const s = e.cloneNode(!0);
        e.parentNode.replaceChild(s, e), s.onclick = this.config.onSettingsClick;
      }
    }
  }
  showError(t, i = !1) {
    if (this.config.errorDisplayId) {
      const e = document.getElementById(this.config.errorDisplayId);
      e && (e.style.display = "block", e.innerText = t, e.style.backgroundColor = i ? "#e8f5e9" : "#ffebee", e.style.color = i ? "#2e7d32" : "#c62828", e.style.borderColor = i ? "#a5d6a7" : "#ef9a9a", setTimeout(() => {
        e.style.display = "none";
      }, 5e3));
    } else
      console.log(i ? "Info:" : "Error:", t), i || alert(t);
  }
  updateStatusDisplay() {
    if (this.config.statusDisplayId) {
      const t = document.getElementById(this.config.statusDisplayId);
      if (t && this.canvas) {
        const i = this.canvas.getWidth(), e = this.canvas.getHeight(), s = this.orientation === "portrait" ? this.t.status.portrait : this.t.status.landscape;
        t.innerHTML = `
                <strong>${this.t.status.setting}</strong> ${this.t.status.dpi} ${this.config.dpi} | 
                <strong>${this.t.status.pages}</strong> ${this.pageCount} | 
                <strong>${this.t.status.orientation}</strong> ${s} | 
                <strong>${this.t.status.size}</strong> ${i} x ${e} px |
                <strong>${this.t.status.margin}</strong> ${this.config.pageMargin} |
                <strong>${this.t.status.grayscale}</strong> ${this.config.defaultGrayscale ? this.t.status.on : this.t.status.off}
            `;
      }
    }
  }
  async fetchImages() {
    try {
      const t = await fetch(this.config.apiEndpoint);
      if (!t.ok) throw new Error(this.t.error.fetchFailed);
      const i = await t.json();
      if (i.succ === !1)
        throw new Error(i.error || this.t.error.fetchFailed);
      this.images = i.data || [], this.renderSidebar();
    } catch (t) {
      console.error(this.t.error.readError, t), this.showError(`${this.t.error.fetchFailed}: ${t.message}`), this.images = [], this.renderSidebar();
    }
  }
  renderSidebar() {
    const t = document.getElementById("image-sidebar");
    t && (t.innerHTML = "", this.images.forEach((i) => {
      const e = document.createElement("div");
      e.className = "image-item", e.dataset.id = i.img_id;
      const s = this.config.uniqueImages && this.isImageOnCanvas(i.img_id);
      e.onclick = () => {
        s ? confirm(this.t.confirm.removeImage) && (this.canvas.getObjects().filter((f) => f.imageId === i.img_id).forEach((f) => this.canvas.remove(f)), this.updateSidebarStatus(i.img_id, !1), this.showError(this.t.error.removedFromCanvas, !0)) : this.addImageToCanvas(i.img_id);
      }, s && (e.classList.add("disabled"), e.title = "已在A4上 (點擊可移除)", e.style.cursor = "help");
      const n = document.createElement("img");
      n.src = i.url || i.base64, n.draggable = !1;
      const o = document.createElement("span");
      o.className = "label", o.innerText = i.title || i.img_id, e.appendChild(n), e.appendChild(o), t.appendChild(e);
    }));
  }
  isImageOnCanvas(t) {
    return this.canvas.getObjects().some((i) => i.imageId === t);
  }
  updateSidebarStatus(t, i) {
    this.config.uniqueImages && this.renderSidebar();
  }
  async addImageToCanvas(t) {
    if (this.config.uniqueImages && this.isImageOnCanvas(t)) return;
    const i = this.images.find((u) => u.img_id === t);
    if (!i) return;
    const e = i.url || i.base64, s = await M.fromURL(e);
    s.set({
      imageId: t,
      cornerSize: 10,
      transparentCorners: !1,
      originX: "center",
      originY: "center"
    });
    const o = this.config.dpi / 96;
    let r = 1, f = 1;
    i.original_width && i.original_height && s.width > 0 && s.height > 0 ? (r = i.original_width / s.width * o, f = i.original_height / s.height * o) : (r = o, f = o), s.scaleX = r, s.scaleY = f, this.config.defaultGrayscale && (s.filters.push(new H.Grayscale()), s.applyFilters()), this.setupCustomControls(s);
    const c = this.orientation === "portrait", g = c ? this.pageWidthPx : this.pageHeightPx, l = c ? this.pageHeightPx : this.pageWidthPx, d = g - this.pageMarginPx * 2, p = l - this.pageMarginPx * 2;
    if (s.getScaledWidth() > d || s.getScaledHeight() > p) {
      const u = Math.min(d / s.getScaledWidth(), p / s.getScaledHeight());
      s.scaleX *= u, s.scaleY *= u;
    }
    let h = this.pageCount - 1;
    const v = ((u) => this.canvas.getObjects().filter((y) => !y.isBackground).filter((y) => {
      const w = y.getCenterPoint();
      if (c) {
        const I = u * (g + this.gap), O = I + g;
        return w.x >= I && w.x < O;
      } else {
        const I = u * (l + this.gap), O = I + l;
        return w.y >= I && w.y < O;
      }
    }))(h);
    let m = 0;
    const P = this.pageMarginPx;
    if (v.length > 0) {
      let u = 0;
      v.forEach((S) => {
        let y = 0;
        if (c)
          y = S.top + S.getScaledHeight() / 2;
        else {
          const w = h * (l + this.gap);
          y = S.top - w + S.getScaledHeight() / 2;
        }
        y > u && (u = y);
      }), m = u + this.gap;
    } else
      m = P;
    m + s.getScaledHeight() > l - this.pageMarginPx && (this.addPage(), h++, m = P);
    let b, E;
    if (c)
      b = h * (g + this.gap) + this.pageMarginPx + s.getScaledWidth() / 2, E = m + s.getScaledHeight() / 2;
    else {
      const u = h * (l + this.gap);
      b = this.pageMarginPx + s.getScaledWidth() / 2, E = u + m + s.getScaledHeight() / 2;
    }
    s.set({ left: b, top: E }), this.canvas.add(s), this.canvas.setActiveObject(s), this.updateSidebarStatus(t, !0);
  }
  setupCustomControls(t) {
    delete t.controls.ml, delete t.controls.mr, delete t.controls.mt, delete t.controls.mb, delete t.controls.mtr, t.controls.deleteControl = A, t.controls.grayscaleControl = Y, t.controls.rotate90Control = X;
  }
  setupLayout() {
    let t, i;
    const e = this.canvas.getObjects().filter((s) => s.isBackground);
    if (this.canvas.remove(...e), this.orientation === "portrait") {
      const s = this.pageWidthPx, n = this.pageHeightPx;
      i = n, t = (s + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: t, height: i },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new T({
          left: o * (s + this.gap),
          top: 0,
          width: s,
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
      const s = this.pageHeightPx, n = this.pageWidthPx;
      t = s, i = (n + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: t, height: i },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new T({
          left: 0,
          top: o * (n + this.gap),
          width: s,
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
    this.canvas.calcOffset(), this._beginLayoutCycle(), this.canvas.requestRenderAll();
  }
  toggleOrientation() {
    const t = this.orientation;
    this.orientation = t === "portrait" ? "landscape" : "portrait", this.canvas.getObjects().filter((e) => !e.isBackground).forEach((e) => {
      const s = e.getCenterPoint();
      let n = 0, o = 0, r = 0;
      const f = this.pageWidthPx, c = this.pageHeightPx;
      if (t === "portrait")
        n = Math.floor(s.x / (f + this.gap)), o = s.x - n * (f + this.gap), r = s.y;
      else {
        const h = f;
        n = Math.floor(s.y / (h + this.gap)), o = s.x, r = s.y - n * (h + this.gap);
      }
      let g, l;
      t === "portrait" ? (g = c - r, l = o, e.angle = (e.angle || 0) + 90) : (g = r, l = c - o, e.angle = (e.angle || 0) - 90);
      let d, p;
      this.orientation === "portrait" ? (d = n * (f + this.gap) + g, p = l) : (d = g, p = n * (f + this.gap) + l), e.setPositionByOrigin(new B(d, p), "center", "center"), e.setCoords();
    }), this.setupLayout();
  }
  setupEvents() {
    this.canvas.on("object:custom:delete", (t) => {
      t.target && t.target.imageId && this.updateSidebarStatus(t.target.imageId, !1);
    });
  }
  save(t = {}) {
    const i = this.canvas.getObjects().filter((r) => !r.isBackground), e = [], s = this.pageWidthPx, n = this.pageHeightPx, o = this.gap;
    return i.forEach((r, f) => {
      const c = r.getCenterPoint();
      let g = 1, l = 0, d = 0;
      if (this.orientation === "portrait") {
        const h = Math.floor(c.x / (s + o));
        g = h + 1, l = c.x - h * (s + o), d = c.y;
      } else {
        const h = s, C = Math.floor(c.y / (h + o));
        g = C + 1, l = c.x, d = c.y - C * (h + o);
      }
      const p = {
        type: "image",
        originX: "center",
        originY: "center",
        left: l,
        top: d,
        angle: r.angle || 0,
        width: r.width,
        height: r.height,
        scaleX: r.scaleX || 1,
        scaleY: r.scaleY || 1,
        is_grayscale: r.filters.some((h) => h.type === "Grayscale")
      };
      e.push({
        seq_no: f + 1,
        img_id: r.imageId,
        page_num: g,
        img_setting: p
      });
    }), {
      data: { ...this.config.data, ...t },
      page: {
        orientation: this.orientation,
        dpi: this.config.dpi,
        width: this.orientation === "portrait" ? s : n,
        height: this.orientation === "portrait" ? n : s,
        margin: this.config.pageMargin,
        pages: this.pageCount
      },
      items: e
    };
  }
  async saveToBackend(t = {}) {
    const i = this.save(t);
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
      const s = await e.json();
      if (s.succ === !1)
        throw new Error(s.error || "Server reported failure.");
      return s;
    } catch (e) {
      throw console.error("Save failed:", e), e;
    }
  }
  async load(t) {
    if (!t) return { success: !1, message: "No data" };
    let i = t;
    if ("succ" in t) {
      if (t.succ === !1)
        return { success: !1, message: t.error || "Unknown error from API data" };
      t.data && (i = t.data);
    }
    const e = i;
    this.canvas.clear(), this.orientation = e.page && e.page.orientation || e.orientation || "portrait", this.pageCount = e.page && e.page.pages || e.pageCount || 1, e.page && typeof e.page.margin < "u" ? this.config.pageMargin = e.page.margin : typeof e.margin < "u" && (this.config.pageMargin = e.margin);
    const s = (d) => Math.round(d / 25.4 * this.config.dpi);
    this.pageMarginPx = s(this.config.pageMargin), this.setupLayout();
    const n = e.items || [], o = /* @__PURE__ */ new Set(), r = [], f = e.page && e.page.dpi || e.dpi || this.config.dpi, c = this.config.dpi / f, g = this.pageWidthPx;
    this.pageHeightPx;
    const l = this.gap;
    for (const d of n) {
      const p = d.img_id, h = d.img_setting || {};
      if (this.config.uniqueImages && o.has(p)) {
        const v = this.images.find((P) => P.img_id === p), m = v ? v.title || v.img_id : p;
        r.push(m);
        continue;
      }
      const C = this.images.find((v) => v.img_id === p);
      if (C) {
        o.add(p);
        const v = (d.page_num || 1) - 1;
        let m = 0, P = 0;
        if (this.orientation === "portrait")
          m = (h.left || 0) + v * (g + l), P = h.top || 0;
        else {
          const y = g;
          m = h.left || 0, P = (h.top || 0) + v * (y + l);
        }
        let b = h.scaleX || 1, E = h.scaleY || 1;
        if (Math.abs(c - 1) > 1e-4) {
          const y = (h.left || 0) * c, w = (h.top || 0) * c;
          if (this.orientation === "portrait")
            m = y + v * (g + l), P = w;
          else {
            const I = g;
            m = y, P = w + v * (I + l);
          }
          b *= c, E *= c;
        }
        const u = C.url || C.base64, S = await M.fromURL(u);
        S.set({
          left: m,
          top: P,
          angle: h.angle || 0,
          scaleX: b,
          scaleY: E,
          originX: "center",
          originY: "center",
          imageId: p,
          cornerSize: 10,
          transparentCorners: !1
        }), h.is_grayscale && (S.filters.push(new H.Grayscale()), S.applyFilters()), this.setupCustomControls(S), this.canvas.add(S), this.updateSidebarStatus(p, !0);
      } else
        console.warn(`Image ID ${p} not found in API. Skipping.`);
    }
    return this.canvas.requestRenderAll(), { success: !0, skipped: r };
  }
  addPage() {
    this.pageCount++, this.setupLayout();
  }
  removePage() {
    if (this.pageCount > 1) {
      const t = this.pageWidthPx, i = this.pageHeightPx, e = this.pageCount - 1;
      let s, n, o, r;
      if (this.orientation === "portrait")
        s = e * (t + this.gap), n = 0, o = t, r = i;
      else {
        const l = i, d = t;
        s = 0, n = e * (d + this.gap), o = l, r = d;
      }
      const f = this.canvas.getObjects().filter((l) => !l.isBackground), c = [], g = /* @__PURE__ */ new Set();
      f.forEach((l) => {
        const d = l.getCenterPoint();
        d.x >= s && d.x <= s + o && d.y >= n && d.y <= n + r && c.push(l);
      }), c.forEach((l) => {
        l.imageId && g.add(l.imageId), this.canvas.remove(l);
      }), this.pageCount--, this.setupLayout(), g.size > 0 && this.updateSidebarStatus(null, !1);
    }
  }
  enforceUniqueness() {
    if (!this.config.uniqueImages) return;
    const t = this.canvas.getObjects().filter((s) => !s.isBackground), i = /* @__PURE__ */ new Set(), e = [];
    return t.forEach((s) => {
      s.imageId && (i.has(s.imageId) ? e.push(s) : i.add(s.imageId));
    }), e.forEach((s) => {
      this.canvas.remove(s);
    }), this.canvas.requestRenderAll(), e.length;
  }
  cleanupOutOfBounds() {
    const t = this.canvas.getObjects().filter((s) => !s.isBackground), i = this.canvas.getWidth(), e = this.canvas.getHeight();
    t.forEach((s) => {
      const n = s.getCenterPoint();
      (n.x < -50 || n.x > i + 50 || n.y < -50 || n.y > e + 50) && (this.canvas.remove(s), s.imageId && this.updateSidebarStatus(s.imageId, !1));
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
