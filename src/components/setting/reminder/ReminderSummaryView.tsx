import React from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';

import useCustomTheme from 'hooks/useCustomTheme';

import { getDateStrings } from 'utils/date';

import { WEEK_DAYS } from 'constants/string';

type Props = {
    time: Date;
    week: boolean[];
};

const ReminderSummaryView = (props: Props) => {
    const { colors } = useCustomTheme();
    const { time, week } = props;

    const renderDays = () => {
        const [mon, tue, wed, thu, fri, sat, sun] = week;

        const IS_WEEKEND = !mon && !tue && !wed && !thu && !fri && sat && sun;
        const IS_WEEKDAY = mon && tue && wed && thu && fri && !sat && !sun;
        const IS_ALL_DAY = week.every(e => e === true);

        let weekString: string = '';

        if (IS_ALL_DAY) weekString = '매일';
        if (IS_WEEKEND) weekString = '주말';
        if (IS_WEEKDAY) weekString = '평일';

        if (IS_ALL_DAY || IS_WEEKEND || IS_WEEKDAY) {
            return <WarppedText>{weekString}</WarppedText>;
        }

        const filteredWeekDay = WEEK_DAYS.filter((_, idx) => {
            return week[idx];
        });

        return (
            <View style={styles.daysContainer}>
                {filteredWeekDay.map(day => {
                    return <WarppedText key={day}>{day + '요일'}</WarppedText>;
                })}
            </View>
        );
    };

    const renderTimeText = () => {
        const { hours, min, ampm } = getDateStrings(time);
        const ampmString = ampm === 'am' ? '오전' : '오후';
        const padMin = min.padStart(2, '0');

        return <WarppedText>{`${ampmString} ${hours}시 ${padMin}분`}</WarppedText>;
    };

    return (
        <View
            style={[
                {
                    backgroundColor: colors.settingBackground,
                },
                styles.container,
            ]}
        >
            <CustomText style={styles.summaryText}>{'리마인더 활성화 시'}</CustomText>
            <View>{renderDays()}</View>
            <View>{renderTimeText()}</View>
            <CustomText style={styles.summaryText}>{'에 알림을 드려요!'}</CustomText>
        </View>
    );
};

// deps component

const WarppedText = ({ children }: { children: string }) => {
    return (
        <View style={styles.textWrapper}>
            <CustomText style={styles.wrappedText}>{children}</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 5,
        gap: 5,
    },
    daysContainer: {
        flexWrap: 'wrap',
        gap: 5,
        flexDirection: 'row',
    },
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    summaryText: {
        fontSize: 15,
        fontWeight: 500,
    },

    textWrapper: {
        padding: 5,
        backgroundColor: '#000',
        borderRadius: 3,
        alignSelf: 'flex-start',
    },
    wrappedText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 600,
    },
});

export default React.memo(ReminderSummaryView);
