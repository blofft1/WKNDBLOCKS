/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Studio Dado website cleanup
 * Purpose: Remove non-content elements, navigation, footer, and site widgets
 * Applies to: www.studiodado.com (all templates)
 * Generated: 2026-02-19
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of https://www.studiodado.com/
 * - Cleaned HTML analysis from migration-work/cleaned.html
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation elements
    WebImporter.DOMUtils.remove(element, [
      '.site-header',
      'header',
    ]);

    // Remove footer elements
    WebImporter.DOMUtils.remove(element, [
      '.site-footer',
      'footer',
    ]);

    // Remove preloader, mask, and overlay elements
    WebImporter.DOMUtils.remove(element, [
      '.js-t-preloader',
      '.js-t-mask',
      '.js-t-overlay',
    ]);

    // Remove mobile menu
    WebImporter.DOMUtils.remove(element, [
      '.mobile-menu',
      '.js-menu',
    ]);

    // Remove grid overlay debug element
    WebImporter.DOMUtils.remove(element, [
      '.dado-grid',
    ]);

    // Remove decorative elements
    WebImporter.DOMUtils.remove(element, [
      '.dot-menu__item',
      '.progress-bar',
    ]);

    // Unwrap .line-mask and .line wrappers (preserve inner text)
    const doc = element.ownerDocument || element;
    element.querySelectorAll('.line-mask').forEach((mask) => {
      const lineDiv = mask.querySelector('.line');
      const text = lineDiv ? lineDiv.textContent : mask.textContent;
      mask.replaceWith(doc.createTextNode(text));
    });

    // Re-enable scrolling if body has overflow hidden
    // EXTRACTED: Captured DOM showed potential overflow:hidden on body
    if (element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);
  }
}
