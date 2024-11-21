import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import CustomText from 'components/common/CustomText';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CustomButton from 'components/common/CustomButton';
import CustomTextInput from 'components/common/CustomTextInput';
import KeyboardDismissSafeAreaView from 'components/common/KeyboardDismissSafeAreaView';
import ScreenLayout from 'components/common/ScreenLayout';
import Logo from 'components/common/Logo';
import PasswordChangeCompleteView from 'components/auth/PasswordChangeCompleteView';

import { ChangePasswordScreenNavigationProps } from 'types/navigations/authStack';
import { ChangePasswordScreenRouteProps } from 'types/navigations/settingStack';

import useCustomTheme from 'hooks/useCustomTheme';
import useInput from 'hooks/useInput';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';
import useKeyboard from 'hooks/useKeyboard';

import {
    handleChangePasswordWithOTP,
    handleChangePasswordWithPasswordVerification,
} from 'logics/auth';

import { getErrorMessageByErrorCode, checkValidatePassword } from 'utils/string';
import HorizontalDivider from 'components/common/HorizontalDivider';

const ChangePasswordScreen = () => {
    const navigation = useNavigation<ChangePasswordScreenNavigationProps>();
    const route = useRoute<ChangePasswordScreenRouteProps>();

    const { token, email, isDeepLink } = route.params;
    // token : 이메일 인증 토큰으로, 딥링크 접근 시에만 사용

    const { colors } = useCustomTheme();
    const { openToast } = useToast();
    const { setLoading, isLoading } = useLoading();
    const { dismiss: keyboardDismiss } = useKeyboard();

    const [errorMessageCode, setErrorMessageCode] = useState<string | null>(null);
    const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false);

    const {
        value: currentPassword,
        handleChange: setCurrentPassword,
        clearValue: clearCurrentPassword,
    } = useInput('');
    const {
        value: newPassword,
        handleChange: setPassword,
        clearValue: clearPassword,
    } = useInput('');
    const {
        value: confirmPassword,
        handleChange: setConfirmPassword,
        clearValue: clearConfirmPassword,
    } = useInput('');

    const buttonDisabledDeepLink = !newPassword || !confirmPassword || isLoading;
    const buttonDisabledInApp = !currentPassword || !newPassword || !confirmPassword || isLoading;

    const buttonDisabled = isDeepLink ? buttonDisabledDeepLink : buttonDisabledInApp;

    const handleChangePasswordPress = async () => {
        keyboardDismiss();

        // input 유효성 검사
        const passwordValidate = checkValidatePassword(newPassword);

        if (passwordValidate !== null) {
            // null 이 아니면 에러
            setErrorMessageCode(passwordValidate);
            return;
        }

        // 비밀번호 변경 로직
        try {
            setLoading(true);

            if (isDeepLink && token && email) {
                await handleChangePasswordWithOTP(email, token, newPassword);
            } else {
                await handleChangePasswordWithPasswordVerification(
                    currentPassword,
                    email,
                    newPassword
                );
            }

            setIsPasswordChanged(true);
            openToast({
                text: '비밀번호 변경 완료!',
                type: 'complete',
            });
        } catch (error: any) {
            // 회원가입 실패 시 에러 메시지 처리
            const parsedError = JSON.parse(error.message);
            setErrorMessageCode(parsedError.code);
        } finally {
            setLoading(false);
        }
    };

    const onCurrentPasswordChange = (text: string) => {
        setCurrentPassword(text);
        setErrorMessageCode(null);
    };

    const onPasswordChange = (text: string) => {
        setPassword(text);
        setErrorMessageCode(null);
    };

    const onConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setErrorMessageCode(null);
    };

    // 딥링크로 접근하는 경우 하위 스택이 없으므로, 네비게이션 처리
    const toHome = () => {
        navigation.navigate('AuthScreen');
    };

    return (
        <KeyboardDismissSafeAreaView keyboardAvoiding>
            <InnerNavigationBar
                screenTitle="비밀번호 변경"
                rightComponent={
                    isDeepLink ? <CustomText onPress={toHome}>홈으로</CustomText> : <></>
                }
                goBack={navigation.goBack}
                isVisibleGoBack={!isDeepLink}
            />
            <ScreenLayout style={styles.container}>
                {/* 딥링크 접근일 경우에만 로고 표시 */}
                {isDeepLink && <Logo style={styles.logo} />}

                {/* 비밀번호 변경 완료 화면 */}
                {isPasswordChanged ? (
                    <PasswordChangeCompleteView
                        onPressConfirm={isDeepLink ? toHome : navigation.goBack}
                    />
                ) : (
                    <>
                        {/* 회원가입 입력 폼 */}
                        <View style={styles.inputContainer}>
                            {/* 인앱 접근일 경우 현재 비밀번호 입력 필드 추가 */}
                            {!isDeepLink && (
                                <>
                                    <CustomTextInput
                                        title="현재 비밀번호"
                                        value={currentPassword}
                                        onChangeText={onCurrentPasswordChange}
                                        onPressClear={clearCurrentPassword}
                                        clearButton
                                        secureTextEntry
                                    />
                                    <HorizontalDivider />
                                </>
                            )}
                            <CustomTextInput
                                title="새 비밀번호 (영문/숫자 포함, 8자 이상)"
                                value={newPassword}
                                onChangeText={onPasswordChange}
                                onPressClear={clearPassword}
                                clearButton
                                secureTextEntry
                            />
                            <CustomTextInput
                                title="새 비밀번호 확인"
                                value={confirmPassword}
                                onChangeText={onConfirmPasswordChange}
                                onPressClear={clearConfirmPassword}
                                clearButton
                                secureTextEntry
                            />
                            {errorMessageCode && (
                                <CustomText
                                    style={{
                                        paddingLeft: 5,
                                        fontWeight: 500,
                                        color: colors.warning,
                                    }}
                                >
                                    {getErrorMessageByErrorCode(errorMessageCode)}
                                </CustomText>
                            )}
                        </View>
                        <CustomButton
                            title="변경하기"
                            onPress={handleChangePasswordPress}
                            disabled={buttonDisabled}
                        />
                    </>
                )}
            </ScreenLayout>
        </KeyboardDismissSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    logo: {
        marginBottom: 25,
    },
    inputContainer: {
        marginBottom: 30,
        gap: 15,
    },
    policyContainer: {
        marginTop: 10,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    policyTextContainer: {
        alignItems: 'center',
        gap: 5,
    },
    policyTitle: {
        fontSize: 14,
    },
    policy: {
        fontSize: 14,
    },
    policyLink: {
        fontWeight: 600,
        textDecorationLine: 'underline',
    },
});

export default ChangePasswordScreen;
