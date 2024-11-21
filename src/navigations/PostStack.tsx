import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostDetailScreen from 'screens/post/PostDetailScreen';
import LookUpPostsScreen from 'screens/post/LookUpPostsScreen';
import CustomStackNavigator from 'components/navigation/CustomStackNavigator';

const Stack = createNativeStackNavigator();

const PostStack = () => {
    // 포스트 디테일 - 컴포즈 스택(컴포즈 , 위치 수정 / 검색)

    return (
        <CustomStackNavigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
            <Stack.Screen name="LookUpPostScreen" component={LookUpPostsScreen} />
        </CustomStackNavigator>
    );
};

export default PostStack;
