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
        icon="account-circle"
        mode="contained"
        style={{ marginTop: 12 }}
        onPress={() => navigation.navigate("Account")}
      >
        My Account
      </Button>
      <Button
        icon="account-group"
        mode="contained"
        style={{ marginTop: 12 }}
        onPress={() => navigation.navigate("Profile")}
      >
        My Profile
      </Button>
     
      <Button
        icon="cards"
        mode="contained"
        style={{ marginTop: 12 }}
        onPress={() => navigation.navigate("Swipe")}
      >
        Find Adventure Seekers
      </Button>
    </View>
  );
};

export default HomeScreen;
