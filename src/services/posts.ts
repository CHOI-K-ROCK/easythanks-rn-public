import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from './supabase';

import { PostDataType } from 'types/models/post';
import { getPaginationRange } from 'utils/data';
import { PostSummaryDataType } from 'types/models/post';

// read
export const getPostById = async (postId: string): Promise<PostDataType> => {
    try {
        const { data, error } = await supabase.from('posts').select().eq('id', postId).single();

        if (error) {
            throw new Error(JSON.stringify(error));
        }
        return data;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, getPostById`);
        throw error;
    }
};

export const lookupPost = async (
    userId: string,
    startDate: Date,
    endDate: Date,
    usePagination: boolean,
    paginationOptions?: Partial<{ perLoad: number; page: number }>,
    ascending: boolean = true
): Promise<{ data: PostDataType[]; count: number }> => {
    try {
        let query;

        if (usePagination) {
            // 페이징 처리
            const { page = 0, perLoad = 5 } = paginationOptions || {};
            const paginationRange: [number, number] = getPaginationRange(page, perLoad);

            query = await supabase
                .from('posts')
                .select('*', { count: 'exact' })
                .eq('author_id', userId)
                .gte('date', startDate.toISOString())
                .lte('date', endDate.toISOString())
                .order('date', { ascending: ascending })
                .range(paginationRange[0], paginationRange[1]);
        } else {
            // 일괄 조회
            query = await supabase
                .from('posts')
                .select('*', { count: 'exact' })
                .eq('author_id', userId)
                .gte('date', startDate.toISOString())
                .lte('date', endDate.toISOString())
                .order('date', { ascending: ascending });
        }

        const { data, error, count } = query;

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return { data, count: count ?? 0 };
    } catch (error) {
        console.log(`${JSON.stringify(error)}, lookupPost`);
        throw error;
    }
};

export const checkPostSummaryDataWithTimezone = async (
    authorId: string,
    year: number,
    month: number,
    userTimeZone: string
): Promise<PostSummaryDataType> => {
    try {
        // 월별 게시글 요약 데이터 조회

        const { data, error } = await supabase
            .rpc('get_post_stats_with_overview_by_timezone', {
                author_id_input: authorId,
                year_input: year,
                month_input: month,
                timezone_input: userTimeZone,
            })
            .single();

        if (error) {
            throw new Error(JSON.stringify(error));
        }
        return data as PostSummaryDataType;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, checkPostsByMonth`);
        throw error;
    }
};

// create / update
export const createOrUpdatePost = async (postData: Partial<PostDataType>) => {
    try {
        const { data, error } = await supabase.from('posts').upsert({
            ...postData,
            updated_at: new Date().toISOString(),
        });

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return data;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, createOrUpdatePost`);
        throw error;
    }
};

// delete
export const deletePost = async (postId: string) => {
    try {
        const { data, error } = await supabase.from('posts').delete().eq('id', postId);

        if (error) {
            throw new Error(JSON.stringify(error));
        }
        return data;
    } catch (error) {
        console.log(`${JSON.stringify(error)}, deletePost`);
        throw error;
    }
};

// subs

export const subscribePost = (
    postId: string,
    cb: (
        payload: RealtimePostgresChangesPayload<{
            [key: string]: any;
        }>
    ) => void
) => {
    console.log('post subs');

    return supabase
        .channel('post_channel')
        .on(
            'postgres_changes',
            {
                schema: 'public',
                event: '*',
                table: 'posts',
                filter: `id=eq.${postId}`,
            },
            payload => {
                cb(payload);
            }
        )
        .subscribe();
};

export const subscribeMainScreen = (
    userId: string,
    cb: (
        payload: RealtimePostgresChangesPayload<{
            [key: string]: any;
        }>
    ) => void
) => {
    console.log('main screen subs');

    return supabase
        .channel('main_screen_channel')
        .on(
            'postgres_changes',
            {
                schema: 'public',
                event: '*',
                table: 'posts',
                filter: `author_id=eq.${userId}`,
            },
            payload => {
                cb(payload);
            }
        )
        .subscribe();
};

export const subscribeLookUpPost = (
    userId: string,
    cb: (
        payload: RealtimePostgresChangesPayload<{
            [key: string]: any;
        }>
    ) => void
) => {
    console.log('look up post subs');

    return supabase
        .channel('look_up_posts_channel')
        .on(
            'postgres_changes',
            {
                schema: 'public',
                event: '*',
                table: 'posts',
                filter: `author_id=eq.${userId}`,
            },
            payload => {
                cb(payload);
            }
        )
        .subscribe();
};
