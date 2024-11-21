import React from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import VectorIcon from 'components/common/VectorIcon';

import { getDateStrings } from 'utils/date';

import { commonStyles } from 'styles';

import { MONTHLY_EMOJI_SET } from 'constants/string';

const ChangeLookUpDateButton = ({ date, onPress }: { date: Date; onPress: () => void }) => {
    const { year, month } = getDateStrings(date);

    return (
        <PushAnimatedPressable onPress={onPress} scale={0.98} style={styles.wrapper}>
            <View style={styles.dateWrapper}>
                <CustomText>
                    <CustomText style={styles.date}>{year}</CustomText>
                    <CustomText style={styles.text}>{'년 '}</CustomText>
                    <CustomText style={styles.date}>{month}</CustomText>
                    <CustomText style={styles.text}>{'월'}</CustomText>
                </CustomText>
                <CustomText style={styles.text}>{MONTHLY_EMOJI_SET[Number(month) - 1]}</CustomText>
            </View>

            <View style={commonStyles.rowCenter}>
                <CustomText>{'변경하기'}</CustomText>
                <VectorIcon name="chevron-right" color={'#FFF'} />
            </View>
        </PushAnimatedPressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    text: { fontSize: 16, color: '#FFF' },
    date: {
        fontSize: 24,
        fontWeight: 600,
        color: '#FFF',
    },
});

export default React.memo(ChangeLookUpDateButton);
