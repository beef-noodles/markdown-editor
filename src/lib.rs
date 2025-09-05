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

#[wasm_bindgen]
pub fn render_markdown(md: &str) -> Result<JsString, wasm_bindgen::JsValue> {
    let html_output = markdown::to_html_with_options(
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
    );

    Ok(JsString::from(
        html_output
            .map_err(|err| JsValue::from_str(&err.to_string()))?
            .as_str(),
    ))
}
