import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';
import useCustomTheme from 'hooks/useCustomTheme';
import Animated, { withTiming } from 'react-native-reanimated';
import CustomButton from 'components/common/CustomButton';

type Props = {
    onPressBackToLogin: () => void;
    type: 'signUp' | 'forgotPassword';
};

const EmailSentCompleteView = (props: Props) => {
    const { colors } = useCustomTheme();

    const { onPressBackToLogin, type } = props;

    const appearAnimation = useCallback(() => {
        'worklet';

        const animations = {
            opacity: withTiming(1, { duration: 200 }),
            transform: [{ translateY: withTiming(0, { duration: 300 }) }],
        };
        const initialValues = {
            opacity: 0,
            transform: [{ translateY: 20 }],
        };

        return { animations, initialValues };
    }, []);

    return (
        <View>
            <Animated.View style={styles.emailSentContainer} entering={appearAnimation}>
                <VectorIcon name="check" size={40} color={'#FFF'} style={styles.checkIcon} />
                <View style={styles.titleContainer}>
                    <CustomText style={styles.title}>{MESSAGE[type].title}</CustomText>
                    <CustomText style={styles.title}>{MESSAGE[type].content}</CustomText>
                    <CustomText style={[{ color: colors.subtitle }, styles.subtitle]}>
                        {'인증메일을 받지 못하신 경우 스팸함을 확인해 주세요.'}
                    </CustomText>
                </View>
            </Animated.View>

            <View style={styles.buttonContainer}>
                <CustomButton title="확인" onPress={onPressBackToLogin} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    emailSentContainer: {
        gap: 10,
    },
    checkIcon: {
        marginBottom: 20,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 100,
        alignSelf: 'center',
    },
    titleContainer: {
        gap: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 600,
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 10,
        fontWeight: 500,
    },
    buttonContainer: {
        alignSelf: 'stretch',
    },
});

const MESSAGE = {
    signUp: {
        title: '작성해주신 이메일로 인증 메일을 보냈습니다.',
        content: '인증 메일의 링크를 눌러 회원 등록을 마무리해주세요.',
    },
    forgotPassword: {
        title: '작성해주신 이메일로 비밀번호 변경 메일을 보냈습니다.',
        content: '인증 메일의 링크를 눌러 비밀번호를 변경해주세요.',
    },
};

export default EmailSentCompleteView;
