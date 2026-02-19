/* eslint-disable */
/* global WebImporter */

/**
 * Parser for project detail header section
 *
 * Source: https://www.studiodado.com/project/*
 * Base Block: columns (for subtitle/category row)
 *
 * Source HTML Pattern:
 * <div class="site-grid site-max gap-y-80 ...">
 *   <div class="col-span-12 ..."><h1>Project Title</h1></div>
 *   <div class="col-span-12 s:col-span-6"><p>...subtitle...</p></div>
 *   <div class="col-span-12 s:col-span-6 s:text-right"><p>...category...</p></div>
 * </div>
 *
 * Output: H1 heading + Columns block with subtitle | category
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  // Extract H1 title
  const h1 = element.querySelector('h1');

  // Get column divs that are NOT the H1 container
  const allCols = element.querySelectorAll(':scope > div[class*="col-span"]');
  const subtitleCols = [];

  for (const col of allCols) {
    // Skip the column that contains H1
    if (col.querySelector('h1')) continue;

    const text = col.textContent.trim();
    if (text) {
      subtitleCols.push(text);
    }
  }

  // Build container with H1 + Columns block
  const container = document.createElement('div');

  // Add H1
  if (h1) {
    const heading = document.createElement('h1');
    heading.textContent = h1.textContent.trim();
    container.appendChild(heading);
  }

  // Add Columns block for subtitle/category
  if (subtitleCols.length > 0) {
    const cells = [];
    const row = subtitleCols.map((text) => document.createTextNode(text));
    cells.push(row);

    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    container.appendChild(block);
  }

  element.replaceWith(container);
}
