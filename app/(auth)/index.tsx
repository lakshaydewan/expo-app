import { AntDesign } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Google from "expo-auth-session/providers/google"
import { router, Stack } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {

  const [req, res, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_ID!,
    iosClientId: process.env.EXPO_PUBLIC_IOS_ID!
  })

  async function handleSignIn() {
    const user = await AsyncStorage.getItem('@user')

    // ealry return if user is already authenticated
    if (user) return

    if (!user) {
      if (res?.type === 'success') {
        try {
          await getUserInfo(res.authentication?.accessToken as string)
        } catch (error) {
          console.log("Error getting user info", error)
        }
      }
    }
  }

  useEffect(() => {
    handleSignIn()
  }, [res])

  const getUserInfo = async (token: string) => {
    if (!token) return

    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      AsyncStorage.setItem('@user', JSON.stringify(data))
      router.replace('/(tabs)/foryou')
    } catch (error) {
      console.log("Error getting user info from API", error)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
          <AntDesign name="google" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})
