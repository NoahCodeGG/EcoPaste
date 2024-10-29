use crate::error::Error;
use reqwest_dav::{Auth, ClientBuilder};
use std::path::Path;
use tauri::{command, AppHandle, Runtime};

#[command(async)]
pub async fn webdav<R: Runtime>(
    app_handle: AppHandle<R>,
    operate: &str,
    url: String,
    username: String,
    password: String,
    backup_file_path: String,
) -> Result<bool, Error> {
    let app_name = app_handle.config().product_name.clone().unwrap_or_default();

    let mut client = ClientBuilder::new()
        .set_host(url.clone())
        .set_auth(Auth::Basic(username.clone(), password.clone()))
        .build()?;

    client
        .mkcol(&format!("/{}", app_name))
        .await
        .unwrap_or_default();

    client = ClientBuilder::new()
        .set_host(format!("{}/{}", url.trim_end_matches("/"), app_name))
        .set_auth(Auth::Basic(username, password))
        .build()?;

    let filename = Path::new(&backup_file_path)
        .file_name()
        .unwrap()
        .to_str()
        .unwrap();

    match operate {
        "upload" => {
            match client
                .put(&format!("/{}", filename), std::fs::read(&backup_file_path)?)
                .await
            {
                Ok(()) => {
                    std::fs::remove_file(&backup_file_path).unwrap();
                    Ok(true)
                }
                Err(e) => {
                    return Err(Error::Error(format!("WebDav Put Error: {}", e).into()));
                }
            }
        }
        "download" => {
            let response = client.get(&format!("/{}", filename)).await?;
            std::fs::write(backup_file_path, response.bytes().await?).unwrap();
            Ok(true)
        }
        _ => {
            return Err(Error::Error(
                format!("WebDav Operate Error: {}", operate).into(),
            ));
        }
    }
}
