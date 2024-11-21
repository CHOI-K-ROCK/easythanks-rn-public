import React, { useEffect } from 'react';

import { StyleProp, View, ViewStyle } from 'react-native';
import LinearGradientView from 'components/common/LinearGradientView';

import Animated, {
    Easing,
    StyleProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    width: number;
    height: number;
    backgroundColor: string;
    highlightColor?: string;

    style?: StyleProp<ViewStyle>;
};

const BaseSkeleton = (props: Props) => {
    const { dark } = useCustomTheme();

    const DEFAULT_HIGHLIGHT_COLOR = dark ? '#FFFFFF50' : '#00000050';

    const {
        width,
        height,
        backgroundColor,
        highlightColor = DEFAULT_HIGHLIGHT_COLOR,
        style,
    } = props;

    const duration = 1500;
    const offset = useSharedValue<number>(-width);

    useEffect(() => {
        offset.value = withRepeat(
            withDelay(200, withSequence(withTiming(width, { duration, easing: Easing.ease }))),
            -1,
            false
        );
    }, [duration, offset, width]);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
    }));

    return (
        <View
            style={[
                {
                    width,
                    height,
                    backgroundColor,
                    justifyContent: 'center',
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            <Animated.View style={[animatedStyles]}>
                <LinearGradientView
                    style={[
                        {
                            width: width,
                            height: height,
                        },
                    ]}
                    colors={['#00000000', highlightColor, highlightColor, '#00000000']}
                    locations={[0, 0.4, 0.6, 1]}
                    gradientDirection="rtl"
                />
            </Animated.View>
        </View>
    );
};

export default BaseSkeleton;
