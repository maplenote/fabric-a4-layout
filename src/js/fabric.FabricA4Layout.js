import { Canvas, Rect, FabricImage, Control, util, filters, Point } from 'fabric';
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
        if (target.imageId) {
             canvas.fire('object:custom:delete', { target });
        }
        canvas.remove(target);
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
      buttons: {}, // Map of action -> buttonId
      statusDisplayId: null,
      errorDisplayId: null,
      ...config
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
    await this.fetchImages(); // Render sidebar happens here
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
                  // Remove old listener if any (clone node trick)
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
          await this.fetchImages();
          this.showError('圖片列表已更新', true); // Show as info
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
                          this.showError(`已略過重複圖片: ${res.skipped.join(', ')}`);
                      }
                  } else {
                      this.showError('無可讀取的佈局資料');
                  }
              };
          }
      }

      // Settings is usually bound externally because it opens a modal, 
      // but we can provide a hook if needed. Here we expect index.html to handle modal logic.
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
            
            el.innerHTML = `
                <strong>設定:</strong> DPI ${this.config.dpi} | 
                <strong>頁數:</strong> ${this.pageCount} | 
                <strong>方向:</strong> ${this.orientation === 'portrait' ? '直式' : '橫式'} | 
                <strong>畫布尺寸:</strong> ${totalW} x ${totalH} px
            `;
          }
      }
  }

  async fetchImages() {
    try {
      const response = await fetch(this.config.apiEndpoint);
      if (!response.ok) throw new Error('API 讀取失敗');
      const json = await response.json();
      this.images = json.data || [];
      this.renderSidebar();
    } catch (e) {
      console.error('讀取圖片錯誤:', e);
      this.showError('讀取圖片列表失敗');
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
      div.onclick = () => this.addImageToCanvas(imgData.img_id);

      if (this.config.uniqueImages && this.isImageOnCanvas(imgData.img_id)) {
        div.classList.add('disabled');
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
    const sidebarItem = document.querySelector(`.image-item[data-id="${imgId}"]`);
    if (sidebarItem) {
      if (disabled) sidebarItem.classList.add('disabled');
      else sidebarItem.classList.remove('disabled');
    }
  }

  async addImageToCanvas(imgId) {
    if (this.config.uniqueImages && this.isImageOnCanvas(imgId)) return;

    const imgData = this.images.find(i => i.img_id === imgId);
    if (!imgData) return;

    const imgSrc = imgData.url || imgData.base64;

    const imgObj = await FabricImage.fromURL(imgSrc);
    
    imgObj.set({
      imageId: imgId,
      left: 50,
      top: 50,
      cornerSize: 10,
      transparentCorners: false,
      originX: 'left', 
      originY: 'top'
    });

    this.setupCustomControls(imgObj);

    if (imgObj.width > 200) {
      imgObj.scaleToWidth(200);
    }

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
      extraParams
    };
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
    
    for (const objData of objects) {
       // Uniqueness Check
       if (this.config.uniqueImages && seenIds.has(objData.imageId)) {
           const duplicateImg = this.images.find(i => i.img_id === objData.imageId);
           const name = duplicateImg ? (duplicateImg.title || duplicateImg.img_id) : objData.imageId;
           skippedItems.push(name);
           continue; 
       }

       const apiImg = this.images.find(i => i.img_id === objData.imageId);
       
       if (apiImg) {
         seenIds.add(objData.imageId); 

         const imgSrc = apiImg.url || apiImg.base64;
         const imgObj = await FabricImage.fromURL(imgSrc);
         imgObj.set(objData);
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

  destroy() {
      if (this.canvas) {
          this.canvas.dispose();
          this.canvas = null;
      }
  }
}