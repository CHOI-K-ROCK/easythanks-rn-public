import React from 'react';
import { AppRegistry, Platform } from 'react-native';

import App from './App';

import { name as appName } from './app.json';

import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { onMessageReceived } from 'utils/notification';

// 푸시 알림 등록 (background)
messaging().setBackgroundMessageHandler(async msg => {
    await onMessageReceived(msg);
    console.log('onMessageReceived background');
});

// foreground 푸시 알림 등록은 app.tsx에서 처리

notifee.onBackgroundEvent(async ({ type }) => {
    // 백그라운드 이벤트 경고 메시지 처리

    switch (type) {
        case EventType.DISMISSED:
            console.log('dismissed');
            break;
        case EventType.PRESS:
            console.log('press');
            break;
    }
});

const HeadlessCheck = ({ isHeadless }) => {
    console.log('isHeadless', isHeadless);
    // headless = React 메인 컴포넌트와 별도로 실행하여 백그라운드 동작시 루트 컴포넌트를 실행하지 않고
    // 백그라운드 핸들러를 실행시킴

    // 안드로이드에서는 기본적으로 설정되어 있지만, ios 에서는 설정되어 있지 않아 appDelegate.mm 에서 initialProps 를 설정하여
    // 루트 컴포넌트를 실행시키지 않도록 설정함.

    if (isHeadless) {
        return null;
    }
    return <App />;
};

AppRegistry.registerComponent(appName, () => (Platform.OS === 'ios' ? HeadlessCheck : App));
