import React, { useMemo, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import BottomSheet from './BottomSheet';
import CustomText from 'components/common/CustomText';
import CustomButton from 'components/common/CustomButton';
import DatePicker from 'react-native-date-picker';

import useCustomTheme from 'hooks/useCustomTheme';

import { commonStyles } from 'styles';

type Props = {
    initialDate?: Date;

    type?: 'date' | 'time' | 'datetime' | undefined;

    closeBottomSheet: () => void;
    onConfirm: (date: Date) => void;
};

const DatePickerBottomSheet = (props: Props) => {
    const { dark } = useCustomTheme();

    const { closeBottomSheet, initialDate, type, onConfirm } = props;

    const [date, setDate] = useState<Date>(initialDate || new Date());

    const handleConfirm = () => {
        onConfirm(date);
    };

    const title = useMemo(() => {
        switch (type) {
            case 'date':
                return '날짜 설정';
            case 'time':
                return '시간 설정';
            case 'datetime':
            default:
                return '날짜 및 시간 설정';
        }
    }, [type]);

    return (
        <BottomSheet closeBottomSheet={closeBottomSheet}>
            <View style={styles.container}>
                <CustomText style={styles.subject}>{title}</CustomText>
                <View style={{ alignItems: 'center' }}>
                    <DatePicker
                        key={dark ? 'dark' : 'light'} // 기기테마 변경 미 반영 문제 해결
                        mode={type}
                        date={date}
                        onDateChange={setDate}
                    />
                </View>
                <View style={{ height: 30 }} />

                <CustomButton
                    title={'완료'}
                    onPress={handleConfirm}
                    style={{ backgroundColor: '#000' }}
                    titleStyle={{ color: '#FFF' }}
                    triggerHaptic
                />
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    subject: {
        ...commonStyles.subject,
    },
});

export default DatePickerBottomSheet;
