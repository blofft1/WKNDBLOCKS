/* eslint-disable */
/* global WebImporter */

/**
 * Parser for blog article header section
 *
 * Source: https://www.studiodado.com/blog/*
 * Output: Default content (label paragraph, date paragraph, H1 heading)
 *
 * Source HTML Pattern:
 * <div class="site-grid site-max gap-y-80 ...">
 *   <div class="col-span-...">
 *     <p>Blog article</p>
 *     <p>Oct 21, 2025</p>
 *   </div>
 *   <div class="col-span-...">
 *     <h1>Article Title</h1>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  const h1 = element.querySelector('h1');
  const paragraphs = element.querySelectorAll('p');

  const container = document.createElement('div');

  // Extract label and date paragraphs
  for (const p of paragraphs) {
    const text = p.textContent.trim();
    if (text) {
      const newP = document.createElement('p');
      newP.textContent = text;
      container.appendChild(newP);
    }
  }

  // Add H1
  if (h1) {
    const heading = document.createElement('h1');
    heading.textContent = h1.textContent.trim();
    container.appendChild(heading);
  }

  element.replaceWith(container);
}
