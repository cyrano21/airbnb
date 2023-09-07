import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";

export default function AroundMe() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState({
    latitude: 48.856614,
    longitude: 2.3522219,
  });
  useEffect(() => {
    const askPermissionAndGetCoords = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let latitude = "";
      let longitude = "";

      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync();
        // const result = await Location.getLastKnownPositionAsync();
        console.log("====================================");
        console.log(
          "latitude>>>",
          result.coords.latitude,
          "longitude>>>",
          result.coords.longitude
        );
        console.log("====================================");
        if (result) {
          latitude = result.coords.latitude;
          longitude = result.coords.longitude;
          ``;
          console.log("====================================");
          console.log("lat>>", latitude, "lon>>", longitude);
          console.log("====================================");

          setCoords({
            latitude: result.coords.latitude,

            longitude: result.coords.longitude,
          });
        } else {
          console.log("No known location available.");
        }
      } else {
        console.log("Permission denied");
      }

      try {
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${latitude}&longitude=${longitude}`
        );

        console.log("data>>>", response);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log("catch>>", error);
      }
    };
    askPermissionAndGetCoords();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <TouchableOpacity>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
      >
        {data.map((room) => (
          <Marker
            key={room._id}
            coordinate={{
              latitude: room.location[1],
              longitude: room.location[0],
            }}
            title={room.title}
            onPress={() => {
              navigation.navigate("Room", { roomId: room._id });
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
