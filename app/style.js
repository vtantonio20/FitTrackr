import { StyleSheet, Platform } from "react-native";
import colors from './colors'

const mode = colors.white


export default StyleSheet.create({
    welcomeBackground: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.darker,
        paddingVertical: 100,
        
    },
    tabContainer: {
        flexGrow: 1,
        backgroundColor: colors.darker,
        borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
        marginBottom: Platform.OS === 'ios' ? 95 : 85,
        paddingBottom: 50
    },
    modalContainer: {
        flexGrow: 1,
        backgroundColor: colors.darker,
        borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
    },
    containerWrapper: {
        paddingHorizontal: 14,
        paddingBottom: 14 
    },
    widgetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 14 
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    flexRowLeft: {
        flexDirection: "row",
        alignItems: "center"

    },
    h1: {
        fontSize: 48,
        color: colors.white,
        fontFamily: "Lato-Regular",

    },
    h2: {
        fontSize: 28,
        color: colors.white,
        fontFamily: "Lato-Regular",

    },
    h3: {
        fontSize: 24,
        color: colors.white,
        fontFamily: "Lato-Regular",
        
    },
    h4: {
        fontSize: 18,
        color: colors.white,
        fontFamily: "Lato-Regular",
        
    },
    p: {
        fontSize: 14,
        color: colors.lighter,
        fontFamily: "Lato-Regular",
    },
    divider: {
        borderColor: colors.darker,
        borderWidth: StyleSheet.hairlineWidth
    },

    lighterFont: {
        fontFamily: Platform.OS === 'ios' ? "Lato-Light" : "Lato-Regular"
    }
});