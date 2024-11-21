import { supabase } from './supabase';

import { APP_ENV_APPLE_CLIENT_SECRET } from '@env';

import { AuthResponse, Session } from '@supabase/supabase-js';
import { getSupabaseAuthToken } from 'utils/storage';

export const checkSession = async (): Promise<AuthResponse> => {
    try {
        const localSessionData = await getSupabaseAuthToken();

        if (!localSessionData) {
            throw Error('local session data is null');
        }

        const parsedSession = JSON.parse(localSessionData) as Session;

        const sessionRes = await supabase.auth.setSession({
            access_token: parsedSession.access_token,
            refresh_token: parsedSession.refresh_token,
        });

        if (sessionRes.error) {
            throw new Error(JSON.stringify(sessionRes.error));
        }

        return sessionRes;
    } catch (error) {
        console.log('checkSession error: ', error);
        throw error;
    }
};

export const getAppleTokenWithAuthorizationCode = async (authorizationCode: string) => {
    try {
        const response = await fetch('https://appleid.apple.com/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: 'com.rockwithsun.easythanks',
                client_secret: APP_ENV_APPLE_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: 'https://ymizppghrgkchbgkclgh.supabase.co/auth/v1/callback',
            }).toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        return data;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, getAppleTokenWithAuthorizationCode`);
        throw error;
    }
};

export const revokeAppleAuthorization = async (refreshToken: string) => {
    try {
        const response = await fetch('https://appleid.apple.com/auth/revoke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: 'com.rockwithsun.easythanks',
                client_secret: APP_ENV_APPLE_CLIENT_SECRET,
                token: refreshToken,
            }).toString(),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(JSON.stringify(data));
        }

        return response;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, revokeAppleAuthorization`);
        throw error;
    }
};

export const resendConfirmationEmail = async (email: string): Promise<void> => {
    try {
        const res = await supabase.auth.resend({
            email,
            type: 'signup',
        });

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }
    } catch (error) {
        console.log(`${JSON.stringify(error)}, sendConfirmationEmail`);
        throw error;
    }
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
        const res = await supabase.auth.resetPasswordForEmail(email);

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }
    } catch (error) {
        console.log(`${JSON.stringify(error)}, sendPasswordResetEmail`);
        throw error;
    }
};

export const changePassword = async (password: string): Promise<void> => {
    try {
        const res = await supabase.auth.updateUser({ password: password });

        if (res.error) {
            throw new Error(JSON.stringify(res.error));
        }
    } catch (error) {
        console.log(`${JSON.stringify(error)}, changePassword`);
        throw error;
    }
};

export const checkExistEmail = async (email: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email);

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return data.length > 0;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, checkDuplicateEmail`);
        throw error;
    }
};
