# Fabric A4 Layout

## Project Overview

**Fabric A4 Layout** is a specialized, reusable JavaScript (ES6) class built on top of **Fabric.js v7.1.0**. Its primary purpose is to simulate a multi-page A4 layout editor on a single HTML5 Canvas.

**Key Features:**

* **A4 Simulation:** Renders multiple A4 pages on a single canvas (horizontally for portrait, vertically for landscape).
* **Dynamic Layout:** Supports switching between Portrait and Landscape orientations with automatic coordinate transformation for objects.
* **Image Management:** Loads images from a JSON API, supports drag-and-drop (click-to-add), and enforces optional uniqueness constraints.
* **Custom Controls:** Custom Fabric.js controls for deleting objects (top-right) and toggling grayscale (top-left).
* **Serialization:** Saves and loads layout state to/from JSON, compatible with a specified backend format.
* **Pure Frontend:** Built with Vite, Sass, and native ES6 modules. No backend server is required for the demo.

## Architecture

The project follows a standard modern frontend structure:

* **`src/js/fabric.FabricA4Layout.js`**: The core class containing all logic (layout calculation, image loading, interactions, persistence).
* **`src/scss/fabric.FabricA4Layout.scss`**: SCSS styles for the layout container and sidebar.
* **`index.html`**: The demo entry point that initializes the class and binds UI buttons.
* **`api/images.json`**: A static JSON file mocking the backend image list API.
* **`dist/`**: Production build output (Library mode).

## Setup & Commands

### Prerequisites

* Node.js (LTS recommended)
* npm

### Installation

```bash
npm install
```

### Development

Starts the Vite development server (usually at `http://localhost:5173`).

```bash
npm run dev
```

### Build

Builds the project for production, outputting to the `dist/` directory.

```bash
npm run build
```

## Key Files & Documentation

* **`API_SPEC.md`**: Detailed specification of the JSON data structures for saving layouts and fetching image lists.
* **`.doc/spec.md`**: Functional requirements and detailed feature specifications.
* **`.doc/plan.md`**: Development plan and architectural design.
* **`.doc/task.md`**: Implementation task checklist.
* **`README.md`**: General project introduction and usage examples.

## Development Guidelines

1. **Fabric.js v7**: The project strictly uses Fabric.js v7.1.0. Pay attention to breaking changes from v6, such as default origin behavior (now explicitly set to `left`/`top` in this project to match layout needs) and the use of `FabricImage` instead of `Image`.
2. **Retina Scaling**: `enableRetinaScaling` is currently set to `false` in the Canvas initialization to ensure strict 1:1 pixel mapping for layout precision on HighDPI screens.
3. **Coordinate System**:
    * **Internal**: Objects exist on a single large canvas.
    * **Persistence**: When saving (`save()`), coordinates are normalized relative to their specific page (Page 1, Page 2, etc.) as per `API_SPEC.md`.
4. **Rotation Logic**: Orientation toggling (`toggleOrientation`) uses a center-point mapping algorithm to ensure objects remain visually consistent when the "paper" rotates.
5. **Mock Data**: Image data in `api/images.json` contains Base64 strings. This file was generated from the `uploads/` directory.

## Usage Example

```javascript
import { FabricA4Layout } from './src/js/fabric.FabricA4Layout.js';

const layout = new FabricA4Layout({
    canvasId: 'c',
    orientation: 'portrait',
    apiEndpoint: './api/images.json',
    dpi: 48
});

await layout.init();
```
