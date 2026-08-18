import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CAPTURE_WIDTH_PX = 900;
const CAPTURE_SCALE = 1.5;
const PDF_WIDTH_MM = 210;
const PDF_HEIGHT_MM = 297;
const PDF_MARGIN_MM = 12;
const PDF_BOTTOM_PADDING_PX = 32;
const CAPTURE_BACKGROUND = '#f8fafc';

export async function downloadResumePdf(
  sourceElement: HTMLElement,
  profileName: string,
): Promise<void> {
  await waitForAssets(sourceElement);
  const embeddedImageSources = await embedImageSources(sourceElement);
  const pdfLinks: PdfLinkRegion[] = [];
  const selectableTexts: PdfSelectableTextRegion[] = [];
  const pageSections: PdfPageSectionRegion[] = [];

  const canvas = await html2canvas(sourceElement, {
    backgroundColor: CAPTURE_BACKGROUND,
    scale: CAPTURE_SCALE,
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15_000,
    windowWidth: 1_200,
    width: CAPTURE_WIDTH_PX,
    scrollX: 0,
    scrollY: -window.scrollY,
    onclone: (clonedDocument) =>
      prepareClone(
        clonedDocument,
        embeddedImageSources,
        pdfLinks,
        selectableTexts,
        pageSections,
      ),
  });

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error('Resume capture produced an empty canvas.');
  }

  const contentWidthMm = PDF_WIDTH_MM - PDF_MARGIN_MM * 2;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  });

  pdf.setProperties({
    title: `${profileName} - 이력서`,
    author: profileName,
    subject: `${profileName} 포트폴리오 이력서`,
    creator: 'studio portfolio',
  });

  addSectionPages(pdf, canvas, pageSections, pdfLinks, selectableTexts, contentWidthMm);

  pdf.save(`${sanitizeFileName(profileName)}-이력서.pdf`);
}

interface PdfLinkRegion {
  href: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PdfSelectableTextRegion {
  text: string;
  left: number;
  top: number;
  fontSizePx: number;
}

interface PdfPageSectionRegion {
  top: number;
  height: number;
}

function addSectionPages(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  sections: PdfPageSectionRegion[],
  links: PdfLinkRegion[],
  texts: PdfSelectableTextRegion[],
  contentWidthMm: number,
) {
  const contentHeightMm = PDF_HEIGHT_MM - PDF_MARGIN_MM * 2;
  const maxSliceHeightPx = Math.floor(
    (contentHeightMm / contentWidthMm) * canvas.width,
  );
  const pageSlices = createPageSlices(canvas.height, sections, maxSliceHeightPx);

  pageSlices.forEach((slice, pageIndex) => {
    if (pageIndex > 0) {
      pdf.addPage('a4', 'portrait');
    }

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = slice.height;

    const context = pageCanvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create a PDF page canvas.');
    }

    context.fillStyle = CAPTURE_BACKGROUND;
    context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    context.drawImage(
      canvas,
      0,
      slice.top,
      canvas.width,
      slice.height,
      0,
      0,
      canvas.width,
      slice.height,
    );

    const renderedHeightMm = (slice.height / canvas.width) * contentWidthMm;
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, PDF_WIDTH_MM, PDF_HEIGHT_MM, 'F');
    pdf.addImage(
      pageCanvas.toDataURL('image/jpeg', 0.96),
      'JPEG',
      PDF_MARGIN_MM,
      PDF_MARGIN_MM,
      contentWidthMm,
      renderedHeightMm,
      undefined,
      'MEDIUM',
    );
    addPdfLinks(pdf, links, canvas.width, contentWidthMm, slice.top, slice.height);
    addSelectableTextLayer(
      pdf,
      texts,
      canvas.width,
      contentWidthMm,
      slice.top,
      slice.height,
    );
  });
}

function createPageSlices(
  canvasHeight: number,
  sections: PdfPageSectionRegion[],
  maxSliceHeight: number,
): PdfPageSectionRegion[] {
  const normalizedSections = sections.length
    ? sections
    : [{ top: 0, height: canvasHeight }];
  const slices: PdfPageSectionRegion[] = [];
  let pendingSlice: PdfPageSectionRegion | null = null;

  normalizedSections.forEach((section) => {
    const sectionTop = Math.max(0, Math.min(section.top, canvasHeight));
    let remainingHeight = Math.max(
      0,
      Math.min(section.height, canvasHeight - sectionTop),
    );
    const sectionBottom = sectionTop + remainingHeight;

    if (remainingHeight === 0) {
      return;
    }

    if (pendingSlice && sectionBottom - pendingSlice.top <= maxSliceHeight) {
      pendingSlice.height = sectionBottom - pendingSlice.top;
      return;
    }

    if (pendingSlice) {
      slices.push(pendingSlice);
      pendingSlice = null;
    }

    let top = sectionTop;

    while (remainingHeight > maxSliceHeight) {
      const height = maxSliceHeight;
      slices.push({ top, height });
      top += height;
      remainingHeight -= height;
    }

    if (remainingHeight > 0) {
      pendingSlice = { top, height: remainingHeight };
    }
  });

  if (pendingSlice) {
    slices.push(pendingSlice);
  }

  return slices.length ? slices : [{ top: 0, height: canvasHeight }];
}

