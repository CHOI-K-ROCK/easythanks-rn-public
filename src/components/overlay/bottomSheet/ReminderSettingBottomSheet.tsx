import React from 'react';
import BottomSheet from './BottomSheet';
import ReminderSettingView from 'components/setting/reminder/ReminderSettingView';

type Props = {
    initialTime: Date;
    initialWeek: boolean[];

    closeBottomSheet: () => void;
    onConfirm: (data: { time: Date; week: boolean[] }) => void;
};

const ReminderSettingBottomSheet = (props: Props) => {
    const { closeBottomSheet, initialTime, initialWeek, onConfirm } = props;

    return (
        <BottomSheet closeBottomSheet={closeBottomSheet}>
            <ReminderSettingView
                initialTime={initialTime}
                initialWeek={initialWeek}
                onConfirm={onConfirm}
            />
        </BottomSheet>
    );
};

export default ReminderSettingBottomSheet;
