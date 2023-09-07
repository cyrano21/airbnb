import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen({ navigation, setTokenAndId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const id = await AsyncStorage.getItem("userId");
      if (token && id) {
        setToken(token);
        navigation.navigate("TabHome");
      }
    };
    checkToken();
  }, []);

  const handleSignup = async () => {
    console.log("handleSignup");

    try {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
        {
          email,
          username,
          description,
          password,
        }
      );

      console.log("response>>>", response.data.token, response.data.id);

      if (response.status === 200 && response.data && response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        setTokenAndId(response.data.token, response.data.id);
        alert("compte créé");
        navigation.navigate("TabHome");
      } else if (response.data && response.data.error) {
        if (response.data.error === "Username already taken") {
          setErrorMessage("Ce nom d'utilisateur est déjà pris");
        } else if (response.data.error === "Email already in use") {
          setErrorMessage("Cet email est déjà utilisé");
        } else {
          setErrorMessage("Paramètre(s) manquant(s)");
        }
      }
    } catch (error) {
      console.log("catch Signup>>>", error.response);
      if (error.response && error.response.data && error.response.data.error) {
        switch (error.response.data.error) {
          case "Username already taken":
            setErrorMessage("Ce nom d'utilisateur est déjà pris");
            break;
          case "This email already has an account.":
            setErrorMessage("Cet email a déjà un compte.");
            break;
          default:
            setErrorMessage("une erreur est survenue");
        }
      }
    }
  };

  return (
    <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
      <View
        style={[styles.container, { marginTop: Constants.statusBarHeight }]}
      >
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View>
          <Text
            style={{
              marginVertical: 20,
              textAlign: "center",
              fontSize: 26,
              fontWeight: "bold",
              color: "grey",
            }}
          >
            Sign up
          </Text>
          <View>
            <TextInput
              placeholder="email"
              value={email}
              onChangeText={setEmail}
              style={[
                styles.input,
                {
                  marginBottom: 10,
                  padding: 10,
                },
              ]}
            />

            <TextInput
              placeholder="username"
              value={username}
              onChangeText={setUsername}
              style={[
                styles.input,
                {
                  marginBottom: 10,
                  padding: 10,
                },
              ]}
            />

            <TextInput
              style={{
                height: 100,
                width: "100%",
                borderColor: "#FFBAC0",
                borderWidth: 1,
                marginBottom: 10,
                marginVertical: 15,
                paddingLeft: 10,
                paddingTop: 10,
                textAlignVertical: "top",
              }}
              placeholder="Describe yourself in a few words..."
              multiline={true}
              textAlignVertical="top"
              onChangeText={(text) => {
                setDescription(text);
              }}
              value={description}
            />

            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[
                  styles.input,
                  {
                    marginBottom: 10,
                    padding: 10,
                  },
                ]}
              />
              <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="grey"
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 10, top: 12 }}
              />
            </View>

            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                style={[
                  styles.input,
                  {
                    marginBottom: 10,
                    padding: 10,
                  },
                ]}
              />
              <FontAwesome
                name={showConfirmPassword ? "eye" : "eye-slash"}
                size={20}
                color="grey"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: 10, top: 12 }}
              />
            </View>

            <View style={styles.register}>
              {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
              <View style={styles.errorBloc}>
                {errorMessage && <Text>{errorMessage}</Text>}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text>Sign up </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SignIn");
                }}
              >
                <Text style={styles.link}>
                  Already have an account ? Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  input: {
    borderBottomColor: "#FFBAC0",
    borderBottomWidth: 1,
    width: "100%",
    marginVertical: 15,
    marginBottom: 3,
  },
  button: {
    width: 200,
    height: 60,
    borderColor: "#EA5961",
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 50,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  register: {
    alignItems: "center",
  },
  link: {
    marginTop: 10,
    fontSize: 12,
    color: "grey",
  },
  errorBloc: {
    height: 30,
    color: "red",
  },
});
