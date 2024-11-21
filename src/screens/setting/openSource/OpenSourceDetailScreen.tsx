import React from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import InnerNavigationBar from 'components/common/InnerNavigationBar';
import ScreenLayout from 'components/common/ScreenLayout';
import CustomText from 'components/common/CustomText';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
    OpenSourceDetailScreenRouteProps,
    OpenSourceScreenNavigationProps,
} from 'types/navigations/settingStack';
import HorizontalDivider from 'components/common/HorizontalDivider';
import { openUrl } from 'utils/linking';
import { HORIZONTAL_GAP } from 'constants/style';
import { commonStyles } from 'styles';

const OpenSourceDetailScreen = () => {
    const navigation = useNavigation<OpenSourceScreenNavigationProps>();
    const { params } = useRoute<OpenSourceDetailScreenRouteProps>();

    const { name, version, publisher, description, repository, url, email, licenses, licenseText } =
        params.data;

    return (
        <SafeAreaView>
            <InnerNavigationBar goBack={navigation.goBack} screenTitle={'오픈소스 세부정보'} />
            <ScrollView style={styles.container}>
                <View>
                    {publisher && <CustomText style={styles.publisher}>{publisher}</CustomText>}
                    <CustomText style={styles.name}>{name}</CustomText>
                    <CustomText style={styles.version}>{'v' + version}</CustomText>

                    {description && (
                        <CustomText style={styles.description}>{description}</CustomText>
                    )}
                </View>
                <HorizontalDivider style={styles.divider} />

                <View style={styles.linksContainer}>
                    {repository && (
                        <TouchableOpacity onPress={() => openUrl(repository)}>
                            <CustomText style={commonStyles.link}>{repository}</CustomText>
                        </TouchableOpacity>
                    )}
                    {url && (
                        <TouchableOpacity onPress={() => openUrl(url)}>
                            <CustomText style={commonStyles.link}>{url}</CustomText>
                        </TouchableOpacity>
                    )}
                    {email && (
                        <TouchableOpacity onPress={() => openUrl('mailto:' + email)}>
                            <CustomText style={commonStyles.link}>{email}</CustomText>
                        </TouchableOpacity>
                    )}
                </View>
                <HorizontalDivider style={styles.divider} />

                <View>
                    {licenses && <CustomText style={styles.licenses}>{licenses}</CustomText>}
                    {licenseText && <CustomText>{licenseText}</CustomText>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: HORIZONTAL_GAP,
        paddingTop: 20,
    },
    publisher: {
        fontSize: 13,
        fontWeight: 500,
        opacity: 0.5,
        marginBottom: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 500,
        marginBottom: 5,
    },
    version: {
        fontSize: 13,
        fontWeight: 500,
        opacity: 0.5,
    },
    description: {
        marginTop: 15,
    },
    linksContainer: {
        gap: 5,
    },
    licenses: {
        fontSize: 15,
        fontWeight: 500,
        marginBottom: 10,
    },
    divider: {
        marginVertical: 20,
    },
});

export default OpenSourceDetailScreen;
