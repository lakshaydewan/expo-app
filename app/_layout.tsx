import { useColorScheme } from '@/hooks/useColorScheme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const checkAuth = async () => {
      try {
        const user = await AsyncStorage.getItem('@user')

        if (user) {
          setIsAuthenticated(true)
          return
        }
        
        if (!user) {
          return
        }
      } catch (e) {
        console.error('Error reading user from AsyncStorage:', e)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!fontsLoaded || isLoading || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isAuthenticated ? (
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaProvider>
      ) : (
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaProvider>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
