import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { OpenSourceDataType } from '../../openSource';

// setting
export type SettingStackParamList = {
    SettingScreen: undefined;

    UserProfileEditScreen: undefined;
    UserProfileInitializeScreen: undefined;

    ReminderScreen: undefined;
    NotificationSettingScreen: undefined;
    AppThemeSettingScreen: undefined;

    OpenSourceScreen: undefined;
    OpenSourceDetailScreen: { data: OpenSourceDataType };

    ChangePasswordScreen: { email: string; token?: string; isDeepLink?: boolean };
};

export type SettingScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'SettingScreen'
>;
export type SettingScreenRouteProps = RouteProp<SettingStackParamList, 'SettingScreen'>;

// user
export type UserProfileEditScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'UserProfileEditScreen'
>;
export type UserProfileEditScreenRouteProps = RouteProp<
    SettingStackParamList,
    'UserProfileEditScreen'
>;

export type UserProfileInitializeScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'UserProfileInitializeScreen'
>;
export type UserProfileInitializeScreenRouteProps = RouteProp<
    SettingStackParamList,
    'UserProfileInitializeScreen'
>;

// notification (푸시알림 설정)
export type ReminderScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'ReminderScreen'
>;
export type ReminderScreenRouteProps = RouteProp<SettingStackParamList, 'ReminderScreen'>;

export type NotificationSettingScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'NotificationSettingScreen'
>;
export type NotificationSettingScreenRouteProps = RouteProp<
    SettingStackParamList,
    'NotificationSettingScreen'
>;

// app theme

export type AppThemeSettingScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'AppThemeSettingScreen'
>;
export type AppThemeSettingScreenRouteProps = RouteProp<
    SettingStackParamList,
    'AppThemeSettingScreen'
>;

// open source
export type OpenSourceScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'OpenSourceScreen'
>;
export type OpenSourceScreenRouteProps = RouteProp<SettingStackParamList, 'OpenSourceScreen'>;

export type OpenSourceDetailScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'OpenSourceDetailScreen'
>;
export type OpenSourceDetailScreenRouteProps = RouteProp<
    SettingStackParamList,
    'OpenSourceDetailScreen'
>;

// change password
export type ChangePasswordScreenNavigationProps = NativeStackNavigationProp<
    SettingStackParamList,
    'ChangePasswordScreen'
>;
export type ChangePasswordScreenRouteProps = RouteProp<
    SettingStackParamList,
    'ChangePasswordScreen'
>;
