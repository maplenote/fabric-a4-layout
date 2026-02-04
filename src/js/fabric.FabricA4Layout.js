import { Canvas, Rect, FabricImage, Control, util, filters, Point } from 'fabric';
import { defaultLocale } from './locale.js';
import '../scss/fabric.FabricA4Layout.scss';

// --- Custom Control Definitions (Module Level) ---

const renderDeleteIcon = (ctx, left, top, styleOverride, fabricObject) => {
    const size = 24;
    const hitSize = 28;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(fabricObject.angle));

    ctx.beginPath();
    ctx.arc(0, 0, hitSize / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#F44336';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(-size / 4, -size / 4);
    ctx.lineTo(size / 4, size / 4);
    ctx.moveTo(size / 4, -size / 4);
    ctx.lineTo(-size / 4, size / 4);
    ctx.stroke();
    ctx.restore();
};

const deleteControl = new Control({
    x: 0.5,
    y: -0.5, // Top Right
    offsetY: 16,
    offsetX: -16,
    sizeX: 28,
    sizeY: 28,
    cursorStyle: 'pointer',
    mouseUpHandler: (eventData, transform) => {
        const target = transform.target;
        const canvas = target.canvas;

        // Remove first, then notify
        canvas.remove(target);

        if (target.imageId) {
            canvas.fire('object:custom:delete', { target });
        }

        canvas.requestRenderAll();
        return true;
    },
    render: renderDeleteIcon
});

const renderGrayIcon = (ctx, left, top, styleOverride, fabricObject) => {
    const size = 24;
    const hitSize = 28;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(fabricObject.angle));

    ctx.beginPath();
    ctx.arc(0, 0, hitSize / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size / 2, -Math.PI / 2, Math.PI / 2, false);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.restore();
};

const grayscaleControl = new Control({
    x: -0.5,
    y: 0.5, // Bottom Left
    offsetY: -16,
    offsetX: 16,
    sizeX: 28,
    sizeY: 28,
    cursorStyle: 'pointer',
    mouseUpHandler: (eventData, transform) => {
        const target = transform.target;
        const canvas = target.canvas;

        canvas.setCursor('wait');

        setTimeout(() => {
            const hasGray = target.filters.some(f => f.type === 'Grayscale');
            if (hasGray) {
                target.filters = target.filters.filter(f => f.type !== 'Grayscale');
            } else {
                target.filters.push(new filters.Grayscale());
            }

            target.applyFilters();
            canvas.setCursor('default');
            canvas.requestRenderAll();
        }, 50);

        return true;
    },
    render: renderGrayIcon
});

const renderRotateIcon = (ctx, left, top, styleOverride, fabricObject) => {
    const size = 24;
    const hitSize = 28;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(fabricObject.angle));

    ctx.beginPath();
    ctx.arc(0, 0, hitSize / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size / 4, 0, Math.PI * 1.5, false);
    ctx.stroke();

    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.moveTo(size / 4, -size / 8);
    ctx.lineTo(size / 4 + 4, 0);
    ctx.lineTo(size / 4 - 4, 0);
    ctx.fill();

    ctx.restore();
};

const rotate90Control = new Control({
    x: -0.5,
    y: -0.5, // Top Left
    offsetY: 16,
    offsetX: 16,
    sizeX: 28,
    sizeY: 28,
    cursorStyle: 'crosshair',
    mouseUpHandler: (eventData, transform) => {
        const target = transform.target;
        const canvas = target.canvas;

        const currentAngle = target.angle || 0;
        target.set('angle', (currentAngle + 90) % 360);

        target.setCoords();
        canvas.requestRenderAll();
        return true;
    },
    render: renderRotateIcon
});

/**
 * FabricA4Layout
 */
