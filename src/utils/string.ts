import { getDateStrings } from './date';

export const getInitialPostNameByDate = (date: Date) => {
    const dateStrings = getDateStrings(date);
    const { year, month, day } = dateStrings;

    return `${year.slice(2)}년 ${month}월 ${day}일의 감사일기`;
};

// 참고 : https://velog.io/@kallroo/JS-%EA%B8%80%EC%9E%90-%EC%88%98%EC%97%90-%EB%94%B0%EB%A5%B8-byte%EC%88%98-%EC%B2%B4%ED%81%AC%ED%95%98%EA%B8%B0
export function getStringBytesSize(str: string) {
    let byte, index, char;

    for (byte = index = 0; (char = str.charCodeAt(index++));) {
        byte += char >> 11 ? 2 : char >> 7 ? 2 : 1;
    }
    return byte;
}

export function sliceStringByBytesSize(str: string, length: number) {
    let byte, index, char;

    for (byte = index = 0; (char = str.charCodeAt(index));) {
        byte += char >> 11 ? 2 : char >> 7 ? 2 : 1;
        if (byte > length) {
            break;
        }
        index++;
    }
    return str.substring(0, index);
}

export const checkValidateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/;

    if (!emailRegex.test(email)) {
        return 'invalid_email';
    }

    return null;
};

export const checkValidatePassword = (password: string, confirmPassword?: string) => {
    // 비밀번호는 8자 이상, 영문자와 숫자를 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // 비밀번호 유효성 체크
    if (!passwordRegex.test(password)) {
        return 'password_not_valid';
    }

    // 확인 비밀 번호가 있는 경우
    if (confirmPassword) {
        if (password !== confirmPassword) {
            return 'confirm_password_not_same';
        }
    }

    return null;
};

export const getErrorMessageByErrorCode = (errorCode: string) => {
    switch (errorCode) {
        // 인증 과정 오류
        case 'invalid_credentials':
            return '계정 혹은 비밀번호가 다릅니다.';
        case 'email_not_confirmed':
            return '인증 메일을 확인해주세요.';
        case 'duplicated_email':
            return '이미 존재하는 이메일입니다.';
        case 'not_registered_email':
            return '존재하지 않는 이메일입니다.';
        case 'password_not_verified':
            return '기존 비밀번호가 일치하지 않습니다.';

        // 가입 필드 검증
        case 'invalid_email':
            return '유효한 이메일 주소가 아닙니다.';
        case 'password_not_valid':
            return '비밀번호는 8자 이상, 영문자와 숫자를 포함해야 합니다.';
        case 'confirm_password_not_same':
            return '확인 비밀번호가 일치하지 않습니다.';
        default:
            return '알 수 없는 오류가 발생했습니다.';
    }
};
