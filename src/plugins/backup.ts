import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { downloadDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";

/**
 * 备份数据的扩展名
 */
export const extname = () => {
	const { appName } = globalStore.env;

	return `${appName}-backup`;
};

/**
 * 导出数据
 */
export const exportData = async (
	synchronization?: boolean,
	filename?: string,
	directory?: string,
) => {
	await saveStore(true);

	const finalFilename = filename || formatDate(dayjs(), "YYYY_MM_DD_HH_mm_ss");
	const finalDirectory = directory || (await downloadDir());
	const finalSynchronization = synchronization || false;

	const dstPath = joinPath(finalDirectory, `${finalFilename}.${extname()}`);

	return invoke(BACKUP_PLUGIN.EXPORT_DATA, {
		synchronization: finalSynchronization,
		dstPath,
		srcDir: getSaveDataDir(),
	});
};

/**
 * 导入数据
 */
export const importData = async (srcPath?: string) => {
	const finalSrcPath =
		srcPath ||
		(await open({
			filters: [{ name: "", extensions: [extname()] }],
		}));

	if (!finalSrcPath) return;

	await emit(LISTEN_KEY.CLOSE_DATABASE);

	return invoke(BACKUP_PLUGIN.IMPORT_DATA, {
		srcPath,
		dstDir: getSaveDataDir(),
	});
};

/**
 * 移动数据
 * @param from 源文件夹
 * @param to 目标文件夹
 */
export const moveData = async (from: string, to: string) => {
	await emit(LISTEN_KEY.CLOSE_DATABASE);

	return invoke<string>(BACKUP_PLUGIN.MOVE_DATA, { from, to });
};
