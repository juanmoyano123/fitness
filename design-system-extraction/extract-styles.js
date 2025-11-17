const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractDesignSystemExtended(url) {
  console.log('🚀 Iniciando extracción exhaustiva...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('📄 Cargando página:', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];
  
  const allData = {};
  
  // EXTRAER EN CADA VIEWPORT
  for (const viewport of viewports) {
    console.log(`📱 Analizando ${viewport.name} (${viewport.width}px)...`);
    
    const data = await page.evaluate(() => {
      // HELPERS
      const rgbToHex = (rgb) => {
        if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return null;
        const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return rgb;
        const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
        return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
      };
      
      const countOccurrences = (arr) => {
        return arr.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});
      };
      
      // 1. COLORS WITH FREQUENCY
      const colorData = {
        backgrounds: [],
        texts: [],
        borders: [],
        fills: []
      };
      
      document.querySelectorAll('*').forEach(el => {
        const styles = getComputedStyle(el);
        
        const bg = rgbToHex(styles.backgroundColor);
        if (bg) colorData.backgrounds.push(bg);
        
        const color = rgbToHex(styles.color);
        if (color) colorData.texts.push(color);
        
        const border = rgbToHex(styles.borderColor);
        if (border) colorData.borders.push(border);
      });
      
      // 2. TYPOGRAPHY - MÁS EXHAUSTIVO
      const typographyElements = [];
      const typographyTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'label'];
      
      typographyTags.forEach(tag => {
        document.querySelectorAll(tag).forEach(el => {
          const styles = getComputedStyle(el);
          typographyElements.push({
            tag: tag,
            fontFamily: styles.fontFamily.replace(/['"]/g, ''),
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            textTransform: styles.textTransform,
            color: rgbToHex(styles.color)
          });
        });
      });
      
      // 3. SPACING - TODO
      const spacingData = {
        paddings: [],
        margins: [],
        gaps: []
      };
      
      document.querySelectorAll('*').forEach(el => {
        const styles = getComputedStyle(el);
        
        ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(prop => {
          const val = styles[prop];
          if (val && val !== '0px') spacingData.paddings.push(val);
        });
        
        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(prop => {
          const val = styles[prop];
          if (val && val !== '0px' && val !== 'auto') spacingData.margins.push(val);
        });
        
        if (styles.gap && styles.gap !== 'normal' && styles.gap !== '0px') {
          spacingData.gaps.push(styles.gap);
        }
      });
      
      // 4. BORDERS
      const borderData = {
        radius: [],
        widths: [],
        styles: []
      };
      
      document.querySelectorAll('*').forEach(el => {
        const styles = getComputedStyle(el);
        
        if (styles.borderRadius && styles.borderRadius !== '0px') {
          borderData.radius.push(styles.borderRadius);
        }
        if (styles.borderWidth && styles.borderWidth !== '0px') {
          borderData.widths.push(styles.borderWidth);
        }
        if (styles.borderStyle && styles.borderStyle !== 'none') {
          borderData.styles.push(styles.borderStyle);
        }
      });
      
      // 5. SHADOWS
      const shadows = [];
      document.querySelectorAll('*').forEach(el => {
        const shadow = getComputedStyle(el).boxShadow;
        if (shadow && shadow !== 'none') {
          shadows.push(shadow);
        }
      });
      
      // 6. ANIMATIONS & TRANSITIONS
      const animations = {
        transitions: [],
        durations: [],
        timings: []
      };
      
      document.querySelectorAll('*').forEach(el => {
        const styles = getComputedStyle(el);
        
        if (styles.transition && styles.transition !== 'all 0s ease 0s') {
          animations.transitions.push(styles.transition);
        }
        if (styles.transitionDuration && styles.transitionDuration !== '0s') {
          animations.durations.push(styles.transitionDuration);
        }
        if (styles.transitionTimingFunction && styles.transitionTimingFunction !== 'ease') {
          animations.timings.push(styles.transitionTimingFunction);
        }
      });
      
      // 7. LAYOUT PATTERNS
      const layouts = [];
      document.querySelectorAll('*').forEach(el => {
        const styles = getComputedStyle(el);
        
        if (styles.display === 'flex') {
          layouts.push({
            type: 'flex',
            direction: styles.flexDirection,
            justify: styles.justifyContent,
            align: styles.alignItems,
            gap: styles.gap,
            wrap: styles.flexWrap
          });
        }
        
        if (styles.display === 'grid') {
          layouts.push({
            type: 'grid',
            columns: styles.gridTemplateColumns,
            rows: styles.gridTemplateRows,
            gap: styles.gap
          });
        }
      });
      
      // 8. Z-INDEX LAYERS
      const zIndexes = [];
      document.querySelectorAll('*').forEach(el => {
        const z = getComputedStyle(el).zIndex;
        if (z && z !== 'auto') {
          zIndexes.push(parseInt(z));
        }
      });
      
      // 9. COMPONENT DETECTION (por clases comunes)
      const detectComponent = (patterns) => {
        const results = [];
        patterns.forEach(pattern => {
          document.querySelectorAll(`[class*="${pattern}"]`).forEach(el => {
            const styles = getComputedStyle(el);
            results.push({
              pattern: pattern,
              className: el.className,
              styles: {
                display: styles.display,
                padding: styles.padding,
                margin: styles.margin,
                background: rgbToHex(styles.backgroundColor),
                color: rgbToHex(styles.color),
                border: styles.border,
                borderRadius: styles.borderRadius,
                boxShadow: styles.boxShadow,
                fontSize: styles.fontSize,
                fontWeight: styles.fontWeight
              }
            });
          });
        });
        return results;
      };
      
      const componentPatterns = ['button', 'btn', 'card', 'modal', 'nav', 'header', 'footer', 'hero', 'container'];
      const detectedComponents = detectComponent(componentPatterns);
      
      // 10. MAX-WIDTHS (containers)
      const maxWidths = [];
      document.querySelectorAll('*').forEach(el => {
        const mw = getComputedStyle(el).maxWidth;
        if (mw && mw !== 'none') {
          maxWidths.push(mw);
        }
      });
      
      return {
        colors: {
          backgrounds: countOccurrences(colorData.backgrounds),
          texts: countOccurrences(colorData.texts),
          borders: countOccurrences(colorData.borders)
        },
        typography: typographyElements,
        spacing: spacingData,
        borders: borderData,
        shadows: shadows,
        animations: animations,
        layouts: layouts,
        zIndexes: Array.from(new Set(zIndexes)).sort((a, b) => a - b),
        components: detectedComponents,
        maxWidths: Array.from(new Set(maxWidths))
      };
    });
    
    allData[viewport.name] = data;
  }
  
  await browser.close();
  
  console.log('\n✅ Extracción completa!\n');
  
  return allData;
}

