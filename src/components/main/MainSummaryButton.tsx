import React from 'react';

import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import CustomText from '../common/CustomText';
import VectorIcon from '../common/VectorIcon';
import CardBox from '../common/CardBox';

import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    title: string;
    amount?: number;

    hideIndicator?: boolean;
    linkText?: string;

    thumbnail?: string[];

    backgroundComponent?: React.ReactNode;

    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

const MainSummaryButton = (props: Props) => {
    const { colors } = useCustomTheme();

    const {
        title,
        amount,
        hideIndicator = false,
        linkText = '바로가기',
        backgroundComponent,
        onPress,
        style,
    } = props;

    return (
        <CardBox style={[styles.container, style]} onPress={onPress} scale={0.98} triggerHaptic>
            {/* 썸네일이 다수 있는 경우 인터벌로 이미지 변경 추가  */}
            {backgroundComponent && (
                <View style={styles.backgroundContainer}>{backgroundComponent}</View>
            )}
            {/* 상단 인디케이터 */}
            <View style={styles.innerContainer}>
                {!hideIndicator && (
                    <View style={styles.indicatorContainer}>
                        <View style={styles.indicator}>
                            <CustomText style={styles.indicatorText}>{amount}</CustomText>
                        </View>
                    </View>
                )}

                {/* 하단 타이틀 / 바로가기 */}
                <View style={styles.bottomContainer}>
                    <View>
                        {/* 하단 타이틀 */}
                        <CustomText style={styles.titleText}>{title}</CustomText>

                        {/* 하단 바로가기 */}
                        <View style={styles.linkContainer}>
                            <CustomText style={[{ color: colors.mainColor }, styles.linkText]}>
                                {linkText}
                            </CustomText>
                            <VectorIcon
                                name="play"
                                size={15}
                                color={colors.mainColor}
                                style={styles.icon}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </CardBox>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        aspectRatio: 4 / 3,
    },
    backgroundContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden',
        zIndex: -1,
    },
    innerContainer: {
        flex: 1,
        padding: 15,
    },
    indicatorContainer: {
        alignItems: 'flex-end',
    },
    indicator: {
        aspectRatio: 1,
        padding: 5,
        margin: -5,
        backgroundColor: '#000',
        borderRadius: 100,
    },
    indicatorText: {
        fontSize: 24,
        fontWeight: 600,
        color: '#fff',
        textAlign: 'center',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 5,
        textAlign: 'right',
        lineHeight: 20,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    linkText: {
        fontSize: 12,
        fontWeight: '500',
    },
    icon: {
        marginRight: -5,
    },
});

export default React.memo(MainSummaryButton);
