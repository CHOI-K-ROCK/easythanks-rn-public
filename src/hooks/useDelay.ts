import { useCallback, useEffect, useRef } from 'react';

// useDelay.ts
/**
 *
 * @returns 딜레이 메소드를 반환합니다.
 */
export const useDelay = () => {
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            clearTimeout(timeoutId.current as NodeJS.Timeout);
        };
    }, []);

    const delayFn = useCallback(
        (delay: number, callback?: () => void) =>
            new Promise<void>(resolve => {
                timeoutId.current = setTimeout(() => {
                    callback && callback();
                    resolve();
                }, delay);
            }),
        []
    );

    return delayFn;
};

export default useDelay;
