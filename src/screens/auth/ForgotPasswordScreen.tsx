import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomText from 'components/common/CustomText';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CustomButton from 'components/common/CustomButton';
import CustomTextInput from 'components/common/CustomTextInput';
import KeyboardDismissSafeAreaView from 'components/common/KeyboardDismissSafeAreaView';
import ScreenLayout from 'components/common/ScreenLayout';
import EmailSentCompleteView from 'components/auth/EmailSentCompleteView';
import Logo from 'components/common/Logo';

import { ForgotPasswordScreenNavigationProps } from 'types/navigations/authStack';

import useCustomTheme from 'hooks/useCustomTheme';
import useInput from 'hooks/useInput';
import useLoading from 'hooks/useLoading';
import useToast from 'hooks/useToast';
import useKeyboard from 'hooks/useKeyboard';

import { getErrorMessageByErrorCode, checkValidateEmail } from 'utils/string';
import { handleSendPasswordResetEmail } from 'logics/auth';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<ForgotPasswordScreenNavigationProps>();
    const { colors } = useCustomTheme();
    const { setLoading, isLoading } = useLoading();
    const { openToast } = useToast();
    const { dismiss: keyboardDismiss } = useKeyboard();

    const [errorMessageCode, setErrorMessageCode] = useState<string | null>(null);
    const [isSendEmail, setIsSendEmail] = useState<boolean>(false);

    const { value: email, handleChange: setEmail, clearValue: clearEmail } = useInput('');

    const onSendPasswordResetEmail = async () => {
        // input 유효성 검사
        const emailValidate = checkValidateEmail(email);

        if (emailValidate !== null) {
            setErrorMessageCode(emailValidate);
            return;
        }

        // 비밀번호 초기화 메일 전송 로직
        try {
            keyboardDismiss();

            setLoading(true);
            // 이메일 전송
            await handleSendPasswordResetEmail(email);

            setIsSendEmail(true);
            openToast({
                text: '비밀번호 초기화 메일 전송 완료!',
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

    return (
        <KeyboardDismissSafeAreaView keyboardAvoiding>
            <InnerNavigationBar screenTitle="비밀번호 초기화" goBack={navigation.goBack} />
            <ScreenLayout style={styles.container}>
                {/* 로고 */}
                <Logo style={styles.logo} />

                {/* 메일 전송 완료 화면 */}
                {isSendEmail ? (
                    <EmailSentCompleteView
                        type="forgotPassword"
                        onPressBackToLogin={navigation.goBack}
                    />
                ) : (
                    <>
                        {/* 이메일 입력 */}
                        <View style={styles.inputContainer}>
                            <CustomTextInput
                                title="가입하신 이메일"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={onEmailChange}
                                onPressClear={onEmailClear}
                                clearButton
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
                            title="비밀번호 초기화"
                            onPress={onSendPasswordResetEmail}
                            disabled={!email || isLoading}
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
    },
});

export default ForgotPasswordScreen;
