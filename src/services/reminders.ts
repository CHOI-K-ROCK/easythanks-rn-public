import { ReminderDataType } from 'types/models/reminder';
import { supabase } from './supabase';

export const getReminderData = async (uid: string): Promise<ReminderDataType[]> => {
    try {
        const { data, error } = await supabase.from('reminders').select('*').eq('user_id', uid);
        // 단순히 리마인더 데이터가 없는 것과, 요청에 오류가 있음을 구분하기 위해
        // select 를 사용하지 않음.

        // 단순 리마인더 데이터가 없는 경우 빈 배열 반환하지만,
        // select 사용하는 경우 데이터가 없는 경우 에러를 반환하기 때문.

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return data;
    } catch (error: any) {
        console.log('get reminder data error :', error);
        throw error;
    }
};

export const createOrUpdateReminder = async (
    reminderData: Partial<ReminderDataType>
): Promise<ReminderDataType> => {
    try {
        const { data, error } = await supabase
            .from('reminders')
            .upsert({
                ...reminderData,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return data;
    } catch (error: any) {
        console.log('create or update reminder error :', error);
        throw error;
    }
};
