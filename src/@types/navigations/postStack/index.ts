import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ComposeStackParamList } from '../composeStack';

// auth
export type PostStackParamList = {
    PostDetailScreen: { postId: string };

    TodayPostsScreen: undefined;
    MonthlyPostsScreen: undefined;
    CurrentMonthlyPostsScreen: undefined;
    LookUpPostScreen: LookUpPostScreenRouteParams;

    ComposeStack: NavigatorScreenParams<ComposeStackParamList>;
};

export type LookUpPostScreenRouteParams = {
    title: string;
    monthChangeable?: boolean;

    beginDate: number;
    endDate: number;

    ascending?: boolean;
    usePagination?: boolean;
    pagePerLoad?: number;

    goBackOnPostEmpty?: boolean;
};

export type LookUpPostScreenNavigationProps = NativeStackNavigationProp<
    PostStackParamList,
    'LookUpPostScreen'
>;
export type LookUpPostScreenRouteProps = RouteProp<PostStackParamList, 'LookUpPostScreen'>;

export type PostDetailScreenNavigationProps = NativeStackNavigationProp<
    PostStackParamList,
    'PostDetailScreen'
>;
export type PostDetailScreenRouteProps = RouteProp<PostStackParamList, 'PostDetailScreen'>;
