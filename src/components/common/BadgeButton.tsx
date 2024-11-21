import React, { useCallback } from 'react';

import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import CustomText from 'components/common/CustomText';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import VectorIcon from './VectorIcon';

import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    title: string;
    onPress?: () => void;

    icon?: string;
    iconSize?: number;
    iconColor?: string;
    iconStyle?: StyleProp<ViewStyle>;
    iconPosition?: 'left' | 'right';

    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

const BadgeButton = (props: Props) => {
    const { colors } = useCustomTheme();

    const {
        title,
        onPress,

        style,
        textStyle,

        icon,
        iconSize = 16,
        iconColor = '#FFF',
        iconStyle,
        iconPosition = 'right',
    } = props;

    const renderIcon = useCallback(() => {
        if (!icon) return null;

        return (
            <VectorIcon
                name={icon}
                size={iconSize}
                color={iconColor}
                style={[styles.icon, iconStyle]}
            />
        );
    }, [icon, iconSize, iconColor, iconStyle]);

    return (
        <PushAnimatedPressable onPress={onPress} scale={0.98} style={[styles.badge, style]}>
            {iconPosition === 'left' && icon && renderIcon()}
            <CustomText style={[{ color: colors.WHITE[50] }, styles.title, textStyle]}>
                {title}
            </CustomText>
            {iconPosition === 'right' && icon && renderIcon()}
        </PushAnimatedPressable>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 3,
        backgroundColor: '#000',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 600,
        fontSize: 12,
    },
    icon: {
        // marginRight: -5,
    },
});

export default BadgeButton;
