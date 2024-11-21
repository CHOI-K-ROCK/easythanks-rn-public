import { UserDataType } from 'types/models/user';
import { supabase } from './supabase';
import { APP_ENV_SUPABASE_URL } from '@env';

export const getUserById = async (id: string): Promise<UserDataType> => {
    try {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return data;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, getUserById`);
        throw error;
    }
};

export const updateUserData = async (
    uid: string,
    userData: Partial<UserDataType>
): Promise<UserDataType> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ ...userData, updated_at: new Date().toISOString() })
            .eq('id', uid)
            .select()
            .single();

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return data;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, updateUserData`);
        throw error;
    }
};

export const updateUserFcmToken = async (
    uid: string,
    token: string,
    platform: 'ios' | 'android'
): Promise<void> => {
    try {
        const { error } = await supabase.from('fcm_tokens').upsert(
            {
                user_id: uid,
                token: token,
                platform: platform,
                updated_at: new Date().toISOString(),
            },
            // token이 존재하는 경우 update, 아닌 경우 insert
            { onConflict: 'token' }
        );

        if (error) {
            throw new Error(JSON.stringify(error));
        }
    } catch (error) {
        console.log(`${JSON.stringify(error)}, updateUserFcmToken`);
        throw error;
    }
};

export const checkFcmTokenAleadyUsed = async (userId: string, token: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('fcm_tokens')
            .select('*')
            .eq('token', token)
            .single();

        // 조회가 되지 않는 경우 (현재 fcm 토큰이 존재하지 않는 경우)
        if (!data) {
            return false;
        }

        // 등록된 fcm 토큰을 다른 유저가 사용하고 있는 경우
        if (data.user_id !== userId) {
            return true;
        }

        // 그 외의 경우 false
        return false;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, checkFcmTokenAleadyUsed`);
        throw error;
    }
};

export const clearUserFcmToken = async (token: string): Promise<void> => {
    try {
        const { error } = await supabase.from('fcm_tokens').delete().eq('token', token);

        if (error) {
            throw new Error(JSON.stringify(error));
        }
    } catch (error) {
        console.log(`${JSON.stringify(error)}, clearUserFcmToken`);
        throw error;
    }
};

export const optOutUser = async (userId: string): Promise<void> => {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('session data is null');
        }

        const { access_token } = session;

        // edge function
        const response = await fetch(`${APP_ENV_SUPABASE_URL}/functions/v1/user-optout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(JSON.stringify(data.error));
        }

        return data;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, optOutUser`);
        throw error;
    }
};
