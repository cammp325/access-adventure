import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import dayjs from "dayjs";

import {
  getFirestore,
  doc,
  collection,
  where,
  getDocs,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { TextInput, Card, Button, Avatar } from "react-native-paper";

const db = getFirestore();

const ChatScreen = (props) => {
  const { user } = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState({ sender: {}, receiver: {} });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const scrollRef = useRef();
  const receiverUid = props.route.params.uid;
  const senderUid = user.uid;

  const fetchMessages = () => {
    setIsFetching(true);
    //todo get messages from db call
    if (receiverUid && senderUid && !isFetching) {

      getDocs(
        collection(db, "messages"),
        where("receiverUid", "==", receiverUid),
        where("senderUid", "==", senderUid)
      ).then(async (data) => {

        setIsFetching(false);
        setMessages(
          data.docs
            .map((doc) => doc.data())
            .filter((d) =>( d.senderUid === senderUid && d.receiverUid === receiverUid)|| ( d.senderUid === receiverUid && d.receiverUid === senderUid))
            .sort((a, b) => a.dateSent - b.dateSent)
        );
        const newUsers = { ...users };
        newUsers.sender = (
          await getDocs(collection(db, "users"), where("uid", "==", senderUid))
        ).docs.find(doc => doc.data().uid === senderUid).data();
        newUsers.receiver = (
          await getDocs(
            collection(db, "users"),
            where("uid", "==", receiverUid)
          )
        ).docs.find(doc => doc.data().uid === receiverUid).data();
        setUsers(newUsers);
      });
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [receiverUid, senderUid]);

  console.log(users)

  const onSubmit = () => {
    if (message.length > 0) {
      setIsFetching(true);
      const newMessage = {
        message,
        senderUid,
        receiverUid,
        dateSent: new Date(),
      };
      addDoc(collection(db, "messages"), newMessage).then(() => {
        fetchMessages();
        setMessage("");
      });
    }
  };

  useEffect(() => {
    if (messages) scrollRef.current?.scrollToEnd();
  }, [messages]);

  console.log(senderUid, receiverUid)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scrollRef}>
        <View style={{ flex: 1, height: "100%" }}>
          {messages.map((message, index) => {
            return (
              <Card style={{ margin: 8, padding: 16, backgroundColor: message.senderUid === senderUid ? '#00B2FF' : '#43CC47' }} key={index}>
                <View style={{ flexDirection: message.senderUid === senderUid ? "row" : "row-reverse" }}>
                  <Avatar.Image
                    size={40}
                    source={{ url:  message.senderUid === senderUid ? users.sender.photoUrl :  users.receiver.photoUrl }}
                  />
                  <View style={{[`margin${message.senderUid === senderUid ? 'Left' : 'Right'}`]: 16, flex: 1}}>
                    <Text style={{textAlign: message.senderUid === senderUid ? 'left' : 'right'}}>{message.message}</Text>
                    <Text style={{ fontSize: 12, opacity: 0.5, marginTop: 8, textAlign: message.senderUid === senderUid ? 'left' : 'right' }}>
                      {dayjs(message.dateSent.toDate()).format(
                        "MMMM DD - hh:mma"
                      )}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
      <Card style={{ background: "#fff", padding: 16 }}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <TextInput
            style={{ flex: 1, marginRight: 8 }}
            placeholder="Enter a message"
            value={message}
            onChangeText={(text) => setMessage(text)}
            numberOfLines={2}
            label="Type a message"
          />
          <Button
            disabled={isFetching}
            onPress={() => onSubmit()}
            mode="contained"
            icon={"send"}
            labelStyle={{ marginTop: 40, marginLeft: 0, fontSize: 24 }}
          ></Button>
        </View>
      </Card>
    </View>
  );
};

export default ChatScreen;
