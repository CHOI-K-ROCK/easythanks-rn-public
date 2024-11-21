import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useAppState = () => {
    const [appState, setAppState] = useState<AppStateStatus>('active');

    useEffect(() => {
        const appStateSub = AppState.addEventListener('change', e => {
            setAppState(e);
        });

        return () => {
            appStateSub.remove();
        };
    }, []);

    return { appState };
};

export default useAppState;