function addPdfLinks(
  pdf: jsPDF,
  links: PdfLinkRegion[],
  canvasWidth: number,
  contentWidthMm: number,
  pageTop: number,
  pageHeight: number,
) {
  const millimetersPerPixel = contentWidthMm / canvasWidth;
  const pageBottom = pageTop + pageHeight;

  links.forEach((link) => {
    const linkTop = Math.max(link.top, pageTop);
    const linkBottom = Math.min(link.top + link.height, pageBottom);
    if (linkBottom <= linkTop) {
      return;
    }

    pdf.link(
      PDF_MARGIN_MM + link.left * millimetersPerPixel,
      PDF_MARGIN_MM + (linkTop - pageTop) * millimetersPerPixel,
      link.width * millimetersPerPixel,
      (linkBottom - linkTop) * millimetersPerPixel,
      { url: link.href },
    );
  });
}

function addSelectableTextLayer(
  pdf: jsPDF,
  texts: PdfSelectableTextRegion[],
  canvasWidth: number,
  contentWidthMm: number,
  pageTop: number,
  pageHeight: number,
) {
  const millimetersPerPixel = contentWidthMm / canvasWidth;
  const pageBottom = pageTop + pageHeight;

  pdf.setFont('helvetica', 'normal');
  texts.forEach((text) => {
    if (text.top < pageTop || text.top >= pageBottom) {
      return;
    }

    pdf.setFontSize((text.fontSizePx * 72) / 96);
    pdf.text(
      text.text,
      PDF_MARGIN_MM + text.left * millimetersPerPixel,
      PDF_MARGIN_MM + (text.top - pageTop) * millimetersPerPixel,
      {
        baseline: 'top',
        renderingMode: 'invisible',
      },
    );
  });
}

async function prepareClone(
  clonedDocument: Document,
  embeddedImageSources: string[],
  pdfLinks: PdfLinkRegion[],
  selectableTexts: PdfSelectableTextRegion[],
  pageSections: PdfPageSectionRegion[],
) {
  inlineActiveStyles(clonedDocument);

  const captureRoot = clonedDocument.querySelector<HTMLElement>('[data-resume-capture-root]');
  if (!captureRoot) {
    throw new Error('Resume capture root was not found in the cloned document.');
  }

  captureRoot.style.width = `${CAPTURE_WIDTH_PX}px`;
  captureRoot.style.minWidth = `${CAPTURE_WIDTH_PX}px`;
  captureRoot.style.maxWidth = `${CAPTURE_WIDTH_PX}px`;
  captureRoot.style.overflow = 'visible';
  captureRoot.style.paddingBottom = `${PDF_BOTTOM_PADDING_PX}px`;

  clonedDocument.querySelectorAll<HTMLElement>('[data-pdf-hide]').forEach((element) => {
    element.style.display = 'none';
  });

  insertPdfCopyText(clonedDocument);

  clonedDocument.documentElement.style.backgroundColor = CAPTURE_BACKGROUND;
  clonedDocument.body.style.backgroundColor = CAPTURE_BACKGROUND;

  const stableStyles = clonedDocument.createElement('style');
  stableStyles.textContent = `
    *, *::before, *::after {
      animation: none !important;
      caret-color: transparent !important;
      transition: none !important;
    }

    [data-pdf-pill] {
      align-items: center !important;
      display: inline-flex !important;
      justify-content: center !important;
      line-height: 1 !important;
      text-align: center !important;
    }

    [data-pdf-pill-text] {
      top: -6px !important;
    }

    [data-pdf-pill-text][data-pdf-pill-latin] {
      top: -7px !important;
    }

    [data-pdf-copy-row] {
      align-items: center !important;
      display: inline-flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
      min-height: 28px !important;
    }

    [data-pdf-selectable-text] {
      cursor: text !important;
      user-select: text !important;
    }
  `;
  clonedDocument.head.appendChild(stableStyles);

  await applyEmbeddedImages(captureRoot, embeddedImageSources);
  collectPdfLinks(captureRoot, pdfLinks);
  collectSelectableTexts(captureRoot, selectableTexts);
  collectPdfPageSections(captureRoot, pageSections);
}

function collectPdfPageSections(
  captureRoot: HTMLElement,
  pageSections: PdfPageSectionRegion[],
) {
  const rootBounds = captureRoot.getBoundingClientRect();
  captureRoot
    .querySelectorAll<HTMLElement>(':scope > [data-pdf-page-section]')
    .forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.height <= 0) {
        return;
      }

      pageSections.push({
        top: Math.round((bounds.top - rootBounds.top) * CAPTURE_SCALE),
        height: Math.ceil(bounds.height * CAPTURE_SCALE),
      });
    });
}

