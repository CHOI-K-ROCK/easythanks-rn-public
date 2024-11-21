import React, { useState } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { handleHapticSimply } from 'utils/haptic';

type Props = {
    active: boolean;
    onChange: (active: boolean) => void;

    triggerHaptic?: boolean;
    hapticVelocity?: 'light' | 'medium' | 'heavy';
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomSwitch = (props: Props) => {
    const { active, onChange, triggerHaptic, hapticVelocity = 'medium' } = props;

    const [pressed, setPressed] = useState<boolean>(false);

    const ACTIVE_BACKGROUND_COLOR = '#000';
    const DEACTIVE_BACKGROUND_COLOR = '#aaa';
    const CIRCLE_COLOR = '#fff';

    const CIRCLE_WIDTH = 28;
    const INNER_GAP = 2;

    const SWITCH_HEIGHT = CIRCLE_WIDTH + INNER_GAP * 2;
    const SWITCH_WIDTH = 55;

    const backgroundColor = active ? ACTIVE_BACKGROUND_COLOR : DEACTIVE_BACKGROUND_COLOR;

    const handleOnChange = () => {
        triggerHaptic && handleHapticSimply(hapticVelocity);
        onChange(!active);
    };

    // animation

    const ANIMATION_DURATION = 200;
    const EASING_BEZIER = Easing.bezier(0.25, 0.1, 0.25, 1);
    const ANIMATION_CONFIG = {
        duration: ANIMATION_DURATION,
        easing: EASING_BEZIER,
    };

    const animatedSwitchColor = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(backgroundColor, ANIMATION_CONFIG),
        };
    }, [active]);

    const animatedCirclePosition = useAnimatedStyle(() => {
        const CIRCLE_TRANSLATE_X = SWITCH_WIDTH - CIRCLE_WIDTH - INNER_GAP * 2;

        return {
            transform: [
                {
                    translateX: withTiming(active ? CIRCLE_TRANSLATE_X : 0, ANIMATION_CONFIG),
                },
            ],
        };
    }, [active, pressed]);

    return (
        <AnimatedPressable
            onPress={handleOnChange}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[
                {
                    backgroundColor: backgroundColor,
                    width: SWITCH_WIDTH,
                    height: SWITCH_HEIGHT,
                    padding: INNER_GAP,
                },
                styles.rounded,
                animatedSwitchColor,
            ]}
        >
            <Animated.View
                style={[
                    {
                        backgroundColor: CIRCLE_COLOR,
                        height: CIRCLE_WIDTH,
                        width: CIRCLE_WIDTH,
                        opacity: pressed ? 0.8 : 1,
                    },
                    styles.rounded,
                    animatedCirclePosition,
                ]}
            />
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    rounded: {
        borderRadius: 999,
    },
});

export default React.memo(CustomSwitch);
