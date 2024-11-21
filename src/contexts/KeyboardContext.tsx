import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

type KeyboardContextType = {
    keyboardHeight: number;
    isShow: boolean;
    dismiss: () => void;
};

const KeyboardContext = createContext<KeyboardContextType>({
    keyboardHeight: 0,
    isShow: false,
    dismiss: () => { },
});

const KeyboardContextProvider = ({ children }: { children: ReactNode }) => {
    const IS_IOS = Platform.OS === 'ios';

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isShow, setIsShow] = useState(false);

    const dismiss = Keyboard.dismiss;

    useEffect(() => {
        const onKeyboardShow = (e: KeyboardEvent) => {
            setKeyboardHeight(e.endCoordinates.height);
            setIsShow(true);
        };

        const onKeyboardHide = () => {
            setKeyboardHeight(0);
            setIsShow(false);
        };

        const showSubscription = Keyboard.addListener(
            IS_IOS ? 'keyboardWillShow' : 'keyboardDidShow',
            onKeyboardShow
        );
        const hideSubscription = Keyboard.addListener(
            IS_IOS ? 'keyboardWillHide' : 'keyboardDidHide',
            onKeyboardHide
        );

        // 두 이벤트 리스너 사용 -> ios, aos 공통 사용을 위해
        // ~~~WillShow - ios 에서만 동작
        // isShow 의 변경 반응속도 차이가 있어 두

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [IS_IOS]);

    return (
        <KeyboardContext.Provider value={{ keyboardHeight, isShow, dismiss }}>
            {children}
        </KeyboardContext.Provider>
    );
};

export { KeyboardContext, KeyboardContextProvider };
