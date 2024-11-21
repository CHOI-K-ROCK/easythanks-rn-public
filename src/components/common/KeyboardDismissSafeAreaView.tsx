import React from 'react';
import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ColorValue,
    ViewStyle,
} from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import { SafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = SafeAreaViewProps & {
    style?: ExtendedStyleProps;
    keyboardAvoiding?: boolean;
};

type ExtendedStyleProps = ViewStyle & {
    topAreaBackgroundColor?: ColorValue;
    bottomAreaBackgroundColor?: ColorValue;
};

const KeyboardDismissSafeAreaView = (props: Props) => {
    const { bottom, top } = useSafeAreaInsets();
    const { keyboardAvoiding = false, children, ...restProp } = props;

    return (
        <SafeAreaView {...restProp}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    enabled={keyboardAvoiding}
                    behavior={'padding'}
                    keyboardVerticalOffset={top}
                    style={{ flex: 1 }}
                >
                    {children}
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default KeyboardDismissSafeAreaView;
