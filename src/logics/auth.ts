import { APP_ENV_GOOGLE_IOS_CLIENT_ID, APP_ENV_GOOGLE_WEB_CLIENT_ID } from '@env';

// kakao
import {
    login as kakaoLogin,
    logout as kakaoLogout,
    unlink as kakaoUnlink,
} from '@react-native-seoul/kakao-login';
// google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// apple
import { appleAuth } from '@invertase/react-native-apple-authentication';

import { OauthProviderType, UserDataType } from '../@types/models/user';

import { supabase } from 'services/supabase';
import { clearUserFcmToken, getUserById, optOutUser } from 'services/users';
import { getAppleToken, removeAppleToken, saveAppleToken } from 'utils/storage';
import { AppleTokenType } from 'types/models/auth';
import {
    changePassword,
    checkExistEmail,
    getAppleTokenWithAuthorizationCode,
    resendConfirmationEmail,
    revokeAppleAuthorization,
    sendPasswordResetEmail,
} from 'services/auth';
import { removeFiles } from 'services/files';
import messaging from '@react-native-firebase/messaging';
import { requestFcmToken } from 'utils/notification';
// oauth
// sign in
export const handleKakaoLogin = async (): Promise<UserDataType> => {
    try {
        const kakaoToken = await kakaoLogin();

        if (!kakaoToken) {
            throw new Error('token is null');
        }
        // supabase auth
        const res = await supabase.auth.signInWithIdToken({
            provider: 'kakao',
            token: kakaoToken.idToken,
        });

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }

        if (!res.data.user) {
            throw new Error('userdata is null');
        }

        const userData = await getUserById(res.data.user.id);

        return userData;
    } catch (error) {
        console.log('handleKakaoLogin error: ', error);
        throw error;
    }
};

export const handleGoogleLogin = async (): Promise<UserDataType> => {
    try {
        await GoogleSignin.hasPlayServices();
        GoogleSignin.configure({
            webClientId: APP_ENV_GOOGLE_WEB_CLIENT_ID,
            iosClientId: APP_ENV_GOOGLE_IOS_CLIENT_ID,
        });

        const { idToken } = await GoogleSignin.signIn();

        if (!idToken) {
            throw new Error('id Token is null');
        }

        const res = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        });

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }

        if (!res.data.user) {
            throw new Error('userdata is null');
        }

        const userData = await getUserById(res.data.user.id);

        return userData;
    } catch (error) {
        console.log('handleGoogleLogin error: ', error);
        throw error;
    }
};

export const handleAppleLogin = async (): Promise<UserDataType> => {
    try {
        const { user, nonce, identityToken, authorizationCode } = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // Note: it appears putting FULL_NAME first is important, see issue #293
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(user);

        if (credentialState !== appleAuth.State.AUTHORIZED) {
            throw new Error('apple login not authorized');
        }

        if (!identityToken || !authorizationCode) {
            throw new Error('token and auth code is null');
        }

        // authorizationCode 이용, appleToken 요청 및 로컬 저장소 저장
        // 회원 탈퇴(revoke) 로직을 위해 토큰 저장
        const appleTokenRes = await getAppleTokenWithAuthorizationCode(authorizationCode);

        // local 저장
        await saveAppleToken(JSON.stringify(appleTokenRes));

        // supabase auth
        const res = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: identityToken,
            nonce,
        });

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }

        if (!res.data.user) {
            throw new Error('userdata is null');
        }

        const userData = await getUserById(res.data.user.id);

        return userData;
    } catch (error) {
        console.log('handleAppleLogin error: ', error);
        throw error;
    }
};

// email
export const handleEmailSignUp = async (email: string, password: string): Promise<void> => {
    try {
        // 이메일 존재 여부확인
        const isRegisteredEmail = await checkExistEmail(email);

        if (isRegisteredEmail) {
            // 이메일 중복시 에러처리
            throw new Error(JSON.stringify({ code: 'duplicated_email' }));
        }

        const res = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }
    } catch (error) {
        console.log('handleEmailSignUp error: ', error);
        throw error;
    }
};

export const handleEmailSignIn = async (email: string, password: string): Promise<UserDataType> => {
    try {
        const res = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }

        if (!res.data.user) {
            throw new Error('userdata is null');
        }

        const userData = await getUserById(res.data.user.id);

        return userData;
    } catch (error) {
        console.log('handleEmailSignIn error: ', error);
        throw error;
    }
};

