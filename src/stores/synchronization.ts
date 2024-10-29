import { SYNCHRONIZATION_SERVER_TYPE } from "@/constants";
import type { SynchronizationStore } from "@/types/store";
import proxyWithPersist from "valtio-persist";

// TODO 删除测试配置
export const SYNCHRONIZATION_STORE_INITIAL_STATE: SynchronizationStore = {
	server: {
		type: SYNCHRONIZATION_SERVER_TYPE.WEBDAV,
		options: {
			url: "https://dav.jianguoyun.com/dav/",
			username: "noahcodegg@gmail.com",
			password: "ah3q34yza3mm6pk9",
		},
	},
};

export const synchronizationStore = proxyWithPersist<SynchronizationStore>({
	name: "synchronization",
	initialState: { ...SYNCHRONIZATION_STORE_INITIAL_STATE },
	persistStrategies,
	version: 0,
	migrations: {},
	getStorage,
});
