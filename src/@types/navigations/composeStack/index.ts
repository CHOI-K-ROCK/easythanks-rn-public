import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PostDataType } from 'types/models/post';

// Compose
export type ComposeStackParamList = {
    ComposeScreen: { initialData?: PostDataType };
    EditLocationScreen: undefined;
};

export type ComposeScreenNavigationProps = NativeStackNavigationProp<
    ComposeStackParamList,
    'ComposeScreen'
>;
export type ComposeScreenRouteProps = RouteProp<ComposeStackParamList, 'ComposeScreen'>;

export type EditLocationScreenNavigationProps = NativeStackNavigationProp<
    ComposeStackParamList,
    'EditLocationScreen'
>;
export type EditLocationScreenRouteProps = RouteProp<ComposeStackParamList, 'EditLocationScreen'>;
