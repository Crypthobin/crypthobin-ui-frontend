import React, {useState, useCallback, useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, Dimensions, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Font from 'expo-font';
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
import Start from './components/start';
import { Asset } from 'expo-asset';

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        await Asset.loadAsync([
          require('./images/sot.png'),
          require('./images/bob.png'),
          require('./images/test.png'),      
        ]);
        
        await Font.loadAsync({
          My: require('./assets/fonts/BinggraeSamanco.ttf'),
          'Mybold': {
            uri: require('./assets/fonts/BinggraeSamanco-Bold.ttf'),
            display: Font.FontDisplay.FALLBACK,
          },
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View
      style={{height: screenHeight, backgroundColor:"blue" }}
      onLayout={onLayoutRootView}>
      <Start/>
    </View>
  );
}