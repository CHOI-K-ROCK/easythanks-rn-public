import AsyncStroage from '@react-native-async-storage/async-storage';
import { AppThemeType } from '../hooks/useCustomTheme';
import { APP_ENV_SUPABASE_AUTH_TOKEN_STORAGE_KEY } from '@env';

const { setItem, getItem, getAllKeys, multiRemove, removeItem } = AsyncStroage;

export const set = (key: string, value: string) => {
    return setItem(key, value);
};

export const get = (key: string) => {
    return getItem(key);
};

export const clearStorage = async () => {
    const allKeys = await getAllKeys();
    return multiRemove(allKeys);
};

export const checkStroageValue = async (key: string) => {
    const res = await get(key);

    console.log(`AsyncStorage Key: ${key}, Value : ${res}`);
};

// ================

export const getUserId = () => {
    return get(asUserId);
};
export const saveUserId = (id: string) => {
    return set(asUserId, id);
};

export const getAppTheme = () => {
    return get(asAppTheme);
};
export const saveAppTheme = (appTheme: AppThemeType) => {
    return set(asAppTheme, appTheme);
};

export const getSupabaseAuthToken = () => {
    return get(APP_ENV_SUPABASE_AUTH_TOKEN_STORAGE_KEY);
};

export const getAppleToken = () => {
    return get(asAppleToken);
};
export const saveAppleToken = (appleToken: string) => {
    return set(asAppleToken, appleToken);
};
export const removeAppleToken = () => {
    return removeItem(asAppleToken);
};

// ================
// as : async storage
const asUserId = 'asUserId';
const asAppTheme = 'asAppTheme';
const asAppleToken = 'asAppleToken';
