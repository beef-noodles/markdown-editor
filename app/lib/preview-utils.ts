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

type ExportPdfOptions = {
  fileNamePrefix?: string;
  format?: string;
  unit?: string;
  margin?: number;
  scale?: number;
  backgroundColor?: string;
  desiredWidth?: number;
};

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "-").replace(/\s+/g, "-");
}

function getArticleTitle(container: HTMLElement, fallback: string): string {
  const h1 = container.querySelector("h1")?.textContent?.trim();
  return sanitizeFileName(h1 || fallback);
}

function buildExportFileName(
  container: HTMLElement,
  fallback: string,
  ext: string
): string {
  const prefix = getArticleTitle(container, fallback);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const extension = ext.startsWith(".") ? ext.slice(1) : ext;
  return `${prefix}-${timestamp}.${extension}`;
}

async function renderDynamicContent(container: HTMLElement): Promise<void> {
  renderLatexInElement(container);
  await renderMermaid(container);
}

function buildStyledHTML(container: HTMLElement, theme: string): string {
  const html = appendReferencesSection(container.innerHTML) as string;
  return inlineTheme(html, theme);
}

function downloadFile(name: string, content: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = content;
  link.click();
}

export async function copyPreviewToClipboard(
  container: HTMLElement,
  theme: string
): Promise<void> {
  await renderDynamicContent(container);
  const html = buildStyledHTML(container, theme);
  await navigator.clipboard.write([
    new window.ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([container.textContent || ""], { type: "text/plain" }),
    }),
  ]);
}

export async function exportPreviewToPng(
  container: HTMLElement,
  options: ExportPngOptions = {}
): Promise<void> {
  await renderDynamicContent(container);
  const target = container.querySelector("article") as HTMLElement || container;
  const width = options.desiredWidth ?? 960;
  const bg =
    options.backgroundColor ??
    (getComputedStyle(document.documentElement).getPropertyValue("--background") ||
      "#ffffff");
  const dataUrl = await toPng(target, {
    width,
    style: {
      width: `${width}px`,
      background: "#ffffff",
      boxSizing: "border-box",
      display: "block",
      position: "static",
    },
    backgroundColor: bg,
  });
  const fileName = buildExportFileName(container, options.fileNamePrefix || TITLE, "png");
  downloadFile(fileName, dataUrl);
}

export async function exportPreviewToPdf(
  container: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<void> {
  await renderDynamicContent(container);
  const target = container.querySelector("article") as HTMLElement || container;
  const width = options.desiredWidth ?? 960;
  const bg =
    options.backgroundColor ??
    (getComputedStyle(document.documentElement).getPropertyValue("--background") ||
      "#ffffff");
  try {
    const dataUrl = await toPng(target, {
      width,
      backgroundColor: bg,
      style: {
        width: `${width}px`,
        boxSizing: "border-box",
        display: "block",
        position: "static",
      },
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });
    const unit = (options.unit ?? "px") as any;
    const format = options.format ?? "a4";
    const pdf = new jsPDF({ unit, format } as any);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = options.margin ?? 0;
    const imgWidth = img.naturalWidth || width;
    const imgHeight = img.naturalHeight || width * 1.3;
    const imgWidthOnPdf = pdfWidth - margin * 2;
    const imgHeightOnPdf = (imgHeight * imgWidthOnPdf) / imgWidth;
    const totalPages = Math.ceil(imgHeightOnPdf / (pdfHeight - margin * 2));
    for (let page = 0; page < totalPages; page++) {
      const y = -page * (pdfHeight - margin * 2);
      pdf.addImage(
        dataUrl,
        "PNG",
        margin,
        y + margin,
        imgWidthOnPdf,
        imgHeightOnPdf
      );
      if (page < totalPages - 1) pdf.addPage();
    }
    const fileName = buildExportFileName(container, options.fileNamePrefix || TITLE, "pdf");
    pdf.save(fileName);
  } catch (e) {
    console.error("Failed to export PDF.", e);
  }
}
