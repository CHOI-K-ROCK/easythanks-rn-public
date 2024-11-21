import { removeFiles, uploadImage } from 'services/files';
import { createOrUpdatePost, deletePost } from 'services/posts';
import { PostDataType } from 'types/models/post';

export const handleCreateOrUpdatePost = async (
    postData: Partial<PostDataType>,
    editedImage: { added: string[]; deleted: string[] }
) => {
    try {
        const copiedPostData = { ...postData };
        const { added, deleted } = editedImage;

        if (copiedPostData.photos) {
            copiedPostData.photos = copiedPostData.photos.filter(photo =>
                photo.startsWith('https://')
            );
            // local path 삭제 -> file://...
        }

        if (added.length > 0) {
            const uploadedImagePublicUri = copiedPostData.photos ? [...copiedPostData.photos] : [];
            // 기존 이미지 URI

            // 모든 이미지를 비동기적으로 업로드, map 을 통해 promise 를 객체의 배열로 전달
            const uploadPromises = added.map(async addedPath => {
                const uploadRes = await uploadImage(`posts/${postData.id}/`, addedPath);
                return uploadRes.publicUrl;
            });

            // 모든 업로드가 완료된 후에 결과를 받아옴
            const uploadedUris = await Promise.all(uploadPromises);
            uploadedImagePublicUri.push(...uploadedUris);

            copiedPostData.photos = uploadedImagePublicUri;
        }

        if (deleted.length > 0) {
            const deletedImagePathWithFolderName = deleted.map(
                deletedPath => deletedPath.split('/').slice(-3).join('/')
                // posts/{postId}/{fileName}
            );

            await removeFiles(deletedImagePathWithFolderName);
        }

        const changedPostData = createOrUpdatePost(copiedPostData);

        return changedPostData;
    } catch (error: any) {
        console.log('create or update post error :', error);
        throw new Error(error);
    }
};

export const handleDeletePost = async (postId: string) => {
    try {
        await deletePost(postId);
        // deleted-posts-queue 에 의해 스토리지에 업로드 된 이미지가 삭제 되므로,
        // 따로 이미지 삭제 로직을 추가하지 않아도 됨.
    } catch (error: any) {
        console.log('delete post error :', error);
        throw new Error(error);
    }
};
