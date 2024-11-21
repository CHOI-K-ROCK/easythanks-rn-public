import { atom } from 'recoil';

export const isSignedAtom = atom<boolean>({
    key: 'isSignedAtom',
    default: false,
});
