import React from 'react';

import { ScrollView, StyleSheet } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import VectorIcon from 'components/common/VectorIcon';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import PushAnimatedPressable from 'components/common/PushAnimatedPressable';

import { useNavigation } from '@react-navigation/native';

const EditLocationScreen = () => {
    const { goBack } = useNavigation();

    return (
        <SafeAreaView>
            <InnerNavigationBar
                screenTitle="위치 수정"
                goBack={goBack}
                rightComponent={
                    <PushAnimatedPressable onPress={goBack} style={styles.searchButton}>
                        <VectorIcon name="magnify" />
                    </PushAnimatedPressable>
                }
            />

            {/* ====================== */}

            <ScrollView />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    searchButton: {
        paddingHorizontal: 5,
    },
});

export default EditLocationScreen;
