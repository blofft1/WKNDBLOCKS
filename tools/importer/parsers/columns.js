/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.studiodado.com/
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Row N: [column1 | column2 | column3...]
 *
 * Handles column patterns from Studio Dado:
 * 1. Intro section: 3 columns (label | body text | CTA)
 * 2. About section: 2 columns (image | text + CTA)
 *
 * Source HTML Pattern (intro):
 * <div class="site-grid ...">
 *   <div class="col-span-...">label text</div>
 *   <div class="col-span-..."><p>body text</p></div>
 *   <div class="col-span-..."><a href="...">CTA</a></div>
 * </div>
 *
 * Source HTML Pattern (about):
 * <div class="site-grid ...">
 *   <div class="col-span-..."><img .../></div>
 *   <div class="col-span-..."><p>text</p><a href="...">CTA</a></div>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  // Get direct child column elements
  // VALIDATED: Captured DOM uses div[class*="col-span-"] for grid columns
  const columnDivs = element.querySelectorAll(':scope > div[class*="col-span-"]');

  if (columnDivs.length === 0) {
    // Fallback: try direct child divs
    const directDivs = element.querySelectorAll(':scope > div');
    if (directDivs.length === 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells: [] });
      element.replaceWith(block);
      return;
    }
  }

  const columns = columnDivs.length > 0 ? columnDivs : element.querySelectorAll(':scope > div');

  // Build cells - each row has columns matching the grid structure
  const cells = [];
  const row = [];

  for (const col of columns) {
    // Collect all content from this column
    const content = [];

    // Check for images
    const img = col.querySelector('img');
    if (img) {
      content.push(img);
    }

    // Check for headings
    const headings = col.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const h of headings) {
      content.push(h);
    }

    // Check for paragraphs
    const paragraphs = col.querySelectorAll('p');
    for (const p of paragraphs) {
      if (p.textContent.trim()) {
        content.push(p);
      }
    }

    // Check for links (CTAs)
    const links = col.querySelectorAll('a');
    for (const link of links) {
      // Avoid duplicating links already inside paragraphs
      if (!link.closest('p')) {
        content.push(link);
      }
    }

    // If no structured content found, use text content
    if (content.length === 0 && col.textContent.trim()) {
      content.push(document.createTextNode(col.textContent.trim()));
    }

    row.push(content.length === 1 ? content[0] : content);
  }

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
