import React from 'react';

import { StyleSheet, View } from 'react-native';
import CustomButton from 'components/common/CustomButton';
import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';
import useCustomTheme from 'hooks/useCustomTheme';

type Props = {
    lookUpDate: Date;
    handleDate?: (date: { beginDate: Date; endDate: Date }) => void;
    isNothingToLoad: boolean;
    hideChangeMonthButton?: boolean;
};

const PostReachEndMessageView = (props: Props) => {
    const { colors } = useCustomTheme();
    const { lookUpDate, handleDate, isNothingToLoad, hideChangeMonthButton } = props;

    const lookUpYear = lookUpDate.getFullYear();
    const lookUpMonth = lookUpDate.getMonth();
    const presentationalLookUpMonth = lookUpDate.getMonth() + 1;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const isVisibleNextMonth =
        lookUpYear < currentYear || (lookUpYear === currentYear && lookUpMonth < currentMonth);

    // 현재 연/월보다 탐색 연/월이 작은 경우에만 다음 월을 표시한다.
    // 현재가 24년 8월이라면 24년 9월로 이동하지 못하게끔.

    const handlePressNextMonth = () => {
        const nextDate = new Date(lookUpDate);

        nextDate.setMonth(lookUpMonth + 1);
        // month++

        if (lookUpMonth === 12 && lookUpYear < currentYear) {
            nextDate.setFullYear(lookUpYear + 1);
            // 현재 연도보다 조회 연도가 작고, 12월인 경우 year++
        }

        if (handleDate) {
            const beginDate = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1, 0, 0, 0, 0);
            const endDate = new Date(
                nextDate.getFullYear(),
                nextDate.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            handleDate({ beginDate, endDate });
        }
    };

    const handlePressPrevMonth = () => {
        const prevDate = new Date(lookUpDate);

        if (presentationalLookUpMonth === 0) {
            prevDate.setMonth(11);
            // month 가 -1이 되며 year도 -1 되므로
        } else {
            prevDate.setMonth(lookUpMonth - 1);
        }
        // month--

        if (presentationalLookUpMonth === 1) {
            prevDate.setFullYear(lookUpYear - 1);
            // 1월인 경우 year--
        }

        if (handleDate) {
            const beginDate = new Date(prevDate.getFullYear(), prevDate.getMonth(), 1, 0, 0, 0, 0);
            const endDate = new Date(
                prevDate.getFullYear(),
                prevDate.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            handleDate({ beginDate, endDate });
        }
    };

    return (
        <View style={styles.container}>
            {isNothingToLoad && (
                <View style={styles.emptyIconWrapper}>
                    <VectorIcon name={'dots-horizontal'} size={25} color={'#FFF'} />
                    <View style={styles.bubbleTail} />
                </View>
            )}
            <CustomText style={{ color: colors.subtitle }}>
                {isNothingToLoad
                    ? `${presentationalLookUpMonth}월에 작성된 글이 없어요.`
                    : '모든 글을 불러왔어요!'}
            </CustomText>
            {!hideChangeMonthButton && (
                <View style={styles.buttonContainer}>
                    <CustomButton
                        onPress={handlePressPrevMonth}
                        style={styles.button}
                        title={
                            presentationalLookUpMonth - 1 === 0
                                ? `${lookUpYear - 1}년`
                                : `${presentationalLookUpMonth - 1}월 보기`
                        }
                        titleStyle={styles.buttonText}
                        iconComponent={<VectorIcon name="chevron-left" />}
                        iconPosition="left"
                        triggerHaptic
                    />
                    {isVisibleNextMonth && (
                        <CustomButton
                            onPress={handlePressNextMonth}
                            style={styles.button}
                            title={
                                presentationalLookUpMonth + 1 === 13
                                    ? `${lookUpYear + 1}년`
                                    : `${presentationalLookUpMonth + 1}월 보기`
                            }
                            titleStyle={styles.buttonText}
                            iconComponent={<VectorIcon name="chevron-right" />}
                            triggerHaptic
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 15,
    },
    bubbleTail: {
        width: 10,
        height: 10,
        borderBottomWidth: 10,
        borderRightWidth: 10,
        borderColor: '#000',
        position: 'absolute',
        zIndex: 20,
        right: 3,
        bottom: 2,
        transform: [{ skewY: '10deg' }, { rotateZ: '-5deg' }],
    },
    emptyIconWrapper: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 999,
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
    },
    button: { paddingHorizontal: 13 },
    buttonText: { fontSize: 14 },
});

export default React.memo(PostReachEndMessageView);
