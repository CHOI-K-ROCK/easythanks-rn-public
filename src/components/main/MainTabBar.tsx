import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { commonStyles } from 'styles';
import MainTabBarButton from 'components/main/MainTabBarButton';
import MainTabBarComposeButton from 'components/main/MainTabBarComposeButton';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import useCustomTheme from 'hooks/useCustomTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticMedium } from 'utils/haptic';

//! deprecated
const MainTabBar = (props: BottomTabBarProps) => {
    const { colors } = useCustomTheme();
    const { bottom } = useSafeAreaInsets();

    const { navigation, state } = props;

    const { index } = state;

    return (
        <View
            style={[
                {
                    backgroundColor: colors.card,
                    paddingBottom: Platform.select({
                        ios: bottom,
                        android: 10,
                    }),
                },
                styles.mainTab,
            ]}
        >
            <MainTabBarButton
                tabName="메인화면"
                iconName="home"
                isActive={index === 0}
                onPress={() => {
                    hapticMedium();
                    navigation.navigate('MainScreen');
                }}
            />
            <MainTabBarComposeButton
                onPress={() => {
                    hapticMedium();
                    navigation.navigate('BottomSheetComposeStack', {
                        screen: 'ComposeScreen',
                    });
                }}
            />
            <MainTabBarButton
                tabName="지난감사"
                iconName="book"
                isActive={index === 1}
                onPress={() => {
                    hapticMedium();
                    navigation.navigate('PostScreen');
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainTab: {
        paddingTop: 10,
        paddingHorizontal: 20,

        borderRadius: 15,
        borderTopWidth: 0,

        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        ...commonStyles.dropShadow,
        shadowOffset: { height: -5, width: 0 },
    },
});

export default MainTabBar;
