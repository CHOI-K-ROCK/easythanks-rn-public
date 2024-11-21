import AsyncStorage from '@react-native-async-storage/async-storage';

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

import { APP_ENV_SUPABASE_URL, APP_ENV_SUPABASE_ANON_KEY } from '@env';
import { AppState, AppStateStatus } from 'react-native';

const supabaseUrl = APP_ENV_SUPABASE_URL;
const supabaseKey = APP_ENV_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});
