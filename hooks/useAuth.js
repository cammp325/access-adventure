import { View, Text } from "react-native";
import React, { createContext, useContext, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { ResponseType } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import firebase from "../firebase";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  addDoc,
  setDoc,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
const db = getFirestore();
// import * as Google from 'expo-google-app-auth';

initializeApp({
  apiKey: "AIzaSyBOaUNediehSWV0DUpKxhWfqM97fR9GXFM",
  authDomain: "access-adventure.firebaseapp.com",
  projectId: "access-adventure",
  storageBucket: "access-adventure.appspot.com",
  messagingSenderId: "12457190458",
  appId: "1:12457190458:web:699a916d9d0300ccc98103",
});

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});
let isWriting = false;
export const AuthProvider = ({ children }) => {
  const { navigate } = useNavigation();
  const [user, setUser] = useState();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "12457190458-ad50bq5o9k7grumjsb8an8806e8nj9th.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success" && !isWriting) {
      isWriting = true;
      const { id_token } = response.params;
      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then((value) => {
        const writeUser = () => {
          addDoc(collection(db, "profiles"), { uid: value.user.uid}).then(() => {
            addDoc(collection(db, "users"), {
              email: value.user.email,
              firstName: value.user.displayName.split(" ")[0] || '',
              lastName: value.user.displayName.split(" ")[1] || '',
              photoUrl: value.user.photoURL,
              uid: value.user.uid,
            })
            .catch(console.error)
            .finally(() => {
              isWriting = false;
            });
          })
          
          setUser(value.user);
          navigate("Home");
        };

        //check to see if a user exists
        getDocs(
          collection(db, "users"),
          where("uid", "==", value.user.uid)
        )
          .then((data) => {
            let userDoc;
            data.forEach(doc => {
              if( doc.data().uid === value.user.uid) {
                userDoc = doc
              }
            })

            if(!userDoc)
              writeUser();
            else {
              setUser(value.user);
              navigate("Home");
            }
          })
          .catch((e) => {
            console.error(e)
            writeUser();
          });
      });
    }
  }, [response]);


  // const signInWithGoogle = async () => {
  //     Google.useAuthRequest(config).then( async (logInResult) => {
  //         if(logInResult.type === 'success') {

  //         }
  //     })
  // }

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //     iosClientId: '12457190458-hber30k6am5n1m7f6kuavcdogusbdifd.apps.googleusercontent.com',
  //     expoClientId: '12457190458-hber30k6am5n1m7f6kuavcdogusbdifd.apps.googleusercontent.com',
  //   });

  // const signInWithGoogle = async () => {
  //     if (response?.type === 'success') {
  //       const { authentication } = response;
  //       console.log(response);
  //       }
  //   }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle: () => promptAsync(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
