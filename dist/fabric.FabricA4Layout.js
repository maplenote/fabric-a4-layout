import { Control as D, filters as E, util as H, Canvas as W, FabricImage as z, Rect as M, Point as T } from "fabric";
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
}, L = (a, t, s, i, e) => {
  a.save(), a.translate(t, s), a.rotate(H.degreesToRadians(e.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "#F44336", a.fill(), a.lineWidth = 2, a.strokeStyle = "white", a.beginPath(), a.moveTo(-24 / 4, -24 / 4), a.lineTo(24 / 4, 24 / 4), a.moveTo(24 / 4, -24 / 4), a.lineTo(-24 / 4, 24 / 4), a.stroke(), a.restore();
}, A = new D({
  x: 0.5,
  y: -0.5,
  // Top Right
  offsetY: 16,
  offsetX: -16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, t) => {
    const s = t.target, i = s.canvas;
    return i.remove(s), s.imageId && i.fire("object:custom:delete", { target: s }), i.requestRenderAll(), !0;
  },
  render: L
}), R = (a, t, s, i, e) => {
  a.save(), a.translate(t, s), a.rotate(H.degreesToRadians(e.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.lineWidth = 1, a.strokeStyle = "#333", a.stroke(), a.beginPath(), a.arc(0, 0, 24 / 2, -Math.PI / 2, Math.PI / 2, !1), a.fillStyle = "black", a.fill(), a.restore();
}, j = new D({
  x: -0.5,
  y: 0.5,
  // Bottom Left
  offsetY: -16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, t) => {
    const s = t.target, i = s.canvas;
    return i.setCursor("wait"), setTimeout(() => {
      s.filters.some((n) => n.type === "Grayscale") ? s.filters = s.filters.filter((n) => n.type !== "Grayscale") : s.filters.push(new E.Grayscale()), s.applyFilters(), i.setCursor("default"), i.requestRenderAll(), i.fire("object:modified", { target: s });
    }, 50), !0;
  },
  render: R
}), Y = (a, t, s, i, e) => {
  a.save(), a.translate(t, s), a.rotate(H.degreesToRadians(e.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.strokeStyle = "#2196F3", a.lineWidth = 2, a.beginPath(), a.arc(0, 0, 24 / 4, 0, Math.PI * 1.5, !1), a.stroke(), a.fillStyle = "#2196F3", a.beginPath(), a.moveTo(24 / 4, -24 / 8), a.lineTo(24 / 4 + 4, 0), a.lineTo(24 / 4 - 4, 0), a.fill(), a.restore();
}, $ = new D({
  x: -0.5,
  y: -0.5,
  // Top Left
  offsetY: 16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "crosshair",
  mouseUpHandler: (a, t) => {
    const s = t.target, i = s.canvas, e = s.angle || 0;
    return s.set("angle", (e + 90) % 360), s.setCoords(), i.requestRenderAll(), i.fire("object:modified", { target: s }), !0;
  },
  render: Y
});
class q {
  constructor(t) {
    var i, e, n;
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
      warnOnUnsavedClose: !0,
      buttons: {},
      // Map of action -> buttonId
      statusDisplayId: null,
      errorDisplayId: null,
      locale: {},
      onDirtyChange: null,
      ...t
    }, typeof this.config.warnOnUnsavedClose != "boolean" && (typeof this.config.unsavedWarning == "string" ? this.config.warnOnUnsavedClose = this.config.unsavedWarning.trim().length > 0 : this.config.warnOnUnsavedClose = !1), this.t = {
      status: { ...k.status, ...((i = this.config.locale) == null ? void 0 : i.status) || {} },
      error: { ...k.error, ...((e = this.config.locale) == null ? void 0 : e.error) || {} },
      confirm: { ...k.confirm, ...((n = this.config.locale) == null ? void 0 : n.confirm) || {} }
    }, this.config.dpi < 24 && (this.config.dpi = 24), this.config.dpi > 192 && (this.config.dpi = 192);
    const s = (r) => Math.round(r / 25.4 * this.config.dpi);
    this.pageWidthPx = s(this.config.width), this.pageHeightPx = s(this.config.height), this.pageMarginPx = s(this.config.pageMargin), this.gap = 4, this.canvasId = this.config.canvasId, this.canvas = null, this.images = [], this.pageCount = 1, this.orientation = this._normalizeOrientation(this.config.orientation), this._layoutPending = !1, this._layoutPromise = null, this._dirty = !1, this._suppressDirty = 0;
  }
  _normalizeOrientation(t) {
    const i = (t === null || typeof t > "u" ? "" : String(t).trim()).toLowerCase();
    return i === "p" || i === "portrait" ? "portrait" : i === "l" || i === "landscape" ? "landscape" : "portrait";
  }
  async init() {
    this.canvas = new W(this.canvasId, {
      preserveObjectStacking: !0,
      selection: !0,
      enableRetinaScaling: !1
    }), this.setupLayout(), await this.fetchImages(), this.setupEvents(), this.bindControls(), this.updateStatusDisplay(), this.canvas.on("after:render", (t) => this._renderBleedOverlay(t.ctx)), this.canvas.requestRenderAll();
  }
  isDirty() {
    return this._dirty;
  }
  markSaved() {
    this._setDirty(!1, "markSaved");
  }
  markDirty(t = "manual") {
    this._setDirty(!0, t);
  }
  _setDirty(t, s) {
    if (this._suppressDirty > 0) return;
    const i = !!t;
    this._dirty !== i && (this._dirty = i, typeof this.config.onDirtyChange == "function" && this.config.onDirtyChange(this._dirty, s || "unknown"));
  }
  _withDirtySuppressed(t) {
    this._suppressDirty++;
    let s;
    try {
      s = t();
    } catch (i) {
      throw this._suppressDirty = Math.max(0, this._suppressDirty - 1), i;
    }
    return s && typeof s.then == "function" ? s.finally(() => {
      this._suppressDirty = Math.max(0, this._suppressDirty - 1);
    }) : (this._suppressDirty = Math.max(0, this._suppressDirty - 1), s);
  }
  _renderBleedOverlay(t) {
    if (!this.canvas) return;
    t.save();
    const s = this.canvas.viewportTransform;
    t.transform(s[0], s[1], s[2], s[3], s[4], s[5]);
    const i = this.pageMarginPx, e = this.pageWidthPx, n = this.pageHeightPx, r = this.gap;
    t.fillStyle = "rgba(189, 189, 255, 0.2)", t.beginPath();
    for (let h = 0; h < this.pageCount; h++) {
      let l, d, c, o;
      if (this.orientation === "portrait")
        l = h * (e + r), d = 0, c = e, o = n;
      else {
        const g = n, f = e;
        l = 0, d = h * (f + r), c = g, o = f;
      }
      t.rect(l, d, c, o), t.rect(l + i, d + i, c - 2 * i, o - 2 * i);
    }
    t.fill("evenodd"), t.restore();
  }
  _beginLayoutCycle() {
    this.canvas && (this._layoutPending = !0, this._layoutPromise = new Promise((t) => {
      const s = () => {
        this.canvas.off("after:render", s), this._layoutPending = !1, t();
      };
      this.canvas.on("after:render", s);
    }));
  }
  _waitForLayout() {
    return !this._layoutPending || !this._layoutPromise ? Promise.resolve() : this._layoutPromise;
  }
  bindControls() {
    const t = this.config.buttons, s = (i, e) => {
      if (i) {
        const n = document.getElementById(i);
        if (n) {
          const r = n.cloneNode(!0);
          n.parentNode.replaceChild(r, n), r.onclick = e;
        }
      }
    };
    if (s(t.orientation, () => {
      this.toggleOrientation(), this.updateStatusDisplay();
    }), s(t.addPage, () => {
      this.addPage(), this.updateStatusDisplay();
    }), s(t.removePage, () => {
      this.removePage(), this.updateStatusDisplay();
    }), s(t.refreshImages, async () => {
      await this._waitForLayout(), this.cleanupOutOfBounds(), await this.fetchImages(), this.showError(this.t.error.listUpdated, !0);
    }), s(t.clearCanvas, () => {
      confirm(this.t.confirm.clearCanvas) && (this.clearCanvas(), this.showError(this.t.error.canvasCleared, !0));
    }), t.save) {
      const i = document.getElementById(t.save);
      if (i) {
        const e = i.cloneNode(!0);
        i.parentNode.replaceChild(e, i), e.onclick = () => {
          const n = this.save();
          this.config.onSave && this.config.onSave(n);
        };
      }
    }
    if (t.load) {
      const i = document.getElementById(t.load);
      if (i) {
        const e = i.cloneNode(!0);
        i.parentNode.replaceChild(e, i), e.onclick = async () => {
          let n = null;
          if (this.config.onLoad && (n = this.config.onLoad()), n) {
            const r = await this.load(n);
            this.updateStatusDisplay(), r.skipped && r.skipped.length > 0 && this.showError(`${this.t.error.skipped} ${r.skipped.join(", ")}`);
          } else
            this.showError(this.t.error.noData);
        };
      }
    }
    if (t.settings && this.config.onSettingsClick) {
      const i = document.getElementById(t.settings);
      if (i) {
        const e = i.cloneNode(!0);
        i.parentNode.replaceChild(e, i), e.onclick = this.config.onSettingsClick;
      }
    }
  }
  showError(t, s = !1) {
    if (this.config.errorDisplayId) {
      const i = document.getElementById(this.config.errorDisplayId);
      i && (i.style.display = "block", i.innerText = t, i.style.backgroundColor = s ? "#e8f5e9" : "#ffebee", i.style.color = s ? "#2e7d32" : "#c62828", i.style.borderColor = s ? "#a5d6a7" : "#ef9a9a", setTimeout(() => {
        i.style.display = "none";
      }, 5e3));
    } else
      console.log(s ? "Info:" : "Error:", t), s || alert(t);
  }
  updateStatusDisplay() {
    if (this.config.statusDisplayId) {
      const t = document.getElementById(this.config.statusDisplayId);
      if (t && this.canvas) {
        const s = this.canvas.getWidth(), i = this.canvas.getHeight(), e = this.orientation === "portrait" ? this.t.status.portrait : this.t.status.landscape;
        t.innerHTML = `
                <strong>${this.t.status.setting}</strong> ${this.t.status.dpi} ${this.config.dpi} | 
                <strong>${this.t.status.pages}</strong> ${this.pageCount} | 
                <strong>${this.t.status.orientation}</strong> ${e} | 
                <strong>${this.t.status.size}</strong> ${s} x ${i} px |
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
      const s = await t.json();
      if (s.succ === !1)
        throw new Error(s.error || this.t.error.fetchFailed);
      this.images = s.data || [], this.renderSidebar();
    } catch (t) {
      console.error(this.t.error.readError, t), this.showError(`${this.t.error.fetchFailed}: ${t.message}`), this.images = [], this.renderSidebar();
    }
  }
  renderSidebar() {
    const t = document.getElementById("image-sidebar");
    t && (t.innerHTML = "", this.images.forEach((s) => {
      const i = document.createElement("div");
      i.className = "image-item", i.dataset.id = s.img_id;
      const e = this.config.uniqueImages && this.isImageOnCanvas(s.img_id);
      i.onclick = () => {
        e ? confirm(this.t.confirm.removeImage) && (this.canvas.getObjects().filter((l) => l.imageId === s.img_id).forEach((l) => this.canvas.remove(l)), this.updateSidebarStatus(s.img_id, !1), this.showError(this.t.error.removedFromCanvas, !0)) : this.addImageToCanvas(s.img_id);
      }, e && (i.classList.add("disabled"), i.title = "已在A4上 (點擊可移除)", i.style.cursor = "help");
      const n = document.createElement("img");
      n.src = s.url || s.base64, n.draggable = !1;
      const r = document.createElement("span");
      r.className = "label", r.innerText = s.title || s.img_id, i.appendChild(n), i.appendChild(r), t.appendChild(i);
    }));
  }
  isImageOnCanvas(t) {
    return this.canvas.getObjects().some((s) => s.imageId === t);
  }
  updateSidebarStatus(t, s) {
    this.config.uniqueImages && this.renderSidebar();
  }
  async addImageToCanvas(t) {
    if (this.config.uniqueImages && this.isImageOnCanvas(t)) return;
    const s = this.images.find((u) => u.img_id === t);
    if (!s) return;
    const i = s.url || s.base64, e = await z.fromURL(i);
    e.set({
      imageId: t,
      cornerSize: 10,
      transparentCorners: !1,
      originX: "center",
      originY: "center"
    });
    const r = this.config.dpi / 96;
    let h = 1, l = 1;
    s.original_width && s.original_height && e.width > 0 && e.height > 0 ? (h = s.original_width / e.width * r, l = s.original_height / e.height * r) : (h = r, l = r), e.scaleX = h, e.scaleY = l, this.config.defaultGrayscale && (e.filters.push(new E.Grayscale()), e.applyFilters()), this.setupCustomControls(e);
    const d = this.orientation === "portrait", c = d ? this.pageWidthPx : this.pageHeightPx, o = d ? this.pageHeightPx : this.pageWidthPx, g = c - this.pageMarginPx * 2, f = o - this.pageMarginPx * 2;
    if (e.getScaledWidth() > g || e.getScaledHeight() > f) {
      const u = Math.min(g / e.getScaledWidth(), f / e.getScaledHeight());
      e.scaleX *= u, e.scaleY *= u;
    }
    let m = this.pageCount - 1;
    const y = ((u) => this.canvas.getObjects().filter((b) => !b.isBackground).filter((b) => {
      const w = b.getCenterPoint();
      if (d) {
        const I = u * (c + this.gap), O = I + c;
        return w.x >= I && w.x < O;
      } else {
        const I = u * (o + this.gap), O = I + o;
        return w.y >= I && w.y < O;
      }
    }))(m);
    let P = 0;
    const v = this.pageMarginPx;
    if (y.length > 0) {
      let u = 0;
      y.forEach((_) => {
        let b = 0;
        if (d)
          b = _.top + _.getScaledHeight() / 2;
        else {
          const w = m * (o + this.gap);
          b = _.top - w + _.getScaledHeight() / 2;
        }
        b > u && (u = b);
      }), P = u + this.gap;
    } else
      P = v;
    P + e.getScaledHeight() > o - this.pageMarginPx && (this.addPage(), m++, P = v);
    let S, C;
    if (d)
      S = m * (c + this.gap) + this.pageMarginPx + e.getScaledWidth() / 2, C = P + e.getScaledHeight() / 2;
    else {
      const u = m * (o + this.gap);
      S = this.pageMarginPx + e.getScaledWidth() / 2, C = u + P + e.getScaledHeight() / 2;
    }
    e.set({ left: S, top: C }), this.canvas.add(e), this.canvas.setActiveObject(e), this.updateSidebarStatus(t, !0);
  }
  setupCustomControls(t) {
    delete t.controls.ml, delete t.controls.mr, delete t.controls.mt, delete t.controls.mb, delete t.controls.mtr, t.controls.deleteControl = A, t.controls.grayscaleControl = j, t.controls.rotate90Control = $;
  }
  setupLayout() {
    return this._withDirtySuppressed(() => {
      let t, s;
      const i = this.canvas.getObjects().filter((e) => e.isBackground);
      if (this.canvas.remove(...i), this.orientation === "portrait") {
        const e = this.pageWidthPx, n = this.pageHeightPx;
        s = n, t = (e + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
          { width: t, height: s },
          { cssOnly: !1, backstoreOnly: !1 }
        );
        for (let r = 0; r < this.pageCount; r++) {
          const h = new M({
            left: r * (e + this.gap),
            top: 0,
            width: e,
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
          this.canvas.add(h), this.canvas.sendObjectToBack(h);
        }
      } else {
        const e = this.pageHeightPx, n = this.pageWidthPx;
        t = e, s = (n + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
          { width: t, height: s },
          { cssOnly: !1, backstoreOnly: !1 }
        );
        for (let r = 0; r < this.pageCount; r++) {
          const h = new M({
            left: 0,
            top: r * (n + this.gap),
            width: e,
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
          this.canvas.add(h), this.canvas.sendObjectToBack(h);
        }
      }
      this.canvas.calcOffset(), this._beginLayoutCycle(), this.canvas.requestRenderAll();
    });
  }
  toggleOrientation() {
    const t = this.orientation;
    this.orientation = t === "portrait" ? "landscape" : "portrait", this.canvas.getObjects().filter((i) => !i.isBackground).forEach((i) => {
      const e = i.getCenterPoint();
      let n = 0, r = 0, h = 0;
      const l = this.pageWidthPx, d = this.pageHeightPx;
      if (t === "portrait")
        n = Math.floor(e.x / (l + this.gap)), r = e.x - n * (l + this.gap), h = e.y;
      else {
        const m = l;
        n = Math.floor(e.y / (m + this.gap)), r = e.x, h = e.y - n * (m + this.gap);
      }
      let c, o;
      t === "portrait" ? (c = d - h, o = r, i.angle = (i.angle || 0) + 90) : (c = h, o = d - r, i.angle = (i.angle || 0) - 90);
      let g, f;
      this.orientation === "portrait" ? (g = n * (l + this.gap) + c, f = o) : (g = c, f = n * (l + this.gap) + o), i.setPositionByOrigin(new T(g, f), "center", "center"), i.setCoords();
    }), this.setupLayout(), this._setDirty(!0, "toggleOrientation");
  }
  setupEvents() {
    this.canvas.on("object:custom:delete", (t) => {
      t.target && t.target.imageId && this.updateSidebarStatus(t.target.imageId, !1);
    }), this.canvas.on("object:added", (t) => {
      t.target && !t.target.isBackground && this._setDirty(!0, "object:added");
    }), this.canvas.on("object:modified", (t) => {
      t.target && !t.target.isBackground && this._setDirty(!0, "object:modified");
    }), this.canvas.on("object:removed", (t) => {
      t.target && !t.target.isBackground && this._setDirty(!0, "object:removed");
    });
  }
  save(t = {}) {
    const s = this.canvas.getObjects().filter((l) => !l.isBackground), i = [], e = (l) => Math.round(l * 1e3) / 1e3, n = this.pageWidthPx, r = this.pageHeightPx, h = this.gap;
    return s.forEach((l, d) => {
      const c = l.getCenterPoint();
      let o = 1, g = 0, f = 0;
      if (this.orientation === "portrait") {
        const p = Math.floor(c.x / (n + h));
        o = p + 1, g = c.x - p * (n + h), f = c.y;
      } else {
        const p = n, y = Math.floor(c.y / (p + h));
        o = y + 1, g = c.x, f = c.y - y * (p + h);
      }
      const m = {
        type: "image",
        originX: "center",
        originY: "center",
        left: e(g),
        top: e(f),
        angle: l.angle || 0,
        width: l.width,
        height: l.height,
        scaleX: e(l.scaleX || 1),
        scaleY: e(l.scaleY || 1),
        is_grayscale: l.filters.some((p) => p.type === "Grayscale")
      };
      i.push({
        seq_no: d + 1,
        img_id: l.imageId,
        page_num: o,
        img_setting: m
      });
    }), {
      data: { ...this.config.data, ...t },
      page: {
        orientation: this.orientation,
        dpi: this.config.dpi,
        width: e(this.orientation === "portrait" ? n : r),
        height: e(this.orientation === "portrait" ? r : n),
        margin: this.config.pageMargin,
        pages: this.pageCount
      },
      items: i
    };
  }
  async saveToBackend(t = {}) {
    const s = this.save(t);
    if (!this.config.saveEndpoint)
      throw new Error("No saveEndpoint configured.");
    try {
      const i = await fetch(this.config.saveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(s)
      });
      if (!i.ok)
        throw new Error(`HTTP error! status: ${i.status}`);
      const e = await i.json();
      if (e.succ === !1)
        throw new Error(e.error || "Server reported failure.");
      return e;
    } catch (i) {
      throw console.error("Save failed:", i), i;
    }
  }
  async load(t) {
    if (!t) return { success: !1, message: "No data" };
    const s = await this._withDirtySuppressed(async () => {
      let i = t;
      if ("succ" in t) {
        if (t.succ === !1)
          return { success: !1, message: t.error || "Unknown error from API data" };
        t.data && (i = t.data);
      }
      const e = i;
      this.canvas.clear();
      const n = e.page && e.page.orientation || e.orientation || "portrait";
      this.orientation = this._normalizeOrientation(n), this.pageCount = e.page && e.page.pages || e.pageCount || 1, e.page && typeof e.page.margin < "u" ? this.config.pageMargin = e.page.margin : typeof e.margin < "u" && (this.config.pageMargin = e.margin);
      const r = (m) => Math.round(m / 25.4 * this.config.dpi);
      this.pageMarginPx = r(this.config.pageMargin), this.setupLayout();
      const h = e.items || [], l = /* @__PURE__ */ new Set(), d = [], c = e.page && e.page.dpi || e.dpi || this.config.dpi, o = this.config.dpi / c, g = this.pageWidthPx;
      this.pageHeightPx;
      const f = this.gap;
      for (const m of h) {
        const p = m.img_id, y = m.img_setting || {};
        if (this.config.uniqueImages && l.has(p)) {
          const v = this.images.find((C) => C.img_id === p), S = v ? v.title || v.img_id : p;
          d.push(S);
          continue;
        }
        const P = this.images.find((v) => v.img_id === p);
        if (P) {
          l.add(p);
          const v = (m.page_num || 1) - 1;
          let S = 0, C = 0;
          if (this.orientation === "portrait")
            S = (y.left || 0) + v * (g + f), C = y.top || 0;
          else {
            const I = g;
            S = y.left || 0, C = (y.top || 0) + v * (I + f);
          }
          let u = y.scaleX || 1, _ = y.scaleY || 1;
          if (Math.abs(o - 1) > 1e-4) {
            const I = (y.left || 0) * o, O = (y.top || 0) * o;
            if (this.orientation === "portrait")
              S = I + v * (g + f), C = O;
            else {
              const B = g;
              S = I, C = O + v * (B + f);
            }
            u *= o, _ *= o;
          }
          const b = P.url || P.base64, w = await z.fromURL(b);
          w.set({
            left: S,
            top: C,
            angle: y.angle || 0,
            scaleX: u,
            scaleY: _,
            originX: "center",
            originY: "center",
            imageId: p,
            cornerSize: 10,
            transparentCorners: !1
          }), y.is_grayscale && (w.filters.push(new E.Grayscale()), w.applyFilters()), this.setupCustomControls(w), this.canvas.add(w), this.updateSidebarStatus(p, !0);
        } else
          console.warn(`Image ID ${p} not found in API. Skipping.`);
      }
      return this.canvas.requestRenderAll(), { success: !0, skipped: d };
    });
    return s && s.success !== !1 && this._setDirty(!0, "load"), s;
  }
  addPage() {
    this.pageCount++, this.setupLayout(), this._setDirty(!0, "addPage");
  }
  removePage() {
    if (this.pageCount > 1) {
      const t = this.pageWidthPx, s = this.pageHeightPx, i = this.pageCount - 1;
      let e, n, r, h;
      if (this.orientation === "portrait")
        e = i * (t + this.gap), n = 0, r = t, h = s;
      else {
        const o = s, g = t;
        e = 0, n = i * (g + this.gap), r = o, h = g;
      }
      const l = this.canvas.getObjects().filter((o) => !o.isBackground), d = [], c = /* @__PURE__ */ new Set();
      l.forEach((o) => {
        const g = o.getCenterPoint();
        g.x >= e && g.x <= e + r && g.y >= n && g.y <= n + h && d.push(o);
      }), d.forEach((o) => {
        o.imageId && c.add(o.imageId), this.canvas.remove(o);
      }), this.pageCount--, this.setupLayout(), c.size > 0 && this.updateSidebarStatus(null, !1), this._setDirty(!0, "removePage");
    }
  }
  enforceUniqueness() {
    if (!this.config.uniqueImages) return;
    const t = this.canvas.getObjects().filter((e) => !e.isBackground), s = /* @__PURE__ */ new Set(), i = [];
    return t.forEach((e) => {
      e.imageId && (s.has(e.imageId) ? i.push(e) : s.add(e.imageId));
    }), i.forEach((e) => {
      this.canvas.remove(e);
    }), this.canvas.requestRenderAll(), i.length;
  }
  cleanupOutOfBounds() {
    const t = this.canvas.getObjects().filter((e) => !e.isBackground), s = this.canvas.getWidth(), i = this.canvas.getHeight();
    t.forEach((e) => {
      const n = e.getCenterPoint();
      (n.x < -50 || n.x > s + 50 || n.y < -50 || n.y > i + 50) && (this.canvas.remove(e), e.imageId && this.updateSidebarStatus(e.imageId, !1));
    }), this.canvas.requestRenderAll(), this._setDirty(!0, "cleanupOutOfBounds");
  }
  clearCanvas() {
    this.canvas.getObjects().filter((s) => !s.isBackground).forEach((s) => {
      this.canvas.remove(s), s.imageId && this.updateSidebarStatus(s.imageId, !1);
    }), this.canvas.requestRenderAll(), this._setDirty(!0, "clearCanvas");
  }
  destroy() {
    this.canvas && (this.canvas.dispose(), this.canvas = null);
  }
}
export {
  q as FabricA4Layout
};
