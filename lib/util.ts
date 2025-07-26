import AsyncStorage from "@react-native-async-storage/async-storage"

export const getUserId = async () => {
    // get User email from AsyncStorage
    const user = await AsyncStorage.getItem('@user')
    const userObject = JSON.parse(user as string)
    const userId = userObject.email
    
    if (!user) {
        return
    }

    return userId
}