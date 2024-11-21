import React from 'react';

import { StyleSheet, View } from 'react-native';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';

import useCustomTheme from 'hooks/useCustomTheme';

import { commonStyles } from 'styles';

type Props = {
    onPressShortcut: () => void;
};

const ReminderPermissionCautionView = (props: Props) => {
    const { colors } = useCustomTheme();

    const { onPressShortcut } = props;

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View>
                    <VectorIcon name="alert" color={colors.caution} size={30} />
                </View>
                <View>
                    <CustomText style={styles.title}>{'알림이 허용되어 있지 않습니다!'}</CustomText>
                    <CustomText>
                        {'허용되어 있지 않으면 리마인더를 보내드릴 수 없어요🥲'}
                    </CustomText>
                    <CustomText>{'바로가기를 눌러 알림을 활성화 해주세요!'}</CustomText>
                </View>
            </View>

            <PushAnimatedPressable style={styles.shortcutWrapper} onPress={onPressShortcut}>
                <CustomText style={styles.shortcutText}>{'바로가기'}</CustomText>
                <VectorIcon name="chevron-right" />
            </PushAnimatedPressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
    },
    title: {
        fontWeight: 600,
        fontSize: 16,
        marginBottom: 5,
    },
    content: {
        fontSize: 15,
    },
    shortcutWrapper: {
        ...commonStyles.rowCenter,
        alignSelf: 'flex-end',
    },
    shortcutText: {
        fontWeight: 500,
        fontSize: 15,
    },
});

export default ReminderPermissionCautionView;
