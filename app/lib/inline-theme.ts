interface StyleRule {
  [property: string]: string;
}

interface StyleRules {
  [selector: string]: StyleRule;
}


export default function inlineTheme(html: string, css: string): string {
  if (!html || !css) {
    return html;
  }

  const tempDiv = document.createElement("div");

  tempDiv.innerHTML = html;

  const styleRules: StyleRules = {};

  css.split("}").forEach((rule) => {
    const parts = rule.split("{");

    if (parts.length !== 2) return;

    const [selector, styles] = parts;

    if (!selector?.trim() || !styles?.trim()) return;

    const trimmedSelector = selector.trim();

    styleRules[trimmedSelector] = {};

    styles.split(";").forEach((style) => {
      const [property, value] = style.split(":");

      if (property?.trim() && value?.trim()) {
        styleRules[trimmedSelector][property.trim()] = value.trim();
      }
    });
  });

  try {
    Object.entries(styleRules).forEach(([selector, styles]) => {
      const elements = tempDiv.querySelectorAll(selector);

      elements.forEach((element) => {
        // 跳过 Mermaid 图表内的元素
        if (element.closest('.mermaid')) {
          return;
        }

        if (element instanceof HTMLElement) {
          Object.entries(styles).forEach(([property, value]) => {
            element.style.setProperty(property, value);
          });
        }
      });
    });
  } catch (error) {
    console.error("Error applying inline styles:", error);
  }

  return tempDiv.innerHTML;
}
