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

  // tools/importer/import-project-detail.js
  var import_project_detail_exports = {};
  __export(import_project_detail_exports, {
    default: () => import_project_detail_default
  });

  // tools/importer/parsers/project-header.js
  function parse(element, { document }) {
    const h1 = element.querySelector("h1");
    const allCols = element.querySelectorAll(':scope > div[class*="col-span"]');
    const subtitleCols = [];
    for (const col of allCols) {
      if (col.querySelector("h1")) continue;
      const text = col.textContent.trim();
      if (text) {
        subtitleCols.push(text);
      }
    }
    const container = document.createElement("div");
    if (h1) {
      const heading = document.createElement("h1");
      heading.textContent = h1.textContent.trim();
      container.appendChild(heading);
    }
    if (subtitleCols.length > 0) {
      const cells = [];
      const row = subtitleCols.map((text) => document.createTextNode(text));
      cells.push(row);
      const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
      container.appendChild(block);
    }
    element.replaceWith(container);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const columnDivs = element.querySelectorAll(':scope > div[class*="col-span-"]');
    if (columnDivs.length === 0) {
      const directDivs = element.querySelectorAll(":scope > div");
      if (directDivs.length === 0) {
        const block2 = WebImporter.Blocks.createBlock(document, { name: "Columns", cells: [] });
        element.replaceWith(block2);
        return;
      }
    }
    const columns = columnDivs.length > 0 ? columnDivs : element.querySelectorAll(":scope > div");
    const cells = [];
    const row = [];
    for (const col of columns) {
      const content = [];
      const img = col.querySelector("img");
      if (img) {
        content.push(img);
      }
      const headings = col.querySelectorAll("h1, h2, h3, h4, h5, h6");
      for (const h of headings) {
        content.push(h);
      }
      const paragraphs = col.querySelectorAll("p");
      for (const p of paragraphs) {
        if (p.textContent.trim()) {
          content.push(p);
        }
      }
      const links = col.querySelectorAll("a");
      for (const link of links) {
        if (!link.closest("p")) {
          content.push(link);
        }
      }
      if (content.length === 0 && col.textContent.trim()) {
        content.push(document.createTextNode(col.textContent.trim()));
      }
      row.push(content.length === 1 ? content[0] : content);
    }
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/next-project.js
  function parse3(element, { document }) {
    const link = element.querySelector('a[class*="next-project"], a[href*="/project/"]');
    if (!link) {
      element.remove();
      return;
    }
    const href = link.getAttribute("href");
    const labelEl = element.querySelector('[class*="next-project-label"]');
    const label = labelEl ? labelEl.textContent.trim() : "Next Project";
    const titleEl = element.querySelector("h2");
    const title = titleEl ? titleEl.textContent.trim() : "";
    const img = element.querySelector("img");
    const container = document.createElement("div");
    const labelP = document.createElement("p");
    labelP.textContent = label;
    container.appendChild(labelP);
    if (title) {
      const h2 = document.createElement("h2");
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = title;
      h2.appendChild(a);
      container.appendChild(h2);
    }
    if (img) {
      const p = document.createElement("p");
      const imgClone = img.cloneNode(true);
      p.appendChild(imgClone);
      container.appendChild(p);
    }
    element.replaceWith(container);
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

  // tools/importer/import-project-detail.js
  var parsers = {
    "project-header": parse,
    "columns": parse2,
    "next-project": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "project-detail",
    description: "Project detail page with title, subtitle/category columns, hero image, alternating text columns and gallery images, and next project navigation",
    urls: ["https://www.studiodado.com/project/grand-atrium"],
    blocks: [
      {
        name: "project-header",
        instances: [".site-grid.site-max[class*='gap-y-80']"]
      },
      {
        name: "columns",
        instances: [".site-max[class*='gap-y-20'].site-grid"]
      },
      {
        name: "next-project",
        instances: ["section.js-next-project, section[class*='300vh']"]
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
  var import_project_detail_default = {
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
  return __toCommonJS(import_project_detail_exports);
})();
