import { View, Text, Image, Touchable } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Card, Button, Title, Paragraph } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
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
const RETURN_ALL_USERS=false; //disable this if you need to debug something with the results

const filterUsersByTraits = (users, traits) => {
  if(RETURN_ALL_USERS) return users
  let relaventUsers = [];
  users.forEach(user => {
    if(user.miles <= traits.miles) {
        if(user.adventures?.some(adventure => traits.adventures.includes(adventure))) {
          relaventUsers.push(user);
        }
    }
  })

  return relaventUsers.length > 0 ? relaventUsers : users;
}

const SwipeScreen = ({navigation}) => {
  const { user } = useAuth();
  const docRef = useRef();
  const profileDocRef = useRef();

  const [userData, setUserData] = useState(["Loading"]);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    setIsFetching(true);
    if (user.uid && !docRef.current) {
      getDocs(collection(db, "users"))
        .then(async (data) => {
          docRef.current = data.docs.filter(doc => doc.data().uid !== user.uid);
          let newUserData = [];
          let profileData = [];

          profileDocRef.current = (
            await getDocs(
              collection(db, "profiles")
            )
          )
              
          profileDocRef.current.forEach((doc) => {
            if(doc.data().uid !== user.uid) 
              profileData.push({ ...doc.data() });
          });

          docRef.current.forEach((doc) => {
            newUserData.push({
              ...doc.data(),
              ...profileData.find((profile) => profile.uid === doc.data().uid),
            });
          });
          setUserData(filterUsersByTraits(newUserData, profileDocRef.current.docs.find(doc => doc.data().uid === user.uid).data()));
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [user.uid, refreshCount]);


  return (
    userData && userData.length > 1 && <View style={{ flex: 1 }}>
      <Swiper
        key={refreshCount}
        onTapCard={(cardIndex) => {
            navigation.navigate("Chat", {
                uid: userData[cardIndex].uid,
            });
        }}
        cards={userData}
        renderCard={(user) => {
          return (
            <Card
              style={{
                height: "100%",
                top: -35,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 3,
                shadowOffset: [0, 1],
                overflow: "hidden",
              }}
            >
              <Card.Cover
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  flex: 1,
                  resizeMode: "cover",
                }}
                source={{ uri: user.photoUrl }}
              />

              <Card.Title
                title={`${user.firstName} ${user.lastName}`}
                subtitle={(
                  user.adventures || ["Hiking", "Camping", "Holidays"]
                )?.join(", ")}
              />
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    flexWrap: "wrap",
                    marginTop: 4
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Level:</Text>
                  <Text style={{ marginLeft: 4, marginRight: 16 }}>
                    {user.level}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>Attitude:</Text>
                  <Text style={{ marginLeft: 4 }}>{user.attitude}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    flexWrap: "wrap",
                    marginTop: 8
                  }}
                >
                  <Text style={{ fontWeight: "bold"}}>Preferences:</Text>
                  <Text style={{ marginLeft: 4, marginRight: 16 }}>
                    {user.preferences}
                  </Text>
                  </View>
              </Card.Content>
            </Card>
          );
        }}
        onSwiped={(cardIndex) => {
     
        }}
        onSwipedAll={() => {
   
        }}
        cardIndex={0}
        backgroundColor={"transparent"}
        stackSize={3}
      >
        <View
          style={{
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            icon="refresh"
            mode="contained"
            disabled={isFetching}
            onPress={() => {
              docRef.current = null;
              setRefreshCount(refreshCount + 1);
            }}
            title="Press me"
          >
            Refresh
          </Button>
        </View>
      </Swiper>
    </View>
  );
};

export default SwipeScreen;
