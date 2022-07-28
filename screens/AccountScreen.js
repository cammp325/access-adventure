import React, { useEffect, useState, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import {
  getFirestore,
  doc,
  collection,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { NativeModules } from "react-native";
import useAuth from "../hooks/useAuth";
import * as ImagePicker from "expo-image-picker";

const getPictureBlob = (uri) => {
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

const db = getFirestore();

import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const storage = getStorage();

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    photoUrl: "",
    instagram: "",
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      const blob = await getPictureBlob(result.uri);
      // binary data
      const storageRef = ref(storage, "profile_photos/" + user.uid);
      uploadBytes(storageRef, blob)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, photoUrl: downloadURL });
          });
        })
        .catch((e) => console.error(e));
    }
  };

  const userDocRef = useRef();

  useEffect(() => {
    if (user.uid && !userDocRef.current) {
      console.log(user.uid)
      getDocs(collection(db, "users"), where("uid", "==", user.uid))
        .then((data) => {
          userDocRef.current = data.docs.find((doc) => doc.data().uid === user.uid);
          const userData = userDocRef.current.data();

          setFormData({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            photoUrl: userData.photoUrl,
            instagram: userData.instagram,
          });
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
      updateDoc(doc(db, "users", userDocRef.current.id), formData)
        .then(() => {})
        .catch((e) => console.error(e))
        .finally(() => {
          setIsFetching(false);
        });
    }
  };

  const onDelete = () => {
    setIsFetching(true);
    if (userDocRef.current) {
      deleteDoc(doc(db, "users", userDocRef.current.id))
        .then(() => {})
        .catch((e) => console.error(e))
        .finally(() => {
          setIsFetching(false);
          NativeModules.DevSettings.reload();
        });
    }
  };
  return (
    <View style={{ alignItems: "center", paddingTop: 16 }}>
      <TouchableOpacity
        onPress={() => {
          pickImage();
        }}
      >
        <Avatar.Image size={100} source={{ url: formData.photoUrl }} />
      </TouchableOpacity>
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
        <TextInput
          label="Instagram"
          value={formData.instagram}
          style={{ flex: 1 }}
          onChangeText={(text) => setFormData({ ...formData, instagram: text })}
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
        <Button
          disabled={isFetching}
          icon="trash-can"
          mode="contained"
          style={{ marginLeft: 8 }}
          color="red"
          onPress={onDelete}
        >
          Delete
        </Button>
      </View>
    </View>
  );
};
export default ProfileScreen;
