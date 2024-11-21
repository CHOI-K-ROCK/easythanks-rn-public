import React from 'react';

import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context';

import useCustomTheme from 'hooks/useCustomTheme';

type Props = SafeAreaViewProps & {
    topAreaBackgroundColor?: ColorValue;
    bottomAreaBackgroundColor?: ColorValue;

    withTabBar?: boolean; // tabBar와 함께 있는 경우 paddingBottom 없애기 위한 용도

    style?: StyleProp<ViewStyle>;
};

const SafeAreaView = (props: Props) => {
    const { colors } = useCustomTheme();
    const { top, left, right, bottom } = useSafeAreaInsets();
    const {
        topAreaBackgroundColor = colors.mainBackground,
        bottomAreaBackgroundColor = colors.mainBackground,
        withTabBar = false,
        style,
        ...restProps
    } = props;

    /**
     * View 이용사유
     * 스크린 전환 간에 깜빡이는 현상이 있어 View + useSafeAreaInsets 사용으로 해결
     */

    return (
        <>
            {/* 상단 SafeAreaView backgroundColor */}
            <View
                style={[
                    {
                        backgroundColor: topAreaBackgroundColor,
                        paddingTop: top,
                    },
                ]}
            />
            {/* 메인 컨텐츠 영역 backgroundColor */}
            <View
                style={[
                    {
                        backgroundColor: colors.mainBackground,
                        paddingRight: right,
                        paddingLeft: left,
                    },
                    styles.safeAreaView,
                    style,
                ]}
                {...restProps}
            />
            {/* 하단 SafeAreaView backgroundColor */}
            <View
                style={[
                    {
                        backgroundColor: bottomAreaBackgroundColor,
                        paddingBottom: withTabBar ? 0 : bottom,
                    },
                ]}
            />
        </>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
});

export default SafeAreaView;
