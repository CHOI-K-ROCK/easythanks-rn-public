import React from 'react';

import AuthScreen from 'screens/auth/AuthScreen';
import EmailSignInScreen from 'screens/auth/EmailSignInScreen';
import EmailSignUpScreen from 'screens/auth/EmailSignUpScreen';
import EmailResendScreen from 'screens/auth/EmailResendScreen';
import ForgotPasswordScreen from 'screens/auth/ForgotPasswordScreen';
import ChangePasswordScreen from 'screens/auth/ChangePasswordScreen';

import CustomStackNavigator from 'components/navigation/CustomStackNavigator';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <CustomStackNavigator
            initialRouteName="LoginScreen"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="AuthScreen"
                component={AuthScreen}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="EmailSignInScreen" component={EmailSignInScreen} />
            <Stack.Screen name="EmailSignUpScreen" component={EmailSignUpScreen} />
            <Stack.Screen name="EmailResendScreen" component={EmailResendScreen} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        </CustomStackNavigator>
    );
};

export default AuthStack;
