import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import CustomText from './CustomText';

import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    style?: StyleProp<ViewStyle>;
};

const Logo = (props: Props) => {
    const { colors } = useCustomTheme();

    const { style } = props;

    return (
        <>
            <View style={[styles.logoContainer, style]}>
                <CustomText style={[{ color: colors.mainColor }, styles.logo]}>
                    {'EasyThanks'}
                </CustomText>
                <CustomText style={styles.catch}>매일매일, 감사일기</CustomText>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 5,
    },
    catch: {
        fontSize: 14,
        fontWeight: 200,
        textAlign: 'center',
    },
});

export default Logo;
