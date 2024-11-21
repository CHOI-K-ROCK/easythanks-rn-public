import { removeFiles, uploadImage } from 'services/files';

import {
    checkFcmTokenAleadyUsed,
    clearUserFcmToken,
    updateUserData,
    updateUserFcmToken,
} from 'services/users';
import { UserDataType } from 'types/models/user';

export const handleUpdateUserProfile = async (
    id: string,
    userData: UserDataType,
    newUserData: Partial<UserDataType>
) => {
    try {
        const copiedNewUserData = { ...newUserData };

        if (newUserData.profile_img) {
            // 새로운 프로필 이미지 업로드
            const uploadRes = await uploadImage(`profiles/`, newUserData.profile_img);
            copiedNewUserData.profile_img = uploadRes.publicUrl;

            if (userData.profile_img) {
                // 기존 프로필 이미지 삭제
                const pathWithFolderName = userData.profile_img.split('/').slice(-2).join('/');
                // profiles/{fileName}

                await removeFiles([pathWithFolderName]);
            }
        }

        const updatedUserData = await updateUserData(id, copiedNewUserData);

        return updatedUserData;
    } catch (error: any) {
        console.log('update user error :', error);
        throw new Error(error);
    }
};

export const handleUpadateUserProfileSettedToTrue = async (id: string) => {
    try {
        const updatedUserData = await updateUserData(id, { profile_setted: true });

        return updatedUserData;
    } catch (error: any) {
        console.log('update user profile setted to true error :', error);
        throw new Error(error);
    }
};

export const handleUpdateUserFcmToken = async (
    userId: string,
    token: string,
    platform: 'ios' | 'android'
) => {
    try {
        // 다른 유저가 해당 토큰을 사용하고 있는지 확인
        const isUsed = await checkFcmTokenAleadyUsed(userId, token);
        // 다른 유저가 사용하고 있다면 해당 토큰 삭제
        if (isUsed) {
            await clearUserFcmToken(token);
        }

        // 토큰 업데이트
        await updateUserFcmToken(userId, token, platform);
    } catch (error: any) {
        console.log('update user fcm token error :', error);
        throw new Error(error);
    }
};
