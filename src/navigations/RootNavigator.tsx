import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import MainStack from './MainStack';
import AuthStack from './AuthStack';

import LoadingProvider from 'components/provider/LoadingProvider';
import OverlayProvider from 'components/provider/OverlayProvider';
import ToastProvider from 'components/provider/ToastProvider';

import { KeyboardContextProvider } from 'contexts/KeyboardContext';
import { PermissionProvider } from 'contexts/PermissionContext';

import { customTheme } from 'hooks/useCustomTheme';

import { useRecoilValue } from 'recoil';
import { isSignedAtom } from 'states/system';

import { linking } from 'utils/linking';

// app.tsx - 초기 앱 설정 및 fcm 관리
// RootNavigator - context / navigation 관리

const RootNavigator = () => {
    const isDark = useColorScheme() === 'dark';
    const theme = isDark ? customTheme.dark : customTheme.light;

    const isSigned = useRecoilValue(isSignedAtom);

    return (
        <NavigationContainer theme={theme} linking={linking}>
            <KeyboardContextProvider>
                <PermissionProvider>
                    {isSigned ? <MainStack /> : <AuthStack />}

                    {/* Overlay Providers */}
                    <OverlayProvider />
                    <ToastProvider />
                    <LoadingProvider />
                </PermissionProvider>
            </KeyboardContextProvider>
        </NavigationContainer>
    );
};

export default RootNavigator;
