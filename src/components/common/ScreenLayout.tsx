import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { HORIZONTAL_GAP } from 'constants/style';

const ScreenLayout = (props: ViewProps) => {
    const { style, ...restProps } = props;
    return <View style={[styles.container, style]} {...restProps} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: HORIZONTAL_GAP,
        paddingBottom: 10,
    },
});

export default ScreenLayout;
