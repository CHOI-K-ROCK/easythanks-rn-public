import { createOrUpdateReminder, getReminderData } from 'services/reminders';
import { ReminderDataType } from 'types/models/reminder';

export const getUserReminderDataOrCreateNew = async (uid: string): Promise<ReminderDataType> => {
    try {
        const res = await getReminderData(uid);

        if (res.length > 0) {
            console.log('get reminder data exist');
            return res[0];
        }

        console.log('create new reminder data');
        const newReminderData = await createOrUpdateReminder({
            user_id: uid,
            active: false,
            time: (() => {
                const date = new Date();
                date.setHours(18, 0, 0, 0);
                // 오후 6시로 설정
                return date.toISOString();
            })(),
            week: [true, true, true, true, true, true, true],
        });

        return newReminderData;
    } catch (error: any) {
        console.log('get user reminder data or create new error :', error);
        throw new Error(error);
    }
};
