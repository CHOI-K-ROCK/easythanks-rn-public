import React from 'react';

import { View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NativeStackNavigatorProps } from 'react-native-screens/lib/typescript/native-stack/types';

import useCustomTheme from 'hooks/useCustomTheme';

const Stack = createNativeStackNavigator();

// android 화면 전환 시 하얀색 배경 노출되는 문제 처리를 위한 컴포넌트
const CustomStackNavigator = (props: NativeStackNavigatorProps) => {
    const { colors } = useCustomTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
            <Stack.Navigator {...props} />
        </View>
    );
};

export default CustomStackNavigator;
