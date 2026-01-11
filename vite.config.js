import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/js/fabric.FabricA4Layout.js'),
      name: 'FabricA4Layout',
      fileName: (format) => `fabric.FabricA4Layout.${format === 'es' ? 'js' : 'min.js'}` // simplified naming
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['fabric'], // Don't bundle Fabric.js if we want it strictly peer, but for a standalone tool including it is often safer unless specified otherwise. 
                            // Prompt said "No external CSS frameworks" and "Environment: Core lib Fabric.js".
                            // Usually "Reusable Class" implies peer dependency or bundle. 
                            // If I exclude 'fabric', the user must include it globally.
                            // Given "fabric@7.1.0" is installed, bundling it makes it easiest to use unless size is critical.
                            // However, strictly speaking for a plugin, we usually externalize.
                            // BUT, since the demo `index.html` imports it, and we want a working demo.
                            // I will NOT externalize it for now to ensure the demo works out of the box with the build, 
                            // OR I will externalize it and ensure the demo imports fabric from node_modules or CDN.
                            // Let's bundle it to be safe and self-contained as requested "Generate code... to dist".
      output: {
        // Global variable name for UMD/IIFE build
        globals: {
          fabric: 'fabric'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/fabric.FabricA4Layout.min.css';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  }
});