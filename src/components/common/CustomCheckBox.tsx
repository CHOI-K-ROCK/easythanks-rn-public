import React from 'react';

import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import useCustomTheme from 'hooks/useCustomTheme';
import MaskedView from '@react-native-masked-view/masked-view';
import VectorIcon from 'components/common/VectorIcon';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { handleHapticSimply } from 'utils/haptic';

type Props = {
    checked: boolean;
    onPress?: (checked: boolean) => void;
    size?: number;
    style?: StyleProp<ViewStyle>;

    triggerHaptic?: boolean;
    hapticVelocity?: 'light' | 'medium' | 'heavy';
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CustomCheckBox = (props: Props) => {
    const { colors } = useCustomTheme();
    const { checked, onPress, size = 20, style, triggerHaptic, hapticVelocity = 'medium' } = props;

    const ANIMATION_DURATION = { duration: 250 };

    const DISABLED_BACKGROUND_COLOR = colors.selectorBackground;
    const ACTIVE_BACKGROUND_COLOR = '#000';
    const ICON_COLOR = '#fff';

    const _onPress = () => {
        if (!onPress) return;

        triggerHaptic && handleHapticSimply(hapticVelocity);
        onPress(checked);
    };

    const checkAnimatedStyle = useAnimatedStyle(() => {
        const checkTransX = withTiming(checked ? 0 : -size, ANIMATION_DURATION);

        return {
            transform: [{ translateX: checkTransX }],
        };
    });

    return (
        <AnimatedTouchableOpacity
            onPress={_onPress}
            disabled={!onPress}
            style={[
                {
                    backgroundColor: checked ? ACTIVE_BACKGROUND_COLOR : DISABLED_BACKGROUND_COLOR,
                    padding: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.text + 20,
                },
                style,
            ]}
        >
            <MaskedView
                maskElement={
                    <Animated.View
                        style={[
                            {
                                ...styles.maskedViewStyle,
                            },
                            checkAnimatedStyle,
                        ]}
                    />
                }
            >
                <VectorIcon name={'check'} size={size - 2} color={ICON_COLOR} />
            </MaskedView>
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxStyle: {
        aspectRatio: 1,
        borderWidth: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    maskedViewStyle: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#000',
    },
});

export default CustomCheckBox;
