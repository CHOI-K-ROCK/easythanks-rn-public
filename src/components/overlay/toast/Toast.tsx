import React, { useCallback, useEffect, useState } from 'react';

import { ColorValue, Platform, StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import VectorIcon from 'components/common/VectorIcon';

import { ToastType } from 'types/models/toast';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useToast from 'hooks/useToast';
import useCustomTheme from 'hooks/useCustomTheme';
import useDelay from 'hooks/useDelay';
import useKeyboard from 'hooks/useKeyboard';

import { commonStyles } from 'styles';
import useDimensions from 'hooks/useDimensions';

const Toast = (props: ToastType & { position: number }) => {
    const { closeToast } = useToast();
    const { bottom } = useSafeAreaInsets();
    const { colors } = useCustomTheme();
    const { keyboardHeight } = useKeyboard();
    const { wp } = useDimensions();

    const delay = useDelay();

    const { type = 'common', id, text, component, duration = 2000, position } = props;

    const [visible, setVisible] = useState<boolean>(false);
    const [messageSize, setMessageSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const [layoutChecked, setLayoutChecked] = useState<boolean>(false);
    // 레이아웃 체크가 완료된 경우에 애니메이션을 재생한다.(위치 오차 문제 해결)

    // variables
    const ANIMATION_DURATION = 300;
    const EASING_BEZIER = Easing.bezier(0.25, 0.1, 0.25, 1);
    const TOAST_GAP = 5;
    const MAXIMUM_TOAST_AMOUNT = 2;

    useEffect(() => {
        const handleToast = async () => {
            setVisible(true);

            await delay(ANIMATION_DURATION);
            await delay(duration);

            setVisible(false);
            await delay(ANIMATION_DURATION);
            closeToast(id);
        };

        const removeOlderToast = async () => {
            if (position > MAXIMUM_TOAST_AMOUNT) {
                setVisible(false);
                await delay(ANIMATION_DURATION);
                closeToast(id);
            }
        };

        handleToast();
        removeOlderToast();
    }, [closeToast, duration, id, position, delay]);

    // animation

    const toastAppearHeight = Platform.select({
        ios: -bottom - keyboardHeight,
        android: -bottom - keyboardHeight - 15,
    });
    // 토스트 메시지를 상단 기준 기기 화면 높이 만큼 아래로 밀어놓았기 때문에
    // 토스트가 떠오르는데 필요한 만큼의 높이를 빼야함.
    const toastOffset = (messageSize.h + TOAST_GAP) * position;
    //  토스트 메시지 높이 + 설정한 갭 * 현재 포지션

    const animatedAppear = useAnimatedStyle(() => {
        return {
            opacity: withTiming(layoutChecked && visible ? 1 : 0, {
                duration: ANIMATION_DURATION,
                easing: EASING_BEZIER,
            }),
            transform: [
                {
                    translateY: withTiming(
                        layoutChecked && visible
                            ? toastAppearHeight! - toastOffset
                            : -keyboardHeight,
                        { duration: ANIMATION_DURATION }
                    ),
                },
            ],
        };
    }, [visible, layoutChecked, messageSize, keyboardHeight, position]);

    // handler
    const handleCloseToast = useCallback(async () => {
        setVisible(false);
        await delay(ANIMATION_DURATION);
        closeToast(id);
    }, [closeToast, delay, id]);

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: colors.toastBackground,
                    zIndex: 999,
                    bottom: 0,
                    left: wp(50) - messageSize.w / 2,
                },
                styles.container,
                commonStyles.rowCenter,
                animatedAppear,
            ]}
            onLayout={e => {
                const { height, width } = e.nativeEvent.layout;
                setMessageSize({ h: height, w: width });
                setLayoutChecked(true);
            }}
        >
            <View style={[commonStyles.rowCenter, { gap: 10 }]}>
                <ToastIcon type={type} />
                {text && <CustomText style={styles.text}>{text}</CustomText>}
                {component && component}
                <VectorIcon
                    name="close"
                    color={'#000'}
                    size={15}
                    style={styles.closeButton}
                    onPress={handleCloseToast}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        paddingLeft: 15,
        paddingRight: 10,

        paddingVertical: 8,
        borderRadius: 999,
    },
    text: {
        fontWeight: 600,
        fontSize: 15,
        color: '#FFF',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#FFF',
        borderRadius: 999,
        padding: 4,
    },
});

// deps component

const ToastIcon = ({ type }: { type: ToastType['type'] }) => {
    const { colors } = useCustomTheme();

    let name: string = '';
    let backgroundColor: ColorValue = '#000';

    switch (type) {
        case 'complete': {
            name = 'check';
            backgroundColor = colors.complete;
            break;
        }
        case 'caution': {
            name = 'exclamation';
            backgroundColor = colors.caution;
            break;
        }
        case 'error': {
            name = 'close';
            backgroundColor = colors.warning;
            break;
        }
        case 'common': {
            return <></>;
        }
    }

    return (
        <VectorIcon
            name={name}
            color={'#FFF'}
            size={17}
            style={[
                {
                    backgroundColor,
                },
                toastIconStyles.typeIcon,
            ]}
        />
    );
};

const toastIconStyles = StyleSheet.create({
    typeIcon: {
        borderRadius: 6,
        padding: 2,
    },
});

export default Toast;
