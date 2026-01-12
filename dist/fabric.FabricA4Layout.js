import { Control as O, filters as T, util as E, Canvas as H, FabricImage as z, Rect as B, Point as W } from "fabric";
const P = {
  status: {
    setting: "設定:",
    dpi: "DPI",
    pages: "頁數:",
    orientation: "方向:",
    portrait: "直式",
    landscape: "橫式",
    size: "A4尺寸:",
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
}, j = (a, e, t, s, i) => {
  a.save(), a.translate(e, t), a.rotate(E.degreesToRadians(i.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "#F44336", a.fill(), a.lineWidth = 2, a.strokeStyle = "white", a.beginPath(), a.moveTo(-24 / 4, -24 / 4), a.lineTo(24 / 4, 24 / 4), a.moveTo(24 / 4, -24 / 4), a.lineTo(-24 / 4, 24 / 4), a.stroke(), a.restore();
}, A = new O({
  x: 0.5,
  y: -0.5,
  // Top Right
  offsetY: 16,
  offsetX: -16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, e) => {
    const t = e.target, s = t.canvas;
    return s.remove(t), t.imageId && s.fire("object:custom:delete", { target: t }), s.requestRenderAll(), !0;
  },
  render: j
}), D = (a, e, t, s, i) => {
  a.save(), a.translate(e, t), a.rotate(E.degreesToRadians(i.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.beginPath(), a.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.lineWidth = 1, a.strokeStyle = "#333", a.stroke(), a.beginPath(), a.arc(0, 0, 24 / 2, -Math.PI / 2, Math.PI / 2, !1), a.fillStyle = "black", a.fill(), a.restore();
}, R = new O({
  x: -0.5,
  y: 0.5,
  // Bottom Left
  offsetY: -16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (a, e) => {
    const t = e.target, s = t.canvas;
    return s.setCursor("wait"), setTimeout(() => {
      t.filters.some((n) => n.type === "Grayscale") ? t.filters = t.filters.filter((n) => n.type !== "Grayscale") : t.filters.push(new T.Grayscale()), t.applyFilters(), s.setCursor("default"), s.requestRenderAll();
    }, 50), !0;
  },
  render: D
}), L = (a, e, t, s, i) => {
  a.save(), a.translate(e, t), a.rotate(E.degreesToRadians(i.angle)), a.beginPath(), a.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), a.fillStyle = "white", a.fill(), a.shadowColor = "rgba(0,0,0,0.2)", a.shadowBlur = 4, a.fill(), a.strokeStyle = "#2196F3", a.lineWidth = 2, a.beginPath(), a.arc(0, 0, 24 / 4, 0, Math.PI * 1.5, !1), a.stroke(), a.fillStyle = "#2196F3", a.beginPath(), a.moveTo(24 / 4, -24 / 8), a.lineTo(24 / 4 + 4, 0), a.lineTo(24 / 4 - 4, 0), a.fill(), a.restore();
}, M = new O({
  x: -0.5,
  y: -0.5,
  // Top Left
  offsetY: 16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "crosshair",
  mouseUpHandler: (a, e) => {
    const t = e.target, s = t.canvas, i = t.angle || 0;
    return t.set("angle", (i + 90) % 360), t.setCoords(), s.requestRenderAll(), !0;
  },
  render: L
});
class $ {
  constructor(e) {
    this.config = {
      dpi: 48,
      width: 210,
      // mm
      height: 297,
      // mm
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
      ...e
    }, this.t = {
      status: { ...P.status, ...this.config.locale?.status || {} },
      error: { ...P.error, ...this.config.locale?.error || {} },
      confirm: { ...P.confirm, ...this.config.locale?.confirm || {} }
    }, this.config.dpi < 24 && (this.config.dpi = 24), this.config.dpi > 192 && (this.config.dpi = 192);
    const t = (s) => Math.round(s / 25.4 * this.config.dpi);
    this.pageWidthPx = t(this.config.width), this.pageHeightPx = t(this.config.height), this.gap = 4, this.canvasId = this.config.canvasId, this.canvas = null, this.images = [], this.pageCount = 1, this.orientation = this.config.orientation;
  }
  async init() {
    this.canvas = new H(this.canvasId, {
      preserveObjectStacking: !0,
      selection: !0,
      enableRetinaScaling: !1
    }), this.setupLayout(), await this.fetchImages(), this.setupEvents(), this.bindControls(), this.updateStatusDisplay();
  }
  bindControls() {
    const e = this.config.buttons, t = (s, i) => {
      if (s) {
        const n = document.getElementById(s);
        if (n) {
          const o = n.cloneNode(!0);
          n.parentNode.replaceChild(o, n), o.onclick = i;
        }
      }
    };
    if (t(e.orientation, () => {
      this.toggleOrientation(), this.updateStatusDisplay();
    }), t(e.addPage, () => {
      this.addPage(), this.updateStatusDisplay();
    }), t(e.removePage, () => {
      this.removePage(), this.updateStatusDisplay();
    }), t(e.refreshImages, async () => {
      this.cleanupOutOfBounds(), await this.fetchImages(), this.showError(this.t.error.listUpdated, !0);
    }), t(e.clearCanvas, () => {
      confirm(this.t.confirm.clearCanvas) && (this.clearCanvas(), this.showError(this.t.error.canvasCleared, !0));
    }), e.save) {
      const s = document.getElementById(e.save);
      if (s) {
        const i = s.cloneNode(!0);
        s.parentNode.replaceChild(i, s), i.onclick = () => {
          const n = this.save();
          this.config.onSave && this.config.onSave(n);
        };
      }
    }
    if (e.load) {
      const s = document.getElementById(e.load);
      if (s) {
        const i = s.cloneNode(!0);
        s.parentNode.replaceChild(i, s), i.onclick = async () => {
          let n = null;
          if (this.config.onLoad && (n = this.config.onLoad()), n) {
            const o = await this.load(n);
            this.updateStatusDisplay(), o.skipped && o.skipped.length > 0 && this.showError(`${this.t.error.skipped} ${o.skipped.join(", ")}`);
          } else
            this.showError(this.t.error.noData);
        };
      }
    }
    if (e.settings && this.config.onSettingsClick) {
      const s = document.getElementById(e.settings);
      if (s) {
        const i = s.cloneNode(!0);
        s.parentNode.replaceChild(i, s), i.onclick = this.config.onSettingsClick;
      }
    }
  }
  showError(e, t = !1) {
    if (this.config.errorDisplayId) {
      const s = document.getElementById(this.config.errorDisplayId);
      s && (s.style.display = "block", s.innerText = e, s.style.backgroundColor = t ? "#e8f5e9" : "#ffebee", s.style.color = t ? "#2e7d32" : "#c62828", s.style.borderColor = t ? "#a5d6a7" : "#ef9a9a", setTimeout(() => {
        s.style.display = "none";
      }, 5e3));
    } else
      console.log(t ? "Info:" : "Error:", e), t || alert(e);
  }
  updateStatusDisplay() {
    if (this.config.statusDisplayId) {
      const e = document.getElementById(this.config.statusDisplayId);
      if (e && this.canvas) {
        const t = this.canvas.getWidth(), s = this.canvas.getHeight(), i = this.orientation === "portrait" ? this.t.status.portrait : this.t.status.landscape;
        e.innerHTML = `
                <strong>${this.t.status.setting}</strong> ${this.t.status.dpi} ${this.config.dpi} | 
                <strong>${this.t.status.pages}</strong> ${this.pageCount} | 
                <strong>${this.t.status.orientation}</strong> ${i} | 
                <strong>${this.t.status.size}</strong> ${t} x ${s} px |
                <strong>${this.t.status.grayscale}</strong> ${this.config.defaultGrayscale ? this.t.status.on : this.t.status.off}
            `;
      }
    }
  }
  async fetchImages() {
    try {
      const e = await fetch(this.config.apiEndpoint);
      if (!e.ok) throw new Error(this.t.error.fetchFailed);
      const t = await e.json();
      this.images = t.data || [], this.renderSidebar();
    } catch (e) {
      console.error(this.t.error.readError, e), this.showError(this.t.error.fetchFailed), this.images = [], this.renderSidebar();
    }
  }
  renderSidebar() {
    const e = document.getElementById("image-sidebar");
    e && (e.innerHTML = "", this.images.forEach((t) => {
      const s = document.createElement("div");
      s.className = "image-item", s.dataset.id = t.img_id;
      const i = this.config.uniqueImages && this.isImageOnCanvas(t.img_id);
      s.onclick = () => {
        i ? confirm(this.t.confirm.removeImage) && (this.canvas.getObjects().filter((g) => g.imageId === t.img_id).forEach((g) => this.canvas.remove(g)), this.updateSidebarStatus(t.img_id, !1), this.showError(this.t.error.removedFromCanvas, !0)) : this.addImageToCanvas(t.img_id);
      }, i && (s.classList.add("disabled"), s.title = "已在A4上 (點擊可移除)", s.style.cursor = "help");
      const n = document.createElement("img");
      n.src = t.url || t.base64, n.draggable = !1;
      const o = document.createElement("span");
      o.className = "label", o.innerText = t.title || t.img_id, s.appendChild(n), s.appendChild(o), e.appendChild(s);
    }));
  }
  isImageOnCanvas(e) {
    return this.canvas.getObjects().some((t) => t.imageId === e);
  }
  updateSidebarStatus(e, t) {
    this.config.uniqueImages && this.renderSidebar();
  }
  async addImageToCanvas(e) {
    if (this.config.uniqueImages && this.isImageOnCanvas(e)) return;
    const t = this.images.find((d) => d.img_id === e);
    if (!t) return;
    const s = t.url || t.base64, i = await z.fromURL(s);
    i.set({
      imageId: e,
      cornerSize: 10,
      transparentCorners: !1,
      originX: "left",
      originY: "top"
    });
    const o = this.config.dpi / 96;
    let r = 1, g = 1;
    t.original_width && t.original_height && i.width > 0 && i.height > 0 ? (r = t.original_width / i.width * o, g = t.original_height / i.height * o) : (r = o, g = o), i.scaleX = r, i.scaleY = g, this.config.defaultGrayscale && (i.filters.push(new T.Grayscale()), i.applyFilters()), this.setupCustomControls(i);
    const h = this.orientation === "portrait", c = h ? this.pageWidthPx : this.pageHeightPx, l = h ? this.pageHeightPx : this.pageWidthPx;
    if (i.getScaledWidth() > c || i.getScaledHeight() > l) {
      const d = Math.min(c / i.getScaledWidth(), l / i.getScaledHeight()) * 0.95;
      i.scaleX *= d, i.scaleY *= d;
    }
    let f = this.pageCount - 1;
    const v = ((d) => this.canvas.getObjects().filter((p) => !p.isBackground).filter((p) => {
      const m = p.getCenterPoint();
      if (h) {
        const b = d * (c + this.gap), w = b + c;
        return m.x >= b && m.x < w;
      } else {
        const b = d * (l + this.gap), w = b + l;
        return m.y >= b && m.y < w;
      }
    }))(f);
    let u = 0;
    const k = l * 0.025;
    if (v.length > 0) {
      let d = 0;
      v.forEach((y) => {
        let p = 0;
        if (h)
          p = y.top + y.getScaledHeight();
        else {
          const m = f * (l + this.gap);
          p = y.top - m + y.getScaledHeight();
        }
        p > d && (d = p);
      }), u = d + this.gap;
    } else
      u = k;
    u + i.getScaledHeight() > l && (this.addPage(), f++, u = k);
    let S, I;
    if (h)
      S = f * (c + this.gap) + (c - i.getScaledWidth()) / 2, I = u;
    else {
      const d = f * (l + this.gap);
      S = (c - i.getScaledWidth()) / 2, I = d + u;
    }
    i.set({ left: S, top: I }), this.canvas.add(i), this.canvas.setActiveObject(i), this.updateSidebarStatus(e, !0);
  }
  setupCustomControls(e) {
    delete e.controls.ml, delete e.controls.mr, delete e.controls.mt, delete e.controls.mb, delete e.controls.mtr, e.controls.deleteControl = A, e.controls.grayscaleControl = R, e.controls.rotate90Control = M;
  }
  setupLayout() {
    let e, t;
    const s = this.canvas.getObjects().filter((i) => i.isBackground);
    if (this.canvas.remove(...s), this.orientation === "portrait") {
      const i = this.pageWidthPx, n = this.pageHeightPx;
      t = n, e = (i + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: e, height: t },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new B({
          left: o * (i + this.gap),
          top: 0,
          width: i,
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
      const i = this.pageHeightPx, n = this.pageWidthPx;
      e = i, t = (n + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: e, height: t },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new B({
          left: 0,
          top: o * (n + this.gap),
          width: i,
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
    const e = this.orientation;
    this.orientation = e === "portrait" ? "landscape" : "portrait", this.canvas.getObjects().filter((s) => !s.isBackground).forEach((s) => {
      const i = s.getCenterPoint();
      let n = 0, o = 0, r = 0;
      const g = this.pageWidthPx, h = this.pageHeightPx;
      if (e === "portrait")
        n = Math.floor(i.x / (g + this.gap)), o = i.x - n * (g + this.gap), r = i.y;
      else {
        const v = g;
        n = Math.floor(i.y / (v + this.gap)), o = i.x, r = i.y - n * (v + this.gap);
      }
      let c, l;
      e === "portrait" ? (c = h - r, l = o, s.angle = (s.angle || 0) + 90) : (c = r, l = h - o, s.angle = (s.angle || 0) - 90);
      let f, C;
      this.orientation === "portrait" ? (f = n * (g + this.gap) + c, C = l) : (f = c, C = n * (g + this.gap) + l), s.setPositionByOrigin(new W(f, C), "center", "center"), s.setCoords();
    }), this.setupLayout();
  }
  setupEvents() {
    this.canvas.on("object:custom:delete", (e) => {
      e.target && e.target.imageId && this.updateSidebarStatus(e.target.imageId, !1);
    });
  }
  save(e = {}) {
    const t = this.canvas.toObject(["imageId", "id"]);
    return t.objects = t.objects.filter((s) => !s.isBackground), this.config.saveWithBase64 || t.objects.forEach((s) => {
      s.type === "image" && delete s.src;
    }), {
      version: "1.0",
      timestamp: Date.now(),
      orientation: this.orientation,
      pageCount: this.pageCount,
      dpi: this.config.dpi,
      canvasObjects: t.objects,
      data: { ...this.config.data, ...e }
    };
  }
  async saveToBackend(e = {}) {
    const t = this.save(e);
    if (!this.config.saveEndpoint)
      throw new Error("No saveEndpoint configured.");
    try {
      const s = await fetch(this.config.saveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(t)
      });
      if (!s.ok)
        throw new Error(`HTTP error! status: ${s.status}`);
      return await s.json();
    } catch (s) {
      throw console.error("Save failed:", s), s;
    }
  }
  async load(e) {
    if (!e) return { success: !1, message: "No data" };
    this.canvas.clear(), this.orientation = e.orientation || "portrait", this.pageCount = e.pageCount || 1, this.setupLayout();
    const t = e.canvasObjects || [], s = /* @__PURE__ */ new Set(), i = [], n = e.dpi || this.config.dpi, o = this.config.dpi / n;
    for (const r of t) {
      if (this.config.uniqueImages && s.has(r.imageId)) {
        const h = this.images.find((l) => l.img_id === r.imageId), c = h ? h.title || h.img_id : r.imageId;
        i.push(c);
        continue;
      }
      const g = this.images.find((h) => h.img_id === r.imageId);
      if (g) {
        s.add(r.imageId);
        const h = { ...r };
        Math.abs(o - 1) > 1e-4 && (h.left *= o, h.top *= o, h.scaleX = (h.scaleX || 1) * o, h.scaleY = (h.scaleY || 1) * o);
        const c = g.url || g.base64, l = await z.fromURL(c);
        l.set(h), l.set({ src: c }), r.filters && r.filters.length > 0 && l.applyFilters(), this.setupCustomControls(l), this.canvas.add(l), this.updateSidebarStatus(r.imageId, !0);
      } else
        console.warn(`Image ID ${r.imageId} not found in API. Skipping.`);
    }
    return this.canvas.requestRenderAll(), { success: !0, skipped: i };
  }
  addPage() {
    this.pageCount++, this.setupLayout();
  }
  removePage() {
    if (this.pageCount > 1) {
      const e = this.pageWidthPx, t = this.pageHeightPx, s = this.pageCount - 1;
      let i, n, o, r;
      if (this.orientation === "portrait")
        i = s * (e + this.gap), n = 0, o = e, r = t;
      else {
        const c = t, l = e;
        i = 0, n = s * (l + this.gap), o = c, r = l;
      }
      const g = this.canvas.getObjects().filter((c) => !c.isBackground), h = [];
      g.forEach((c) => {
        const l = c.getCenterPoint();
        l.x >= i && l.x <= i + o && l.y >= n && l.y <= n + r && h.push(c);
      }), h.forEach((c) => {
        c.imageId && this.updateSidebarStatus(c.imageId, !1), this.canvas.remove(c);
      }), this.pageCount--, this.setupLayout();
    }
  }
  enforceUniqueness() {
    if (!this.config.uniqueImages) return;
    const e = this.canvas.getObjects().filter((i) => !i.isBackground), t = /* @__PURE__ */ new Set(), s = [];
    return e.forEach((i) => {
      i.imageId && (t.has(i.imageId) ? s.push(i) : t.add(i.imageId));
    }), s.forEach((i) => {
      this.canvas.remove(i);
    }), this.canvas.requestRenderAll(), s.length;
  }
  cleanupOutOfBounds() {
    const e = this.canvas.getObjects().filter((i) => !i.isBackground), t = this.canvas.getWidth(), s = this.canvas.getHeight();
    e.forEach((i) => {
      const n = i.getCenterPoint();
      (n.x < -50 || n.x > t + 50 || n.y < -50 || n.y > s + 50) && (this.canvas.remove(i), i.imageId && this.updateSidebarStatus(i.imageId, !1));
    }), this.canvas.requestRenderAll();
  }
  clearCanvas() {
    this.canvas.getObjects().filter((t) => !t.isBackground).forEach((t) => {
      this.canvas.remove(t), t.imageId && this.updateSidebarStatus(t.imageId, !1);
    }), this.canvas.requestRenderAll();
  }
  destroy() {
    this.canvas && (this.canvas.dispose(), this.canvas = null);
  }
}
export {
  $ as FabricA4Layout
};
