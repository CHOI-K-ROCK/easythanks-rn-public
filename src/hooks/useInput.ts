import { useCallback, useState } from 'react';

/**
 *
 * @param initialValue - 초기값입니다.
 * @returns value - input의 값 입니다. 초기값은 "", 초기값이 있는 경우 초기값을 따릅니다.
 * @returns handleChange - value 를 업데이트 합니다.(string)
 * @returns clearValue - value 를 "" 로 초기화합니다.
 */

const useInput = (initialValue?: string) => {
    const [value, setValue] = useState<string>(initialValue || '');

    const handleChange = useCallback((e: string) => {
        setValue(e);
    }, []);

    const clearValue = useCallback(() => {
        setValue('');
    }, []);

    return { value, handleChange, clearValue };
};

export default useInput;
