import React from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from 'components/common/CustomText';
import VectorIcon from 'components/common/VectorIcon';

import { OpenSourceDataType } from 'types/openSource';

type Props = {
    data: OpenSourceDataType;
    onPress: (data: OpenSourceDataType) => void;
};

const OpenSourceListItem = (props: Props) => {
    const { data, onPress } = props;

    const { name, licenses, version } = data;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.container}
            onPress={() => onPress(data)}
        >
            <View style={styles.titleContainer}>
                <CustomText style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
                    {name}
                </CustomText>
                <CustomText style={styles.info}>{licenses}</CustomText>
                <CustomText style={styles.info}>{'v' + version}</CustomText>
            </View>
            <VectorIcon name="chevron-right" size={15} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    titleContainer: {
        flex: 1,
        gap: 3,
    },
    name: {
        fontSize: 16,
        fontWeight: 500,
        maxWidth: '95%',
    },
    info: { fontSize: 13, opacity: 0.6 },
});

export default React.memo(OpenSourceListItem);
