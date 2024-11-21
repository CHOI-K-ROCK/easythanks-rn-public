import React, { useCallback, useEffect, useRef, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import CustomButton from 'components/common/CustomButton';
import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';
import BottomSheet from './BottomSheet';

import { commonStyles } from 'styles';
import useToast from 'hooks/useToast';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';
import { handleHapticSimply } from 'utils/haptic';

type Props = {
    date: Date;

    closeBottomSheet: () => void;
    onConfirm: (date: { beginDate: Date; endDate: Date }) => void;
};

const YearMonthSelectorBottomSheet = (props: Props) => {
    const { openToast } = useToast();

    const { closeBottomSheet, date, onConfirm } = props;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [monthMax, setMonthMax] = useState<number | undefined>(12);

    const yearRef = useRef<number>(date.getFullYear());
    const monthRef = useRef<number>(date.getMonth() + 1);
    // month의 인덱싱은 0부터, 0 -> 1월

    const openFutureCautionToast = useCallback(() => {
        openToast({ text: '지금보다 미래로 설정 할 수 없어요!', type: 'caution' });
    }, [openToast]);

    const handleChangeYear = useCallback(
        (value: number) => {
            if (value === currentYear) {
                // 연도가 현재 연도일 경우, 월 최대값을 현재 월 + 1로 설정
                setMonthMax(currentMonth + 1);
            } else {
                // 그 외의 경우, 월 최대값을 12로 설정
                setMonthMax(12);
            }

            yearRef.current = value;
        },
        [currentMonth, currentYear]
    );

    const handleChangeMonth = useCallback((value: number) => {
        monthRef.current = value;
    }, []);

    const onYearMaxReached = useCallback(() => {
        openFutureCautionToast();
    }, [openFutureCautionToast]);

    const onMonthMaxReached = useCallback(() => {
        if (yearRef.current === currentYear) {
            openFutureCautionToast();
        }
    }, [currentYear, openFutureCautionToast]);

    const handleConfirm = useCallback(() => {
        const newBeginDate = new Date(yearRef.current, monthRef.current - 1, 1, 0, 0, 0, 0);
        const newEndDate = new Date(yearRef.current, monthRef.current, 0, 23, 59, 59, 999);

        onConfirm({ beginDate: newBeginDate, endDate: newEndDate });
    }, [onConfirm]);

    const handleLookUpRecent = useCallback(() => {
        const newDate = new Date();
        const beginDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1, 0, 0, 0, 0);
        const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0, 23, 59, 59, 999);

        onConfirm({ beginDate, endDate });
    }, [onConfirm]);

    return (
        <BottomSheet closeBottomSheet={closeBottomSheet}>
            <View style={styles.main.container}>
                <View style={styles.main.titleWrapper}>
                    <CustomText style={commonStyles.subject}>{'조회 시기 설정'}</CustomText>
                    <PushAnimatedPressable
                        onPress={handleLookUpRecent}
                        style={styles.main.lookUpRecentBtn}
                    >
                        <CustomText style={styles.main.lookUpRecentBtnText}>최근글 조회</CustomText>
                        <VectorIcon name="refresh" size={15} />
                    </PushAnimatedPressable>
                </View>
                <View style={styles.main.selectorWrapper}>
                    <Selector
                        initialValue={yearRef.current}
                        maxValue={currentYear}
                        minValue={currentYear - 100}
                        unit="년"
                        minWidth={90}
                        onChange={handleChangeYear}
                        onMaxValueReached={onYearMaxReached}
                        triggerHaptic
                    />
                    <Selector
                        initialValue={monthRef.current}
                        maxValue={monthMax}
                        minValue={1}
                        unit="월"
                        minWidth={50}
                        onChange={handleChangeMonth}
                        onMaxValueReached={onMonthMaxReached}
                        triggerHaptic
                    />
                </View>

                <View style={{ height: 30 }} />

                <CustomButton
                    title={'완료'}
                    onPress={handleConfirm}
                    titleStyle={{ color: '#FFF' }}
                    style={{ backgroundColor: '#000' }}
                    triggerHaptic
                />
            </View>
        </BottomSheet>
    );
};

