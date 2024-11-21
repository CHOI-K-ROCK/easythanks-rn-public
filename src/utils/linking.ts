import { Linking } from 'react-native';
import { LinkingOptions } from '@react-navigation/native';
import { MainStackParamList } from 'types/navigations/mainStack';
import { AuthStackParamList } from 'types/navigations/authStack';

export const openUrl = async (url: string) => {
    try {
        const isValidUrl = await Linking.canOpenURL(url);

        if (isValidUrl) {
            await Linking.openURL(url);
        }
    } catch (error: any) {
        console.error(error.message);
    }
};

export const linking: LinkingOptions<MainStackParamList | AuthStackParamList> = {
    prefixes: ['easythanks://'],
    async getInitialURL() {
        const url = await Linking.getInitialURL();

        if (url != null) {
            return url;
        }

        return null;
    },

    subscribe(listener: any) {
        // 딥링크 수신 시 실행될 이벤트 등록
        const linkingSubscription = Linking.addListener('url', ({ url }) => {
            console.log('Linking.addListener url: ', url);
            listener(url);
        });

        return () => {
            linkingSubscription.remove();
        };
    },
    // isSigned 에 따라 stack 결정됨,
    // 딥링킹으로 이동하는 경우의 수(비밀번호 초기화 / 리마인더로 글 작성)가 확실하므로
    // 아래의 설정을 이용해도 무방 할 것이라 생각
    config: {
        screens: {
            // MainStack
            BottomSheetComposeStack: {
                screens: {
                    ComposeScreen: {
                        path: 'compose',
                    },
                },
            },

            // AuthStack
            ChangePasswordScreen: {
                path: 'change-password',
                parse: {
                    // 쿼리 스트링으로 route params 받아올 수 있음.
                    // ex) easythanks://change-password?token=123&isDeepLink=true

                    token: (token: string) => `${token}`,
                    email: (email: string) => `${email}`,
                    isDeepLink: (value: string) => value,
                },
            },
        },
    },
};
