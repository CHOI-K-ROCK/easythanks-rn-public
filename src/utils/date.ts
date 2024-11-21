export const convertDateToString = (date: Date, format?: string) => {
    const nonPadValues = [
        date.getFullYear().toString(),
        (date.getMonth() + 1).toString(),
        date.getDate().toString(),
        date.getHours().toString(),
        date.getMinutes().toString(),
        date.getSeconds().toString(),
    ];

    const [year, month, day, hours, min, sec] = nonPadValues;

    const padValues = [
        month.padStart(2, '0'),
        day.padStart(2, '0'),
        hours.padStart(2, '0'),
        min.padStart(2, '0'),
        sec.padStart(2, '0'),
    ];
    const [padMonth, padDay] = padValues;

    switch (format) {
        case 'yyyy. mm. dd': {
            return [year, padMonth, padDay].join('. ');
        }
        default: {
            return [year, padMonth, padDay].join('. ');
        }
    }
};

/**
 *
 * @param initialDate - 초기값 설정 (Date)
 * @param {boolean} use24hours - 24시간제 사용여부 (boolean)
 * @returns year, month, day, hours, min, sec, dayOfWeek
 */
export const getDateStrings = (initialDate: Date, use24hours?: boolean) => {
    const date = new Date(initialDate);

    const hourDefault = date.getHours();
    const ampm = hourDefault < 12 ? 'am' : 'pm';

    let convertedHour;

    if (use24hours) {
        convertedHour = hourDefault;
    }

    if (!use24hours) {
        if (hourDefault > 12) {
            convertedHour = hourDefault - 12;
        } else {
            convertedHour = hourDefault;
        }
    }

    return {
        year: '' + date.getFullYear(),
        month: '' + (date.getMonth() + 1),
        day: '' + date.getDate(),
        hours: '' + convertedHour,
        min: '' + date.getMinutes(),
        sec: '' + date.getSeconds(),
        dayOfWeek: date.getDay(),
        ampm,
    };
};

export const getDayOfWeekName = (day: number) => {
    const daysStringArr = ['일', '월', '화', '수', '목', '금', '토'];

    return daysStringArr[day];
};

export const isSameDate = (
    date1: Date | string | number | null,
    date2: Date | string | number | null,
    options?: Partial<{ ignoreSeconds: boolean }>
) => {
    const newDate1 = date1 ? new Date(date1) : new Date();
    const newDate2 = date2 ? new Date(date2) : new Date();

    if (options) {
        const { ignoreSeconds } = options || {};

        if (ignoreSeconds) {
            newDate1.setSeconds(0, 0);
            newDate2.setSeconds(0, 0);
        }
    }

    return newDate1.getTime() === newDate2.getTime();
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime();
};
