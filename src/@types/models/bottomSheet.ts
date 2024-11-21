import { ReactElement } from 'react';

export type BottomSheetType = {
    children: ReactElement;
    closeBottomSheet: () => void;

    closeButton?: boolean;
    closeByBackdrop?: boolean;
    rawElement?: boolean;
};
