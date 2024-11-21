import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomText from 'components/common/CustomText';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CustomButton from 'components/common/CustomButton';
import CustomTextInput from 'components/common/CustomTextInput';
import KeyboardDismissSafeAreaView from 'components/common/KeyboardDismissSafeAreaView';
import ScreenLayout from 'components/common/ScreenLayout';
import CustomCheckBox from 'components/common/CustomCheckBox';
import EmailSentCompleteView from 'components/auth/EmailSentCompleteView';

import { EmailSignUpScreenNavigationProps } from 'types/navigations/authStack';

import useCustomTheme from 'hooks/useCustomTheme';
import useInput from 'hooks/useInput';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';
import useKeyboard from 'hooks/useKeyboard';

import { openUrl } from 'utils/linking';
import {
    getErrorMessageByErrorCode,
    checkValidateEmail,
    checkValidatePassword,
} from 'utils/string';

import { APP_POLICY_URL, PRIVATE_POLICY_URL } from 'constants/links';
import { handleEmailSignUp } from 'logics/auth';

const EmailSignUpScreen = () => {
    const navigation = useNavigation<EmailSignUpScreenNavigationProps>();
    const { colors } = useCustomTheme();
    const { setLoading, isLoading } = useLoading();
    const { openToast } = useToast();
    const { dismiss: keyboardDismiss } = useKeyboard();

    const [isAgreeToPolicies, setIsAgreeToPolicies] = useState<boolean>(false);
    const [errorMessageCode, setErrorMessageCode] = useState<string | null>(null);
    const [isSendEmail, setIsSendEmail] = useState<boolean>(false);

    const { value: email, handleChange: setEmail, clearValue: clearEmail } = useInput('');
    const { value: password, handleChange: setPassword, clearValue: clearPassword } = useInput('');
    const {
        value: confirmPassword,
        handleChange: setConfirmPassword,
        clearValue: clearConfirmPassword,
    } = useInput('');

    const signUpButtonDisabled =
        !email || !password || !confirmPassword || !isAgreeToPolicies || isLoading;

    const handleSignUpPress = async () => {
        // input 유효성 검사
        const emailValidate = checkValidateEmail(email);
        const passwordValidate = checkValidatePassword(password);

        if (emailValidate !== null) {
            setErrorMessageCode(emailValidate);
            return;
        }
        if (passwordValidate !== null) {
            setErrorMessageCode(passwordValidate);
            return;
        }
        // 회원가입 로직
        try {
            keyboardDismiss();

            setLoading(true);
            await handleEmailSignUp(email, password);

            setIsSendEmail(true);
            openToast({
                text: '인증메일 전송 완료!',
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

    const onEmailChange = (text: string) => {
        setEmail(text);
        setErrorMessageCode(null);
    };

    const onEmailClear = () => {
        clearEmail();
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

    const onPressPrivacyPolicy = () => {
        openUrl(PRIVATE_POLICY_URL);
    };
    const onPressAppPolicy = () => {
        openUrl(APP_POLICY_URL);
    };

    return (
        <KeyboardDismissSafeAreaView keyboardAvoiding>
            <InnerNavigationBar screenTitle="이메일 회원가입" goBack={navigation.goBack} />
            <ScreenLayout style={styles.container}>
                {/* 회원가입 완료 화면 */}
                {isSendEmail ? (
                    <EmailSentCompleteView type="signUp" onPressBackToLogin={navigation.goBack} />
                ) : (
                    <>
                        {/* 회원가입 입력 폼 */}
                        <View style={styles.inputContainer}>
                            <CustomTextInput
                                title="이메일"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={onEmailChange}
                                onPressClear={onEmailClear}
                                clearButton
                            />
                            <CustomTextInput
                                title="비밀번호 (영문/숫자 포함, 8자 이상)"
                                value={password}
                                onChangeText={onPasswordChange}
                                onPressClear={clearPassword}
                                clearButton
                                secureTextEntry
                            />
                            <CustomTextInput
                                title="비밀번호 확인"
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
                        <View style={styles.policyContainer}>
                            <CustomCheckBox
                                triggerHaptic
                                size={20}
                                checked={isAgreeToPolicies}
                                onPress={() => setIsAgreeToPolicies(!isAgreeToPolicies)}
                            />
                            <CustomText style={[{ color: colors.subtitle }, styles.policy]}>
                                <CustomText
                                    style={[{ color: colors.subtitle }, styles.policyLink]}
                                    onPress={onPressPrivacyPolicy}
                                >
                                    {'개인정보 처리방침'}
                                </CustomText>
                                {' 및 '}
                                <CustomText
                                    style={[{ color: colors.subtitle }, styles.policyLink]}
                                    onPress={onPressAppPolicy}
                                >
                                    {'이용약관'}
                                </CustomText>
                                {' 에 동의합니다.'}
                            </CustomText>
                        </View>
                        <CustomButton
                            title="회원가입"
                            onPress={handleSignUpPress}
                            disabled={signUpButtonDisabled}
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
    profileContainer: {
        alignItems: 'center',
    },
    profile: {
        marginBottom: 7,
    },
    profileEditButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 3,
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
    policy: {
        fontSize: 14,
    },
    policyLink: {
        fontWeight: 600,
        textDecorationLine: 'underline',
    },
});

export default EmailSignUpScreen;
