import React from 'react';

import ComposeScreen from 'screens/compose/ComposeScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditLocationScreen from 'screens/compose/EditLocationScreen';

import CustomStackNavigator from 'components/navigation/CustomStackNavigator';

const Stack = createNativeStackNavigator();

const ComposeStack = () => {
    return (
        <CustomStackNavigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ComposeScreen" component={ComposeScreen} />
            <Stack.Screen name="EditLocationScreen" component={EditLocationScreen} />
        </CustomStackNavigator>
    );
};

export default ComposeStack;
