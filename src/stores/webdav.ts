import type { WebdavStore } from "@/types/store";
import proxyWithPersist from "valtio-persist";

// TODO 删除测试配置
export const WEBDAV_STORE_INITIAL_STATE: WebdavStore = {
	enable: true,
	url: "https://dav.jianguoyun.com/dav/",
	options: {
		username: "noahcodegg@gmail.com",
		password: "ah3q34yza3mm6pk9",
	},
	directory: `/${globalStore.env.appName}`,
	autoUpload: true,
	autoUploadInterval: 1000 * 60 * 1,
	uploading: false,
	uploadingProgress: 0,
};

export const webdavStore = proxyWithPersist<WebdavStore>({
	name: "webdav",
	initialState: { ...WEBDAV_STORE_INITIAL_STATE },
	persistStrategies,
	version: 0,
	migrations: {},
	getStorage,
});
