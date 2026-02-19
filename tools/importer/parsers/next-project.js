/* eslint-disable */
/* global WebImporter */

/**
 * Parser for next-project navigation section
 *
 * Source: https://www.studiodado.com/project/*
 * Output: Default content (paragraph + H2 link + image)
 *
 * Source HTML Pattern:
 * <section class="h-[300vh]">
 *   <div class="... sticky ...">
 *     <a href="/project/next-project" class="... js-next-project-link">
 *       <div>...<p>Next Project</p>...</div>
 *       <div>...<h2>Next Project Title</h2>...</div>
 *       <div>...<img src="..." />...</div>
 *     </a>
 *   </div>
 * </section>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
  const link = element.querySelector('a[class*="next-project"], a[href*="/project/"]');
  if (!link) {
    element.remove();
    return;
  }

  const href = link.getAttribute('href');

  // Extract "Next Project" label
  const labelEl = element.querySelector('[class*="next-project-label"]');
  const label = labelEl ? labelEl.textContent.trim() : 'Next Project';

  // Extract title
  const titleEl = element.querySelector('h2');
  const title = titleEl ? titleEl.textContent.trim() : '';

  // Extract image
  const img = element.querySelector('img');

  // Build default content container
  const container = document.createElement('div');

  // Label paragraph
  const labelP = document.createElement('p');
  labelP.textContent = label;
  container.appendChild(labelP);

  // H2 with link
  if (title) {
    const h2 = document.createElement('h2');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = title;
    h2.appendChild(a);
    container.appendChild(h2);
  }

  // Image
  if (img) {
    const p = document.createElement('p');
    const imgClone = img.cloneNode(true);
    p.appendChild(imgClone);
    container.appendChild(p);
  }

  element.replaceWith(container);
}
