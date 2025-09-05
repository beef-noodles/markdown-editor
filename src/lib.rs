mod utils;

use js_sys::JsString;
use markdown::{CompileOptions, Options, ParseOptions};
use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn init() -> Result<(), wasm_bindgen::JsValue> {
    utils::set_panic_hook();
    console::log_1(&"Initialized".into());
    Ok(())
}

fn _render_markdown(md: &str) -> Result<String, String> {
    markdown::to_html_with_options(
        md,
        &Options {
            parse: ParseOptions {
                constructs: markdown::Constructs::gfm(),
                ..ParseOptions::default()
            },
            compile: CompileOptions {
                allow_dangerous_html: true,
                allow_dangerous_protocol: true,
                ..CompileOptions::default()
            },
        },
    )
    .map_err(|err| err.to_string())
}

#[wasm_bindgen]
pub fn render_markdown(md: &str) -> Result<JsString, wasm_bindgen::JsValue> {
    let html_output = _render_markdown(md)?;
    Ok(JsString::from(html_output.as_str()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_render_markdown_heading() {
        let md = "# Hello";
        let result = _render_markdown(md).unwrap();
        let expected = "<h1>Hello</h1>";
        assert_eq!(result, expected);
    }

    #[test]
    fn test_render_markdown_strikethrough() {
        let md = "~~world~~";
        let result = _render_markdown(md).unwrap();
        let expected = "<p><del>world</del></p>";
        assert_eq!(result, expected);
    }

    #[test]
    fn test_render_markdown_empty() {
        let md = "";
        let result = _render_markdown(md).unwrap();
        let expected = "";
        assert_eq!(result, expected);
    }

    #[test]
    fn test_render_markdown_paragraph() {
        let md = "This is a paragraph.";
        let result = _render_markdown(md).unwrap();
        let expected = "<p>This is a paragraph.</p>";
        assert_eq!(result, expected);
    }
}
