import { useRecoilValue, useSetRecoilState } from 'recoil';

import { isOverlayIdExistsSelector, overlaysAtom } from '../states/ui';

import React, { useCallback, useId } from 'react';

/**
 *
 * 오버레이 관리를 위한 훅
 * @params component - 열고자하는 오버레이 컴포넌트를 전달받습니다. 내부에 상태를 사용하는 오버레이의 경우 따로 컴포넌트로 분리하여 관리해야합니다. (OptOutDialogModal 참고)
 * @returns openModal - 전달받은 오버레이 컴포넌트를 오픈합니다.
 * @returns closeModal - 해당 오버레이를 닫습니다.
 * @returns clearModal - 모든 오버레이를 닫습니다.
 *
 */
const useOverlay = (component: React.FC, overlayId: string) => {
    const updateOverlaysAtom = useSetRecoilState(overlaysAtom);

    const isOverlayIdExists = useRecoilValue(isOverlayIdExistsSelector(overlayId));

    const openOverlay = useCallback(() => {
        // 중복 오버레이 방지
        if (isOverlayIdExists) return;

        updateOverlaysAtom(prev => {
            return [...prev, { id: overlayId, component }];
        });
    }, [component, overlayId, updateOverlaysAtom, isOverlayIdExists]);

    const closeOverlay = useCallback(() => {
        updateOverlaysAtom(prev => prev.filter(e => e.id !== overlayId));
    }, [overlayId, updateOverlaysAtom]);

    const clearOverlay = useCallback(() => {
        updateOverlaysAtom([]);
    }, [updateOverlaysAtom]);

    return { openOverlay, closeOverlay, clearOverlay };
};

export default useOverlay;
