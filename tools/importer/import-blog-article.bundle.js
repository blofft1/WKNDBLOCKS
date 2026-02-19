var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-blog-article.js
  var import_blog_article_exports = {};
  __export(import_blog_article_exports, {
    default: () => import_blog_article_default
  });

  // tools/importer/parsers/blog-header.js
  function parse(element, { document }) {
    const h1 = element.querySelector("h1");
    const paragraphs = element.querySelectorAll("p");
    const container = document.createElement("div");
    for (const p of paragraphs) {
      const text = p.textContent.trim();
      if (text) {
        const newP = document.createElement("p");
        newP.textContent = text;
        container.appendChild(newP);
      }
    }
    if (h1) {
      const heading = document.createElement("h1");
      heading.textContent = h1.textContent.trim();
      container.appendChild(heading);
    }
    element.replaceWith(container);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    var _a;
    const isProjectCard = element.classList.contains("project-card");
    const isBlogCard = element.classList.contains("hover-article");
    const cells = [];
    if (isProjectCard) {
      const img = element.querySelector("img");
      const titleEl = element.querySelector('h2, h3, p[class*="text-"]');
      const categoryEl = element.querySelectorAll('p[class*="text-"]');
      const contentCell = [];
      if (titleEl) {
        const link = document.createElement("a");
        link.href = element.href || ((_a = element.querySelector("a")) == null ? void 0 : _a.href) || "#";
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        link.appendChild(strong);
        contentCell.push(link);
      }
      if (categoryEl.length > 1) {
        const catText = document.createTextNode(" " + categoryEl[categoryEl.length - 1].textContent.trim());
        contentCell.push(catText);
      }
      if (img) {
        cells.push([img, contentCell]);
      }
    } else if (isBlogCard) {
      const img = element.querySelector("img");
      const dateEl = element.querySelector('p[class*="text-14"], p[class*="opacity"]') || element.querySelector("time");
      const headlineEl = element.querySelector("h3, h2") || element.querySelector('a[class*="heading"]');
      const link = element.querySelector('a[href*="/blog/"]') || element.querySelector("a");
      const contentCell = [];
      if (dateEl) {
        const dateText = document.createTextNode(dateEl.textContent.trim() + " ");
        contentCell.push(dateText);
      }
      if (headlineEl && link) {
        const a = document.createElement("a");
        a.href = link.href;
        const strong = document.createElement("strong");
        strong.textContent = headlineEl.textContent.trim();
        a.appendChild(strong);
        contentCell.push(a);
      }
      if (img) {
        cells.push([img, contentCell]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/studiodado-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".site-header",
        "header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".site-footer",
        "footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".js-t-preloader",
        ".js-t-mask",
        ".js-t-overlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".mobile-menu",
        ".js-menu"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".dado-grid"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".dot-menu__item",
        ".progress-bar"
      ]);
      const doc = element.ownerDocument || element;
      element.querySelectorAll(".line-mask").forEach((mask) => {
        const lineDiv = mask.querySelector(".line");
        const text = lineDiv ? lineDiv.textContent : mask.textContent;
        mask.replaceWith(doc.createTextNode(text));
      });
      if (element.style.overflow === "hidden") {
        element.setAttribute("style", "overflow: scroll;");
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
    }
  }

  // tools/importer/import-blog-article.js
  var parsers = {
    "blog-header": parse,
    "cards": parse2
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "blog-article",
    description: "Blog article with header, hero image, long-form body text with H2 subheadings, inline images, blockquote, and related articles cards",
    urls: ["https://www.studiodado.com/blog/miami-design/"],
    blocks: [
      {
        name: "blog-header",
        instances: [".site-grid.site-max[class*='gap-y-80']"]
      },
      {
        name: "cards",
        instances: [".blog-grid, [class*='hover-article']"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null
            });
          });
        } catch (e) {
          console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
        }
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_blog_article_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_blog_article_exports);
})();
