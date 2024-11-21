import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';

import { version } from '../../../package.json';
import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    onPressOpenSource: () => void;
    onPressPrivacyPolicy: () => void;
    onPressTermsOfService: () => void;

    style?: StyleProp<ViewStyle>;
};

const SettingFooter = (props: Props) => {
    const { colors } = useCustomTheme();

    const { onPressOpenSource, onPressPrivacyPolicy, onPressTermsOfService, style } = props;

    const currentYear = new Date().getFullYear();
    const APP_VERSION = version;

    return (
        <View style={[styles.container, style]}>
            <CustomText style={[{ color: colors.subtitle }, styles.text]}>
                {`ⓒ ${currentYear}. KROCK All rights reserved.`}
            </CustomText>
            {/* 훅으로 앱 정보 가져올 수 있도록 개발 필요 */}
            <CustomText
                style={[{ color: colors.subtitle }, styles.text]}
            >{`ver ${APP_VERSION}`}</CustomText>

            <View style={styles.linkContainer}>
                <TouchableOpacity
                    onPress={onPressOpenSource}
                    activeOpacity={0.5}
                    style={styles.linkWrapper}
                >
                    <CustomText
                        style={[{ color: colors.subtitle }, styles.text]}
                    >{`오픈소스 라이센스`}</CustomText>
                    <VectorIcon name="chevron-right" size={14} color={colors.subtitle} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPressPrivacyPolicy}
                    activeOpacity={0.5}
                    style={styles.linkWrapper}
                >
                    <CustomText
                        style={[{ color: colors.subtitle }, styles.text]}
                    >{`개인정보 처리방침`}</CustomText>
                    <VectorIcon name="chevron-right" size={14} color={colors.subtitle} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPressTermsOfService}
                    activeOpacity={0.5}
                    style={styles.linkWrapper}
                >
                    <CustomText
                        style={[{ color: colors.subtitle }, styles.text]}
                    >{`앱 이용약관`}</CustomText>
                    <VectorIcon name="chevron-right" size={14} color={colors.subtitle} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 5,
        marginBottom: 20,
    },
    text: {
        fontSize: 12,
        fontWeight: 300,
    },
    linkContainer: {
        gap: 5,
        marginTop: 5,
    },
    linkWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default SettingFooter;
