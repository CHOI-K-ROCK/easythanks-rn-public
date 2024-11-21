import React, { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';
import { toastsAtom } from '../states/ui';

import { ToastCreateType } from '../@types/models/toast';

import useUuid from './useUuid';

/**
 *
 * 모달 관리를 위한 훅
 * @returns openToast - 전달받은 데이터로 토스트를 오픈합니다.
 * @returns closeModal - 아이디를 전달 받고 해당 토스트를 닫습니다.
 * @returns clearModal - 모든 토스트를 닫습니다.
 *
 */
const useToast = () => {
    const setToastsAtom = useSetRecoilState(toastsAtom);
    const uuid = useUuid();

    const openToast = useCallback(
        (toastData: ToastCreateType) => {
            setToastsAtom(prev => [...prev, { ...toastData, id: toastData.id || uuid() }]);
        },
        [setToastsAtom, uuid]
    );

    const closeToast = useCallback(
        (id: string) => {
            setToastsAtom(prev => prev.filter(e => e.id !== id));
        },
        [setToastsAtom]
    );

    return { openToast, closeToast };
};

export default useToast;
