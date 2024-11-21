import { atom } from 'recoil';
import { UserDataType } from '../@types/models/user';

export const userDataAtom = atom<UserDataType | null>({
    key: 'userDataAtom',
    default: null,
});
