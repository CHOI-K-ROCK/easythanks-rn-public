import React, { useMemo } from 'react';
import { Text, Platform, StyleSheet, TextProps, TextStyle } from 'react-native';

import useCustomTheme from 'hooks/useCustomTheme';

import { convertFontWeightToFontFamily } from 'utils/fonts';
import { View } from 'react-native';

type FontWeightType = TextStyle['fontWeight'];

const CustomText = (props: TextProps) => {
    const { children, style, ...restProps } = props;
    const { colors } = useCustomTheme();

    const flattenedStyle = StyleSheet.flatten(style) || {};
    const fontWeight = flattenedStyle.fontWeight as FontWeightType;
    const fontFamilyForAndroid = useMemo(() => {
        const convertedFontWeight = '' + fontWeight; // 문자열 형변환

        return convertFontWeightToFontFamily(convertedFontWeight as FontWeightType);
    }, [fontWeight]);

    const fontStyleByOS = Platform.select({
        ios: { fontFamily: 'Pretendard', fontWeight },
        android: { fontFamily: fontFamilyForAndroid },
    });

    return (
        <Text
            style={[
                {
                    color: colors.text,
                },
                fontStyleByOS,
                style,
            ]}
            allowFontScaling={false}
            {...restProps}
        >
            {children}
        </Text>
    );
};

export default React.memo(CustomText);
