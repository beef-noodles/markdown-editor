export const DEFAULT_MARKDOWN = `# Hello, Markdown Editor

👋 Welcome to **Markdown Editor**! Nice to meet you!

Just focus on creating your content, **Markdown Editor** will convert it to \`email\` and \`image\`.

## Quick Start

1. Write content: Enter Markdown text📝, paste images🏞️.
2. Copy content: Copy the formatted content with one click.
3. Paste & Share: Paste it into emails, chat software, or anywhere else for quick sharing.

## Features
- ⚡️ **Fast:** Built with [WASM](https://webassembly.org/)
- 💡 **Simple to Use:** Real-time preview, what you see is what you get.
- 🏞️ **Image Upload:** Paste images, automatically generate image links.
- 🧮 **Math Formula:** Support for [$LaTeX$](https://en.wikipedia.org/wiki/LaTeX) math formula.
- 📊 **Data Visualization:** Create beautiful flowcharts, sequence diagrams, and more with Mermaid syntax, making your data more vivid.
- 🎨 **Multiple Themes:** Continuously updated to meet different layout needs.
- 📧 **Quick Sharing:** One-click copy, ready to publish on multiple platforms.
- 📄 **Auto-Adapt:** Adapts to email window widths for a more attractive display.
- 🔒 **Data Security:** Text and images are processed entirely in the browser, not uploaded to servers.
- 🌟 **Free & Open Source:** Completely free to use, community contributions welcome.


## Use Cases

**Markdown Editor**'s various output formats (currently under development) can meet different use cases:

| Format    | Description                                              | Scenario                          |
|-----------|----------------------------------------------------------|-----------------------------------|
| 📧 Email  | Create content that can be embedded directly into emails | Newsletters, article sharing      |
| 🖼️ Image | Generate shareable images from Markdown                   | Social media sharing              |
| 🖼️ PDF | Generate shareable PDF from Markdown                        | Work sharing              |


![Preview](https://picsum.photos/600/300)

\`\`\`ts
useEffect(() => {
  (async () => {
    await init();
    setWasmReady(true);
  })();
  }, []);

  useEffect(() => {
  if (wasmReady) {
    const html = render_markdown(markdown);
    setInnerHTML(html);
  }
  }, [markdown, wasmReady]);
\`\`\`

$$P_\\omega={n_\\omega\\over 2}\\hbar\\omega\\,{1+R\\over 1-v^2}\\int\\limits_{-1}^{1}dx\\,(x-v)|x-v|,$$

\`\`\`mermaid
flowchart LR
  A[Write Markdown] -->|Real-time| B[Preview]
  B --> C{Export Options}
  C -->|Social Media| D[Twitter/LinkedIn]
  C -->|Assert| E[Image]
  C -->|Web| F[HTML]
  C -->|Email| G[Newsletter]

  style A fill:#d8dee9,stroke:#3b4252,stroke-width:2px
  style B fill:#81a1c1,stroke:#3b4252,stroke-width:2px
  style C fill:#d8dee9,stroke:#3b4252,stroke-width:2px
  style D fill:#d8dee9,stroke:#3b4252,stroke-width:2px
  style E fill:#d8dee9,stroke:#3b4252,stroke-width:2px
  style F fill:#d8dee9,stroke:#3b4252,stroke-width:2px
  style G fill:#d8dee9,stroke:#3b4252,stroke-width:2px
\`\`\`

## Feedback

Feel free to share your ideas and suggestions on [GitHub Issue](https://github.com/beef-noodles/markdown-editor). Your
feedback will make **Markdown Editor** better!`;
