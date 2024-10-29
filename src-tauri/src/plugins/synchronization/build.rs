const COMMANDS: &[&str] = &["webdav"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS).build();
}
