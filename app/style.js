import { StyleSheet } from "react-native";
import colors from './colors'

export default StyleSheet.create({
    welcomeBackground: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.primary,
        paddingVertical: 100,
        
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.primary,
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
        fontSize: 20,
        color: colors.white,
        fontFamily: "Lato-Regular",
    },
    p: {
        fontSize: 14,
        color: colors.white,
        fontFamily: "Lato-Regular",
    }
    
});