export const handleResendConfirmationEmail = async (email: string): Promise<void> => {
    try {
        await resendConfirmationEmail(email);
    } catch (error) {
        console.log('handleResendConfirmationEmail error: ', error);
        throw error;
    }
};

// password
export const handleSendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
        // 이메일 존재 여부
        const isRegisteredEmail = await checkExistEmail(email);

        if (!isRegisteredEmail) {
            // 존재하지 않는 이메일인 경우
            throw new Error(JSON.stringify({ code: 'not_registered_email' }));
        }

        await sendPasswordResetEmail(email);
    } catch (error) {
        console.log('handleSendPasswordResetEmail error: ', error);
        throw error;
    }
};

export const handleChangePasswordWithOTP = async (
    email: string,
    token: string,
    password: string
): Promise<void> => {
    try {
        const tempSignInRes = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'recovery',
        });

        if (tempSignInRes.error) {
            throw new Error(JSON.stringify(tempSignInRes.error));
        }

        // 임시 로그인 후 비밀번호 변경
        await changePassword(password);

        // 로그아웃
        await supabase.auth.signOut();
    } catch (error) {
        console.log('handleChangePasswordWithOTP error: ', error);
        throw error;
    }
};

export const handleChangePasswordWithPasswordVerification = async (
    currentPassword: string,
    email: string,
    password: string
): Promise<void> => {
    try {
        // 현재 비밀번호 검증
        const passwordVerificationRes = await supabase.auth.signInWithPassword({
            email: email,
            password: currentPassword,
        });

        if (passwordVerificationRes.error) {
            throw new Error(JSON.stringify({ code: 'password_not_verified' }));
        }

        // 비밀번호 변경
        await changePassword(password);
    } catch (error) {
        console.log('handleChangePasswordWithOTP error: ', error);
        throw error;
    }
};

// sign out
export const handleSignOut = async (
    userId: string,
    oauth_provider: OauthProviderType
): Promise<void> => {
    try {
        try {
            // 각 oauth 로그아웃 로직 요청 실패 시 단순 콘솔로만 에러 처리
            // -> supabase 내에서 signOut 처리가 메인으로,
            // 각 provider 요청 실패 시 에러로 인해 로그아웃 불가능 한 상황 회피
            switch (oauth_provider) {
                case 'kakao': {
                    await kakaoLogout();
                    break;
                }
                case 'google': {
                    await GoogleSignin.signOut();
                    break;
                }
                case 'apple': {
                    // 애플에서 제공하는 별도의 로그아웃 로직 X
                    // await supabase.auth.signOut(); 과 로그인 시 저장한 appleToken 삭제로 대체
                    await removeAppleToken();
                    break;
                }
            }
        } catch (error) {
            console.log(`handleSignOut error by ${oauth_provider} : `, error);
        }

        // 로그아웃 시 fcm 토큰 / 플랫폼 초기화
        // 회원 탈퇴의 경우 토큰 초기화가 필요치 않음.
        const fcmToken = await requestFcmToken();

        if (fcmToken) {
            await clearUserFcmToken(fcmToken);
        }

        await supabase.auth.signOut();
    } catch (error) {
        console.log('handleSignOut error: ', error);
        throw error;
    }
};

export const handleUserOptOut = async (userData: UserDataType) => {
    try {
        const { id, oauth_provider, profile_img } = userData;

        if (profile_img) {
            // 프로필 이미지 스토리지에서 삭제
            const pathWithFolderName = profile_img.split('/').slice(-2).join('/');
            // profiles/{fileName}

            await removeFiles([pathWithFolderName]);
        }

        switch (oauth_provider) {
            case 'kakao': {
                // 카카오 링크 해제
                await kakaoUnlink();
                break;
            }
            case 'apple': {
                const appleToken = await getAppleToken();

                if (!appleToken) {
                    throw new Error('apple token not saved in device storage');
                }

                const { refresh_token } = JSON.parse(appleToken) as AppleTokenType;
                // apple 회원 탈퇴 REST API 사용 (revoke)
                await revokeAppleAuthorization(refresh_token);

                // 디바이스에 저장된 appleToken 초기화
                await removeAppleToken();
                break;
            }
        }

        await optOutUser(id); // supabase 처리
    } catch (error) {
        console.log('handleUserOptOut error: ', error);
        throw error;
    }
};
