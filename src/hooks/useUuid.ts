import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * uuid 생성을 위한 Hook
 *
 * RN 에서의 사용을 위해 react-native-get-random-values 라이브러리 import 및 v4 반환
 *
 * @returns uuidv4()
 *
 */
const useUuid = () => {
    return uuidv4;
};

export default useUuid;
