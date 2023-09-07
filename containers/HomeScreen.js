import { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Swiper from "react-native-swiper";
import LottieView from "lottie-react-native";

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        return token || "";
      } catch (error) {
        throw new Error("Error getting the token: " + error.message);
      }
    };

    const checkToken = async (token) => {
      if (!token) {
        console.log("Pas de Token. Redirection vers la page SignIn.");
        navigation.navigate("SignIn");
        return;
      }

      try {
        const response = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        // console.log("====================================");
        // console.log(response.data);
        // console.log("====================================");
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error(
            "le Token n'est pas valide. Redirection vers la page de connection"
          );
          navigation.navigate("SignIn");
        } else if (error.response && error.response.status === 503) {
          console.error(
            "Le service est actuellement indisponible. Veuillez réessayer plus tard."
          );
        } else {
          setError("Il y a eu un problème dans le téléchargement des données");
          console.error(error.message);
          setIsLoading(false);
        }
      }
    };

    const init = async () => {
      const token = await getToken();
      checkToken(token);
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <LottieView source={require("../assets/animation.json")} autoPlay loop />
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={[styles.container, { marginTop: Constants.statusBarHeight }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Room", { id: item._id })}
          >
            <View style={{ flex: 1 }}>
              <Swiper
                height={200}
                showsButtons={true}
                loop={true}
                activeDotColor="#000"
                dotColor="#999"
              >
                {item.photos &&
                  item.photos.map((photo, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri: photo.url }} style={styles.image} />
                      <View style={styles.price}>
                        <Text style={styles.priceText}>{item.price} €</Text>
                      </View>
                    </View>
                  ))}
              </Swiper>
              <View style={styles.infoContainer}>
                <View style={styles.detailsContainer}>
                  <Text
                    numberOfLines={1}
                    style={styles.title}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {[...Array(item.ratingValue)].map((_, i) => (
                      <FontAwesome key={i} name="star" size={16} color="gold" />
                    ))}
                    {[...Array(5 - item.ratingValue)].map((_, i) => (
                      <FontAwesome
                        key={i + item.ratingValue}
                        name="star-o"
                        size={16}
                        color="gold"
                      />
                    ))}
                    <Text> {item.reviews} reviews</Text>
                  </View>
                </View>
                {item.user && item.user.account && item.user.account.photo && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Profile", { id: item.user._id })
                    }
                  >
                    <Image
                      source={{ uri: item.user.account.photo.url }}
                      style={styles.userImage}
                    />
                  </TouchableOpacity>
                )}
                {/* {console.log("account.data:>>>>>", item.user.account)} */}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  price: {
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    bottom: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    color: "white",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    paddingBottom: 10,
    paddingTop: 10,
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
