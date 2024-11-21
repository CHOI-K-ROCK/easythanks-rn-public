import React from 'react';

import { ColorValue, StyleSheet, ViewStyle } from 'react-native';
import CustomText from 'components/common/CustomText';
import VectorIcon, { iconProviderType } from 'components/common/VectorIcon';

import useCustomTheme from 'hooks/useCustomTheme';
import useDimensions from 'hooks/useDimensions';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';

type Props = {
    tabName: string;

    iconName: string;
    iconProvider?: iconProviderType;
    size?: number;

    isActive: boolean;
    activeColor?: ColorValue;
    inactiveColor?: ColorValue;

    containerStyle?: ViewStyle;
    onPress: () => void;
};

//! deprecated
const MainTabBarButton = (props: Props) => {
    const { colors } = useCustomTheme();
    const { wp } = useDimensions();

    const {
        tabName,

        iconName,
        iconProvider,
        size = 30,

        isActive,
        activeColor = colors.tabBarIconActive,
        inactiveColor = colors.tabBarIconInactive,

        containerStyle,
        onPress,
    } = props;

    const iconColor = isActive ? activeColor : inactiveColor;
    const textColor = isActive ? colors.text : colors.tabBarIconInactive;

    return (
        <PushAnimatedPressable
            onPress={onPress}
            style={[styles.container, containerStyle]}
            scale={0.97}
        >
            <VectorIcon
                name={iconName}
                color={iconColor}
                size={size}
                iconProvider={iconProvider}
                style={{ marginBottom: wp(1) }}
            />
            <CustomText
                style={{
                    color: textColor,
                    fontSize: 12,
                    fontWeight: isActive ? 500 : undefined,
                }}
            >
                {tabName}
            </CustomText>
        </PushAnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});

export default MainTabBarButton;
