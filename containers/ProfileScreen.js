// Importation des dépendances nécessaires
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../assets/colors";
import Message from "../components/Message";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ProfileScreen = ({ userToken, userId, setTokenAndId }) => {
  // Initialisation des states
  const [loading, setLoading] = useState(true);
  const [displayMessage, setDisplayMessage] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [isPictureModified, setIsPictureModified] = useState(false);
  const [isInfosModified, setIsInfosModified] = useState(false);

  // Appel de la fonction fetchData lors de la première ouverture de l'écran
  useEffect(() => {
    fetchData();
  }, []);

  // Récupérer les données de l'utilisateur
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      setUserName(data.username);
      setEmail(data.email);
      setDescription(data.description);

      if (data.photo) {
        setPicture(data.photo.url);
      }

      setLoading(false);
    } catch (error) {
      setDisplayMessage({
        message: "Une erreur est survenue",
        color: "error",
      });
    }
  };

  // Mettre à jour les informations de l'utilisateur
  const editInformations = async () => {
    setDisplayMessage(false);

    if (isPictureModified || isInfosModified) {
      setLoading(true);

      // Mise à jour de la photo
      if (isPictureModified) {
        try {
          const uri = picture;
          const uriParts = uri.split(".");
          const fileType = uriParts.at(-1);

          const formData = new FormData();
          formData.append("photo", {
            uri,
            name: `userPicture.${fileType}`,
            type: `image/${fileType}`,
          });

          const { data } = await axios.put(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture`,
            formData,
            {
              headers: {
                Authorization: "Bearer " + userToken,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (data) {
            setPicture(data.photo?.url);

            setDisplayMessage({
              message: "Votre profil a été mis à jour",
              color: "success",
            });
          }
        } catch (error) {
          setDisplayMessage({
            message:
              "Une erreur est survenue lors de la mise à jour de la photo",
            color: "error",
          });
        }
      }

      // Mise à jour des informations (sauf la photo)
      if (isInfosModified) {
        try {
          const body = {
            email: email,
            username: userName,
            description: description,
          };

          const { data } = await axios.put(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update`,
            body,
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          );

          if (data) {
            setUserName(data.username);
            setEmail(data.email);
            setDescription(data.description);

            setDisplayMessage({
              message: "Votre profil a été mis à jour",
              color: "success",
            });
          } else {
            setDisplayMessage({
              message: "Une erreur est survenue",
              color: "error",
            });
          }
        } catch (error) {
          setDisplayMessage({
            message: error.response.data.error,
            color: "error",
          });
        }
      }

      setIsPictureModified(false);
      setIsInfosModified(false);

      setLoading(false);
    } else {
      setDisplayMessage({
        message: "Modifiez au moins une information",
        color: "error",
      });
    }
  };

  // Sélection d'une photo depuis la bibliothèque
  const uploadPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        setPicture(result.assets[0].uri);

        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setDisplayMessage(false);
  };

  // Prendre une photo avec la caméra
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        setPicture(result.assets[0].uri);

        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setDisplayMessage(false);
  };

  // Rendu du composant
  return (
    <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
      <SafeAreaView style={styles.safeAreaView}>
        <View
          style={[styles.container, { marginTop: Constants.statusBarHeight }]}
        >
          <Image source={require("../assets/logo.png")} style={styles.logo} />

          {loading ? (
            <ActivityIndicator
              color={colors.pink}
              size="large"
              style={styles.activityIndicator}
            />
          ) : (
            <ScrollView>
              <View>
                {/* Section de la photo de profil */}
                <View style={styles.profile}>
                  <View style={styles.profilePic}>
                    {picture ? (
                      <Image
                        source={{ uri: picture }}
                        style={styles.profilePic}
                      />
                    ) : (
                      <FontAwesome name="user-circle" size={150} color="gray" />
                    )}
                  </View>

                  {/* Boutons pour uploader/photographier */}
                  <View style={styles.UploadBtn}>
                    <TouchableOpacity
                      onPress={uploadPicture}
                      style={styles.photoIcon}
                    >
                      <FontAwesome name="photo" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={takePicture}>
                      <FontAwesome name="camera" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Section des champs d'informations */}
                <View>
                  <TextInput
                    placeholder="email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                  />

                  <TextInput
                    placeholder="username"
                    value={userName}
                    onChangeText={setUserName}
                    style={styles.input}
                  />
                </View>

                <View style={styles.UploadBtn}>
                  <TouchableOpacity
                    onPress={editInformations}
                    style={styles.button}
                  >
                    <Text style={styles.text}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setTokenAndId(null, null);
                    }}
                  >
                    <Text style={styles.text}>Log out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

// Styles associés au composant
const styles = StyleSheet.create({
  // ... (insérer le style ici)
  container: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  UploadBtn: {
    gap: 20,
    alignItems: "center",
    marginVertical: 40,
  },
  input: {
    borderBottomColor: "#FFBAC0",
    borderBottomWidth: 1,
    width: "100%",
    marginVertical: 20,
    marginBottom: 3,
  },
  button: {
    width: 200,
    height: 60,
    borderColor: "#EA5961",
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 50,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    alignItems: "center",
    marginVertical: 30,
  },
});

export default ProfileScreen;
