import React from "react";
import { Button, Text, View } from "react-native"; // Assurez-vous que Button est importé depuis "react-native"

export default function SettingsScreen({ setToken }) {
  return (
    <View>
      <Text>Hello Settings</Text>
      <Button
        title="Log Out"
        onPress={() => {
          setToken(null, null);
        }}
      />
    </View>
  );
}
