import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { renderMermaid } from "./mermaid-render";
import { renderLatexInElement } from "./latex-render";
import { appendReferencesSection } from "./references";
import inlineTheme from "./inline-theme";
import { TITLE } from "@/constants/config";

type ExportPngOptions = {
  desiredWidth?: number;
  fileNamePrefix?: string;
  backgroundColor?: string;
};

function getArticleTitle(
  container: HTMLElement,
  fallbackTitle: string,
): string {
  const h1Element = container.querySelector("h1");
  const h1Text = h1Element?.textContent?.trim();
  const prefix = h1Text || fallbackTitle;
  return prefix.replace(/[<>:"/\\|?*]/g, "-").replace(/\s+/g, "-");
}

function buildExportFileName(
  container: HTMLElement,
  fallbackTitle: string,
  extension: string,
): string {
  const cleanPrefix = getArticleTitle(container, fallbackTitle);
  const timestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-");
  const normalizedExt = extension.startsWith(".")
    ? extension.slice(1)
    : extension;
  return `${cleanPrefix}-${timestamp}.${normalizedExt}`;
}

async function renderDynamicContent(container: HTMLElement): Promise<void> {
  renderLatexInElement(container);
  await renderMermaid(container);
}

function buildStyledHTMLFrom(container: HTMLElement, twTheme: string): string {
  const articleHTML = container.innerHTML;
  const withReferences = appendReferencesSection(articleHTML) as string;
  return inlineTheme(withReferences, twTheme);
}

export async function copyPreviewToClipboard(
  container: HTMLElement,
  twTheme: string,
): Promise<void> {
  await renderDynamicContent(container);
  const styledContent = buildStyledHTMLFrom(container, twTheme);

  await navigator.clipboard.write([
    new window.ClipboardItem({
      "text/html": new Blob([styledContent], { type: "text/html" }),
      "text/plain": new Blob([container.textContent || ""], {
        type: "text/plain",
      }),
    }),
  ]);
}

export async function exportPreviewToPng(
  container: HTMLElement,
  options: ExportPngOptions = {},
): Promise<void> {
  await renderDynamicContent(container);

  const article = container.querySelector("article") as HTMLElement | null;
  const target = article ?? container;

  const desiredWidth = options.desiredWidth ?? 960;
  const backgroundColor =
    options.backgroundColor ??
    (getComputedStyle(document.documentElement).getPropertyValue(
      "--background",
    ) ||
      "#ffffff");

  const dataUrl = await toPng(target, {
    width: desiredWidth,
    style: {
      width: `${desiredWidth}px`,
      background: "#ffffff",
      boxSizing: "border-box",
      display: "block",
      position: "static",
    },
    backgroundColor,
  });

  download(buildExportFileName(
    container,
    options.fileNamePrefix || TITLE,
    "png"
  ), dataUrl);
}

type ExportPdfOptions = {
  fileNamePrefix?: string;
  format?: string;
  unit?: string;
  margin?: number;
  scale?: number;
  backgroundColor?: string;
  desiredWidth?: number;
};

export async function exportPreviewToPdf(
  container: HTMLElement,
  options: ExportPdfOptions = {},
): Promise<void> {
  await renderDynamicContent(container);

  const article = container.querySelector("article") as HTMLElement | null;
  const target = article ?? container;

  const desiredWidth = options.desiredWidth ?? 960;
  const backgroundColor =
    options.backgroundColor ??
    (getComputedStyle(document.documentElement).getPropertyValue(
      "--background",
    ) || "#ffffff");

  try {
    const dataUrl = await toPng(target, {
      width: desiredWidth,
      backgroundColor,
      style: {
        width: `${desiredWidth}px`,
        boxSizing: "border-box",
        display: "block",
        position: "static",
      },
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = (e) => reject(e);
      i.src = dataUrl;
    });
    const imgData = dataUrl;

    const unit = (options.unit ?? "px") as any;
    const format = options.format ?? "a4";
    const pdf = new jsPDF({ unit, format } as any);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = { width: img.naturalWidth || desiredWidth, height: img.naturalHeight || (desiredWidth * 1.3) };
    const imgWidthOnPdf = pdfWidth - (options.margin ?? 0) * 2;
    const imgHeightOnPdf = (imgProps.height * imgWidthOnPdf) / imgProps.width;

    const totalPages = Math.ceil(imgHeightOnPdf / (pdfHeight - (options.margin ?? 0) * 2));

    for (let page = 0; page < totalPages; page++) {
      const y = -page * (pdfHeight - (options.margin ?? 0) * 2);
      pdf.addImage(
        imgData,
        "PNG",
        options.margin ?? 0,
        y + (options.margin ?? 0),
        imgWidthOnPdf,
        imgHeightOnPdf,
      );

      if (page < totalPages - 1) pdf.addPage();
    }

    const fileName = buildExportFileName(
      container,
      options.fileNamePrefix || TITLE,
      "pdf",
    );
    pdf.save(fileName);
  } finally {
    console.error("Failed to export PDF.")
  }
}

function download(downloadName: string, downloadContent: string) {
  const link = document.createElement("a");
  link.download = downloadName;
  link.href = downloadContent;
  link.click();
}
