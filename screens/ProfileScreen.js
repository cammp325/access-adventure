import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import {
  getFirestore,
  addDoc,
  setDoc,
  getDoc,
  doc,
  collection,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";
import useAuth from "../hooks/useAuth";
const db = getFirestore();

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const userDocRef = useRef();

  useEffect(() => {
    if (user.uid && !userDocRef.current) {
      getDocs(collection(db, "users"), where("uid", "==", user.uid))
        .then((data) => {
         
          userDocRef.current = data.docs[0];
          const userData = data.docs[0].data()
    
          setFormData({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
          })
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user.uid]);

  const [isFetching, setIsFetching] = useState(false);

  const onSubmit = () => {
    setIsFetching(true);
    if (userDocRef.current) {
      if (formData.email) userDocRef.current.email = formData.email;
      if (formData.firstName) userDocRef.current.firstName = formData.firstName;
      if (formData.lastName) userDocRef.current.lastName = formData.lastName;
   
      updateDoc(doc(db, "users", userDocRef.current.id), formData)
        .then(() => {})
        .catch((e) => console.error(e))
        .finally(() => setIsFetching(false));
    }
  };

  return (
    <View style={{ alignItems: "center", paddingTop: 16 }}>
      <Avatar.Image
        size={100}
        source={require("../assets/adaptive-icon.png")}
      />
      <View style={{ padding: 16, flexDirection: "row" }}>
        <TextInput
          label="First Name"
          value={formData.firstName}
          style={{ flex: 1 }}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        />
      </View>
      <View style={{ padding: 16, flexDirection: "row" }}>
        <TextInput
          label="Last Name"
          value={formData.lastName}
          style={{ flex: 1 }}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        />
      </View>
      <View style={{ padding: 16, flexDirection: "row" }}>
        <TextInput
          label="Email"
          value={formData.email}
          style={{ flex: 1 }}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
      </View>
      <View style={{ padding: 16, flexDirection: "row" }}>
        <Button
          disabled={isFetching}
          icon="floppy"
          mode="contained"
          onPress={onSubmit}
        >
          Save
        </Button>
      </View>
    </View>
  );
};
export default ProfileScreen;
