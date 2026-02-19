/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.studiodado.com/
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading)
 *
 * Source HTML Pattern:
 * <div class="hero-section bg-white overflow-hidden relative ...">
 *   <div class="hero-visual ...">
 *     <img ... />  (or video poster)
 *   </div>
 *   <div class="hero-content ...">
 *     <h1 class="...">Form Follows Feeling</h1>
 *     <p>Interior design for hospitality</p>
 *     <p>We create innovative...</p>
 *     <a href="/approach">Approach</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  // Extract hero background image
  // VALIDATED: Captured DOM has img elements within hero-section
  const bgImage = element.querySelector('img[class*="object-cover"], img[class*="hero"], picture img') ||
                  element.querySelector('img');

  // Extract heading
  // VALIDATED: Captured DOM has h1 within hero-section
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('[class*="title"]');

  // Build cells matching hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Heading content
  if (heading) {
    cells.push([heading]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
