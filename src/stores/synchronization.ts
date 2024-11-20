import { SYNCHRONIZATION_SERVER_TYPE } from "@/constants";
import type { SynchronizationStore } from "@/types/store";
import { proxy } from "valtio";

export const synchronizationStore = proxy<SynchronizationStore>({
	server: {
		type: SYNCHRONIZATION_SERVER_TYPE.WEBDAV,
		options: {
			url: "https://dav.jianguoyun.com/dav/",
			username: "noahcodegg@gmail.com",
			password: "ah3q34yza3mm6pk9",
		},
	},
});
