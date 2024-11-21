import { ReactElement } from 'react';

type ToastBaseType = {
    type?: 'common' | 'complete' | 'caution' | 'error';

    text?: string;
    component?: ReactElement;

    duration?: number;
};

export type ToastCreateType = ToastBaseType & {
    id?: string;
};

export type ToastType = ToastBaseType & {
    id: string;
};
