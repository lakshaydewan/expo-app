import { supabase } from '@/lib/supabase'
import { getUserId } from '@/lib/util'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

export default function ForYouScreen() {
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPreferences()
  }, [])

  useEffect(() => {
    if (tags.length > 0) fetchCustomFeed()
    else setPosts([])
  }, [tags])

  const loadPreferences = async () => {
    const currentUserId = await getUserId()
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferred_tags')
      .eq('user_id', currentUserId)
      .single()
      
    if (data) setTags(data.preferred_tags || [])
    setLoading(false)
  }

  const savePreferences = async (updatedTags: string[]) => {
    setTags(updatedTags)
    const currentUserId = await getUserId()
    await supabase.from('user_preferences').upsert({
      user_id: currentUserId,
      preferred_tags: updatedTags
    })

    if (updatedTags.length > 0) fetchCustomFeed()
    else setPosts([])
  }

  const addTag = () => {
    const cleanTag = newTag.trim().toLowerCase()
    if (cleanTag && !tags.includes(cleanTag)) {
      const updated = [...tags, cleanTag]
      savePreferences(updated)
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove)
    savePreferences(updated)
  }

  const fetchCustomFeed = async () => {

    const preferredTags = tags

    if (preferredTags.length === 0) {
      setPosts([])
      return
    }

    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .overlaps('tags', preferredTags)
      .order('created_at', { ascending: false })
      .limit(20)

    if (postsError) {
      console.error('Error fetching posts:', postsError)
    } else {
      setPosts(posts as Post[])
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>🎯 For You</Text>

      <View style={styles.tagInputRow}>
        <TextInput
          value={newTag}
          onChangeText={setNewTag}
          placeholder="Add tag..."
          style={styles.input}
        />
        <Button title="Add" onPress={addTag} />
      </View>

      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={styles.tag}
            onPress={() => removeTag(tag)}
          >
            <Text style={styles.tagText}>#{tag} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subheading}>Your Feed</Text>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : posts.length === 0 ? (
        <Text style={{ paddingHorizontal: 16 }}>
          No posts found for your selected tags.
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>by {item.author_id}</Text>
              <Text>{item.content}</Text>
              <Text style={styles.tags}>
                Tags: {item.tags.join(', ')}
              </Text>
            </View>
          )}
        />
      )}
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
    paddingTop: 20,
    color: '#1e293b',
    letterSpacing: -0.5
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 16,
    color: '#334155',
    letterSpacing: -0.3
  },
  tagInputRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
    gap: 12
  },
  input: {
    flex: 1,
    borderColor: '#e2e8f0',
    borderWidth: 1.5,
    padding: 14,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginVertical: 16
  },
  tag: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  tagText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
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
    fontWeight: '600',
    fontSize: 18,
    color: '#0f172a',
    lineHeight: 24,
    marginBottom: 6
  },
  author: {
    color: '#64748b',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500'
  },
  tags: {
    fontStyle: 'italic',
    color: '#7c3aed',
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500'
  }
});
