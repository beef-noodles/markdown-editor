mod utils;

use js_sys::JsString;
use pulldown_cmark::{Options, Parser};
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

#[wasm_bindgen]
pub fn render_markdown(md: &str) -> Result<JsString, wasm_bindgen::JsValue> {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_TASKLISTS);

    let parser = Parser::new_ext(md, options);

    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);

    Ok(JsString::from(html_output))
}
