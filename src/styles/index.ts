import { StyleSheet, Platform } from 'react-native';

export const commonStyles = StyleSheet.create({
    // box
    paddingHorizontal: {
        paddingHorizontal: 15,
    },
    marginHorizontal: {
        marginHorizontal: 15,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // ui
    dropShadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4.5 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    textShadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    link: {
        color: '#828282',
        textDecorationLine: 'underline',
    },
    subject: {
        paddingLeft: 5,
        marginBottom: 5,
        fontWeight: 500,
    },

    //text

    textWhite: {
        color: '#FFF',
    },
    textBlack: {
        color: '#000',
    },
});
