import React, { ReactElement, useCallback } from 'react';

import {
    GestureResponderEvent,
    PressableProps,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import CustomText from 'components/common/CustomText';

import useCustomTheme from 'hooks/useCustomTheme';

import { handleHapticSimply } from 'utils/haptic';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Props = PressableProps & {
    title: string;

    iconComponent?: ReactElement;
    iconPosition?: 'left' | 'right';

    triggerHaptic?: boolean;
    hapticVelocity?: 'light' | 'medium' | 'heavy';

    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
};

const CustomButton = (props: Props) => {
    const { colors } = useCustomTheme();
    const {
        title,
        onPress,

        iconComponent,
        iconPosition = 'right',

        triggerHaptic,
        hapticVelocity = 'medium',

        style,
        titleStyle,
        ...restProps
    } = props;

    const flattenedStyle = (StyleSheet.flatten(style) as ViewStyle) || {};
    const isSettedBackgroundColor = !!flattenedStyle.backgroundColor;

    const _onPress = useCallback(
        (e: GestureResponderEvent) => {
            triggerHaptic && handleHapticSimply(hapticVelocity);
            onPress && onPress(e);
        },
        [hapticVelocity, onPress, triggerHaptic]
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(restProps.disabled ? 0.5 : 1, { duration: 100 }),
        };
    }, [restProps.disabled]);

    return (
        <Animated.View style={[animatedStyle]}>
            <PushAnimatedPressable
                scale={0.98}
                style={[
                    {
                        backgroundColor: colors.buttonBackground,
                        borderColor: colors.buttonBorder + 60,
                        // 버튼에 배경색이 설정되어 있으면 테두리 미설정.
                        borderWidth: isSettedBackgroundColor ? 0 : 2,
                    },
                    styles.container,
                    style,
                ]}
                {...restProps}
                onPress={_onPress}
            >
                {iconComponent && iconPosition === 'left' && (
                    <View style={styles.leftIconContainer}>{iconComponent}</View>
                )}
                <CustomText style={[styles.title, titleStyle]}>{title}</CustomText>
                {iconComponent && iconPosition === 'right' && (
                    <View style={styles.rightIconContainer}>{iconComponent}</View>
                )}
            </PushAnimatedPressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 45,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 500,
    },
    leftIconContainer: {
        marginRight: 4,
    },
    rightIconContainer: {
        marginLeft: 4,
    },
});

export default React.memo(CustomButton);
