import { Control as D, filters as E, util as H, Canvas as W, FabricImage as B, Rect as z, Point as T } from "fabric";
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
}, L = (a, t, e, i, s) => {
  a.save(), a.translate(t, e), a.rotate(H.degreesToRadians(s.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "#F44336", a.fill(), a.lineWidth = 2, a.strokeStyle = "white", a.beginPath(), a.moveTo(-24 / 4, -24 / 4), a.lineTo(24 / 4, 24 / 4), a.moveTo(24 / 4, -24 / 4), a.lineTo(-24 / 4, 24 / 4), a.stroke(), a.restore();
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
    const e = t.target, i = e.canvas;
    return i.remove(e), e.imageId && i.fire("object:custom:delete", { target: e }), i.requestRenderAll(), !0;
  },
  render: L
}), R = (a, t, e, i, s) => {
  a.save(), a.translate(t, e), a.rotate(H.degreesToRadians(s.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.lineWidth = 1, a.strokeStyle = "#333", a.stroke(), a.beginPath(), a.arc(0, 0, 24 / 2, -Math.PI / 2, Math.PI / 2, !1), a.fillStyle = "black", a.fill(), a.restore();
}, Y = new D({
  x: -0.5,
  y: 0.5,
  // Bottom Left
  offsetY: -16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, t) => {
    const e = t.target, i = e.canvas;
    return i.setCursor("wait"), setTimeout(() => {
      e.filters.some((n) => n.type === "Grayscale") ? e.filters = e.filters.filter((n) => n.type !== "Grayscale") : e.filters.push(new E.Grayscale()), e.applyFilters(), i.setCursor("default"), i.requestRenderAll(), i.fire("object:modified", { target: e });
    }, 50), !0;
  },
  render: R
}), $ = (a, t, e, i, s) => {
  a.save(), a.translate(t, e), a.rotate(H.degreesToRadians(s.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.strokeStyle = "#2196F3", a.lineWidth = 2, a.beginPath(), a.arc(0, 0, 24 / 4, 0, Math.PI * 1.5, !1), a.stroke(), a.fillStyle = "#2196F3", a.beginPath(), a.moveTo(24 / 4, -24 / 8), a.lineTo(24 / 4 + 4, 0), a.lineTo(24 / 4 - 4, 0), a.fill(), a.restore();
}, X = new D({
  x: -0.5,
  y: -0.5,
  // Top Left
  offsetY: 16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "crosshair",
  mouseUpHandler: (a, t) => {
    const e = t.target, i = e.canvas, s = e.angle || 0;
    return e.set("angle", (s + 90) % 360), e.setCoords(), i.requestRenderAll(), i.fire("object:modified", { target: e }), !0;
  },
  render: $
});
class q {
  constructor(t) {
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
      status: { ...k.status, ...this.config.locale?.status || {} },
      error: { ...k.error, ...this.config.locale?.error || {} },
      confirm: { ...k.confirm, ...this.config.locale?.confirm || {} }
    }, this.config.dpi < 24 && (this.config.dpi = 24), this.config.dpi > 192 && (this.config.dpi = 192);
    const e = (i) => Math.round(i / 25.4 * this.config.dpi);
    this.pageWidthPx = e(this.config.width), this.pageHeightPx = e(this.config.height), this.pageMarginPx = e(this.config.pageMargin), this.gap = 4, this.canvasId = this.config.canvasId, this.canvas = null, this.images = [], this.pageCount = 1, this.orientation = this._normalizeOrientation(this.config.orientation), this._layoutPending = !1, this._layoutPromise = null, this._dirty = !1, this._suppressDirty = 0;
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
  _setDirty(t, e) {
    if (this._suppressDirty > 0) return;
    const i = !!t;
    this._dirty !== i && (this._dirty = i, typeof this.config.onDirtyChange == "function" && this.config.onDirtyChange(this._dirty, e || "unknown"));
  }
  _withDirtySuppressed(t) {
    this._suppressDirty++;
    let e;
    try {
      e = t();
    } catch (i) {
      throw this._suppressDirty = Math.max(0, this._suppressDirty - 1), i;
    }
    return e && typeof e.then == "function" ? e.finally(() => {
      this._suppressDirty = Math.max(0, this._suppressDirty - 1);
    }) : (this._suppressDirty = Math.max(0, this._suppressDirty - 1), e);
  }
  _renderBleedOverlay(t) {
    if (!this.canvas) return;
    t.save();
    const e = this.canvas.viewportTransform;
    t.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
    const i = this.pageMarginPx, s = this.pageWidthPx, n = this.pageHeightPx, o = this.gap;
    t.fillStyle = "rgba(189, 189, 255, 0.2)", t.beginPath();
    for (let g = 0; g < this.pageCount; g++) {
      let c, f, l, r;
      if (this.orientation === "portrait")
        c = g * (s + o), f = 0, l = s, r = n;
      else {
        const h = n, d = s;
        c = 0, f = g * (d + o), l = h, r = d;
      }
      t.rect(c, f, l, r), t.rect(c + i, f + i, l - 2 * i, r - 2 * i);
    }
    t.fill("evenodd"), t.restore();
  }
  _beginLayoutCycle() {
    this.canvas && (this._layoutPending = !0, this._layoutPromise = new Promise((t) => {
      const e = () => {
        this.canvas.off("after:render", e), this._layoutPending = !1, t();
      };
      this.canvas.on("after:render", e);
    }));
  }
  _waitForLayout() {
    return !this._layoutPending || !this._layoutPromise ? Promise.resolve() : this._layoutPromise;
  }
  bindControls() {
    const t = this.config.buttons, e = (i, s) => {
      if (i) {
        const n = document.getElementById(i);
        if (n) {
          const o = n.cloneNode(!0);
          n.parentNode.replaceChild(o, n), o.onclick = s;
        }
      }
    };
    if (e(t.orientation, () => {
      this.toggleOrientation(), this.updateStatusDisplay();
    }), e(t.addPage, () => {
      this.addPage(), this.updateStatusDisplay();
    }), e(t.removePage, () => {
      this.removePage(), this.updateStatusDisplay();
    }), e(t.refreshImages, async () => {
      await this._waitForLayout(), this.cleanupOutOfBounds(), await this.fetchImages(), this.showError(this.t.error.listUpdated, !0);
    }), e(t.clearCanvas, () => {
      confirm(this.t.confirm.clearCanvas) && (this.clearCanvas(), this.showError(this.t.error.canvasCleared, !0));
    }), t.save) {
      const i = document.getElementById(t.save);
      if (i) {
        const s = i.cloneNode(!0);
        i.parentNode.replaceChild(s, i), s.onclick = () => {
          const n = this.save();
          this.config.onSave && this.config.onSave(n);
        };
      }
    }
    if (t.load) {
      const i = document.getElementById(t.load);
      if (i) {
        const s = i.cloneNode(!0);
        i.parentNode.replaceChild(s, i), s.onclick = async () => {
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
      const i = document.getElementById(t.settings);
      if (i) {
        const s = i.cloneNode(!0);
        i.parentNode.replaceChild(s, i), s.onclick = this.config.onSettingsClick;
      }
    }
  }
  showError(t, e = !1) {
    if (this.config.errorDisplayId) {
      const i = document.getElementById(this.config.errorDisplayId);
      i && (i.style.display = "block", i.innerText = t, i.style.backgroundColor = e ? "#e8f5e9" : "#ffebee", i.style.color = e ? "#2e7d32" : "#c62828", i.style.borderColor = e ? "#a5d6a7" : "#ef9a9a", setTimeout(() => {
        i.style.display = "none";
      }, 5e3));
    } else
      console.log(e ? "Info:" : "Error:", t), e || alert(t);
  }
  updateStatusDisplay() {
    if (this.config.statusDisplayId) {
      const t = document.getElementById(this.config.statusDisplayId);
      if (t && this.canvas) {
        const e = this.canvas.getWidth(), i = this.canvas.getHeight(), s = this.orientation === "portrait" ? this.t.status.portrait : this.t.status.landscape;
        t.innerHTML = `
                <strong>${this.t.status.setting}</strong> ${this.t.status.dpi} ${this.config.dpi} | 
                <strong>${this.t.status.pages}</strong> ${this.pageCount} | 
                <strong>${this.t.status.orientation}</strong> ${s} | 
                <strong>${this.t.status.size}</strong> ${e} x ${i} px |
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
      const e = await t.json();
      if (e.succ === !1)
        throw new Error(e.error || this.t.error.fetchFailed);
      this.images = e.data || [], this.renderSidebar();
    } catch (t) {
      console.error(this.t.error.readError, t), this.showError(`${this.t.error.fetchFailed}: ${t.message}`), this.images = [], this.renderSidebar();
    }
  }
  renderSidebar() {
    const t = document.getElementById("image-sidebar");
    t && (t.innerHTML = "", this.images.forEach((e) => {
      const i = document.createElement("div");
      i.className = "image-item", i.dataset.id = e.img_id;
      const s = this.config.uniqueImages && this.isImageOnCanvas(e.img_id);
      i.onclick = () => {
        s ? confirm(this.t.confirm.removeImage) && (this.canvas.getObjects().filter((c) => c.imageId === e.img_id).forEach((c) => this.canvas.remove(c)), this.updateSidebarStatus(e.img_id, !1), this.showError(this.t.error.removedFromCanvas, !0)) : this.addImageToCanvas(e.img_id);
      }, s && (i.classList.add("disabled"), i.title = "已在A4上 (點擊可移除)", i.style.cursor = "help");
      const n = document.createElement("img");
      n.src = e.url || e.base64, n.draggable = !1;
      const o = document.createElement("span");
      o.className = "label", o.innerText = e.title || e.img_id, i.appendChild(n), i.appendChild(o), t.appendChild(i);
    }));
  }
  isImageOnCanvas(t) {
    return this.canvas.getObjects().some((e) => e.imageId === t);
  }
  updateSidebarStatus(t, e) {
    this.config.uniqueImages && this.renderSidebar();
  }
  async addImageToCanvas(t) {
    if (this.config.uniqueImages && this.isImageOnCanvas(t)) return;
    const e = this.images.find((m) => m.img_id === t);
    if (!e) return;
    const i = e.url || e.base64, s = await B.fromURL(i);
    s.set({
      imageId: t,
      cornerSize: 10,
      transparentCorners: !1,
      originX: "center",
      originY: "center"
    });
    const o = this.config.dpi / 96;
    let g = 1, c = 1;
    e.original_width && e.original_height && s.width > 0 && s.height > 0 ? (g = e.original_width / s.width * o, c = e.original_height / s.height * o) : (g = o, c = o), s.scaleX = g, s.scaleY = c, this.config.defaultGrayscale && (s.filters.push(new E.Grayscale()), s.applyFilters()), this.setupCustomControls(s);
    const f = this.orientation === "portrait", l = f ? this.pageWidthPx : this.pageHeightPx, r = f ? this.pageHeightPx : this.pageWidthPx, h = l - this.pageMarginPx * 2, d = r - this.pageMarginPx * 2;
    if (s.getScaledWidth() > h || s.getScaledHeight() > d) {
      const m = Math.min(h / s.getScaledWidth(), d / s.getScaledHeight());
      s.scaleX *= m, s.scaleY *= m;
    }
    let p = this.pageCount - 1;
    const y = ((m) => this.canvas.getObjects().filter((b) => !b.isBackground).filter((b) => {
      const w = b.getCenterPoint();
      if (f) {
        const I = m * (l + this.gap), O = I + l;
        return w.x >= I && w.x < O;
      } else {
        const I = m * (r + this.gap), O = I + r;
        return w.y >= I && w.y < O;
      }
    }))(p);
    let S = 0;
    const v = this.pageMarginPx;
    if (y.length > 0) {
      let m = 0;
      y.forEach((_) => {
        let b = 0;
        if (f)
          b = _.top + _.getScaledHeight() / 2;
        else {
          const w = p * (r + this.gap);
          b = _.top - w + _.getScaledHeight() / 2;
        }
        b > m && (m = b);
      }), S = m + this.gap;
    } else
      S = v;
    S + s.getScaledHeight() > r - this.pageMarginPx && (this.addPage(), p++, S = v);
    let C, P;
    if (f)
      C = p * (l + this.gap) + this.pageMarginPx + s.getScaledWidth() / 2, P = S + s.getScaledHeight() / 2;
    else {
      const m = p * (r + this.gap);
      C = this.pageMarginPx + s.getScaledWidth() / 2, P = m + S + s.getScaledHeight() / 2;
    }
    s.set({ left: C, top: P }), this.canvas.add(s), this.canvas.setActiveObject(s), this.updateSidebarStatus(t, !0);
  }
  setupCustomControls(t) {
    delete t.controls.ml, delete t.controls.mr, delete t.controls.mt, delete t.controls.mb, delete t.controls.mtr, t.controls.deleteControl = A, t.controls.grayscaleControl = Y, t.controls.rotate90Control = X;
  }
  setupLayout() {
    return this._withDirtySuppressed(() => {
      let t, e;
      const i = this.canvas.getObjects().filter((s) => s.isBackground);
      if (this.canvas.remove(...i), this.orientation === "portrait") {
        const s = this.pageWidthPx, n = this.pageHeightPx;
        e = n, t = (s + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
          { width: t, height: e },
          { cssOnly: !1, backstoreOnly: !1 }
        );
        for (let o = 0; o < this.pageCount; o++) {
          const g = new z({
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
          this.canvas.add(g), this.canvas.sendObjectToBack(g);
        }
      } else {
        const s = this.pageHeightPx, n = this.pageWidthPx;
        t = s, e = (n + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
          { width: t, height: e },
          { cssOnly: !1, backstoreOnly: !1 }
        );
        for (let o = 0; o < this.pageCount; o++) {
          const g = new z({
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
          this.canvas.add(g), this.canvas.sendObjectToBack(g);
        }
      }
      this.canvas.calcOffset(), this._beginLayoutCycle(), this.canvas.requestRenderAll();
    });
  }
  toggleOrientation() {
    const t = this.orientation;
    this.orientation = t === "portrait" ? "landscape" : "portrait", this.canvas.getObjects().filter((i) => !i.isBackground).forEach((i) => {
      const s = i.getCenterPoint();
      let n = 0, o = 0, g = 0;
      const c = this.pageWidthPx, f = this.pageHeightPx;
      if (t === "portrait")
        n = Math.floor(s.x / (c + this.gap)), o = s.x - n * (c + this.gap), g = s.y;
      else {
        const p = c;
        n = Math.floor(s.y / (p + this.gap)), o = s.x, g = s.y - n * (p + this.gap);
      }
      let l, r;
      t === "portrait" ? (l = f - g, r = o, i.angle = (i.angle || 0) + 90) : (l = g, r = f - o, i.angle = (i.angle || 0) - 90);
      let h, d;
      this.orientation === "portrait" ? (h = n * (c + this.gap) + l, d = r) : (h = l, d = n * (c + this.gap) + r), i.setPositionByOrigin(new T(h, d), "center", "center"), i.setCoords();
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
    const e = this.canvas.getObjects().filter((c) => !c.isBackground), i = [], s = (c) => Math.round(c * 1e3) / 1e3, n = this.pageWidthPx, o = this.pageHeightPx, g = this.gap;
    return e.forEach((c, f) => {
      const l = c.getCenterPoint();
      let r = 1, h = 0, d = 0;
      if (this.orientation === "portrait") {
        const u = Math.floor(l.x / (n + g));
        r = u + 1, h = l.x - u * (n + g), d = l.y;
      } else {
        const u = n, y = Math.floor(l.y / (u + g));
        r = y + 1, h = l.x, d = l.y - y * (u + g);
      }
      const p = {
        type: "image",
        originX: "center",
        originY: "center",
        left: s(h),
        top: s(d),
        angle: c.angle || 0,
        width: c.width,
        height: c.height,
        scaleX: s(c.scaleX || 1),
        scaleY: s(c.scaleY || 1),
        is_grayscale: c.filters.some((u) => u.type === "Grayscale")
      };
      i.push({
        seq_no: f + 1,
        img_id: c.imageId,
        page_num: r,
        img_setting: p
      });
    }), {
      data: { ...this.config.data, ...t },
      page: {
        orientation: this.orientation,
        dpi: this.config.dpi,
        width: s(this.orientation === "portrait" ? n : o),
        height: s(this.orientation === "portrait" ? o : n),
        margin: this.config.pageMargin,
        pages: this.pageCount
      },
      items: i
    };
  }
  async saveToBackend(t = {}) {
    const e = this.save(t);
    if (!this.config.saveEndpoint)
      throw new Error("No saveEndpoint configured.");
    try {
      const i = await fetch(this.config.saveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(e)
      });
      if (!i.ok)
        throw new Error(`HTTP error! status: ${i.status}`);
      const s = await i.json();
      if (s.succ === !1)
        throw new Error(s.error || "Server reported failure.");
      return s;
    } catch (i) {
      throw console.error("Save failed:", i), i;
    }
  }
  async load(t) {
    if (!t) return { success: !1, message: "No data" };
    const e = await this._withDirtySuppressed(async () => {
      let i = t;
      if ("succ" in t) {
        if (t.succ === !1)
          return { success: !1, message: t.error || "Unknown error from API data" };
        t.data && (i = t.data);
      }
      const s = i;
      this.canvas.clear();
      const n = s.page && s.page.orientation || s.orientation || "portrait";
      this.orientation = this._normalizeOrientation(n), this.pageCount = s.page && s.page.pages || s.pageCount || 1, s.page && typeof s.page.margin < "u" ? this.config.pageMargin = s.page.margin : typeof s.margin < "u" && (this.config.pageMargin = s.margin);
      const o = (p) => Math.round(p / 25.4 * this.config.dpi);
      this.pageMarginPx = o(this.config.pageMargin), this.setupLayout();
      const g = s.items || [], c = /* @__PURE__ */ new Set(), f = [], l = s.page && s.page.dpi || s.dpi || this.config.dpi, r = this.config.dpi / l, h = this.pageWidthPx;
      this.pageHeightPx;
      const d = this.gap;
      for (const p of g) {
        const u = p.img_id, y = p.img_setting || {};
        if (this.config.uniqueImages && c.has(u)) {
          const v = this.images.find((P) => P.img_id === u), C = v ? v.title || v.img_id : u;
          f.push(C);
          continue;
        }
        const S = this.images.find((v) => v.img_id === u);
        if (S) {
          c.add(u);
          const v = (p.page_num || 1) - 1;
          let C = 0, P = 0;
          if (this.orientation === "portrait")
            C = (y.left || 0) + v * (h + d), P = y.top || 0;
          else {
            const I = h;
            C = y.left || 0, P = (y.top || 0) + v * (I + d);
          }
          let m = y.scaleX || 1, _ = y.scaleY || 1;
          if (Math.abs(r - 1) > 1e-4) {
            const I = (y.left || 0) * r, O = (y.top || 0) * r;
            if (this.orientation === "portrait")
              C = I + v * (h + d), P = O;
            else {
              const M = h;
              C = I, P = O + v * (M + d);
            }
            m *= r, _ *= r;
          }
          const b = S.url || S.base64, w = await B.fromURL(b);
          w.set({
            left: C,
            top: P,
            angle: y.angle || 0,
            scaleX: m,
            scaleY: _,
            originX: "center",
            originY: "center",
            imageId: u,
            cornerSize: 10,
            transparentCorners: !1
          }), y.is_grayscale && (w.filters.push(new E.Grayscale()), w.applyFilters()), this.setupCustomControls(w), this.canvas.add(w), this.updateSidebarStatus(u, !0);
        } else
          console.warn(`Image ID ${u} not found in API. Skipping.`);
      }
      return this.canvas.requestRenderAll(), { success: !0, skipped: f };
    });
    return e && e.success !== !1 && this._setDirty(!0, "load"), e;
  }
  addPage() {
    this.pageCount++, this.setupLayout(), this._setDirty(!0, "addPage");
  }
  removePage() {
    if (this.pageCount > 1) {
      const t = this.pageWidthPx, e = this.pageHeightPx, i = this.pageCount - 1;
      let s, n, o, g;
      if (this.orientation === "portrait")
        s = i * (t + this.gap), n = 0, o = t, g = e;
      else {
        const r = e, h = t;
        s = 0, n = i * (h + this.gap), o = r, g = h;
      }
      const c = this.canvas.getObjects().filter((r) => !r.isBackground), f = [], l = /* @__PURE__ */ new Set();
      c.forEach((r) => {
        const h = r.getCenterPoint();
        h.x >= s && h.x <= s + o && h.y >= n && h.y <= n + g && f.push(r);
      }), f.forEach((r) => {
        r.imageId && l.add(r.imageId), this.canvas.remove(r);
      }), this.pageCount--, this.setupLayout(), l.size > 0 && this.updateSidebarStatus(null, !1), this._setDirty(!0, "removePage");
    } else {
      const t = this.canvas.getObjects().filter((e) => !e.isBackground);
      if (t.length > 0) {
        const e = /* @__PURE__ */ new Set();
        t.forEach((i) => {
          i.imageId && e.add(i.imageId), this.canvas.remove(i);
        }), e.size > 0 && this.updateSidebarStatus(null, !1), this._setDirty(!0, "removePage");
      }
    }
  }
  removeBlankPages() {
    if (this.pageCount <= 1) return;
    const t = this.pageWidthPx, e = this.pageHeightPx, i = this.gap, s = (l) => {
      if (this.orientation === "portrait")
        return { left: l * (t + i), top: 0, width: t, height: e };
      {
        const r = e, h = t;
        return { left: 0, top: l * (h + i), width: r, height: h };
      }
    }, n = this.canvas.getObjects().filter((l) => !l.isBackground), o = new Array(this.pageCount).fill(!1);
    n.forEach((l) => {
      const r = l.getCenterPoint();
      for (let h = 0; h < this.pageCount; h++) {
        const d = s(h);
        if (r.x >= d.left && r.x <= d.left + d.width && r.y >= d.top && r.y <= d.top + d.height) {
          o[h] = !0;
          break;
        }
      }
    });
    const g = o.filter((l) => !l).length;
    if (g === 0) return;
    if (g === this.pageCount) {
      this.pageCount = 1, this.setupLayout(), this._setDirty(!0, "removeBlankPages");
      return;
    }
    let c = 0;
    const f = new Array(this.pageCount).fill(-1);
    for (let l = 0; l < this.pageCount; l++)
      o[l] && (f[l] = c++);
    n.forEach((l) => {
      const r = l.getCenterPoint();
      for (let h = 0; h < this.pageCount; h++) {
        const d = s(h);
        if (r.x >= d.left && r.x <= d.left + d.width && r.y >= d.top && r.y <= d.top + d.height) {
          const p = f[h];
          if (p !== h) {
            if (this.orientation === "portrait")
              l.set("left", l.left + (p - h) * (t + i));
            else {
              const u = t;
              l.set("top", l.top + (p - h) * (u + i));
            }
            l.setCoords();
          }
          break;
        }
      }
    }), this.pageCount = c, this.setupLayout(), this.canvas.requestRenderAll(), this._setDirty(!0, "removeBlankPages");
  }
  enforceUniqueness() {
    if (!this.config.uniqueImages) return;
    const t = this.canvas.getObjects().filter((s) => !s.isBackground), e = /* @__PURE__ */ new Set(), i = [];
    return t.forEach((s) => {
      s.imageId && (e.has(s.imageId) ? i.push(s) : e.add(s.imageId));
    }), i.forEach((s) => {
      this.canvas.remove(s);
    }), this.canvas.requestRenderAll(), i.length;
  }
  cleanupOutOfBounds() {
    const t = this.canvas.getObjects().filter((s) => !s.isBackground), e = this.canvas.getWidth(), i = this.canvas.getHeight();
    t.forEach((s) => {
      const n = s.getCenterPoint();
      (n.x < -50 || n.x > e + 50 || n.y < -50 || n.y > i + 50) && (this.canvas.remove(s), s.imageId && this.updateSidebarStatus(s.imageId, !1));
    }), this.canvas.requestRenderAll(), this._setDirty(!0, "cleanupOutOfBounds");
  }
  clearCanvas() {
    this.canvas.getObjects().filter((e) => !e.isBackground).forEach((e) => {
      this.canvas.remove(e), e.imageId && this.updateSidebarStatus(e.imageId, !1);
    }), this.canvas.requestRenderAll(), this._setDirty(!0, "clearCanvas");
  }
  destroy() {
    this.canvas && (this.canvas.dispose(), this.canvas = null);
  }
}
export {
  q as FabricA4Layout
};
