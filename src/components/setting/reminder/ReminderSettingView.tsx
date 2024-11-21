import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import DatePicker from 'react-native-date-picker';
import WeekDaySelector from 'components/common/WeekDaySelector';
import CustomButton from 'components/common/CustomButton';

import useCustomTheme from 'hooks/useCustomTheme';

import { commonStyles } from 'styles';

type Props = {
    initialTime: Date;
    initialWeek: boolean[];

    onConfirm: (data: { time: Date; week: boolean[] }) => void;
};

const INITIAL_WEEK = [false, false, false, false, false, false, false];

const ReminderSettingView = (props: Props) => {
    const { dark } = useCustomTheme();

    const { initialTime, initialWeek, onConfirm } = props;

    const [time, setTime] = useState<Date>(initialTime || new Date());
    const [week, setWeek] = useState<boolean[]>(initialWeek || INITIAL_WEEK);

    const handleConfirm = () => {
        onConfirm({ time, week });
    };

    return (
        <View style={styles.container}>
            <CustomText style={styles.subject}>{'시간 설정'}</CustomText>
            <View style={{ alignItems: 'center' }}>
                <DatePicker
                    key={dark ? 'dark' : 'light'} // 기기테마 변경 미 반영 문제 해결
                    mode="time"
                    date={time}
                    minuteInterval={5}
                    onDateChange={setTime}
                />
            </View>

            <CustomText style={styles.subject}>{'요일 설정'}</CustomText>
            <WeekDaySelector initialValue={week} onSelect={setWeek} triggerHaptic />

            <View style={{ height: 30 }} />

            <CustomButton
                title={'완료'}
                onPress={handleConfirm}
                style={{ backgroundColor: '#000' }}
                titleStyle={{ color: '#FFF' }}
                triggerHaptic
            />
        </View>
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

export default ReminderSettingView;
