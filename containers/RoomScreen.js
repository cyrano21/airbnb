import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Swiper from "react-native-swiper";
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

export default function RoomScreen({ route }) {
  const navigation = useNavigation(); // Utilisez useNavigation ici
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFullDescription, setIsFullDescription] = useState(false);

  const roomId = route.params?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.log("Pas de Token. Redirection vers la page SignIn.");
          navigation.navigate("SignIn");
          return;
        }

        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${roomId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        console.log("roomData.location:", response.data.location);
        console.log("roomData.location[0]:", response.data.location[0]);

        setRoomData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching room data:", err); // Log l'erreur pour le débogage
        setError("An error occurred when fetching room data.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roomId, navigation]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Retour</Text>
      </TouchableOpacity>
      <View>
        <Swiper
          height={200}
          showsButtons={true}
          loop={true}
          activeDotColor="#000"
          dotColor="#999"
        >
          {roomData.photos &&
            roomData.photos.map((photo, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: photo.url }} style={styles.image} />
                <View style={styles.price}>
                  <Text style={styles.priceText}>{roomData.price} €</Text>
                </View>
              </View>
            ))}
        </Swiper>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{roomData.title}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(roomData.ratingValue)].map((_, i) => (
              <FontAwesome key={i} name="star" size={16} color="gold" />
            ))}
            {[...Array(5 - roomData.ratingValue)].map((_, i) => (
              <FontAwesome
                key={i + roomData.ratingValue}
                name="star-o"
                size={16}
                color="gold"
              />
            ))}
            <Text> {roomData.reviews} reviews</Text>
          </View>
        </View>
      </View>
      {roomData.description && roomData.description.trim().length > 0 ? (
        <Text
          numberOfLines={isFullDescription ? null : 3}
          style={styles.description}
          onPress={() => setIsFullDescription(!isFullDescription)}
        >
          {roomData.description}
        </Text>
      ) : (
        <Text style={styles.description}>Pas de description disponible.</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsFullDescription(!isFullDescription)}
      >
        <Text>{isFullDescription ? "Voir moins" : "Voir plus"}</Text>
      </TouchableOpacity>
      <MapView
        key={roomData._id}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 48.8564449,
          longitude: 2.4002913,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        <Marker
          coordinate={{
            latitude: roomData.location[1],
            longitude: roomData.location[0],
          }}
        />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
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
  map: {
    width: "100%",
    height: 300,
  },
});
