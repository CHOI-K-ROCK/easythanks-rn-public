import notifee, { AndroidImportance, AndroidGroupAlertBehavior } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import { notificationVibration } from './haptic';
import { Platform } from 'react-native';

export const onMessageReceived = async (message: any) => {
    console.log('message', message);

    // ios 의 경우 표준 fcm, 안드로이드의 경우 data-only 로 전달 받는다.

    // ios 의 경우 data-only 인 경우 앱이 완전히 종료된 상태에서는 fcm 메시지를 받지 못한다.

    // aos 의 경우 백그라운드에서 notification 필드가 있는 표준 fcm 데이터를 받는 경우,
    //firebase 와 onBackgroundMessage 이벤트 양쪽에서 fcm 메시지를 출력, 두개의 메시지가 전송된다.

    const title = Platform.OS === 'ios' ? message.notification.title : message.data.title;
    const body = Platform.OS === 'ios' ? message.notification.body : message.data.body;

    const channelId = await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
    });

    try {
        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                sound: 'default',
                smallIcon: 'splash-dark',
                groupId: 'easythanks-reminder',
                vibrationPattern: [300, 500],
            },
            ios: {
                sound: 'default',
            },
        });

        notificationVibration();
    } catch (e) {
        console.log('error receiving push notification', e);
    }
};

export const requestFcmToken = async () => {
    // react native firebase messaging 공식 문서 권한 체크 참고
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        const token = await messaging().getToken();
        return token;
    }

    return null;
};
