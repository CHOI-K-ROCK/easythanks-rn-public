import { NavigatorScreenParams } from '@react-navigation/native';
import { SettingStackParamList } from '../settingStack';
import { ComposeStackParamList } from '../composeStack';
import { PostStackParamList } from '../postStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Root
export type MainStackParamList = {
    ComposeStack: NavigatorScreenParams<ComposeStackParamList>;
    BottomSheetComposeStack: NavigatorScreenParams<ComposeStackParamList>;
    SettingStack: NavigatorScreenParams<SettingStackParamList>;
    PostStack: NavigatorScreenParams<PostStackParamList>;
};

// Main Tab
export type MainTabParamList = {
    MainScreen: undefined;
    PostScreen: undefined;
};

export type MainStackNavigationProps = NativeStackNavigationProp<MainStackParamList>;
