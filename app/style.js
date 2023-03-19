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
    h3: {
        fontSize: 64,
        color: colors.white,
        fontFamily: "Lato-Light",
    },
    h4: {
        fontSize: 32,
        lineHeight: 32,
        color: 'white',
        fontFamily: "Lato-Regular",
        fontWeight: "bold"
    },
    h5: {
        fontSize: 24,
        lineHeight: 24,
        color: 'white',
        fontFamily: "Lato-Regular",
        fontWeight: "bold"
    },
});