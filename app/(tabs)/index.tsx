import { supabase } from '@/lib/supabase'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Post = {
  id: string
  author_id: string
  title: string
  content: string
  tags: string[]
  created_at: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      fetchGlobalFeed()
    }, [])
  )

  const fetchGlobalFeed = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error.message)
      setError(error.message)
    } else {
      setPosts(data as Post[])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>See Whats New</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>by {item.author_id}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.tags}>Tags: {item.tags.join(', ')}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingVertical: 20,
    color: '#1e293b',
    letterSpacing: -0.5
  },
  card: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 24
  },
  author: {
    color: '#64748b',
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '500'
  },
  content: {
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 22,
    color: '#334155'
  },
  tagsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  tags: {
    fontStyle: 'italic',
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: '500'
  }
})
