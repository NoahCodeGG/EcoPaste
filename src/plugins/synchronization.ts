import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";

export const webdav = async (operate: string) => {
	const backupFilePath = await exportData(
		true,
		"synchronization",
		getSaveDataDir(),
	);
	const { url, username, password } = synchronizationStore.server.options;

	const isSuccess = (await invoke(SYNCHRONIZATION_PLUGIN.WEBDAV, {
		operate,
		url,
		username,
		password,
		backupFilePath,
	})) as boolean;

	if (isSuccess && operate === "download") {
		const result = await importData(backupFilePath as string);
		if (result) {
			await restoreStore(true);
			await closeDatabase();

			emit(LISTEN_KEY.REFRESH_CLIPBOARD_LIST);
		}
	}
};
