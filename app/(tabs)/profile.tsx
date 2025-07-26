import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

// Ideally get this from your auth/session manager
const currentUserId = 'user@example.com'

export default function ProfileScreen() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [location, setLocation] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    const localUser = await AsyncStorage.getItem('@user')
    if (localUser) {
      const parsed = JSON.parse(localUser)
      setName(parsed.name)
      setEmail(parsed.email)
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@user')
    router.replace('/(auth)')
  }

  const deleteAccount = async () => {
    Alert.alert(
      'Are you sure?',
      'Deleting your account is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true)
            await supabase.from('posts').delete().eq('author_id', currentUserId)
            await supabase.from('user_preferences').delete().eq('user_id', currentUserId)
            await supabase.from('user_profiles').delete().eq('user_id', currentUserId)
            await supabase.auth.signOut()
            setLoading(false)
            Alert.alert('Deleted', 'Your account was deleted.')
          }
        }
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Profile Settings</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name..."
            readOnly
            style={styles.input}
          />
          {/* <TouchableOpacity style={styles.saveButton} onPress={saveName}>
            <Text style={styles.saveText}>Save Name</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Appearance</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
          <Text style={styles.label}>Permissions</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Location</Text>
            <Switch value={location} onValueChange={setLocation} />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerButton} onPress={deleteAccount}>
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20
  },
  section: {
    marginBottom: 28,
    gap: 12
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6
  },
  value: {
    fontSize: 16,
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  saveButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500'
  },
  logoutButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  dangerButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  dangerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
