import React, { useCallback, useMemo } from 'react';

import { Platform, StyleSheet, View } from 'react-native';

import SafeAreaView from 'components/common/SafeAreaView';
import CustomText from 'components/common/CustomText';
import OauthIcon from 'components/common/OauthIcon';
import BadgeButton from 'components/common/BadgeButton';
import Logo from 'components/common/Logo';

import { OauthProviderType } from 'types/models/user';
import { AuthScreenNavigationProps } from 'types/navigations/authStack';

import useDimensions from 'hooks/useDimensions';
import useCustomTheme from 'hooks/useCustomTheme';
import useLoading from 'hooks/useLoading';
import useAuth from 'hooks/useAuth';

import { commonStyles } from 'styles';
import { openUrl } from 'utils/linking';
import { useNavigation } from '@react-navigation/native';
import { APP_POLICY_URL, PRIVATE_POLICY_URL } from 'constants/links';

const AuthScreen = () => {
    const { colors } = useCustomTheme();
    const { hp } = useDimensions();
    const { oauthLogin } = useAuth();
    const { setLoading } = useLoading();

    const navigation = useNavigation<AuthScreenNavigationProps>();

    const handleLogin = useCallback(
        async (provider: OauthProviderType) => {
            try {
                setLoading(true);
                await oauthLogin(provider);
            } catch (error) {
                console.log(`handle login failed`);
            } finally {
                setLoading(false);
            }
        },
        [setLoading, oauthLogin]
    );

    const buttonData = useMemo(
        () => [
            {
                provider: 'kakao',
                onPress: () => handleLogin('kakao'),
            },
            {
                provider: 'google',
                onPress: () => handleLogin('google'),
            },
            {
                provider: 'apple',
                onPress: () => handleLogin('apple'),
                visible: Platform.OS === 'ios',
                // android 환경에서는 숨기기
            },
        ],
        [handleLogin]
    );

    const expetedNoneVisibleButtonData = useMemo(
        () => buttonData.filter(item => item.visible !== false),
        [buttonData]
    );

    const onPressPrivacyPolicy = () => {
        openUrl(PRIVATE_POLICY_URL);
    };
    const onPressAppPolicy = () => {
        openUrl(APP_POLICY_URL);
    };

    const toEmailSignInScreen = () => {
        navigation.navigate('EmailSignInScreen');
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                {/* 로고 */}
                <Logo />

                {/* 포인트 라인 */}
                <View
                    style={[
                        {
                            height: hp(13),
                            backgroundColor: colors.mainColor,
                        },
                        styles.pointLine,
                    ]}
                />

                {/* 소셜 로그인 타이틀 */}
                <CustomText style={[{ color: colors.subtitle }, styles.socialLoginTitle]}>
                    {'소셜 계정으로 시작하기'}
                </CustomText>

                <View>
                    {/* 소셜 버튼 */}
                    <View style={styles.socialLoginButtonContainer}>
                        {expetedNoneVisibleButtonData.map(button => {
                            const { provider, onPress } = button;

                            return (
                                <OauthIcon
                                    key={provider}
                                    provider={provider as any}
                                    style={styles.socialLoginButton}
                                    onPress={onPress}
                                />
                            );
                        })}
                    </View>

                    {/* 이메일 로그인 버튼 */}
                    <BadgeButton
                        title={'이메일로 로그인'}
                        icon={'email'}
                        iconStyle={{ marginLeft: 3 }}
                        onPress={toEmailSignInScreen}
                        style={styles.emailLoginButton}
                    />
                </View>

                {/* 개인정보 처리방침 및 이용약관 */}
                <View style={styles.privacyPolicyContainer}>
                    <CustomText style={[{ color: colors.subtitle }, styles.privacyPolicyTitle]}>
                        {'소셜 로그인으로 아래의 약관에 동의합니다.'}
                    </CustomText>
                    <CustomText style={[{ color: colors.subtitle }, styles.privacyPolicy]}>
                        <CustomText
                            style={[{ color: colors.subtitle }, styles.privacyPolicyLink]}
                            onPress={onPressPrivacyPolicy}
                        >
                            {'개인정보 처리방침'}
                        </CustomText>
                        {' 및 '}
                        <CustomText
                            style={[{ color: colors.subtitle }, styles.privacyPolicyLink]}
                            onPress={onPressAppPolicy}
                        >
                            {'이용약관'}
                        </CustomText>
                    </CustomText>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...commonStyles.centered,
    },
    pointLine: {
        width: 1,

        marginVertical: 15,
        opacity: 0.5,
    },
    socialLoginButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 15,
    },
    socialLoginButton: {
        width: 40,
        height: 40,
    },

    socialLoginTitle: {
        marginBottom: 20,
        fontSize: 12,
    },
    emailLoginButton: {
        paddingHorizontal: 30,
    },
    privacyPolicyContainer: {
        marginTop: 10,
        marginBottom: 15,
        alignItems: 'center',
        gap: 5,
    },
    privacyPolicyTitle: {
        fontSize: 12,
    },
    privacyPolicy: {
        fontSize: 12,
    },
    privacyPolicyLink: {
        fontWeight: 600,
        textDecorationLine: 'underline',
    },
});

export default AuthScreen;
