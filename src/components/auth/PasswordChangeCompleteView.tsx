import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { withTiming } from 'react-native-reanimated';
import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';
import useCustomTheme from 'hooks/useCustomTheme';
import CustomButton from 'components/common/CustomButton';

type Props = {
    onPressConfirm: () => void;
};

const PasswordChangeCompleteView = (props: Props) => {
    const { colors } = useCustomTheme();

    const { onPressConfirm } = props;

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
                    <CustomText style={styles.title}>
                        {'비밀번호 변경이 완료되었습니다.'}
                    </CustomText>
                    <CustomText style={[{ color: colors.subtitle }, styles.subtitle]}>
                        {'변경된 비밀번호로 로그인이 가능합니다.'}
                    </CustomText>
                </View>
            </Animated.View>

            <View style={styles.buttonContainer}>
                <CustomButton title="확인" onPress={onPressConfirm} />
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

export default PasswordChangeCompleteView;
