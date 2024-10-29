use serde::{ser::Serializer, Serialize};

#[derive(Debug, thiserror::Error)]
pub enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error(transparent)]
  Error(#[from] Box<dyn std::error::Error>),
  #[error(transparent)]
  Dav(#[from] reqwest_dav::Error),
  #[error(transparent)]
  DavRe(#[from] reqwest_dav::re_exports::reqwest::Error),
  #[error(transparent)]
  Tauri(#[from] tauri::Error),
  #[error(transparent)]
  StripPrefix(#[from] std::path::StripPrefixError)
}

impl Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}
