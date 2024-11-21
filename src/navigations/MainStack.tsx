import React from 'react';

import MainScreen from 'screens/main/MainScreen';

import ComposeStack from 'navigations/ComposeStack';
import SettingStack from 'navigations/SettingStack';
import PostStack from 'navigations/PostStack';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomStackNavigator from 'components/navigation/CustomStackNavigator';

const Stack = createNativeStackNavigator();

const DISABLE_GESTURE_SCREEN_NAMES = ['UserProfileInitializeScreen'];

const MainStack = () => {
    return (
        <CustomStackNavigator
            screenOptions={({ route }: any) => {
                const screen = (route.params as any)?.screen;
                const isEnableGesture = screen
                    ? !DISABLE_GESTURE_SCREEN_NAMES.includes(screen)
                    : true;

                return {
                    headerShown: false,
                    gestureEnabled: isEnableGesture,
                };
            }}
        >
            {/* Main */}
            <Stack.Screen component={MainScreen} name="MainScreen" />

            {/* Compose */}
            <Stack.Screen
                component={ComposeStack}
                name="BottomSheetComposeStack"
                options={{
                    presentation: 'card',
                    animation: 'slide_from_bottom',
                    gestureEnabled: false,
                    animationDuration: 250,
                }}
            />
            <Stack.Screen
                component={ComposeStack}
                name="ComposeStack"
                options={{ gestureEnabled: false }}
            />

            {/* Post */}
            <Stack.Screen component={PostStack} name="PostStack" />

            {/* AppMenu */}
            <Stack.Screen component={SettingStack} name="SettingStack" />
        </CustomStackNavigator>
    );
};

export default MainStack;