export class FabricA4Layout {
    constructor(config) {
        this.config = {
            dpi: 48,
            width: 210, // mm
            height: 297, // mm
            pageMargin: 5, // mm (Default 5mm margin/bleed)
            orientation: 'portrait',
            saveWithBase64: false,
            uniqueImages: false,
            defaultGrayscale: false,
            saveEndpoint: null,
            data: {},
            buttons: {}, // Map of action -> buttonId
            statusDisplayId: null,
            errorDisplayId: null,
            locale: {},
            ...config
        };

        // Merge Locale
        this.t = {
            status: { ...defaultLocale.status, ...(this.config.locale?.status || {}) },
            error: { ...defaultLocale.error, ...(this.config.locale?.error || {}) },
            confirm: { ...defaultLocale.confirm, ...(this.config.locale?.confirm || {}) }
        };

        if (this.config.dpi < 24) this.config.dpi = 24;
        if (this.config.dpi > 192) this.config.dpi = 192;

        const mmToPx = (mm) => Math.round((mm / 25.4) * this.config.dpi);
        this.pageWidthPx = mmToPx(this.config.width);
        this.pageHeightPx = mmToPx(this.config.height);
        this.pageMarginPx = mmToPx(this.config.pageMargin);
        this.gap = 4; // px

        this.canvasId = this.config.canvasId;
        this.canvas = null;
        this.images = [];
        this.pageCount = 1;

        this.orientation = this.config.orientation;
        this._layoutPending = false;
        this._layoutPromise = null;
    }

    async init() {
        this.canvas = new Canvas(this.canvasId, {
            preserveObjectStacking: true,
            selection: true,
            enableRetinaScaling: false
        });

        this.setupLayout();
        await this.fetchImages();
        this.setupEvents();
        this.bindControls();
        this.updateStatusDisplay();

        // Render Bleed Overlay (Always on top)
        this.canvas.on('after:render', (opt) => this._renderBleedOverlay(opt.ctx));
        this.canvas.requestRenderAll();
    }

    _renderBleedOverlay(ctx) {
        if (!this.canvas) return;

        ctx.save();

        // Ensure we draw in the correct coordinate system (handle pan/zoom if any)
        const vpt = this.canvas.viewportTransform;
        ctx.transform(vpt[0], vpt[1], vpt[2], vpt[3], vpt[4], vpt[5]);

        const m = this.pageMarginPx;
        const pW = this.pageWidthPx;
        const pH = this.pageHeightPx;
        const gap = this.gap;

        // Color: #bdbdff (Light Purple) with 0.2 Opacity
        ctx.fillStyle = 'rgba(189, 189, 255, 0.2)';

        ctx.beginPath();

        for (let i = 0; i < this.pageCount; i++) {
            let gx, gy, gw, gh;

            if (this.orientation === 'portrait') {
                gx = i * (pW + gap);
                gy = 0;
                gw = pW;
                gh = pH;
            } else {
                // Landscape
                const visualW = pH;
                const visualH = pW;
                gx = 0;
                gy = i * (visualH + gap);
                gw = visualW; // Visual Width
                gh = visualH; // Visual Height
            }

            // Outer Rect (Page)
            ctx.rect(gx, gy, gw, gh);

            // Inner Rect (Safe Area)
            ctx.rect(gx + m, gy + m, gw - 2 * m, gh - 2 * m);
        }

        // Fill using evenodd rule to create "holes" for the safe area
        ctx.fill('evenodd');

        ctx.restore();
    }

    _beginLayoutCycle() {
        if (!this.canvas) return;

        this._layoutPending = true;
        this._layoutPromise = new Promise((resolve) => {
            const handler = () => {
                this.canvas.off('after:render', handler);
                this._layoutPending = false;
                resolve();
            };
            this.canvas.on('after:render', handler);
        });
    }

    _waitForLayout() {
        if (!this._layoutPending || !this._layoutPromise) return Promise.resolve();
        return this._layoutPromise;
    }

    bindControls() {
        const btns = this.config.buttons;

        const bind = (id, fn) => {
            if (id) {
                const el = document.getElementById(id);
                if (el) {
                    const newEl = el.cloneNode(true);
                    el.parentNode.replaceChild(newEl, el);
                    newEl.onclick = fn;
                }
            }
        };

        bind(btns.orientation, () => {
            this.toggleOrientation();
            this.updateStatusDisplay();
        });

        bind(btns.addPage, () => {
            this.addPage();
            this.updateStatusDisplay();
        });

        bind(btns.removePage, () => {
            this.removePage();
            this.updateStatusDisplay();
        });

        bind(btns.refreshImages, async () => {
            await this._waitForLayout();
            this.cleanupOutOfBounds();
            await this.fetchImages();
            this.showError(this.t.error.listUpdated, true);
        });

        bind(btns.clearCanvas, () => {
            if (confirm(this.t.confirm.clearCanvas)) {
                this.clearCanvas();
                this.showError(this.t.error.canvasCleared, true);
            }
        });

        if (btns.save) {
            const el = document.getElementById(btns.save);
            if (el) {
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
                newEl.onclick = () => {
                    const data = this.save();
                    if (this.config.onSave) this.config.onSave(data);
                };
            }
        }

        if (btns.load) {
            const el = document.getElementById(btns.load);
            if (el) {
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
                newEl.onclick = async () => {
                    let data = null;
                    if (this.config.onLoad) data = this.config.onLoad();
                    if (data) {
                        const res = await this.load(data);
                        this.updateStatusDisplay();
                        if (res.skipped && res.skipped.length > 0) {
                            this.showError(`${this.t.error.skipped} ${res.skipped.join(', ')}`);
                        }
                    } else {
                        this.showError(this.t.error.noData);
                    }
                };
            }
        }

        if (btns.settings && this.config.onSettingsClick) {
            const el = document.getElementById(btns.settings);
            if (el) {
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
                newEl.onclick = this.config.onSettingsClick;
            }
        }
    }

