export type ReminderDataType = {
    id: string;
    user_id: string;
    active: boolean;
    fcm_token: string;
    week: boolean[];
    time: string;
    created_at: string;
    updated_at: string;
};

export type ReminderInitialDataType = Pick<ReminderDataType, 'active' | 'time' | 'week'>;
