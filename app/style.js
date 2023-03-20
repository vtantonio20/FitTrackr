import { StyleSheet, Platform } from "react-native";
import colors from './colors'

const mode = colors.white


export default StyleSheet.create({
    welcomeBackground: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.black,
        paddingVertical: 100,
        
    },
    container: {
        flexDirection: "column",
        flexGrow:1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.black,
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    h1: {
        fontSize: 64,
        color: colors.white,
        fontFamily: "Inter-Regular",

    },
    h2: {
        fontSize: 28,
        color: colors.white,
        fontFamily: "Inter-Regular",

    },
    h3: {
        fontSize: 20,
        color: colors.white,
        fontFamily: "Inter-Regular",
    },
    h4: {
        fontSize: 18,
        color: colors.white,
        fontFamily: "Inter-Regular",
    },
    p: {
        fontSize: 14,
        color: colors.white,
        fontFamily: "Inter-Regular",
    },
    divider: {
        borderColor: colors.lighter,
        borderWidth: StyleSheet.hairlineWidth
    },
    lighterFont: {
        fontFamily: Platform.OS === 'ios' ? "Inter-Light" : "Inter-Regular"
    }
});