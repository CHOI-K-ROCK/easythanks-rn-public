import React, { useCallback, useState } from 'react';

import {
    GestureResponderEvent,
    Pressable,
    PressableProps,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export type PushAnimatedPressableProps = PressableProps & {
    duration?: number;
    scale?: number;
    activeOpacity?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PushAnimatedPressable = (props: PushAnimatedPressableProps) => {
    const {
        children,
        duration = 100,
        scale = 0.95,
        activeOpacity = 0.7,
        style,
        onPressIn,
        onPressOut,
        ...restProps
    } = props;

    const [isPressed, setIsPressed] = useState<boolean>(false);

    const handlePressIn = useCallback(
        (e: GestureResponderEvent) => {
            setIsPressed(true);
            onPressIn && onPressIn(e);
        },
        [onPressIn]
    );
    const handlePressOut = useCallback(
        (e: GestureResponderEvent) => {
            setIsPressed(false);
            onPressOut && onPressOut(e);
        },
        [onPressOut]
    );

    const flattendStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;
    const opacity = (flattendStyle.opacity || 1) as number;

    const animatedStyle = useAnimatedStyle(() => {
        if (!restProps.onPress) {
            // onPress 이벤트 없는 경우 애니메이션 X
            return {};
        }

        return {
            opacity: isPressed
                ? withTiming(opacity * activeOpacity, { duration: 50 })
                : withTiming(opacity, { duration: 50 }),
            transform: [
                {
                    scale: isPressed
                        ? withTiming(scale, { duration })
                        : withTiming(1, { duration }),
                },
            ],
        };
    }, [isPressed, scale, duration, restProps.onPress]);

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[style, animatedStyle]}
            {...restProps}
        >
            {children}
        </AnimatedPressable>
    );
};
export default React.memo(PushAnimatedPressable);
