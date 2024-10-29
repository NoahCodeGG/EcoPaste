use tauri::{
    generate_handler,
    plugin::{Builder, TauriPlugin},
    Runtime,
};

mod commands;
mod error;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("eco-synchronization")
        .invoke_handler(generate_handler![commands::webdav])
        .build()
}