    showError(msg, isInfo = false) {
        if (this.config.errorDisplayId) {
            const el = document.getElementById(this.config.errorDisplayId);
            if (el) {
                el.style.display = 'block';
                el.innerText = msg;
                el.style.backgroundColor = isInfo ? '#e8f5e9' : '#ffebee';
                el.style.color = isInfo ? '#2e7d32' : '#c62828';
                el.style.borderColor = isInfo ? '#a5d6a7' : '#ef9a9a';

                setTimeout(() => {
                    el.style.display = 'none';
                }, 5000);
            }
        } else {
            console.log(isInfo ? 'Info:' : 'Error:', msg);
            if (!isInfo) alert(msg);
        }
    }

    updateStatusDisplay() {
        if (this.config.statusDisplayId) {
            const el = document.getElementById(this.config.statusDisplayId);
            if (el && this.canvas) {
                const totalW = this.canvas.getWidth();
                const totalH = this.canvas.getHeight();
                const dir = this.orientation === 'portrait' ? this.t.status.portrait : this.t.status.landscape;

                el.innerHTML = `
                <strong>${this.t.status.setting}</strong> ${this.t.status.dpi} ${this.config.dpi} | 
                <strong>${this.t.status.pages}</strong> ${this.pageCount} | 
                <strong>${this.t.status.orientation}</strong> ${dir} | 
                <strong>${this.t.status.size}</strong> ${totalW} x ${totalH} px |
                <strong>${this.t.status.margin}</strong> ${this.config.pageMargin} |
                <strong>${this.t.status.grayscale}</strong> ${this.config.defaultGrayscale ? this.t.status.on : this.t.status.off}
            `;
            }
        }
    }

