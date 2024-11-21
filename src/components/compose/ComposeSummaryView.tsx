import React, { useMemo } from 'react';

import { StyleSheet, View } from 'react-native';
import BadgeButton from 'components/common/BadgeButton';
import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';

import { getDateStrings, getDayOfWeekName } from 'utils/date';
import { commonStyles } from 'styles';
import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    date: Date;

    onPressEditDate?: () => void;
    onPressEditTime?: () => void;

    // locationString?: string;
    // onPressEditLocation?: () => void;

    editable?: boolean;
};

const ComposeSummaryView = (props: Props) => {
    const { colors } = useCustomTheme();

    const {
        date,
        onPressEditDate,
        onPressEditTime,
        // locationString,
        // onPressEditLocation,
        editable,
    } = props;

    const { year, month, day, dayOfWeek, hours, min, ampm } = useMemo(
        () => getDateStrings(date),
        [date]
    );

    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <View style={styles.innerWarpper}>
                    {/* 날짜 */}
                    <CustomText style={[styles.date]}>
                        {year}년 {month}월 {day}일
                    </CustomText>
                    {/* 요일 */}
                    <CustomText style={[{ color: colors.subtitle }, styles.dayOfWeek]}>
                        {getDayOfWeekName(dayOfWeek)}요일
                    </CustomText>
                </View>
                {/* 날짜변경 */}
                {editable && (
                    <BadgeButton
                        title="수정"
                        onPress={onPressEditDate}
                        icon="calendar-outline"
                        textStyle={styles.bagedButtonTitle}
                    />
                )}
            </View>

            <View style={styles.contentWrapper}>
                <View style={styles.innerWarpper}>
                    {/* 시간 */}
                    <CustomText style={[{ color: colors.subtitle }, styles.ampm]}>
                        {ampm === 'am' ? '오전' : '오후'}
                    </CustomText>
                    <CustomText style={[styles.time]}>
                        {`${hours}시 ${min.padStart(2, '0')}분`}
                    </CustomText>
                </View>
                {/* 시간변경 */}
                {editable && (
                    <BadgeButton
                        title="수정"
                        onPress={onPressEditTime}
                        icon="clock-outline"
                        textStyle={styles.bagedButtonTitle}
                    />
                )}
            </View>

            {/* {locationString && (
                <View style={styles.loacationContainer}>
                    <View style={styles.contentWrapper}>
                        <View style={styles.locationWrapper}>
                            <VectorIcon name="map-marker" size={14} />
                            <CustomText style={styles.location}>{locationString}</CustomText>
                        </View>
                        {editable && <BadgeButton title="위치변경" onPress={onPressEditLocation} />}
                    </View>
                </View>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // gap: 8,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
    },
    innerWarpper: {
        marginRight: 5,
        ...commonStyles.rowCenter,
    },
    date: {
        fontSize: 20,
        fontWeight: 600,
    },
    dayOfWeek: {
        fontSize: 15,
        fontWeight: 600,
        marginLeft: 6,
    },
    ampm: {
        fontSize: 14,
        fontWeight: 700,
        marginRight: 4,
    },
    bagedButtonTitle: {
        marginRight: 3,
    },
    time: {
        fontSize: 17,
        fontWeight: 500,
    },
    loacationContainer: {
        marginTop: 10,
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        opacity: 0.7,
    },
});

export default ComposeSummaryView;