// PROCESADO Y GUARDADO
const url = process.argv[2] || 'https://gold-mission-724934.framer.app/';

extractDesignSystemExtended(url)
  .then(system => {
    // Guardar JSON completo
    fs.writeFileSync('design-system-full.json', JSON.stringify(system, null, 2));
    console.log('📁 JSON completo: design-system-full.json');
    
    // Crear resumen legible
    const summary = {
      colorsUnique: {
        backgrounds: Object.keys(system.desktop.colors.backgrounds).length,
        texts: Object.keys(system.desktop.colors.texts).length
      },
      typography: {
        totalElements: system.desktop.typography.length,
        uniqueFontSizes: [...new Set(system.desktop.typography.map(t => t.fontSize))].length
      },
      spacing: {
        uniquePaddings: [...new Set(system.desktop.spacing.paddings)].length,
        uniqueMargins: [...new Set(system.desktop.spacing.margins)].length
      },
      components: {
        detected: system.desktop.components.length
      },
      layouts: {
        flex: system.desktop.layouts.filter(l => l.type === 'flex').length,
        grid: system.desktop.layouts.filter(l => l.type === 'grid').length
      },
      zIndexLayers: system.desktop.zIndexes.length
    };
    
    fs.writeFileSync('design-system-summary.json', JSON.stringify(summary, null, 2));
    console.log('📁 Resumen: design-system-summary.json\n');
    
    console.log('📊 RESUMEN RÁPIDO:');
    console.log('-------------------');
    console.log('✓ Colores únicos (backgrounds):', summary.colorsUnique.backgrounds);
    console.log('✓ Colores únicos (texts):', summary.colorsUnique.texts);
    console.log('✓ Font sizes diferentes:', summary.typography.uniqueFontSizes);
    console.log('✓ Spacing patterns (paddings):', summary.spacing.uniquePaddings);
    console.log('✓ Componentes detectados:', summary.components.detected);
    console.log('✓ Flex layouts:', summary.layouts.flex);
    console.log('✓ Grid layouts:', summary.layouts.grid);
    console.log('✓ Z-index layers:', summary.zIndexLayers);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });