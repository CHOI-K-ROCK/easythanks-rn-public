import React, { useEffect, useRef } from 'react';

import messaging from '@react-native-firebase/messaging';

import { RecoilRoot, useRecoilState } from 'recoil';
import { isSignedAtom } from 'states/system';
import { userDataAtom } from 'states/user';

import {
    Appearance,
    AppState,
    ColorSchemeName,
    Platform,
    StatusBar,
    useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from 'navigations/RootNavigator';

import useCustomTheme, { AppThemeType } from 'hooks/useCustomTheme';
import { getAppTheme, saveAppTheme } from 'utils/storage';
import SplashScreen from 'react-native-splash-screen';

import { getUserById } from 'services/users';
import { checkSession } from 'services/auth';

import { handleUpdateUserFcmToken } from 'logics/users';

import { onMessageReceived, requestFcmToken } from 'utils/notification';
import { PERMISSIONS, request } from 'react-native-permissions';

function App(): React.JSX.Element {
    const [isSigned, setSigned] = useRecoilState(isSignedAtom);
    const [userData, setUserData] = useRecoilState(userDataAtom);

    const isDark = useColorScheme() === 'dark';
    const { colors } = useCustomTheme();

    useEffect(() => {
        // 푸시 알림 등록 (foreground)
        const unsubscribe = messaging().onMessage(async msg => {
            await onMessageReceived(msg);
            console.log('onMessageReceived foreground');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        // 앱 초기화
        const initApp = async () => {
            try {
                console.log('init app');

                //  앱 테마 체크
                const appTheme = ((await getAppTheme()) || 'device') as AppThemeType;
                const appThemeScheme = (appTheme === 'device' ? null : appTheme) as ColorSchemeName;

                await saveAppTheme(appTheme);
                Appearance.setColorScheme(appThemeScheme);

                // 로그인 세션 체크
                const sessionRes = await checkSession();

                if (!sessionRes.data || !sessionRes.data.user) {
                    throw Error('session data is null');
                }

                const userDataRes = await getUserById(sessionRes.data.user.id);

                if (!userDataRes) {
                    throw Error('userdata is null');
                }

                if (userDataRes) {
                    setUserData(userDataRes);
                    setSigned(true);
                }
            } catch (e) {
                console.log('app init error :', e);
            } finally {
                SplashScreen.hide();
            }
        };

        initApp();
    }, [setSigned, setUserData]);

    useEffect(() => {
        // 로그인 상태일 때 fcm 토큰 요청 및 업데이트
        if (isSigned && userData) {
            const checkFcmToken = async () => {
                const fcmToken = await requestFcmToken();
                console.log('fcmToken updated');

                if (fcmToken) {
                    await handleUpdateUserFcmToken(
                        userData.id,
                        fcmToken,
                        Platform.OS as 'ios' | 'android'
                    );
                }
            };

            checkFcmToken();
        }
    }, [isSigned, userData]);

    useEffect(() => {
        const listener = AppState.addEventListener('change', async status => {
            if (Platform.OS === 'ios' && status === 'active') {
                // 앱이 active 상태인 경우에만 해당 팝업을 띄울 수 있으므로 위처럼 분기한다.
                // 앱 추적 투명성 권한 요청
                const res = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
                console.log('app tracking transparency res : ', res);
            }
        });

        return () => {
            listener.remove();
        };
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={'transparent'}
                translucent // android
            />
            <RootNavigator />
        </SafeAreaProvider>
    );
}

const AppWithRecoilRoot = () => {
    return (
        <RecoilRoot>
            <App />
        </RecoilRoot>
    );
};

export default AppWithRecoilRoot;
