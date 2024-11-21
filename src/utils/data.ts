import { MONTHLY_EMOJI_SET } from 'constants/string';
import { LookUpPostScreenRouteParams } from 'types/navigations/postStack';

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getRandomArrayValue = (array: any[]) => {
    const length = array.length;

    const index = Math.floor(Math.random() * length);

    return array[index];
};

export const arrayToObjectUsingRefKey = (refKey: string, data: any[]) => {
    if (data.length === 0) {
        return {};
    }
    if (data[0][refKey] === refKey) {
        console.log('there is no such a key' + refKey);
        return {};
    }

    return data.reduce((acc, cur) => {
        if (acc[cur[refKey]] === undefined) {
            acc[cur[refKey]] = cur;
        }

        return acc;
    }, {});
};

export const convertPostMonthlyOverviewToArray = (data: { [day: string]: boolean }) => {
    const dataLength = Object.keys(data).length;
    const arrayLike = { ...data, length: dataLength + 1 };

    const converted = Array.from(arrayLike);
    converted.shift();

    return converted as boolean[];
};

export const base64ToArrayBuffer = (base64: string) => {
    // Base64 디코딩
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    // Uint8Array로 변환
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // ArrayBuffer로 변환
    return bytes.buffer;
};

export const getPaginationRange = (curPage: number, postPerEachLoad: number) => {
    const startIdx = curPage === 0 ? 0 : curPage * postPerEachLoad;
    const endIdx = startIdx + postPerEachLoad - 1;

    return [startIdx, endIdx] as [number, number];
};

export const getLookUpPostsScreenParams = (type: 'today' | 'monthly' | 'currentMonthly') => {
    const currentMonth = new Date().getMonth();

    const beginDate = new Date();
    const endDate = new Date();

    // beginDate, endDate 설정
    switch (type) {
        case 'today':
            beginDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'monthly':
        case 'currentMonthly':
            beginDate.setDate(1);
            beginDate.setHours(0, 0, 0, 0);
            endDate.setMonth(currentMonth + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
            break;
    }

    let mutableParams: Partial<LookUpPostScreenRouteParams>;

    switch (type) {
        case 'today': {
            mutableParams = {
                title: '오늘의 감사일기',
                ascending: false,
                goBackOnPostEmpty: true,
            };
            break;
        }
        case 'currentMonthly':
            mutableParams = {
                title: `${currentMonth + 1}월 ${MONTHLY_EMOJI_SET[currentMonth]}`,
            };
            break;
        case 'monthly':
            mutableParams = {
                title: '월별 감사일기',
                monthChangeable: true,
            };
            break;
    }

    return {
        beginDate: beginDate.getTime(),
        endDate: endDate.getTime(),
        ...mutableParams,
    } as LookUpPostScreenRouteParams;
};
