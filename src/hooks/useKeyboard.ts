import { useContext } from 'react';
import { KeyboardContext } from '../contexts/KeyboardContext';

/**
 *
 * @returns keyboardHeight - 키보드 높이를 반환합니다.(number)
 * @returns isShow - 키보드가 보여지는지 여부를 반환합니다.(boolean)
 * @returns dismiss - 키보드를 숨깁니다.
 */

const useKeyboard = () => {
    const { dismiss, isShow, keyboardHeight } = useContext(KeyboardContext);

    return { dismiss, isShow, keyboardHeight };
};

export default useKeyboard;
