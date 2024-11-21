import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomText from 'components/common/CustomText';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import CustomButton from 'components/common/CustomButton';
import HorizontalDivider from 'components/common/HorizontalDivider';
import CustomTextInput from 'components/common/CustomTextInput';
import KeyboardDismissSafeAreaView from 'components/common/KeyboardDismissSafeAreaView';
import ScreenLayout from 'components/common/ScreenLayout';
import Logo from 'components/common/Logo';

import { EmailSignInScreenNavigationProps } from 'types/navigations/authStack';

import useCustomTheme from 'hooks/useCustomTheme';
import useInput from 'hooks/useInput';
import useAuth from 'hooks/useAuth';
import useLoading from 'hooks/useLoading';

import { getErrorMessageByErrorCode, checkValidateEmail } from 'utils/string';

const EmailSignInScreen = () => {
    const navigation = useNavigation<EmailSignInScreenNavigationProps>();

    const { colors } = useCustomTheme();
    const { emailLogin } = useAuth();

    const { isLoading, setLoading } = useLoading();

    const [errorMessageCode, setErrorMessageCode] = useState<string | null>(null);

    const { value: email, handleChange: setEmail, clearValue: clearEmail } = useInput('');
    const { value: password, handleChange: setPassword, clearValue: clearPassword } = useInput('');

    const handleSignInPress = async () => {
        // input 유효성 검사
        const emailValidate = checkValidateEmail(email);

        if (emailValidate !== null) {
            setErrorMessageCode(emailValidate);
            return;
        }

        // 로그인 로직
        try {
            setLoading(true);
            await emailLogin(email, password);
        } catch (error: any) {
            // 로그인 실패 시 에러 메시지 처리
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

    // navigation
    const toEmailSignUpScreen = () => {
        navigation.navigate('EmailSignUpScreen');
    };

    const toForgotPasswordScreen = () => {
        navigation.navigate('ForgotPasswordScreen');
    };

    const toResendEmailScreen = () => {
        navigation.navigate('EmailResendScreen');
    };

    return (
        <KeyboardDismissSafeAreaView keyboardAvoiding>
            <InnerNavigationBar screenTitle="이메일 로그인" goBack={navigation.goBack} />
            <ScreenLayout style={styles.container}>
                {/* 로고 */}
                <Logo style={styles.logo} />

                <View style={styles.inputContainer}>
                    <CustomTextInput
                        placeholder="이메일"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={onEmailChange}
                        onPressClear={onEmailClear}
                        clearButton
                    />
                    <CustomTextInput
                        placeholder="비밀번호"
                        value={password}
                        onChangeText={onPasswordChange}
                        onPressClear={clearPassword}
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
                    title="로그인"
                    onPress={handleSignInPress}
                    disabled={!email || !password || isLoading}
                />
                <HorizontalDivider style={styles.divider} />
                <CustomButton title="회원가입" onPress={toEmailSignUpScreen} />

                <View style={styles.linkContainer}>
                    <CustomText
                        style={[{ color: colors.subtitle }, styles.link]}
                        onPress={toForgotPasswordScreen}
                    >
                        {'비밀번호를 잊으셨나요?'}
                    </CustomText>
                    <CustomText
                        style={[{ color: colors.subtitle }, styles.link]}
                        onPress={toResendEmailScreen}
                    >
                        {'인증 메일을 받지 못하셨나요?'}
                    </CustomText>
                </View>
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
        marginBottom: 25,
        gap: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    divider: {
        marginVertical: 15,
    },
    linkContainer: {
        alignItems: 'center',
        marginTop: 20,
        gap: 7,
    },
    link: {
        fontSize: 14,
        fontWeight: 500,
        textDecorationLine: 'underline',
    },
});

export default EmailSignInScreen;
