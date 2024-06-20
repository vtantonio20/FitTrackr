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
        paddingBottom: 14,
        marginBottom:28
    },
    widgetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 14 
    },
    widgetBody: {
        backgroundColor: colors.primary,
        borderRadius: 7
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
    h3a: {
        fontSize: 20,
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
        borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1
    },
    lighterFont: {
        fontFamily: Platform.OS === 'ios' ? "Lato-Light" : "Lato-Regular"
    },
  suggestion: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    paddingHorizontal: 7,
    margin: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
    },
    focusedInput: {
        borderColor: 'rgba(255, 255, 10, 0.1)',
    },

});