import { Control as p, filters as I, util as m, Canvas as b, FabricImage as y, Rect as C, Point as w } from "fabric";
const u = {
  status: {
    setting: "設定:",
    dpi: "DPI",
    pages: "頁數:",
    orientation: "方向:",
    portrait: "直式",
    landscape: "橫式",
    size: "A4尺寸:"
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
}, S = (i, e, s, t, a) => {
  i.save(), i.translate(e, s), i.rotate(m.degreesToRadians(a.angle)), i.beginPath(), i.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.shadowColor = "rgba(0,0,0,0.2)", i.shadowBlur = 4, i.fill(), i.beginPath(), i.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "#F44336", i.fill(), i.lineWidth = 2, i.strokeStyle = "white", i.beginPath(), i.moveTo(-24 / 4, -24 / 4), i.lineTo(24 / 4, 24 / 4), i.moveTo(24 / 4, -24 / 4), i.lineTo(-24 / 4, 24 / 4), i.stroke(), i.restore();
}, k = new p({
  x: 0.5,
  y: -0.5,
  // Top Right
  offsetY: 16,
  offsetX: -16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (i, e) => {
    const s = e.target, t = s.canvas;
    return t.remove(s), s.imageId && t.fire("object:custom:delete", { target: s }), t.requestRenderAll(), !0;
  },
  render: S
}), P = (i, e, s, t, a) => {
  i.save(), i.translate(e, s), i.rotate(m.degreesToRadians(a.angle)), i.beginPath(), i.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.shadowColor = "rgba(0,0,0,0.2)", i.shadowBlur = 4, i.fill(), i.beginPath(), i.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.lineWidth = 1, i.strokeStyle = "#333", i.stroke(), i.beginPath(), i.arc(0, 0, 24 / 2, -Math.PI / 2, Math.PI / 2, !1), i.fillStyle = "black", i.fill(), i.restore();
}, E = new p({
  x: -0.5,
  y: 0.5,
  // Bottom Left
  offsetY: -16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "pointer",
  mouseUpHandler: (i, e) => {
    const s = e.target, t = s.canvas;
    return t.setCursor("wait"), setTimeout(() => {
      s.filters.some((n) => n.type === "Grayscale") ? s.filters = s.filters.filter((n) => n.type !== "Grayscale") : s.filters.push(new I.Grayscale()), s.applyFilters(), t.setCursor("default"), t.requestRenderAll();
    }, 50), !0;
  },
  render: P
}), O = (i, e, s, t, a) => {
  i.save(), i.translate(e, s), i.rotate(m.degreesToRadians(a.angle)), i.beginPath(), i.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.shadowColor = "rgba(0,0,0,0.2)", i.shadowBlur = 4, i.fill(), i.strokeStyle = "#2196F3", i.lineWidth = 2, i.beginPath(), i.arc(0, 0, 24 / 4, 0, Math.PI * 1.5, !1), i.stroke(), i.fillStyle = "#2196F3", i.beginPath(), i.moveTo(24 / 4, -24 / 8), i.lineTo(24 / 4 + 4, 0), i.lineTo(24 / 4 - 4, 0), i.fill(), i.restore();
}, z = new p({
  x: -0.5,
  y: -0.5,
  // Top Left
  offsetY: 16,
  offsetX: 16,
  sizeX: 28,
  sizeY: 28,
  cursorStyle: "crosshair",
  mouseUpHandler: (i, e) => {
    const s = e.target, t = s.canvas, a = s.angle || 0;
    return s.set("angle", (a + 90) % 360), s.setCoords(), t.requestRenderAll(), !0;
  },
  render: O
});
class B {
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
      saveEndpoint: null,
      data: {},
      buttons: {},
      // Map of action -> buttonId
      statusDisplayId: null,
      errorDisplayId: null,
      locale: {},
      ...e
    }, this.t = {
      status: { ...u.status, ...this.config.locale?.status || {} },
      error: { ...u.error, ...this.config.locale?.error || {} },
      confirm: { ...u.confirm, ...this.config.locale?.confirm || {} }
    }, this.config.dpi < 24 && (this.config.dpi = 24), this.config.dpi > 192 && (this.config.dpi = 192);
    const s = (t) => Math.round(t / 25.4 * this.config.dpi);
    this.pageWidthPx = s(this.config.width), this.pageHeightPx = s(this.config.height), this.gap = 4, this.canvasId = this.config.canvasId, this.canvas = null, this.images = [], this.pageCount = 1, this.orientation = this.config.orientation;
  }
  async init() {
    this.canvas = new b(this.canvasId, {
      preserveObjectStacking: !0,
      selection: !0,
      enableRetinaScaling: !1
    }), this.setupLayout(), await this.fetchImages(), this.setupEvents(), this.bindControls(), this.updateStatusDisplay();
  }
  bindControls() {
    const e = this.config.buttons, s = (t, a) => {
      if (t) {
        const n = document.getElementById(t);
        if (n) {
          const o = n.cloneNode(!0);
          n.parentNode.replaceChild(o, n), o.onclick = a;
        }
      }
    };
    if (s(e.orientation, () => {
      this.toggleOrientation(), this.updateStatusDisplay();
    }), s(e.addPage, () => {
      this.addPage(), this.updateStatusDisplay();
    }), s(e.removePage, () => {
      this.removePage(), this.updateStatusDisplay();
    }), s(e.refreshImages, async () => {
      this.cleanupOutOfBounds(), await this.fetchImages(), this.showError(this.t.error.listUpdated, !0);
    }), s(e.clearCanvas, () => {
      confirm(this.t.confirm.clearCanvas) && (this.clearCanvas(), this.showError(this.t.error.canvasCleared, !0));
    }), e.save) {
      const t = document.getElementById(e.save);
      if (t) {
        const a = t.cloneNode(!0);
        t.parentNode.replaceChild(a, t), a.onclick = () => {
          const n = this.save();
          this.config.onSave && this.config.onSave(n);
        };
      }
    }
    if (e.load) {
      const t = document.getElementById(e.load);
      if (t) {
        const a = t.cloneNode(!0);
        t.parentNode.replaceChild(a, t), a.onclick = async () => {
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
      const t = document.getElementById(e.settings);
      if (t) {
        const a = t.cloneNode(!0);
        t.parentNode.replaceChild(a, t), a.onclick = this.config.onSettingsClick;
      }
    }
  }
  showError(e, s = !1) {
    if (this.config.errorDisplayId) {
      const t = document.getElementById(this.config.errorDisplayId);
      t && (t.style.display = "block", t.innerText = e, t.style.backgroundColor = s ? "#e8f5e9" : "#ffebee", t.style.color = s ? "#2e7d32" : "#c62828", t.style.borderColor = s ? "#a5d6a7" : "#ef9a9a", setTimeout(() => {
        t.style.display = "none";
      }, 5e3));
    } else
      console.log(s ? "Info:" : "Error:", e), s || alert(e);
  }
  updateStatusDisplay() {
    if (this.config.statusDisplayId) {
      const e = document.getElementById(this.config.statusDisplayId);
      if (e && this.canvas) {
        const s = this.canvas.getWidth(), t = this.canvas.getHeight(), a = this.orientation === "portrait" ? this.t.status.portrait : this.t.status.landscape;
        e.innerHTML = `
                <strong>${this.t.status.setting}</strong> ${this.t.status.dpi} ${this.config.dpi} | 
                <strong>${this.t.status.pages}</strong> ${this.pageCount} | 
                <strong>${this.t.status.orientation}</strong> ${a} | 
                <strong>${this.t.status.size}</strong> ${s} x ${t} px
            `;
      }
    }
  }
  async fetchImages() {
    try {
      const e = await fetch(this.config.apiEndpoint);
      if (!e.ok) throw new Error(this.t.error.fetchFailed);
      const s = await e.json();
      this.images = s.data || [], this.renderSidebar();
    } catch (e) {
      console.error(this.t.error.readError, e), this.showError(this.t.error.fetchFailed), this.images = [], this.renderSidebar();
    }
  }
  renderSidebar() {
    const e = document.getElementById("image-sidebar");
    e && (e.innerHTML = "", this.images.forEach((s) => {
      const t = document.createElement("div");
      t.className = "image-item", t.dataset.id = s.img_id;
      const a = this.config.uniqueImages && this.isImageOnCanvas(s.img_id);
      t.onclick = () => {
        a ? confirm(this.t.confirm.removeImage) && (this.canvas.getObjects().filter((d) => d.imageId === s.img_id).forEach((d) => this.canvas.remove(d)), this.updateSidebarStatus(s.img_id, !1), this.showError(this.t.error.removedFromCanvas, !0)) : this.addImageToCanvas(s.img_id);
      }, a && (t.classList.add("disabled"), t.title = "已在A4上 (點擊可移除)", t.style.cursor = "help");
      const n = document.createElement("img");
      n.src = s.url || s.base64, n.draggable = !1;
      const o = document.createElement("span");
      o.className = "label", o.innerText = s.title || s.img_id, t.appendChild(n), t.appendChild(o), e.appendChild(t);
    }));
  }
  isImageOnCanvas(e) {
    return this.canvas.getObjects().some((s) => s.imageId === e);
  }
  updateSidebarStatus(e, s) {
    this.config.uniqueImages && this.renderSidebar();
  }
  async addImageToCanvas(e) {
    if (this.config.uniqueImages && this.isImageOnCanvas(e)) return;
    const s = this.images.find((n) => n.img_id === e);
    if (!s) return;
    const t = s.url || s.base64, a = await y.fromURL(t);
    a.set({
      imageId: e,
      left: 50,
      top: 50,
      cornerSize: 10,
      transparentCorners: !1,
      originX: "left",
      originY: "top"
    }), this.setupCustomControls(a), a.width > 200 && a.scaleToWidth(200), this.canvas.add(a), this.canvas.setActiveObject(a), this.updateSidebarStatus(e, !0);
  }
  setupCustomControls(e) {
    delete e.controls.ml, delete e.controls.mr, delete e.controls.mt, delete e.controls.mb, delete e.controls.mtr, e.controls.deleteControl = k, e.controls.grayscaleControl = E, e.controls.rotate90Control = z;
  }
  setupLayout() {
    let e, s;
    const t = this.canvas.getObjects().filter((a) => a.isBackground);
    if (this.canvas.remove(...t), this.orientation === "portrait") {
      const a = this.pageWidthPx, n = this.pageHeightPx;
      s = n, e = (a + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: e, height: s },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new C({
          left: o * (a + this.gap),
          top: 0,
          width: a,
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
      const a = this.pageHeightPx, n = this.pageWidthPx;
      e = a, s = (n + this.gap) * this.pageCount - this.gap, this.canvas.setDimensions(
        { width: e, height: s },
        { cssOnly: !1, backstoreOnly: !1 }
      );
      for (let o = 0; o < this.pageCount; o++) {
        const r = new C({
          left: 0,
          top: o * (n + this.gap),
          width: a,
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
    this.orientation = e === "portrait" ? "landscape" : "portrait", this.canvas.getObjects().filter((t) => !t.isBackground).forEach((t) => {
      const a = t.getCenterPoint();
      let n = 0, o = 0, r = 0;
      const d = this.pageWidthPx, h = this.pageHeightPx;
      if (e === "portrait")
        n = Math.floor(a.x / (d + this.gap)), o = a.x - n * (d + this.gap), r = a.y;
      else {
        const v = d;
        n = Math.floor(a.y / (v + this.gap)), o = a.x, r = a.y - n * (v + this.gap);
      }
      let l, c;
      e === "portrait" ? (l = h - r, c = o, t.angle = (t.angle || 0) + 90) : (l = r, c = h - o, t.angle = (t.angle || 0) - 90);
      let g, f;
      this.orientation === "portrait" ? (g = n * (d + this.gap) + l, f = c) : (g = l, f = n * (d + this.gap) + c), t.setPositionByOrigin(new w(g, f), "center", "center"), t.setCoords();
    }), this.setupLayout();
  }
  setupEvents() {
    this.canvas.on("object:custom:delete", (e) => {
      e.target && e.target.imageId && this.updateSidebarStatus(e.target.imageId, !1);
    });
  }
  save(e = {}) {
    const s = this.canvas.toObject(["imageId", "id"]);
    return s.objects = s.objects.filter((t) => !t.isBackground), this.config.saveWithBase64 || s.objects.forEach((t) => {
      t.type === "image" && delete t.src;
    }), {
      version: "1.0",
      timestamp: Date.now(),
      orientation: this.orientation,
      pageCount: this.pageCount,
      dpi: this.config.dpi,
      canvasObjects: s.objects,
      data: { ...this.config.data, ...e }
    };
  }
  async saveToBackend(e = {}) {
    const s = this.save(e);
    if (!this.config.saveEndpoint)
      throw new Error("No saveEndpoint configured.");
    try {
      const t = await fetch(this.config.saveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(s)
      });
      if (!t.ok)
        throw new Error(`HTTP error! status: ${t.status}`);
      return await t.json();
    } catch (t) {
      throw console.error("Save failed:", t), t;
    }
  }
  async load(e) {
    if (!e) return { success: !1, message: "No data" };
    this.canvas.clear(), this.orientation = e.orientation || "portrait", this.pageCount = e.pageCount || 1, this.setupLayout();
    const s = e.canvasObjects || [], t = /* @__PURE__ */ new Set(), a = [], n = e.dpi || this.config.dpi, o = this.config.dpi / n;
    for (const r of s) {
      if (this.config.uniqueImages && t.has(r.imageId)) {
        const h = this.images.find((c) => c.img_id === r.imageId), l = h ? h.title || h.img_id : r.imageId;
        a.push(l);
        continue;
      }
      const d = this.images.find((h) => h.img_id === r.imageId);
      if (d) {
        t.add(r.imageId);
        const h = { ...r };
        Math.abs(o - 1) > 1e-4 && (h.left *= o, h.top *= o, h.scaleX = (h.scaleX || 1) * o, h.scaleY = (h.scaleY || 1) * o);
        const l = d.url || d.base64, c = await y.fromURL(l);
        c.set(h), c.set({ src: l }), r.filters && r.filters.length > 0 && c.applyFilters(), this.setupCustomControls(c), this.canvas.add(c), this.updateSidebarStatus(r.imageId, !0);
      } else
        console.warn(`Image ID ${r.imageId} not found in API. Skipping.`);
    }
    return this.canvas.requestRenderAll(), { success: !0, skipped: a };
  }
  addPage() {
    this.pageCount++, this.setupLayout();
  }
  removePage() {
    if (this.pageCount > 1) {
      const e = this.pageWidthPx, s = this.pageHeightPx, t = this.pageCount - 1;
      let a, n, o, r;
      if (this.orientation === "portrait")
        a = t * (e + this.gap), n = 0, o = e, r = s;
      else {
        const l = s, c = e;
        a = 0, n = t * (c + this.gap), o = l, r = c;
      }
      const d = this.canvas.getObjects().filter((l) => !l.isBackground), h = [];
      d.forEach((l) => {
        const c = l.getCenterPoint();
        c.x >= a && c.x <= a + o && c.y >= n && c.y <= n + r && h.push(l);
      }), h.forEach((l) => {
        l.imageId && this.updateSidebarStatus(l.imageId, !1), this.canvas.remove(l);
      }), this.pageCount--, this.setupLayout();
    }
  }
  enforceUniqueness() {
    if (!this.config.uniqueImages) return;
    const e = this.canvas.getObjects().filter((a) => !a.isBackground), s = /* @__PURE__ */ new Set(), t = [];
    return e.forEach((a) => {
      a.imageId && (s.has(a.imageId) ? t.push(a) : s.add(a.imageId));
    }), t.forEach((a) => {
      this.canvas.remove(a);
    }), this.canvas.requestRenderAll(), t.length;
  }
  cleanupOutOfBounds() {
    const e = this.canvas.getObjects().filter((a) => !a.isBackground), s = this.canvas.getWidth(), t = this.canvas.getHeight();
    e.forEach((a) => {
      const n = a.getCenterPoint();
      (n.x < -50 || n.x > s + 50 || n.y < -50 || n.y > t + 50) && (this.canvas.remove(a), a.imageId && this.updateSidebarStatus(a.imageId, !1));
    }), this.canvas.requestRenderAll();
  }
  clearCanvas() {
    this.canvas.getObjects().filter((s) => !s.isBackground).forEach((s) => {
      this.canvas.remove(s), s.imageId && this.updateSidebarStatus(s.imageId, !1);
    }), this.canvas.requestRenderAll();
  }
  destroy() {
    this.canvas && (this.canvas.dispose(), this.canvas = null);
  }
}
export {
  B as FabricA4Layout
};
