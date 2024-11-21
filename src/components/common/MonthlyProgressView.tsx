import React, { useMemo } from 'react';

import { FlatList, StyleSheet, View } from 'react-native';
import CustomText from './CustomText';

import useCustomTheme from 'hooks/useCustomTheme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { convertPostMonthlyOverviewToArray } from 'utils/data';

type Props = {
    data: { [day: string]: boolean };
};

const MonthlyProgressView = (props: Props) => {
    const { data: raw } = props;
    const data = convertPostMonthlyOverviewToArray(raw);

    const curDate = new Date();
    curDate.setDate(1); // 현재 달의 첫째 날로 설정

    const startDay = curDate.getDay(); // 첫날 요일
    const endDay = 7 * 5 - (startDay + (data ? data.length : 0)); // 그리드의 총 셀 수에서 시작 요일과 데이터 길이를 뺀 값

    const todayIndexOfProgessView = new Date().getDate() + startDay - 1;

    const dataArrayIncludeFill = useMemo(() => {
        const startFillArray = new Array(startDay).fill(null); // 첫째 날 앞의 빈 셀
        const endFillArray = new Array(endDay).fill(null); // 마지막 날 뒤의 빈 셀

        // startFillArray, data, endFillArray를 하나의 배열로 합침
        const concatArr = [] as (null | boolean)[];

        return concatArr.concat(startFillArray, data, endFillArray); // length -> 35
    }, [data, endDay, startDay]);

    //flatlist

    const _renderItem = ({ item, index }: { item: boolean | null; index: number }) => {
        if (item === null) {
            return <ProgressSquare active={false} backgroundColor={'transparent'} />;
            // 전 / 후월 빈공간
        }
        return <ProgressSquare active={item} highlighted={index === todayIndexOfProgessView} />;
    };

    return (
        <FlatList
            data={dataArrayIncludeFill}
            renderItem={_renderItem}
            keyExtractor={(_, index) => index.toString()}
            numColumns={7} // 일주일 기준
            style={styles.gridGap}
            columnWrapperStyle={styles.gridGap}
            ListHeaderComponent={<WeekIndicator currentDay={curDate.getDay()} />}
            ListHeaderComponentStyle={styles.listHeaderStyle}
            scrollEnabled={false} // nesting 시 오류 메시지 처리
        />
    );
};

const styles = StyleSheet.create({
    gridGap: {
        gap: 5,
        marginBottom: 5,
    },
    listHeaderStyle: {
        marginBottom: 5,
    },
});

// deps Component
const ProgressSquare = React.memo(
    (props: {
        active: boolean;
        tintColor?: string;
        backgroundColor?: string;
        highlighted?: boolean;
    }) => {
        const { colors, dark } = useCustomTheme();

        const {
            active,
            backgroundColor = colors.selectorBackground,
            tintColor = colors.mainColor,
            highlighted,
        } = props;

        const animatedStyle = useAnimatedStyle(() => {
            return {
                opacity: withTiming(active ? 1 : 0),
            };
        }, [active]);

        return (
            <View
                style={[
                    {
                        backgroundColor: backgroundColor,
                        borderColor: dark ? colors.text : colors.TAN[700],
                    },
                    progressSquareStyles.square,
                    highlighted && progressSquareStyles.highlighted,
                ]}
            >
                <Animated.View
                    style={[
                        { backgroundColor: tintColor },
                        progressSquareStyles.checker,
                        animatedStyle,
                    ]}
                />
            </View>
        );
    }
);

const progressSquareStyles = StyleSheet.create({
    square: {
        width: 15,
        borderRadius: 3,
        aspectRatio: 1,
        overflow: 'hidden',
    },
    highlighted: {
        borderWidth: 2,
    },
    checker: {
        flex: 1,
        opacity: 0,
    },
});

const WeekIndicator = React.memo((props: { currentDay: number }) => {
    const { colors } = useCustomTheme();

    const { currentDay } = props;

    const WEEK_STRING = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <View style={weekIndicatorStyles.wrapper}>
            {WEEK_STRING.map((week, idx) => {
                const isCurrentDay = idx === currentDay;

                return (
                    <View style={weekIndicatorStyles.textWrapper} key={week}>
                        <CustomText
                            style={[
                                {
                                    color: isCurrentDay ? colors.text : colors.subtitle,
                                    fontWeight: isCurrentDay ? 600 : 400,
                                },
                                weekIndicatorStyles.text,
                            ]}
                        >
                            {week}
                        </CustomText>
                    </View>
                );
            })}
        </View>
    );
});

const weekIndicatorStyles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        gap: 5,
    },
    textWrapper: {
        width: 15,
        borderRadius: 3,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
    },
});

export default React.memo(MonthlyProgressView);
