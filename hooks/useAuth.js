import { View, Text } from 'react-native'
import React, { createContext, useContext, useState } from 'react'
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import firebase from '../firebase'
// import * as Google from 'expo-google-app-auth';

initializeApp({
        apiKey: "AIzaSyBOaUNediehSWV0DUpKxhWfqM97fR9GXFM",
        authDomain: "access-adventure.firebaseapp.com",
        projectId: "access-adventure",
        storageBucket: "access-adventure.appspot.com",
        messagingSenderId: "12457190458",
        appId: "1:12457190458:web:699a916d9d0300ccc98103"
       });

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
          clientId: '12457190458-ad50bq5o9k7grumjsb8an8806e8nj9th.apps.googleusercontent.com',
          },
      );

    React.useEffect(() => {
        console.log(response);
        if (response?.type === 'success') {
          const { id_token } = response.params;
          const auth = getAuth();
          const provider = new GoogleAuthProvider();
          console.log(provider);
          const credential = provider.credential(id_token);
          signInWithCredential(auth, credential);
//if dev mode then else statement called -
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
            user: null,
            signInWithGoogle:() => promptAsync()
        }}
    >
        { children }
    </AuthContext.Provider>
  )
};

export default function useAuth() {
    return useContext(AuthContext);
}