import { computed, ref } from 'vue';

const lockedUserInfo = ref(window.ZnPbInitialData.post_lock_user);

export const usePostLock = () => {
	const isPostLocked = computed(() => lockedUserInfo.value && !!lockedUserInfo.value.message);

	const setPostLock = lockedData => {
		lockedUserInfo.value = lockedData;
	};

	const takeOverPost = () => {
		lockedUserInfo.value = {};
	};

	return {
		isPostLocked,
		lockedUserInfo,
		setPostLock,
		takeOverPost,
	};
};
