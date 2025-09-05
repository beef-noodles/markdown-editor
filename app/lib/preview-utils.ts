import { toPng } from "html-to-image";
import { renderMermaid } from "./mermaid-render";
import { renderLatexInElement } from "./latex-render";
import { appendReferencesSection } from "./references";
import inlineTheme from "./inline-theme";

type ExportPngOptions = {
  desiredWidth?: number;
  fileNamePrefix?: string;
  backgroundColor?: string;
};

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

  const h1Element = container.querySelector("h1");
  const h1Text = h1Element?.textContent?.trim();

  const prefix = h1Text || options.fileNamePrefix || "markdown-preview";

  const cleanPrefix = prefix.replace(/[<>:"/\\|?*]/g, "-").replace(/\s+/g, "-");

  const link = document.createElement("a");
  link.download = `${cleanPrefix}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.png`;
  link.href = dataUrl;
  link.click();
}
