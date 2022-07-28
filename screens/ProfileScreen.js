import { useState, useEffect, useRef } from "react";
import { View, ScrollView } from "react-native";
import { Checkbox, Card, TextInput, Button } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import {
  getFirestore,
  doc,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore();

const adventures = ["Skiing", "Backpacking", "Travel", "Hiking", "Holiday"];

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    adventures: [],
    attitude: "",
    level: "",
    preferences: '',
    miles: ''
  });

  const { user } = useAuth();

  const [isFetching, setIsFetching] = useState(false);

  const docRef = useRef();

  const onSubmit = () => {
    setIsFetching(true);
    updateDoc(doc(db, "profiles", docRef.current.id), {...formData, uid: user.uid})
      .then(() => {})
      .catch((e) => console.error(e))
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (user.uid && !docRef.current) {
      getDocs(collection(db, "profiles"), where("uid", "==", user.uid))
        .then((data) => {
          docRef.current =  data.docs.find((doc) => doc.data().uid === user.uid);
          const userData =   docRef.current.data()

          setFormData({
            adventures: userData.adventures,
            attitude: userData.attitude,
            level: userData.level,
            preferences: userData.preferences,
            miles: userData.miles
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user.uid]);

  return (
    <View style={{ padding: 16, flex: 1 }}>
      <ScrollView>
        <Card>
          <Card.Title
            title="Adventure"
            subtitle="Select adventures that you love"
          />

          {adventures.map((interest, index) => {
            return (
              <View key={index} style={{ flexDirection: "row" }}>
                <Checkbox.Item
                  position="leading"
                  status={
                    formData.adventures?.includes(interest)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => {
                    if (formData.adventures?.includes(interest)) {
                      setFormData({
                        ...formData,
                        adventures: formData.adventures?.filter(
                          (i) => i !== interest
                        ),
                      });
                    } else {
                      setFormData({
                        ...formData,
                        adventures: [...(formData.adventures || []), interest],
                      });
                    }
                  }}
                  label={interest}
                />
              </View>
            );
          })}
        </Card>
        <View style={{ marginTop: 16 }}>
          <Card>
            <Card.Title
              title="Skills"
              subtitle="Provide adventure information"
            />
            <View style={{ padding: 16, flexDirection: "row" }}>
              <TextInput
                label="Skill Level"
                value={formData.level || ""}
                style={{ flex: 1 }}
                onChangeText={(text) =>
                  setFormData({ ...formData, level: text })
                }
              />
            </View>
            <View style={{ padding: 16, flexDirection: "row" }}>
              <TextInput
                label="Preferences"
                value={formData.preferences || ""}
                style={{ flex: 1 }}
                onChangeText={(text) =>
                  setFormData({ ...formData, preferences: text })
                }
              />
            </View>

            <View style={{ padding: 16, flexDirection: "row" }}>
              <TextInput
                label="Meeting Mile Range"
                keyboardType="numeric"
                value={formData.miles || ""}
                style={{ flex: 1 }}
                onChangeText={(text) =>
                  setFormData({ ...formData, miles: text })
                }
              />
            </View>

            <View style={{ padding: 16, flexDirection: "row" }}>
              <TextInput
                label="Attitude"
                value={formData.attitude || ""}
                style={{ flex: 1 }}
                onChangeText={(text) =>
                  setFormData({ ...formData, attitude: text })
                }
              />
            </View>
          </Card>
          <View style={{ marginTop: 24, marginBottom: 16 }}>
            <Button disabled={isFetching}  icon="floppy" mode="contained" onPress={onSubmit}>
              Save
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
