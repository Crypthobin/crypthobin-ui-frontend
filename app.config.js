import 'dotenv/config'

export default {
  "expo": {
    "name": "밥그릇",
    "slug": "bobqurut",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.pqbobtol.wallet",
      "adaptiveIcon": {
        "foregroundImage": "./assets/logo.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "extra": {
      "BACKEND_URL": process.env.BACKEND_URL || 'https://crypto.pmh.codes'
    }
  },
}
