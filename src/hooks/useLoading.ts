import { useRecoilState } from 'recoil';
import { isLoadingAtom } from '../states/ui';

/**
 *
 * @returns isLoading - 현재 로딩중인지 상태를 반환합니다.
 * @returns setLoading - 현재 로딩 상태(boolean)를 변경합니다.
 */
const useLoading = () => {
    const [isLoading, setLoading] = useRecoilState(isLoadingAtom);

    return {
        isLoading,
        setLoading,
    };
};

export default useLoading;
