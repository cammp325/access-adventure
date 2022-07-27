import { View, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginBottom: 20, marginTop: 20}}>Welcome to Access Adventure!</Text>
      <Button
        icon="chat"
        mode="contained"
        style={{ marginTop: 12 }}
        onPress={() => navigation.navigate("Chat")}
      >
        Go to Chat Screen
      </Button>
      <Button
        icon="account-circle"
        mode="contained"
        style={{ marginTop: 12 }}
        onPress={() => navigation.navigate("Profile")}
      >
        Go to Profile Screen
      </Button>
    </View>
  );
};

export default HomeScreen;
