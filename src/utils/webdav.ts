import { readDir, readFile } from "@tauri-apps/plugin-fs";
import { type FileStat, createClient } from "webdav";

/**
 * 初始化 webdav 客户端
 */
export const initWebdavClient = () => {
	const { enable, url, options } = webdavStore;

	if (!enable || !url || !options) return;

	const client = createClient(url, options);
	webdavStore.client = client;
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	console.log("webdav client init success");
};

/**
 * 下载目录
 * @param remoteDir 远程目录
 * @param localDir 本地目录
 */
export const downloadDirectoryByWebdav = async (
	remoteDir: string,
	localDir: string,
) => {
	const client = webdavStore.client;
	if (!client) {
		throw new Error("client is undefined");
	}

	const files = (await client.getDirectoryContents(remoteDir)) as FileStat[];

	for (const file of files) {
		const remoteFilePath = joinPath(remoteDir, file.filename);
		const localFilePath = joinPath(localDir, file.filename);

		if (file.type === "file") {
			const link = await client.getFileDownloadLink(remoteFilePath);
			await downloadFile(link, localFilePath);
		} else {
			await downloadDirectoryByWebdav(remoteFilePath, localFilePath);
		}
	}
};

/**
 * 上传目录
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 */
export const uploadDirectoryByWebdav = async (
	localDir: string,
	remoteDir: string,
) => {
	const client = webdavStore.client;
	if (!client) {
		throw new Error("client is undefined");
	}

	const dirEntries = await readDir(localDir);
	for (const dirEntry of dirEntries) {
		const remoteFilePath = joinPath(remoteDir, dirEntry.name);
		const localFilePath = joinPath(localDir, dirEntry.name);

		if (dirEntry.isFile) {
			const file = await readFile(localFilePath);
			const lockResponse = await client.lock(remoteFilePath);
			await client.putFileContents(remoteFilePath, file);
			await client.unlock(remoteFilePath, lockResponse.token);
		} else {
			if (!(await client.exists(remoteFilePath))) {
				await client.createDirectory(remoteFilePath);
			}

			await uploadDirectoryByWebdav(localFilePath, remoteFilePath);
		}
	}
};
