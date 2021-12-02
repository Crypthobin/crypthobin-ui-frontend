import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function callBackend (method, path, body) {
  const token = await AsyncStorage.getItem('token')

  console.log('callBackend()', method, path)
  return fetch(`${Constants.manifest.extra.BACKEND_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'cryptohobin agent/v1; powered by fetch api',
      'Authorization': token ? `Bearer ${token}` : undefined
    },
    body: body ? JSON.stringify(body) : undefined
  }).then((res) => res.json())
}