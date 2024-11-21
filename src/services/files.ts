import { supabase } from './supabase';
import { FileSystem } from 'react-native-file-access';

import { base64ToArrayBuffer } from 'utils/data';
import { v4 } from 'uuid';

export const uploadImage = async (
    bucketPath: string,
    filePath: string,
    fileName?: string
): Promise<{ publicUrl: string }> => {
    try {
        const base64Image = await FileSystem.readFile(filePath, 'base64');
        const decoded = base64ToArrayBuffer(base64Image);
        // 로컬 파일 불러오기 및 디코딩 base64 -> arrayBuffer

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(`${bucketPath}${fileName ?? v4()}.png`, decoded, {
                // fileName 미설정시 uuidv4 사용
                cacheControl: '3600',
                contentType: 'image/png',
            });

        if (data === null) {
            throw new Error('upload image data is null');
        }

        const { data: uriData } = supabase.storage.from('uploads').getPublicUrl(data.path);

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return uriData;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, uploadImage`);
        throw error;
    }
};

export const removeFiles = async (uris: string[]): Promise<null> => {
    try {
        const { error } = await supabase.storage.from('uploads').remove(uris);

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return null;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, removeFiles`);
        throw error;
    }
};

export const removeFolders = async (folderPath: string): Promise<null> => {
    try {
        const res = await supabase.storage
            .from('uploads')
            .list(folderPath, { limit: 100, offset: 0 });

        const { data, error } = res;

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        if (!data || data.length === 0) {
            console.log("there's no files to remove");
            // 폴더 내부의 파일의 갯수가 1개 이상인 경우에만 removeFiles 호출
        } else {
            const filePaths = data.map(file => `${folderPath}/${file.name}`);
            await removeFiles(filePaths);
            // 폴더 내부의 이미지가 모두 삭제되는 것으로 폴더가 삭제됨
        }

        return null;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, removeFolders`);
        throw error;
    }
};
