import React, { ReactElement } from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import VectorIcon from 'components/common/VectorIcon';
import HorizontalDivider from 'components/common/HorizontalDivider';

import useDimensions from 'hooks/useDimensions';
import useCustomTheme from 'hooks/useCustomTheme';

import { HORIZONTAL_GAP } from 'constants/style';
import { commonStyles } from 'styles';

type Props = {
    screenTitle: string;
    goBack?: () => void;
    isVisibleGoBack?: boolean;

    leftComponent?: ReactElement;
    rightComponent?: ReactElement;
};

const InnerNavigationBar = (props: Props) => {
    const { hp, wp } = useDimensions();
    const { colors } = useCustomTheme();
    const { screenTitle, goBack, isVisibleGoBack = true, leftComponent, rightComponent } = props;

    return (
        <View style={{ zIndex: 1 }}>
            <View style={[{ backgroundColor: colors.mainBackground }, styles.container]}>
                {/* 스크린 타이틀 */}
                <View style={[styles.screenTitleContainer]} pointerEvents="none">
                    <CustomText numberOfLines={1} style={styles.screenTitle}>
                        {screenTitle}
                    </CustomText>
                </View>

                {/* 좌우 컴포넌트 */}
                <View>
                    {leftComponent && <View>{leftComponent}</View>}
                    {goBack && isVisibleGoBack && (
                        <PushAnimatedPressable onPress={goBack} style={styles.goBackBtnContainer}>
                            <VectorIcon name={'chevron-left'} size={20} color={colors.text} />
                            <CustomText style={styles.goBackBtnText}>뒤로</CustomText>
                        </PushAnimatedPressable>
                    )}
                </View>

                {rightComponent && <View style={{ alignItems: 'flex-end' }}>{rightComponent}</View>}
            </View>

            <HorizontalDivider
                style={styles.divider}
                color={colors.divider}
                width={wp(100) - HORIZONTAL_GAP * 2}
                height={2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 15,
    },
    goBackBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goBackBtnText: {
        fontSize: 15,
        fontWeight: 600,
    },
    screenTitleContainer: {
        ...StyleSheet.absoluteFillObject,
        ...commonStyles.centered,
    },
    screenTitle: {
        fontSize: 19,
        fontWeight: 600,

        maxWidth: '60%',
    },
    divider: {
        alignSelf: 'center',
    },
});

export default InnerNavigationBar;
