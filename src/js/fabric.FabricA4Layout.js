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
    ctx.arc(0, 0, hitSize/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#F44336';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(-size/4, -size/4);
    ctx.lineTo(size/4, size/4);
    ctx.moveTo(size/4, -size/4);
    ctx.lineTo(-size/4, size/4);
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
    ctx.arc(0, 0, hitSize/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size/2, -Math.PI/2, Math.PI/2, false);
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
    ctx.arc(0, 0, hitSize/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size/4, 0, Math.PI * 1.5, false);
    ctx.stroke();
    
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.moveTo(size/4, -size/8);
    ctx.lineTo(size/4 + 4, 0);
    ctx.lineTo(size/4 - 4, 0);
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
    this.gap = 4; // px

    this.canvasId = this.config.canvasId;
    this.canvas = null;
    this.images = []; 
    this.pageCount = 1;

    this.orientation = this.config.orientation;
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
      this.images = json.data || [];
      this.renderSidebar();
    } catch (e) {
      console.error(this.t.error.readError, e);
      this.showError(this.t.error.fetchFailed);
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
      originX: 'left', 
      originY: 'top'
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

    // Check against A4 page limits (Fit & Scale if too big)
    // Now getScaledWidth/Height reflects the "Original Physical Size" at current DPI
    if (imgObj.getScaledWidth() > pageVisualW || imgObj.getScaledHeight() > pageVisualH) {
      // Scale to fit then reduce to 95% to avoid bleeding edges
      const fitScale = Math.min(pageVisualW / imgObj.getScaledWidth(), pageVisualH / imgObj.getScaledHeight()) * 0.95;
      
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

    // Define a safe top margin (2.5% of height, matching the 95% scale centering logic)
    const topMargin = pageVisualH * 0.025;

    if (pageObjects.length > 0) {
        // Find the bottom-most point of existing objects
        let maxBottom = 0;
        pageObjects.forEach(o => {
            // Calculate relative bottom
            let objBottomRel = 0;
            if (isPortrait) {
                objBottomRel = o.top + o.getScaledHeight();
            } else {
                // In landscape, global Top includes page offsets
                const pageOffset = targetPage * (pageVisualH + this.gap);
                objBottomRel = (o.top - pageOffset) + o.getScaledHeight();
            }
            if (objBottomRel > maxBottom) maxBottom = objBottomRel;
        });
        startY = maxBottom + this.gap;
    } else {
        startY = topMargin;
    }

    // 3. Check Vertical Overflow
    if (startY + imgObj.getScaledHeight() > pageVisualH) {
        // Doesn't fit on current page -> New Page
        this.addPage();
        targetPage++;
        startY = topMargin; // Reset to top for new page
    }

    // 4. Calculate Global Coordinates
    let globalLeft, globalTop;

    if (isPortrait) {
        const pageOffset = targetPage * (pageVisualW + this.gap);
        // Center horizontally
        globalLeft = pageOffset + (pageVisualW - imgObj.getScaledWidth()) / 2;
        globalTop = startY;
    } else {
        const pageOffset = targetPage * (pageVisualH + this.gap);
        // Center horizontally (visual width)
        globalLeft = (pageVisualW - imgObj.getScaledWidth()) / 2;
        globalTop = pageOffset + startY;
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
    const json = this.canvas.toObject(['imageId', 'id']); 
    
    json.objects = json.objects.filter(o => !o.isBackground);

    if (!this.config.saveWithBase64) {
      json.objects.forEach(o => {
        if (o.type === 'image') {
           delete o.src; 
        }
      });
    }

    return {
      version: '1.0',
      timestamp: Date.now(),
      orientation: this.orientation,
      pageCount: this.pageCount,
      dpi: this.config.dpi,
      canvasObjects: json.objects,
      data: { ...this.config.data, ...extraParams }
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

          return await response.json();
      } catch (error) {
          console.error('Save failed:', error);
          throw error;
      }
  }

  async load(data) {
    if (!data) return { success: false, message: 'No data' };

    this.canvas.clear();
    
    this.orientation = data.orientation || 'portrait';
    this.pageCount = data.pageCount || 1;
    this.setupLayout(); 

    const objects = data.canvasObjects || [];
    const seenIds = new Set();
    const skippedItems = [];

    const loadedDpi = data.dpi || this.config.dpi;
    const scaleFactor = this.config.dpi / loadedDpi;
    
    for (const objData of objects) {
       if (this.config.uniqueImages && seenIds.has(objData.imageId)) {
           const duplicateImg = this.images.find(i => i.img_id === objData.imageId);
           const name = duplicateImg ? (duplicateImg.title || duplicateImg.img_id) : objData.imageId;
           skippedItems.push(name);
           continue; 
       }

       const apiImg = this.images.find(i => i.img_id === objData.imageId);
       
       if (apiImg) {
         seenIds.add(objData.imageId); 

         const scaledData = { ...objData };
         if (Math.abs(scaleFactor - 1) > 0.0001) {
             scaledData.left *= scaleFactor;
             scaledData.top *= scaleFactor;
             scaledData.scaleX = (scaledData.scaleX || 1) * scaleFactor;
             scaledData.scaleY = (scaledData.scaleY || 1) * scaleFactor;
         }

         const imgSrc = apiImg.url || apiImg.base64;
         const imgObj = await FabricImage.fromURL(imgSrc);
         imgObj.set(scaledData);
         imgObj.set({ src: imgSrc }); 
         
         if (objData.filters && objData.filters.length > 0) {
            imgObj.applyFilters();
         }

         this.setupCustomControls(imgObj);

         this.canvas.add(imgObj);
         this.updateSidebarStatus(objData.imageId, true);
       } else {
         console.warn(`Image ID ${objData.imageId} not found in API. Skipping.`);
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

          objects.forEach(obj => {
              const center = obj.getCenterPoint();
              
              if (center.x >= pageLeft && center.x <= pageLeft + pageWidth &&
                  center.y >= pageTop && center.y <= pageTop + pageHeight) {
                  objectsToRemove.push(obj);
              }
          });

          objectsToRemove.forEach(obj => {
              if (obj.imageId) {
                  this.updateSidebarStatus(obj.imageId, false); 
              }
              this.canvas.remove(obj);
          });

          this.pageCount--;
          this.setupLayout();
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