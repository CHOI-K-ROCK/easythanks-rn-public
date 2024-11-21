import { useCallback } from 'react';

import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { userDataAtom } from '../states/user';
import { isSignedAtom } from '../states/system';

import { OauthProviderType, UserDataType } from '../@types/models/user';

import {
    handleAppleLogin,
    handleGoogleLogin,
    handleKakaoLogin,
    handleSignOut,
    handleUserOptOut,
    handleEmailSignIn,
} from '../logics/auth';

/**
 * Auth 와 관련된 동작의 메소드를 제공하는 훅입니다.
 *
 * @return 메소드를 반환하는 객체입니다.
 * @return oauthLogin - oauthProvider 를 전달 받아 그와 일치하는 로그인 과정을 진행합니다.
 * @return logout - 로그아웃 합니다.
 * @return optout - 회원 탈퇴를 진행합니다.
 */
const useAuth = () => {
    const [userData, setUserData] = useRecoilState(userDataAtom);
    const setSigned = useSetRecoilState(isSignedAtom);

    const resetUserData = useResetRecoilState(userDataAtom);

    const clearData = useCallback(() => {
        resetUserData();
    }, [resetUserData]);

    const oauthLogin = async (provider: OauthProviderType) => {
        try {
            let res = {} as UserDataType;

            switch (provider) {
                case 'kakao': {
                    res = await handleKakaoLogin();
                    break;
                }
                case 'google': {
                    res = await handleGoogleLogin();
                    break;
                }
                case 'apple': {
                    res = await handleAppleLogin();
                    break;
                }
            }

            setUserData(res);
            setSigned(true);
        } catch (error) {
            console.log('oauth login error => ', error);
            throw error;
        }
    };

    const emailLogin = async (email: string, password: string) => {
        try {
            const res = await handleEmailSignIn(email, password);
            setUserData(res);
            setSigned(true);
        } catch (error) {
            console.log('email login error => ', error);
            throw error;
        }
    };

    const handleLogout = async () => {
        if (!userData) return;

        try {
            await handleSignOut(userData.id, userData.oauth_provider);

            clearData();
            setSigned(false);
        } catch (error) {
            console.log('logout error : ', error);
            throw error;
        }
    };

    const handleOptOut = async () => {
        if (!userData) return;

        try {
            await handleUserOptOut(userData);

            clearData();
            setSigned(false);
        } catch (error) {
            console.log('opt out error : ', error);
            throw error;
        }
    };

    return { oauthLogin, emailLogin, logout: handleLogout, optOut: handleOptOut };
};

export default useAuth;
