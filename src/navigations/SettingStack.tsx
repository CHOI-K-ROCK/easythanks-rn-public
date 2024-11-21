import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingScreen from 'screens/setting/SettingScreen';
import UserProfileEditScreen from 'screens/setting/user/UserProfileEditScreen';
import ReminderScreen from 'screens/setting/reminder/ReminderScreen';
import AppThemeSettingScreen from 'screens/setting/AppThemeSettingScreen';
import OpenSourceScreen from 'screens/setting/openSource/OpenSourceScreen';
import OpenSourceDetailScreen from 'screens/setting/openSource/OpenSourceDetailScreen';
import ChangePasswordScreen from 'screens/auth/ChangePasswordScreen';
import UserProfileInitializeScreen from 'screens/setting/user/UserProfileInitializeScreen';

import CustomStackNavigator from 'components/navigation/CustomStackNavigator';

const Stack = createNativeStackNavigator();

const SettingStack = () => {
    return (
        <CustomStackNavigator
            initialRouteName="SettingScreen"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="SettingScreen" component={SettingScreen} />

            <Stack.Screen name="UserProfileEditScreen" component={UserProfileEditScreen} />
            <Stack.Screen
                name="UserProfileInitializeScreen"
                component={UserProfileInitializeScreen}
            />

            <Stack.Screen name="ReminderScreen" component={ReminderScreen} />
            <Stack.Screen name="AppThemeSettingScreen" component={AppThemeSettingScreen} />

            <Stack.Screen name="OpenSourceScreen" component={OpenSourceScreen} />
            <Stack.Screen name="OpenSourceDetailScreen" component={OpenSourceDetailScreen} />

            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        </CustomStackNavigator>
    );
};

export default SettingStack;
