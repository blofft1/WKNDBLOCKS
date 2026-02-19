/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.studiodado.com/
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row N: [image | title + description/category]
 *
 * Handles two card patterns from Studio Dado:
 * 1. Project cards: .project-card with image, title, and category
 * 2. Blog cards: .hover-article with image, date, and headline link
 *
 * Source HTML Patterns:
 *
 * Project card:
 * <a class="project-card group" href="/project/grand-atrium">
 *   <img src="..." alt="..." />
 *   <p class="...">Grand Atrium</p>
 *   <p class="...">Public Spaces</p>
 * </a>
 *
 * Blog card:
 * <div class="hover-article post ...">
 *   <a href="/blog/...">
 *     <img src="..." />
 *     <p>Nov 12, 2025</p>
 *     <h3>Article Title</h3>
 *   </a>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  // Determine which card type we're parsing
  const isProjectCard = element.classList.contains('project-card');
  const isBlogCard = element.classList.contains('hover-article');

  const cells = [];

  if (isProjectCard) {
    // Project card pattern
    // VALIDATED: .project-card has img, title text, and category text
    const img = element.querySelector('img');

    // Extract title - typically in a paragraph or heading
    // VALIDATED: Captured DOM shows title in p elements within project-card
    const titleEl = element.querySelector('h2, h3, p[class*="text-"]');
    const categoryEl = element.querySelectorAll('p[class*="text-"]');

    // Build text content cell
    const contentCell = [];
    if (titleEl) {
      const link = document.createElement('a');
      link.href = element.href || element.querySelector('a')?.href || '#';
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      link.appendChild(strong);
      contentCell.push(link);
    }

    // Add category text if different from title
    if (categoryEl.length > 1) {
      const catText = document.createTextNode(' ' + categoryEl[categoryEl.length - 1].textContent.trim());
      contentCell.push(catText);
    }

    if (img) {
      cells.push([img, contentCell]);
    }
  } else if (isBlogCard) {
    // Blog card pattern
    // VALIDATED: .hover-article has img, date, and headline link
    const img = element.querySelector('img');

    // Extract date
    // VALIDATED: Captured DOM has date in a paragraph element
    const dateEl = element.querySelector('p[class*="text-14"], p[class*="opacity"]') ||
                   element.querySelector('time');

    // Extract headline
    // VALIDATED: Captured DOM has headline in h3 or linked text
    const headlineEl = element.querySelector('h3, h2') ||
                       element.querySelector('a[class*="heading"]');

    const link = element.querySelector('a[href*="/blog/"]') ||
                 element.querySelector('a');

    const contentCell = [];
    if (dateEl) {
      const dateText = document.createTextNode(dateEl.textContent.trim() + ' ');
      contentCell.push(dateText);
    }
    if (headlineEl && link) {
      const a = document.createElement('a');
      a.href = link.href;
      const strong = document.createElement('strong');
      strong.textContent = headlineEl.textContent.trim();
      a.appendChild(strong);
      contentCell.push(a);
    }

    if (img) {
      cells.push([img, contentCell]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
