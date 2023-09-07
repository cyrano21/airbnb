import { Image, StyleSheet, Platform } from "react-native";
const HeaderLogo = () => {
  console.log("====================================");
  console.log(Platform.OS);
  console.log("====================================");
  return <Image source={require("../assets/logo.png")} style={styles.logo} />;
};
export default HeaderLogo;

const styles = StyleSheet.create({
  logo: {
    width: Platform.OS === "android" ? "100%" : "100%",
    marginLeft: Platform.OS === "android" ? -10 : -15,
    height: 30,
    resizeMode: "contain",
  },
});
