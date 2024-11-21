import { ReactElement } from 'react';

export type CommonModalType = {
    title?: string;
    titleIcon?: ReactElement;
    text?: string;

    buttons?: CommonModalButtonType[];

    closeModal: () => void;

    backdrop?: boolean;
    closingByBackdropPress?: boolean;

    closingByAndroidBackPress?: boolean;

    children?: ReactElement;
    childrenPosition?: 'top' | 'bottom';
};

export type CommonModalButtonType = {
    type?: 'apply' | 'cancel';

    content: string;
    onPress?: () => void;

    backgroundColor?: string;
    textColor?: string;

    disabled?: boolean;
};
