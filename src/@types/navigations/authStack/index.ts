import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// auth
export type AuthStackParamList = {
    AuthScreen: undefined;
    EmailSignInScreen: undefined;
    EmailSignUpScreen: undefined;
    EmailResendScreen: undefined;
    ForgotPasswordScreen: undefined;
    ChangePasswordScreen: undefined;
};

export type AuthScreenNavigationProps = NativeStackNavigationProp<AuthStackParamList, 'AuthScreen'>;
export type AuthScreenRouteProps = RouteProp<AuthStackParamList, 'AuthScreen'>;

export type EmailSignInScreenNavigationProps = NativeStackNavigationProp<
    AuthStackParamList,
    'EmailSignInScreen'
>;
export type EmailSignInScreenRouteProps = RouteProp<AuthStackParamList, 'EmailSignInScreen'>;

export type EmailSignUpScreenNavigationProps = NativeStackNavigationProp<
    AuthStackParamList,
    'EmailSignUpScreen'
>;

export type EmailResendScreenNavigationProps = NativeStackNavigationProp<
    AuthStackParamList,
    'EmailResendScreen'
>;
export type EmailResendScreenRouteProps = RouteProp<AuthStackParamList, 'EmailResendScreen'>;

export type EmailSignUpScreenRouteProps = RouteProp<AuthStackParamList, 'EmailSignUpScreen'>;

export type ChangePasswordScreenNavigationProps = NativeStackNavigationProp<
    AuthStackParamList,
    'ChangePasswordScreen'
>;
export type ChangePasswordScreenRouteProps = RouteProp<AuthStackParamList, 'ChangePasswordScreen'>;

export type ForgotPasswordScreenNavigationProps = NativeStackNavigationProp<
    AuthStackParamList,
    'ForgotPasswordScreen'
>;
export type ForgotPasswordScreenRouteProps = RouteProp<AuthStackParamList, 'ForgotPasswordScreen'>;