    async fetchImages() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) throw new Error(this.t.error.fetchFailed);
            const json = await response.json();

            if (json.succ === false) {
                throw new Error(json.error || this.t.error.fetchFailed);
            }

            this.images = json.data || [];
            this.renderSidebar();
        } catch (e) {
            console.error(this.t.error.readError, e);
            this.showError(`${this.t.error.fetchFailed}: ${e.message}`);
            this.images = [];
            this.renderSidebar();
        }
    }

    renderSidebar() {
        const sidebar = document.getElementById('image-sidebar');
        if (!sidebar) return;

        sidebar.innerHTML = '';

        this.images.forEach(imgData => {
            const div = document.createElement('div');
            div.className = 'image-item';
            div.dataset.id = imgData.img_id;

            const isOnCanvas = this.config.uniqueImages && this.isImageOnCanvas(imgData.img_id);

            div.onclick = () => {
                if (isOnCanvas) {
                    if (confirm(this.t.confirm.removeImage)) {
                        const objects = this.canvas.getObjects().filter(o => o.imageId === imgData.img_id);
                        objects.forEach(o => this.canvas.remove(o));
                        this.updateSidebarStatus(imgData.img_id, false);
                        this.showError(this.t.error.removedFromCanvas, true);
                    }
                } else {
                    this.addImageToCanvas(imgData.img_id);
                }
            };

            if (isOnCanvas) {
                div.classList.add('disabled');
                div.title = "已在A4上 (點擊可移除)";
                div.style.cursor = "help";
            }

            const img = document.createElement('img');
            img.src = imgData.url || imgData.base64;
            img.draggable = false;

            const span = document.createElement('span');
            span.className = 'label';
            span.innerText = imgData.title || imgData.img_id;

            div.appendChild(img);
            div.appendChild(span);
            sidebar.appendChild(div);
        });
    }

    isImageOnCanvas(imgId) {
        return this.canvas.getObjects().some(obj => obj.imageId === imgId);
    }

    updateSidebarStatus(imgId, disabled) {
        if (!this.config.uniqueImages) return;
        this.renderSidebar();
    }

    async addImageToCanvas(imgId) {
        if (this.config.uniqueImages && this.isImageOnCanvas(imgId)) return;

        const imgData = this.images.find(i => i.img_id === imgId);
        if (!imgData) return;

        const imgSrc = imgData.url || imgData.base64;
        const imgObj = await FabricImage.fromURL(imgSrc);

        // Default props
        imgObj.set({
            imageId: imgId,
            cornerSize: 10,
            transparentCorners: false,
            originX: 'center',
            originY: 'center'
        });

        // Apply DPI Correction based on ORIGINAL dimensions from API
        // The Base64 image might be a thumbnail (e.g., 300px), but we want to render 
        // the size as if it were the original image at the target DPI.
        const BASE_DPI = 96;
        const targetDpiScale = this.config.dpi / BASE_DPI; // e.g. 48/96 = 0.5

        // Calculate the scale factor to restore original physical size
        // Scale = (Original / Base64) * DPI_Ratio
        let finalScaleX = 1;
        let finalScaleY = 1;

        if (imgData.original_width && imgData.original_height && imgObj.width > 0 && imgObj.height > 0) {
            finalScaleX = (imgData.original_width / imgObj.width) * targetDpiScale;
            finalScaleY = (imgData.original_height / imgObj.height) * targetDpiScale;
        } else {
            // Fallback if original dimensions are missing
            finalScaleX = targetDpiScale;
            finalScaleY = targetDpiScale;
        }

        imgObj.scaleX = finalScaleX;
        imgObj.scaleY = finalScaleY;

        // Apply Default Grayscale
        if (this.config.defaultGrayscale) {
            imgObj.filters.push(new filters.Grayscale());
            imgObj.applyFilters();
        }

        this.setupCustomControls(imgObj);

        // 1. Determine Page Dimensions & Scale Logic
        const isPortrait = this.orientation === 'portrait';
        // Visual dimensions of one page
        const pageVisualW = isPortrait ? this.pageWidthPx : this.pageHeightPx;
        const pageVisualH = isPortrait ? this.pageHeightPx : this.pageWidthPx;

        // Define Safe Area (Effective Width/Height)
        const effectiveW = pageVisualW - (this.pageMarginPx * 2);
        const effectiveH = pageVisualH - (this.pageMarginPx * 2);

        // Check against Safe Limits (Fit & Scale if too big)
        // Now getScaledWidth/Height reflects the "Original Physical Size" at current DPI
        if (imgObj.getScaledWidth() > effectiveW || imgObj.getScaledHeight() > effectiveH) {
            // Scale to fit safe area
            const fitScale = Math.min(effectiveW / imgObj.getScaledWidth(), effectiveH / imgObj.getScaledHeight());

            // Apply the fit scale on top of the restored scale
            imgObj.scaleX *= fitScale;
            imgObj.scaleY *= fitScale;
        }

        // 2. Find Insertion Point (Flow Logic)
        let targetPage = this.pageCount - 1;

        // Helper to find objects on a specific page index
        const getObjectsOnPage = (pIdx) => {
            const objs = this.canvas.getObjects().filter(o => !o.isBackground);
            return objs.filter(o => {
                const center = o.getCenterPoint();
                if (isPortrait) {
                    const pStart = pIdx * (pageVisualW + this.gap);
                    const pEnd = pStart + pageVisualW;
                    return center.x >= pStart && center.x < pEnd;
                } else {
                    const pStart = pIdx * (pageVisualH + this.gap);
                    const pEnd = pStart + pageVisualH;
                    return center.y >= pStart && center.y < pEnd;
                }
            });
        };

        const pageObjects = getObjectsOnPage(targetPage);
        let startY = 0; // Relative Y on the page

        // Define a safe top margin
        const topMargin = this.pageMarginPx;

        if (pageObjects.length > 0) {
            // Find the bottom-most point of existing objects
            let maxBottom = 0;
            pageObjects.forEach(o => {
                // Calculate relative bottom
                let objBottomRel = 0;
                if (isPortrait) {
                    // With center origin, top is center Y. Bottom is Top + Height/2
                    objBottomRel = o.top + (o.getScaledHeight() / 2);
                } else {
                    // In landscape, global Top includes page offsets
                    const pageOffset = targetPage * (pageVisualH + this.gap);
                    // Center Y - PageOffset + Height/2
                    objBottomRel = (o.top - pageOffset) + (o.getScaledHeight() / 2);
                }
                if (objBottomRel > maxBottom) maxBottom = objBottomRel;
            });
            startY = maxBottom + this.gap;
        } else {
            startY = topMargin;
        }

        // 3. Check Vertical Overflow
        if (startY + imgObj.getScaledHeight() > pageVisualH - this.pageMarginPx) {
            // Doesn't fit on current page -> New Page
            this.addPage();
            targetPage++;
            startY = topMargin; // Reset to top for new page
        }

        // 4. Calculate Global Coordinates
        let globalLeft, globalTop;

        if (isPortrait) {
            const pageOffset = targetPage * (pageVisualW + this.gap);

            // Left Align with Margin (Origin is Center)
            // Center X = PageStart + Margin + (Width / 2)
            globalLeft = pageOffset + this.pageMarginPx + (imgObj.getScaledWidth() / 2);

            // Global Top = startY (margin or bottom of prev) + Half Height
            globalTop = startY + (imgObj.getScaledHeight() / 2);
        } else {
            const pageOffset = targetPage * (pageVisualH + this.gap);

            // Left Align with Margin (Origin is Center)
            // Center X = Margin + (Width / 2)
            globalLeft = this.pageMarginPx + (imgObj.getScaledWidth() / 2);

            globalTop = pageOffset + startY + (imgObj.getScaledHeight() / 2);
        }

        imgObj.set({ left: globalLeft, top: globalTop });

        this.canvas.add(imgObj);
        this.canvas.setActiveObject(imgObj);
        this.updateSidebarStatus(imgId, true);
    }

    setupCustomControls(obj) {
        delete obj.controls.ml;
        delete obj.controls.mr;
        delete obj.controls.mt;
        delete obj.controls.mb;
        delete obj.controls.mtr;

        obj.controls.deleteControl = deleteControl;
        obj.controls.grayscaleControl = grayscaleControl;
        obj.controls.rotate90Control = rotate90Control;
    }

    setupLayout() {
        let totalW, totalH;

        const bgObjects = this.canvas.getObjects().filter(o => o.isBackground);
        this.canvas.remove(...bgObjects);

        if (this.orientation === 'portrait') {
            const w = this.pageWidthPx;
            const h = this.pageHeightPx;

            totalH = h;
            totalW = (w + this.gap) * this.pageCount - this.gap;

            this.canvas.setDimensions(
                { width: totalW, height: totalH },
                { cssOnly: false, backstoreOnly: false }
            );

            for (let i = 0; i < this.pageCount; i++) {
                const bgRect = new Rect({
                    left: i * (w + this.gap),
                    top: 0,
                    width: w,
                    height: h,
                    fill: 'white',
                    stroke: '#999',
                    strokeWidth: 1,
                    selectable: false,
                    evented: false,
                    isBackground: true,
                    hoverCursor: 'default',
                    originX: 'left',
                    originY: 'top'
                });
                this.canvas.add(bgRect);
                this.canvas.sendObjectToBack(bgRect);
            }

        } else {
            const w = this.pageHeightPx;
            const h = this.pageWidthPx;

            totalW = w;
            totalH = (h + this.gap) * this.pageCount - this.gap;

            this.canvas.setDimensions(
                { width: totalW, height: totalH },
                { cssOnly: false, backstoreOnly: false }
            );

            for (let i = 0; i < this.pageCount; i++) {
                const bgRect = new Rect({
                    left: 0,
                    top: i * (h + this.gap),
                    width: w,
                    height: h,
                    fill: 'white',
                    stroke: '#999',
                    strokeWidth: 1,
                    selectable: false,
                    evented: false,
                    isBackground: true,
                    hoverCursor: 'default',
                    originX: 'left',
                    originY: 'top'
                });
                this.canvas.add(bgRect);
                this.canvas.sendObjectToBack(bgRect);
            }
        }

        this.canvas.calcOffset();
        this._beginLayoutCycle();
        this.canvas.requestRenderAll();
    }

    toggleOrientation() {
        const oldOrientation = this.orientation;
        this.orientation = oldOrientation === 'portrait' ? 'landscape' : 'portrait';

        const objects = this.canvas.getObjects().filter(o => !o.isBackground);

        objects.forEach(obj => {
            const center = obj.getCenterPoint();

            let pageIndex = 0;
            let localCx = 0;
            let localCy = 0;

            const pW = this.pageWidthPx;
            const pH = this.pageHeightPx;

            if (oldOrientation === 'portrait') {
                pageIndex = Math.floor(center.x / (pW + this.gap));
                localCx = center.x - pageIndex * (pW + this.gap);
                localCy = center.y;
            } else {
                const visualW = pH;
                const visualH = pW;
                pageIndex = Math.floor(center.y / (visualH + this.gap));
                localCx = center.x;
                localCy = center.y - pageIndex * (visualH + this.gap);
            }

            let newLocalCx, newLocalCy;

            if (oldOrientation === 'portrait') {
                newLocalCx = pH - localCy;
                newLocalCy = localCx;
                obj.angle = (obj.angle || 0) + 90;
            } else {
                newLocalCx = localCy;
                newLocalCy = pH - localCx;

                obj.angle = (obj.angle || 0) - 90;
            }

            let newGlobalCx, newGlobalCy;
            if (this.orientation === 'portrait') {
                newGlobalCx = pageIndex * (pW + this.gap) + newLocalCx;
                newGlobalCy = newLocalCy;
            } else {
                newGlobalCx = newLocalCx;
                newGlobalCy = pageIndex * (pW + this.gap) + newLocalCy;
            }

            obj.setPositionByOrigin(new Point(newGlobalCx, newGlobalCy), 'center', 'center');
            obj.setCoords();
        });

        this.setupLayout();
    }

    setupEvents() {
        this.canvas.on('object:custom:delete', (e) => {
            if (e.target && e.target.imageId) {
                this.updateSidebarStatus(e.target.imageId, false);
            }
        });
    }

    save(extraParams = {}) {
        const objects = this.canvas.getObjects().filter(o => !o.isBackground);
        const items = [];

        const pW = this.pageWidthPx;
        const pH = this.pageHeightPx;
        const gap = this.gap;

        objects.forEach((obj, index) => {
            const center = obj.getCenterPoint();
            let pageNum = 1;
            let relativeLeft = 0;
            let relativeTop = 0;

            if (this.orientation === 'portrait') {
                // Portrait: Pages stacked horizontally
                // Page Index = floor(Center X / (Width + Gap))
                const pageIndex = Math.floor(center.x / (pW + gap));
                pageNum = pageIndex + 1;

                // Relative Left = Center X - Page Start X
                relativeLeft = center.x - (pageIndex * (pW + gap));
                relativeTop = center.y;
            } else {
                // Landscape: Pages stacked vertically
                // Visual Width is pH, Visual Height is pW (swapped dimensions in logic)
                // But typically Landscape A4 means the paper is rotated. 
                // In this implementation:
                // Portrait: W=210mm, H=297mm.
                // Landscape: W=297mm, H=210mm.
                // The canvas is resizing based on orientation.

                // Let's check setupLayout():
                // Portrait: canvas width = (w + gap) * count.
                // Landscape: canvas height = (h + gap) * count.

                // In Landscape mode:
                // Width = pH (297mm equivalent px)
                // Height = pW (210mm equivalent px)
                const visualW = pH;
                const visualH = pW;

                const pageIndex = Math.floor(center.y / (visualH + gap));
                pageNum = pageIndex + 1;

                relativeLeft = center.x;
                relativeTop = center.y - (pageIndex * (visualH + gap));
            }

            // Construct img_setting
            const imgSetting = {
                type: 'image',
                originX: 'center',
                originY: 'center',
                left: relativeLeft,
                top: relativeTop,
                angle: obj.angle || 0,
                width: obj.width,
                height: obj.height,
                scaleX: obj.scaleX || 1,
                scaleY: obj.scaleY || 1,
                is_grayscale: obj.filters.some(f => f.type === 'Grayscale')
            };

            items.push({
                seq_no: index + 1,
                img_id: obj.imageId,
                page_num: pageNum,
                img_setting: imgSetting
            });
        });

        return {
            data: { ...this.config.data, ...extraParams },
            page: {
                orientation: this.orientation,
                dpi: this.config.dpi,
                width: this.orientation === 'portrait' ? pW : pH,
                height: this.orientation === 'portrait' ? pH : pW,
                margin: this.config.pageMargin,
                pages: this.pageCount
            },
            items: items
        };
    }

    async saveToBackend(extraParams = {}) {
        const data = this.save(extraParams);

        if (!this.config.saveEndpoint) {
            throw new Error('No saveEndpoint configured.');
        }

        try {
            const response = await fetch(this.config.saveEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resJson = await response.json();
            if (resJson.succ === false) {
                throw new Error(resJson.error || 'Server reported failure.');
            }
            return resJson;
        } catch (error) {
            console.error('Save failed:', error);
            throw error;
        }
    }

    async load(inputData) {
        if (!inputData) return { success: false, message: 'No data' };

        // Standard API Response Handling (Unwrap if needed)
        let layoutData = inputData;
        if ('succ' in inputData) {
            if (inputData.succ === false) {
                return { success: false, message: inputData.error || 'Unknown error from API data' };
            }
            if (inputData.data) {
                layoutData = inputData.data;
            }
        }

        const data = layoutData;

        this.canvas.clear();

        this.orientation = (data.page && data.page.orientation) || data.orientation || 'portrait';
        this.pageCount = (data.page && data.page.pages) || data.pageCount || 1;

        // Update Margin from Load Data if present
        if (data.page && typeof data.page.margin !== 'undefined') {
            this.config.pageMargin = data.page.margin;
        } else if (typeof data.margin !== 'undefined') {
            this.config.pageMargin = data.margin;
        }
        // Recalculate Margin PX
        const mmToPx = (mm) => Math.round((mm / 25.4) * this.config.dpi);
        this.pageMarginPx = mmToPx(this.config.pageMargin);

        this.setupLayout();

        // Support new 'items' format or fallback (though fallback is not strictly required by prompt, it's safer)
        const items = data.items || [];
        // If legacy format 'canvasObjects' exists and 'items' is empty, one might consider converting, 
        // but the requirement is to Change Load Logic to Expect Center. Legacy format was Top-Left.
        // So strictly following the new spec is better.

        const seenIds = new Set();
        const skippedItems = [];

        const loadedDpi = (data.page && data.page.dpi) || data.dpi || this.config.dpi;
        const scaleFactor = this.config.dpi / loadedDpi;

        const pW = this.pageWidthPx;
        const pH = this.pageHeightPx;
        const gap = this.gap;

        for (const item of items) {
            const imgId = item.img_id;
            const setting = item.img_setting || {};

            if (this.config.uniqueImages && seenIds.has(imgId)) {
                const duplicateImg = this.images.find(i => i.img_id === imgId);
                const name = duplicateImg ? (duplicateImg.title || duplicateImg.img_id) : imgId;
                skippedItems.push(name);
                continue;
            }

            const apiImg = this.images.find(i => i.img_id === imgId);

            if (apiImg) {
                seenIds.add(imgId);

                // Denormalize Coordinates (Relative -> Absolute)
                const pageIndex = (item.page_num || 1) - 1;
                let absLeft = 0;
                let absTop = 0;

                // setting.left/top are Centers relative to Page Top-Left
                if (this.orientation === 'portrait') {
                    absLeft = (setting.left || 0) + (pageIndex * (pW + gap));
                    absTop = (setting.top || 0);
                } else {
                    const visualH = pW; // Height of landscape page (visually)
                    absLeft = (setting.left || 0);
                    absTop = (setting.top || 0) + (pageIndex * (visualH + gap));
                }

                // Apply Scale Factor if DPI changed
                let finalScaleX = setting.scaleX || 1;
                let finalScaleY = setting.scaleY || 1;

                if (Math.abs(scaleFactor - 1) > 0.0001) {
                    // Coordinates (Centers) scale directly
                    // Note: If the page size scales, the offset calculation above assumes pW/pH are CURRENT config.
                    // Ideally, we should scale the RELATIVE coord first, then add CURRENT offset.

                    // Logic:
                    // Rel_Cur = Rel_Saved * Scale
                    // Abs_Cur = Rel_Cur + Offset_Cur

                    // Re-calculate using scaling:
                    const relLeftScaled = (setting.left || 0) * scaleFactor;
                    const relTopScaled = (setting.top || 0) * scaleFactor;

                    if (this.orientation === 'portrait') {
                        absLeft = relLeftScaled + (pageIndex * (pW + gap));
                        absTop = relTopScaled;
                    } else {
                        const visualH = pW;
                        absLeft = relLeftScaled;
                        absTop = relTopScaled + (pageIndex * (visualH + gap));
                    }

                    finalScaleX *= scaleFactor;
                    finalScaleY *= scaleFactor;
                }

                const imgSrc = apiImg.url || apiImg.base64;
                const imgObj = await FabricImage.fromURL(imgSrc);

                imgObj.set({
                    left: absLeft,
                    top: absTop,
                    angle: setting.angle || 0,
                    scaleX: finalScaleX,
                    scaleY: finalScaleY,
                    originX: 'center',
                    originY: 'center',
                    imageId: imgId,
                    cornerSize: 10,
                    transparentCorners: false
                });

                if (setting.is_grayscale) {
                    imgObj.filters.push(new filters.Grayscale());
                    imgObj.applyFilters();
                }

                this.setupCustomControls(imgObj);

                this.canvas.add(imgObj);
                this.updateSidebarStatus(imgId, true);
            } else {
                console.warn(`Image ID ${imgId} not found in API. Skipping.`);
            }
        }

        this.canvas.requestRenderAll();
        return { success: true, skipped: skippedItems };
    }

    addPage() {
        this.pageCount++;
        this.setupLayout();
    }

    removePage() {
        if (this.pageCount > 1) {
            const pW = this.pageWidthPx;
            const pH = this.pageHeightPx;
            const lastPageIndex = this.pageCount - 1;

            let pageLeft, pageTop, pageWidth, pageHeight;

            if (this.orientation === 'portrait') {
                pageLeft = lastPageIndex * (pW + this.gap);
                pageTop = 0;
                pageWidth = pW;
                pageHeight = pH;
            } else {
                const visualW = pH;
                const visualH = pW;
                pageLeft = 0;
                pageTop = lastPageIndex * (visualH + this.gap);
                pageWidth = visualW;
                pageHeight = visualH;
            }

            const objects = this.canvas.getObjects().filter(obj => !obj.isBackground);
            const objectsToRemove = [];
            const removedImageIds = new Set();

            objects.forEach(obj => {
                const center = obj.getCenterPoint();

                if (center.x >= pageLeft && center.x <= pageLeft + pageWidth &&
                    center.y >= pageTop && center.y <= pageTop + pageHeight) {
                    objectsToRemove.push(obj);
                }
            });

            objectsToRemove.forEach(obj => {
                if (obj.imageId) removedImageIds.add(obj.imageId);
                this.canvas.remove(obj);
            });

            this.pageCount--;
            this.setupLayout();

            if (removedImageIds.size > 0) {
                this.updateSidebarStatus(null, false);
            }
        }
    }

    enforceUniqueness() {
        if (!this.config.uniqueImages) return;

        const objects = this.canvas.getObjects().filter(o => !o.isBackground);
        const seenIds = new Set();
        const objectsToRemove = [];

        objects.forEach(obj => {
            if (obj.imageId) {
                if (seenIds.has(obj.imageId)) {
                    objectsToRemove.push(obj);
                } else {
                    seenIds.add(obj.imageId);
                }
            }
        });

        objectsToRemove.forEach(obj => {
            this.canvas.remove(obj);
        });

        this.canvas.requestRenderAll();
        return objectsToRemove.length;
    }

    cleanupOutOfBounds() {
        const objects = this.canvas.getObjects().filter(o => !o.isBackground);
        const totalW = this.canvas.getWidth();
        const totalH = this.canvas.getHeight();

        objects.forEach(obj => {
            const center = obj.getCenterPoint();
            // Allow some buffer (e.g. 50px)
            if (center.x < -50 || center.x > totalW + 50 || center.y < -50 || center.y > totalH + 50) {
                this.canvas.remove(obj);
                if (obj.imageId) {
                    this.updateSidebarStatus(obj.imageId, false);
                }
            }
        });
        this.canvas.requestRenderAll();
    }

    clearCanvas() {
        const objects = this.canvas.getObjects().filter(o => !o.isBackground);
        objects.forEach(obj => {
            this.canvas.remove(obj);
            if (obj.imageId) {
                this.updateSidebarStatus(obj.imageId, false);
            }
        });
        this.canvas.requestRenderAll();
    }

    destroy() {
        if (this.canvas) {
            this.canvas.dispose();
            this.canvas = null;
        }
    }
}