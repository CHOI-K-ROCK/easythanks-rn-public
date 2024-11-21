import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform, Vibration } from 'react-native';

export const hapticLight = () => {
    return ReactNativeHapticFeedback.trigger('impactLight');
};
export const hapticMedium = () => {
    return ReactNativeHapticFeedback.trigger('impactMedium');
};
export const hapticHeavy = () => {
    return ReactNativeHapticFeedback.trigger('impactHeavy');
};
export const hapticNotification = () => {
    return ReactNativeHapticFeedback.trigger('notificationSuccess');
};

export const handleHapticSimply = (velocity: 'light' | 'medium' | 'heavy') => {
    switch (velocity) {
        case 'light': {
            ReactNativeHapticFeedback.trigger('impactLight');
            return;
        }
        case 'medium': {
            ReactNativeHapticFeedback.trigger('impactMedium');
            return;
        }
        case 'heavy': {
            ReactNativeHapticFeedback.trigger('impactHeavy');
            return;
        }
    }
};

// 엄밀히 말하면 햅틱은 아니나, 같은 성격으로 보여 해당 위치에 작성

export const notificationVibration = async () => {
    const PATTERN = Platform.OS === 'ios' ? [0] : [1000];

    // android -> 번갈아서 실행함.
    // wait, vibration, wait, vibration, ...

    // ios -> 대기만 설정하고, 대기가 끝난뒤 무조건 1초간 진동함
    // wait, (vibration), wait, (vibration),  wait, (vibration) ...

    Vibration.vibrate(PATTERN);
};