const Selector = ({
    initialValue,
    maxValue,
    minValue,
    unit,

    minWidth,

    onChange,
    onMaxValueReached,
    onMinValueReached,

    triggerHaptic,
    hapticVelocity = 'light',
}: {
    initialValue: number;
    maxValue?: number;
    minValue?: number;
    unit: string;

    minWidth?: number;

    onChange: (value: number) => void;
    onMaxValueReached?: () => void;
    onMinValueReached?: () => void;

    triggerHaptic?: boolean;
    hapticVelocity?: 'light' | 'medium' | 'heavy';
}) => {
    const timer = useRef<NodeJS.Timeout>();

    const [longPressed, setLongPressed] = useState<'increase' | 'decrease' | null>(null);
    const [value, setValue] = useState<number>(initialValue);

    const handleIncrease = useCallback(() => {
        triggerHaptic && handleHapticSimply(hapticVelocity);

        const prev = value;
        if (maxValue && prev >= maxValue) {
            onMaxValueReached && onMaxValueReached();
            return;
        }

        setValue(prev + 1);
    }, [hapticVelocity, maxValue, onMaxValueReached, triggerHaptic, value]);

    const handleDecrease = useCallback(() => {
        triggerHaptic && handleHapticSimply(hapticVelocity);

        const prev = value;
        if (minValue && prev <= minValue) {
            onMinValueReached && onMinValueReached();
            return;
        }

        setValue(prev - 1);
    }, [hapticVelocity, minValue, onMinValueReached, triggerHaptic, value]);

    useEffect(() => {
        if (longPressed !== null) {
            timer.current = setInterval(() => {
                longPressed === 'increase' ? handleIncrease() : handleDecrease();
            }, 50);
        } else {
            clearInterval(timer.current);
        }

        return () => clearInterval(timer.current);
    }, [handleDecrease, handleIncrease, longPressed]);

    useEffect(() => {
        if (maxValue && value > maxValue) {
            setValue(maxValue);
        }

        if (minValue && minValue > value) {
            setValue(minValue);
        }
    }, [maxValue, minValue, value]);

    useEffect(() => {
        onChange(value);
    }, [onChange, value]);

    const _onLongPress = useCallback((type: 'increase' | 'decrease') => {
        setLongPressed(type);
    }, []);
    const _onPressOut = useCallback(() => {
        setLongPressed(null);
    }, []);

    return (
        <View style={commonStyles.rowCenter}>
            <View
                style={{
                    alignItems: 'center',
                }}
            >
                <VectorIcon
                    style={styles.selector.button}
                    name="plus"
                    onPress={handleIncrease}
                    onLongPress={() => _onLongPress('increase')}
                    onPressOut={_onPressOut}
                />
                <View style={[styles.selector.valueWarpper, { minWidth }]}>
                    <CustomText style={[styles.selector.value]}>{value}</CustomText>
                </View>
                <VectorIcon
                    style={styles.selector.button}
                    name="minus"
                    onPress={handleDecrease}
                    onLongPress={() => _onLongPress('decrease')}
                    onPressOut={_onPressOut}
                />
            </View>
            <CustomText style={styles.selector.unit}>{unit}</CustomText>
        </View>
    );
};

const styles = {
    main: StyleSheet.create({
        container: {
            padding: 20,
        },
        titleWrapper: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        selectorWrapper: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
        },
        lookUpRecentBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
        },
        lookUpRecentBtnText: {
            fontWeight: 600,
        },
    }),
    selector: StyleSheet.create({
        valueWarpper: {
            paddingVertical: 10,

            backgroundColor: '#000',
            borderRadius: 5,
            marginRight: 5,
        },
        value: {
            color: '#FFF',
            fontSize: 24,
            fontWeight: 600,
            alignSelf: 'center',
        },
        unit: {
            fontSize: 16,
            fontWeight: 600,
        },
        button: {
            paddingVertical: 15,
            paddingHorizontal: 20,
        },
    }),
};

export default YearMonthSelectorBottomSheet;
