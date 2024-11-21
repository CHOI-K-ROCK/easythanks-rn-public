import React, { ReactElement, useCallback } from 'react';

import { KeyboardAvoidingView, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { Easing, withTiming } from 'react-native-reanimated';

import useCustomTheme from 'hooks/useCustomTheme';
import useDimensions from 'hooks/useDimensions';
import useKeyboard from 'hooks/useKeyboard';

import { commonStyles } from 'styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type Props = {
    backdrop?: boolean;
    onPressBackdrop?: () => void;

    children?: ReactElement;
};

const Modal = (props: Props) => {
    const { wp } = useDimensions();
    const { colors } = useCustomTheme();

    const { isShow, dismiss } = useKeyboard();

    const {
        backdrop = true,
        onPressBackdrop,

        children,
    } = props;

    // variables

    const ANIMATION_DURATION = 200;
    const EASING_BEZIER = Easing.bezier(0.25, 0.1, 0.25, 1);

    // animation

    const backdropEntering = useCallback(() => {
        'worklet';
        const animations = {
            opacity: withTiming(1, { duration: ANIMATION_DURATION, easing: EASING_BEZIER }),
        };
        const initialValues = {
            opacity: 0,
        };
        return { animations, initialValues };
    }, [EASING_BEZIER]);

    const backdropExiting = useCallback(() => {
        'worklet';
        const animations = {
            opacity: withTiming(0, { duration: ANIMATION_DURATION, easing: EASING_BEZIER }),
        };
        const initialValues = {
            opacity: 1,
        };
        return { animations, initialValues };
    }, [EASING_BEZIER]);

    const modalEntering = useCallback(() => {
        'worklet';
        const animations = {
            opacity: withTiming(1, {
                duration: ANIMATION_DURATION,
                easing: EASING_BEZIER,
            }),
            transform: [
                {
                    translateY: withTiming(0, {
                        duration: ANIMATION_DURATION,
                        easing: EASING_BEZIER,
                    }),
                },
            ],
        };
        const initialValues = {
            opacity: 0,
            transform: [{ translateY: 15 }],
        };
        return { animations, initialValues };
    }, [EASING_BEZIER]);

    const modalExiting = useCallback(() => {
        'worklet';
        const animations = {
            opacity: withTiming(0, {
                duration: ANIMATION_DURATION,
                easing: EASING_BEZIER,
            }),
            transform: [
                {
                    translateY: withTiming(15, {
                        duration: ANIMATION_DURATION,
                        easing: EASING_BEZIER,
                    }),
                },
            ],
        };
        const initialValues = {
            opacity: 1,
            transform: [{ translateY: 0 }],
        };
        return { animations, initialValues };
    }, [EASING_BEZIER]);

    // handler

    const handlePressBackdrop = useCallback(() => {
        if (isShow) {
            dismiss();
            return;
        }
        backdrop && onPressBackdrop && onPressBackdrop();
    }, [backdrop, dismiss, isShow, onPressBackdrop]);

    return (
        <Animated.View
            entering={backdropEntering}
            exiting={backdropExiting}
            style={[
                StyleSheet.absoluteFill,
                { zIndex: 999 },
                { backgroundColor: backdrop ? 'rgba(0,0,0,0.4)' : undefined },
            ]}
        >
            <KeyboardAvoidingView
                style={[StyleSheet.absoluteFill, commonStyles.centered]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <AnimatedPressable
                    style={[StyleSheet.absoluteFill]}
                    onPress={handlePressBackdrop}
                />
                <Animated.View
                    entering={modalEntering}
                    exiting={modalExiting}
                    style={[
                        {
                            width: wp(75),
                            backgroundColor: colors.mainBackground,
                        },
                        styles.container,
                    ]}
                >
                    {children}
                </Animated.View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: 320,

        padding: 15,
        borderRadius: 15,
        ...commonStyles.dropShadow,
    },
});

export default Modal;