function insertPdfCopyText(clonedDocument: Document) {
  clonedDocument.querySelectorAll<HTMLElement>('[data-pdf-copy-text]').forEach((button) => {
    const text = button.getAttribute('data-pdf-copy-text')?.trim();
    const container = button.parentElement;
    if (!text || !container) {
      return;
    }

    container.setAttribute('data-pdf-copy-row', '');

    const textPill = clonedDocument.createElement('span');
    textPill.className = button.className;
    textPill.style.paddingInline = '20px';
    textPill.setAttribute('data-pdf-pill', '');

    button.remove();

    const selectableText = clonedDocument.createElement('span');
    selectableText.setAttribute('data-pdf-selectable-text', text);
    selectableText.setAttribute('data-pdf-pill-text', '');
    selectableText.setAttribute('data-pdf-pill-latin', '');
    selectableText.className = 'relative -top-px';
    selectableText.textContent = text;
    textPill.appendChild(selectableText);
    container.appendChild(textPill);
  });
}

function collectSelectableTexts(
  captureRoot: HTMLElement,
  selectableTexts: PdfSelectableTextRegion[],
) {
  const rootBounds = captureRoot.getBoundingClientRect();
  const clonedWindow = captureRoot.ownerDocument.defaultView;

  captureRoot.querySelectorAll<HTMLElement>('[data-pdf-selectable-text]').forEach((element) => {
    const text = element.getAttribute('data-pdf-selectable-text')?.trim();
    const bounds = element.getBoundingClientRect();
    if (!text || bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    const fontSizePx = Number.parseFloat(clonedWindow?.getComputedStyle(element).fontSize ?? '12');
    selectableTexts.push({
      text,
      left: (bounds.left - rootBounds.left) * CAPTURE_SCALE,
      top: (bounds.top - rootBounds.top) * CAPTURE_SCALE,
      fontSizePx,
    });
  });
}

function collectPdfLinks(captureRoot: HTMLElement, pdfLinks: PdfLinkRegion[]) {
  const rootBounds = captureRoot.getBoundingClientRect();
  const interactiveElements = captureRoot.querySelectorAll<HTMLElement>(
    'a[href], [data-pdf-href]',
  );

  interactiveElements.forEach((element) => {
    const rawHref = element.getAttribute('data-pdf-href') ?? element.getAttribute('href');
    const href = resolvePdfHref(rawHref);
    if (!href) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    pdfLinks.push({
      href,
      left: Math.round((bounds.left - rootBounds.left) * CAPTURE_SCALE),
      top: Math.round((bounds.top - rootBounds.top) * CAPTURE_SCALE),
      width: Math.round(bounds.width * CAPTURE_SCALE),
      height: Math.round(bounds.height * CAPTURE_SCALE),
    });
  });
}

function resolvePdfHref(rawHref: string | null): string | null {
  if (!rawHref || rawHref.startsWith('javascript:')) {
    return null;
  }

  if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    return rawHref;
  }

  try {
    return new URL(rawHref, window.location.href).href;
  } catch {
    return null;
  }
}

async function embedImageSources(sourceElement: HTMLElement): Promise<string[]> {
  const images = Array.from(sourceElement.querySelectorAll('img'));

  return Promise.all(
    images.map(async (image) => {
      const source = image.currentSrc || image.src;
      if (!source) {
        throw new Error('A resume image does not have a source URL.');
      }

      if (source.startsWith('data:')) {
        return source;
      }

      const response = await fetch(source, {
        cache: 'force-cache',
        credentials: 'omit',
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error(`Could not load a resume image (${response.status}).`);
      }

      return blobToDataUrl(await response.blob());
    }),
  );
}

async function applyEmbeddedImages(captureRoot: HTMLElement, sources: string[]) {
  const clonedImages = Array.from(captureRoot.querySelectorAll('img'));
  if (clonedImages.length !== sources.length) {
    throw new Error('Resume images changed while preparing the PDF.');
  }

  await Promise.all(
    clonedImages.map(async (image, index) => {
      image.removeAttribute('crossorigin');
      image.removeAttribute('loading');
      image.removeAttribute('srcset');
      image.src = sources[index];

      if ('decode' in image) {
        await image.decode();
      }
    }),
  );
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result)), { once: true });
    reader.addEventListener('error', () => reject(reader.error), { once: true });
    reader.readAsDataURL(blob);
  });
}

function inlineActiveStyles(clonedDocument: Document) {
  const styleText = Array.from(document.styleSheets)
    .flatMap((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules, (rule) => rule.cssText);
      } catch {
        return [];
      }
    })
    .join('\n');

  if (!styleText) {
    return;
  }

  const inlineStyles = clonedDocument.createElement('style');
  inlineStyles.setAttribute('data-pdf-inline-styles', 'true');
  inlineStyles.textContent = styleText;
  clonedDocument.head.appendChild(inlineStyles);
}

async function waitForAssets(sourceElement: HTMLElement): Promise<void> {
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const images = Array.from(sourceElement.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          const finish = () => resolve();
          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
          window.setTimeout(finish, 15_000);
        }),
    ),
  );
}

function sanitizeFileName(profileName: string): string {
  return (profileName.trim() || '이력서').replace(/[\\/:*?"<>|]/g, '-');
}
