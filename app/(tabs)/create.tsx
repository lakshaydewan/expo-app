import { supabase } from '@/lib/supabase'
import { getUserId } from '@/lib/util'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Replace with value from secure storage or context

export default function CreatePostScreen() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>()

  useEffect(() => {
    getUserId().then(setCurrentUserId)
  }, [])

  const handleSubmit = async () => {
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)

    if (!trimmedTitle || !trimmedContent || tagArray.length === 0) {
      Alert.alert('Missing fields', 'Please fill in all fields including tags.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('posts').insert([
      {
        author_id: currentUserId,
        title: trimmedTitle,
        content: trimmedContent,
        tags: tagArray
      }
    ])

    setLoading(false)

    if (error) {
      console.error('Error creating post:', error.message)
      Alert.alert('Error', error.message)
    } else {
      if (!error) {
        setSuccess(true)
      }
      setTitle('')
      setContent('')
      setTags('')
    }
  }

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✅ Post created successfully!</Text>
          <Button
            title="Create Another"
            onPress={() => {
              setSuccess(false)
              setTitle('')
              setContent('')
              setTags('')
            }}
          />
          <View style={{ height: 12 }} />
        </View>
      </SafeAreaView>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>📝 Create Post</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title..."
          style={styles.input}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write your post..."
          multiline
          numberOfLines={5}
          style={[styles.input, styles.textarea]}
        />

        <Text style={styles.label}>Tags (comma-separated)</Text>
        <TextInput
          value={tags}
          onChangeText={setTags}
          placeholder="e.g. react, expo, mobile"
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <Button title="Create Post" onPress={handleSubmit} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  scroll: {
    padding: 24
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1e293b',
    letterSpacing: -0.5
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: -0.2
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc'
  },
  successText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 0,
    color: '#059669',
    textAlign: 'center',
    lineHeight: 28
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#ffffff',
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
  textarea: {
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  }
});


