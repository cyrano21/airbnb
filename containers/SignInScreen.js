import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function SignInScreen({ setTokenAndId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation(); // Utilisez useNavigation() ici

  const handleSumit = async () => {
    if (email && password) {
      if (errorMessage !== null) {
        setErrorMessage(null);
      }
      try {
        const { data } = await axios.post(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in`,
          {
            email,
            password,
          }
        );
        console.log("====================================");
        console.log(data);
        console.log("====================================");
        if (data.token && data.id) {
          setTokenAndId(data.token, data.id);
        } else {
          setErrorMessage("An error occured");
        }
      } catch (error) {
        if (error.response.status === 401) {
          setErrorMessage("incorrect credentials");
        } else {
          setErrorMessage("An error occured");
        }
      }
    } else {
      ("Please fill all fields");
    }
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />

      <KeyboardAwareScrollView
        style={{ marginTop: Constants.statusBarHeight }}
        contentContainerStyle={styles.container}
      >
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.main}>
          <Text
            style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
          >
            Sign in
          </Text>
          <View style={styles.form}>
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
          </View>

          <View style={styles.register}>
            {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
            <View style={styles.errorBloc}>
              {errorMessage !== "" && <Text>{errorMessage}</Text>}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSumit}
              disabled={loading}
            >
              <Text>Sign In </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp"); // Utilisez la navigation ici
              }}
            >
              <Text style={styles.link}>No account ? Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
  title: {
    color: "black",
  },
  register: {
    alignItems: "center",
  },
  form: {
    marginTop: 50,
  },
  link: {
    marginTop: 10,
    fontSize: 12,
    color: "grey",
  },
  errorBloc: {
    height: 30,
  },
});
