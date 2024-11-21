import React from 'react';

import { ColorValue, View, ViewStyle, StyleProp, StyleSheet } from 'react-native';

import useCustomTheme from 'hooks/useCustomTheme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Props = {
    current: number;
    max?: number;

    tintColor?: ColorValue;
    backgroundColor?: ColorValue;

    height?: number;

    style?: StyleProp<ViewStyle>;
};

const ProgressBarView = (props: Props) => {
    const { colors } = useCustomTheme();
    const {
        current,
        max = 100,

        tintColor = colors.mainColor,
        backgroundColor = colors.selectorBackground,
        height = 3,

        style,
    } = props;

    const currentWidth = Math.round((current / max) * 100);

    const animatedProgressBarStyle = useAnimatedStyle(
        () => ({
            width: withTiming(`${currentWidth}%`),
        }),
        [current]
    );

    return (
        <View style={[{ height, backgroundColor }, styles.wrapper, style]}>
            <Animated.View
                style={[
                    { height, backgroundColor: tintColor },
                    styles.progress,
                    animatedProgressBarStyle,
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        width: '100%',

        borderRadius: 999,

        overflow: 'hidden',
    },
    progress: {
        borderRadius: 999,
        zIndex: 1,
    },
});

export default React.memo(ProgressBarView);
