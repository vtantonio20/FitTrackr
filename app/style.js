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
        flexGrow:1,
        backgroundColor: colors.black,
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
        fontSize: 64,
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
        color: colors.white,
        fontFamily: "Lato-Regular",
    },
    divider: {
        borderColor: colors.lighter,
        borderWidth: StyleSheet.hairlineWidth
    },
    lighterFont: {
        fontFamily: Platform.OS === 'ios' ? "Lato-Light" : "Lato-Regular"
    }
});