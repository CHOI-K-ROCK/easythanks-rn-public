import { PostDataType } from 'types/models/post';
import { isSameDate } from './date';

export const checkPostEdited = (
    isCreatePost: boolean,
    newData: Pick<PostDataType, 'title' | 'content' | 'date' | 'photos'>,
    initialData: PostDataType | null,
    originalDate: Date
) => {
    const { title, content, date, photos } = newData;
    const {
        title: initialTitle,
        content: initialContent,
        date: initialDate,
        photos: initialPhotos,
    } = initialData || {};

    const IS_EDITED_ON_CREATE =
        title !== '' ||
        content !== '' ||
        !isSameDate(originalDate, date, { ignoreSeconds: true }) ||
        photos.length !== 0;

    const IS_EDITED_ON_EDIT =
        title !== initialTitle ||
        content !== initialContent ||
        !isSameDate(initialDate + 'Z', date, { ignoreSeconds: true }) ||
        JSON.stringify(initialPhotos) !== JSON.stringify(photos);
    // 주소값이 아닌, 절대적인 형태만 비교

    // 글 작성
    if (isCreatePost && IS_EDITED_ON_CREATE) {
        return true;
    }

    // 글 수정
    if (!isCreatePost && IS_EDITED_ON_EDIT) {
        return true;
    }

    return false;
};
