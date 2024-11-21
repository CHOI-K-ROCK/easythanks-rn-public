/* eslint-disable prettier/prettier */
import { atom, selectorFamily } from 'recoil';

// 레이아웃(모달, 바텀시트) 상태
export const overlaysAtom = atom<any[]>({ key: 'overlaysAtom', default: [] });

export const isOverlayIdExistsSelector = selectorFamily({
    key: 'isOverlayIdExistsSelector',
    get: (id: string) => ({ get }) => {
        const overlays = get(overlaysAtom);
        return overlays.some(overlay => overlay.id === id);
    },
});

// 토스트 상태
export const toastsAtom = atom<any[]>({ key: 'toastsAtom', default: [] });

// 로딩 상태
export const isLoadingAtom = atom<boolean>({ key: 'isLoadingAtom', default: false });
