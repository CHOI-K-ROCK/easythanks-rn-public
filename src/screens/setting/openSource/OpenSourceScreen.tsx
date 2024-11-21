import React, { useMemo } from 'react';

import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import OpenSourceListItem from 'components/setting/openSource/OpenSourceListItem';

import { OpenSourceScreenNavigationProps } from 'types/navigations/settingStack';

import { useNavigation } from '@react-navigation/native';

import OPEN_SOURCE_DATA from '../../../../licenses/licenses.json';
import { OpenSourceDataType } from 'types/openSource';
import { HORIZONTAL_GAP } from 'constants/style';

const OpenSourceScreen = () => {
    const navigation = useNavigation<OpenSourceScreenNavigationProps>();

    const openSourceDatas = useMemo(() => Object.values(OPEN_SOURCE_DATA).map(data => data), []);

    const handleNavigateOpenSourceDetail = (data: OpenSourceDataType) => {
        navigation.navigate('OpenSourceDetailScreen', { data });
    };

    const renderItem: ListRenderItem<any> = ({ item }) => {
        return <OpenSourceListItem data={item} onPress={handleNavigateOpenSourceDetail} />;
    };

    return (
        <SafeAreaView>
            <InnerNavigationBar screenTitle={'오픈소스'} goBack={navigation.goBack} />
            <FlatList
                data={openSourceDatas}
                renderItem={renderItem}
                initialNumToRender={20}
                style={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingTop: 10,
        paddingHorizontal: HORIZONTAL_GAP,
    },
});

export default OpenSourceScreen;
