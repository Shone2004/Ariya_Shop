const fs = require('fs');
const css = fs.readFileSync('../admin/src/App.css', 'utf8');

// A very simple regex to prefix all top-level selectors with #admin-root
// It splits by }, then for each block, splits by { to get the selector part.
let prefixedCss = '';
let isInsideMedia = false;

const blocks = css.split('}');
for (let i = 0; i < blocks.length; i++) {
  let block = blocks[i].trim();
  if (!block) continue;
  
  if (block.startsWith('@import')) {
    prefixedCss += block + '}\n';
    continue;
  }
  
  let parts = block.split('{');
  if (parts.length < 2) {
    // might be the end of a media query
    prefixedCss += block + '}\n';
    isInsideMedia = false;
    continue;
  }
  
  let selectorsStr = parts[0].trim();
  let rules = parts.slice(1).join('{');
  
  if (selectorsStr.startsWith('@media')) {
    prefixedCss += selectorsStr + ' {\n';
    isInsideMedia = true;
    
    // Sometimes the first rule inside media query is immediately after {
    // but in this minified CSS, they might be split normally.
    // Let's actually just use a proper CSS parser or a smarter regex.
  }
}

// Actually, writing a flawless CSS parser in 10 lines is hard for minified CSS.
// Let's just use PostCSS or lessc.
