import { writeFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";

export const downloadFile = async (url: string, filePath: string) => {
	const response = await fetch(url, {
		method: "GET",
	});

	if (response.ok) {
		const blob = await response.blob();
		await writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
	}
};
