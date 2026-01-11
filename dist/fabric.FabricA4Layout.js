import { Control as u, filters as I, util as p, Canvas as b, FabricImage as v, Rect as y, Point as C } from "fabric";
const w = (i, e, s, t, a) => {
  i.save(), i.translate(e, s), i.rotate(p.degreesToRadians(a.angle)), i.beginPath(), i.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.shadowColor = "rgba(0,0,0,0.2)", i.shadowBlur = 4, i.fill(), i.beginPath(), i.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "#F44336", i.fill(), i.lineWidth = 2, i.strokeStyle = "white", i.beginPath(), i.moveTo(-24 / 4, -24 / 4), i.lineTo(24 / 4, 24 / 4), i.moveTo(24 / 4, -24 / 4), i.lineTo(-24 / 4, 24 / 4), i.stroke(), i.restore();
}, S = new u({
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
    return s.imageId && t.fire("object:custom:delete", { target: s }), t.remove(s), t.requestRenderAll(), !0;
  },
  render: w
}), P = (i, e, s, t, a) => {
  i.save(), i.translate(e, s), i.rotate(p.degreesToRadians(a.angle)), i.beginPath(), i.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.shadowColor = "rgba(0,0,0,0.2)", i.shadowBlur = 4, i.fill(), i.beginPath(), i.arc(0, 0, 24 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.lineWidth = 1, i.strokeStyle = "#333", i.stroke(), i.beginPath(), i.arc(0, 0, 24 / 2, -Math.PI / 2, Math.PI / 2, !1), i.fillStyle = "black", i.fill(), i.restore();
}, k = new u({
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
}), z = (i, e, s, t, a) => {
  i.save(), i.translate(e, s), i.rotate(p.degreesToRadians(a.angle)), i.beginPath(), i.arc(0, 0, 28 / 2, 0, 2 * Math.PI, !1), i.fillStyle = "white", i.fill(), i.shadowColor = "rgba(0,0,0,0.2)", i.shadowBlur = 4, i.fill(), i.strokeStyle = "#2196F3", i.lineWidth = 2, i.beginPath(), i.arc(0, 0, 24 / 4, 0, Math.PI * 1.5, !1), i.stroke(), i.fillStyle = "#2196F3", i.beginPath(), i.moveTo(24 / 4, -24 / 8), i.lineTo(24 / 4 + 4, 0), i.lineTo(24 / 4 - 4, 0), i.fill(), i.restore();
}, E = new u({
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
  render: z
});
class T {
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
      buttons: {},
      // Map of action -> buttonId
      statusDisplayId: null,
      errorDisplayId: null,
      ...e
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
      await this.fetchImages(), this.showError("圖片列表已更新", !0);
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
            this.updateStatusDisplay(), o.skipped && o.skipped.length > 0 && this.showError(`已略過重複圖片: ${o.skipped.join(", ")}`);
          } else
            this.showError("無可讀取的佈局資料");
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
        const s = this.canvas.getWidth(), t = this.canvas.getHeight();
        e.innerHTML = `
                <strong>設定:</strong> DPI ${this.config.dpi} | 
                <strong>頁數:</strong> ${this.pageCount} | 
                <strong>方向:</strong> ${this.orientation === "portrait" ? "直式" : "橫式"} | 
                <strong>畫布尺寸:</strong> ${s} x ${t} px
            `;
      }
    }
  }
  async fetchImages() {
    try {
      const e = await fetch(this.config.apiEndpoint);
      if (!e.ok) throw new Error("API 讀取失敗");
      const s = await e.json();
      this.images = s.data || [], this.renderSidebar();
    } catch (e) {
      console.error("讀取圖片錯誤:", e), this.showError("讀取圖片列表失敗"), this.images = [], this.renderSidebar();
    }
  }
  renderSidebar() {
    const e = document.getElementById("image-sidebar");
    e && (e.innerHTML = "", this.images.forEach((s) => {
      const t = document.createElement("div");
      t.className = "image-item", t.dataset.id = s.img_id, t.onclick = () => this.addImageToCanvas(s.img_id), this.config.uniqueImages && this.isImageOnCanvas(s.img_id) && t.classList.add("disabled");
      const a = document.createElement("img");
      a.src = s.url || s.base64, a.draggable = !1;
      const n = document.createElement("span");
      n.className = "label", n.innerText = s.title || s.img_id, t.appendChild(a), t.appendChild(n), e.appendChild(t);
    }));
  }
  isImageOnCanvas(e) {
    return this.canvas.getObjects().some((s) => s.imageId === e);
  }
  updateSidebarStatus(e, s) {
    if (!this.config.uniqueImages) return;
    const t = document.querySelector(`.image-item[data-id="${e}"]`);
    t && (s ? t.classList.add("disabled") : t.classList.remove("disabled"));
  }
  async addImageToCanvas(e) {
    if (this.config.uniqueImages && this.isImageOnCanvas(e)) return;
    const s = this.images.find((n) => n.img_id === e);
    if (!s) return;
    const t = s.url || s.base64, a = await v.fromURL(t);
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
    delete e.controls.ml, delete e.controls.mr, delete e.controls.mt, delete e.controls.mb, delete e.controls.mtr, e.controls.deleteControl = S, e.controls.grayscaleControl = k, e.controls.rotate90Control = E;
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
        const r = new y({
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
        const r = new y({
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
      const l = this.pageWidthPx, d = this.pageHeightPx;
      if (e === "portrait")
        n = Math.floor(a.x / (l + this.gap)), o = a.x - n * (l + this.gap), r = a.y;
      else {
        const m = l;
        n = Math.floor(a.y / (m + this.gap)), o = a.x, r = a.y - n * (m + this.gap);
      }
      let h, c;
      e === "portrait" ? (h = d - r, c = o, t.angle = (t.angle || 0) + 90) : (h = r, c = d - o, t.angle = (t.angle || 0) - 90);
      let g, f;
      this.orientation === "portrait" ? (g = n * (l + this.gap) + h, f = c) : (g = h, f = n * (l + this.gap) + c), t.setPositionByOrigin(new C(g, f), "center", "center"), t.setCoords();
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
      extraParams: e
    };
  }
  async load(e) {
    if (!e) return { success: !1, message: "No data" };
    this.canvas.clear(), this.orientation = e.orientation || "portrait", this.pageCount = e.pageCount || 1, this.setupLayout();
    const s = e.canvasObjects || [], t = /* @__PURE__ */ new Set(), a = [];
    for (const n of s) {
      if (this.config.uniqueImages && t.has(n.imageId)) {
        const r = this.images.find((d) => d.img_id === n.imageId), l = r ? r.title || r.img_id : n.imageId;
        a.push(l);
        continue;
      }
      const o = this.images.find((r) => r.img_id === n.imageId);
      if (o) {
        t.add(n.imageId);
        const r = o.url || o.base64, l = await v.fromURL(r);
        l.set(n), l.set({ src: r }), n.filters && n.filters.length > 0 && l.applyFilters(), this.setupCustomControls(l), this.canvas.add(l), this.updateSidebarStatus(n.imageId, !0);
      } else
        console.warn(`Image ID ${n.imageId} not found in API. Skipping.`);
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
        const h = s, c = e;
        a = 0, n = t * (c + this.gap), o = h, r = c;
      }
      const l = this.canvas.getObjects().filter((h) => !h.isBackground), d = [];
      l.forEach((h) => {
        const c = h.getCenterPoint();
        c.x >= a && c.x <= a + o && c.y >= n && c.y <= n + r && d.push(h);
      }), d.forEach((h) => {
        h.imageId && this.updateSidebarStatus(h.imageId, !1), this.canvas.remove(h);
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
  destroy() {
    this.canvas && (this.canvas.dispose(), this.canvas = null);
  }
}
export {
  T as FabricA4Layout
};
