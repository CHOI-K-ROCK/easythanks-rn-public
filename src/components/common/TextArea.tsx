import React from 'react';

import { StyleProp, StyleSheet, TextStyle, View, ViewProps } from 'react-native';
import CustomText from './CustomText';

import useCustomTheme from 'hooks/useCustomTheme';

type Props = ViewProps & {
    content: string;
    textStyle?: StyleProp<TextStyle>;
};

const TextArea = (props: Props) => {
    const { colors } = useCustomTheme();

    const { content, textStyle, ...restProps } = props;

    return (
        <View style={[{ backgroundColor: colors.inputBackground }, styles.field]} {...restProps}>
            <CustomText style={[styles.text, textStyle]}>{content}</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    field: {
        minHeight: 45,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5,
    },
    text: {
        fontSize: 15,
        lineHeight: 24,
    },
});

export default TextArea;
