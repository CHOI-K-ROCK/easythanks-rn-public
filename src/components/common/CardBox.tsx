import React from 'react';

import { GestureResponderEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import useCustomTheme from 'hooks/useCustomTheme';

import { commonStyles } from 'styles';
import PushAnimatedPressable, { PushAnimatedPressableProps } from './PushAnimatedPressable';
import { handleHapticSimply } from 'utils/haptic';

const CardBox = (
    props: PushAnimatedPressableProps & {
        triggerHaptic?: boolean;
        hapticVelocity?: 'light' | 'medium' | 'heavy';
    }
) => {
    const { colors } = useCustomTheme();

    const { style, triggerHaptic, hapticVelocity = 'medium', onPress, ...restProps } = props;

    const _onPress = (e: GestureResponderEvent) => {
        triggerHaptic && handleHapticSimply(hapticVelocity);
        onPress && onPress(e);
    };

    return (
        <PushAnimatedPressable
            style={[
                { backgroundColor: colors.card },
                styles.container,
                style as StyleProp<ViewStyle>,
            ]}
            onPress={onPress && _onPress}
            {...restProps}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,

        ...commonStyles.dropShadow,
    },
});

export default React.memo(CardBox);
