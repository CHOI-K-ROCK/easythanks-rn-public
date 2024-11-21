import React from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import MonthlyProgressView from 'components/common/MonthlyProgressView';
import ProgressBarView from 'components/common/ProgressBarView';
import CardBox from 'components/common/CardBox';

import useCustomTheme from 'hooks/useCustomTheme';

import { commonStyles } from 'styles';

type Props = { data: { [key: string]: boolean } };

const MainMonthlySummaryView = (props: Props) => {
    const { colors } = useCustomTheme();

    const { data } = props;
    const currentMonth = new Date().getMonth() + 1;
    const today = new Date().getDate();

    const dataArr = Object.entries(data);

    const TOTAL_DAYS_OF_CURRENT_MONTH = dataArr.length || 31;
    const TOTAL_WROTE_DIARY_LENGTH = dataArr.filter(([_, bool]) => bool).length;

    return (
        <View>
            {/* title */}
            <CustomText style={[{ color: colors.subtitle }, commonStyles.subject]}>
                이번달 한 눈에 보기!
            </CustomText>

            {/* content */}
            <CardBox style={styles.container}>
                <CustomText style={styles.monthTitle}>{`${currentMonth}월`}</CustomText>
                <ProgressBarView
                    current={TOTAL_WROTE_DIARY_LENGTH}
                    max={TOTAL_DAYS_OF_CURRENT_MONTH}
                    style={styles.progressBar}
                />

                <View style={styles.contentContainer}>
                    <View>
                        <MonthlyProgressView data={data} />
                    </View>

                    <View style={styles.summaryTextContainer}>
                        <CustomText style={styles.summaryText}>
                            <CustomText
                                style={[{ color: colors.mainColor }, styles.summaryTextHighlight]}
                            >
                                {` ${currentMonth}월 `}
                            </CustomText>
                            {'전체'}
                            <CustomText
                                style={[{ color: colors.mainColor }, styles.summaryTextHighlight]}
                            >
                                {` ${TOTAL_DAYS_OF_CURRENT_MONTH}일 `}
                            </CustomText>
                            {'중'}
                        </CustomText>
                        <CustomText style={styles.summaryText}>
                            <CustomText
                                style={[{ color: colors.mainColor }, styles.summaryTextHighlight]}
                            >
                                {` ${today}일 `}
                            </CustomText>
                            {'현재,'}
                        </CustomText>
                        <CustomText style={styles.summaryText}>
                            {'총 '}
                            <CustomText
                                style={[{ color: colors.mainColor }, styles.summaryTextHighlight]}
                            >
                                {`${TOTAL_WROTE_DIARY_LENGTH}일`}
                            </CustomText>
                            {' 감사일기를'}
                        </CustomText>
                        <CustomText style={styles.summaryText}>{`작성했어요!`}</CustomText>
                    </View>
                </View>
            </CardBox>
        </View>
    );
};

export default MainMonthlySummaryView;

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: 600,
        marginRight: 10,
        marginBottom: 10,
    },
    progressBar: {
        marginBottom: 10,
    },
    navigateToCurrentMonthWrapper: {
        opacity: 0.6,
        ...commonStyles.rowCenter,
    },
    navigateToCurrentMonth: {
        fontWeight: 500,
    },

    contentContainer: {
        flexDirection: 'row',
    },
    summaryTextContainer: {
        flex: 1,

        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 5,
    },
    summaryText: {
        fontSize: 16,
        lineHeight: 26,
    },
    summaryTextHighlight: {
        fontSize: 18,
        fontWeight: 600,
    },
    gridGap: {
        gap: 5,
    },
});
