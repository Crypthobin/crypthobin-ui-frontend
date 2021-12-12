import React from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { NativeBaseProvider } from 'native-base';

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const App_info = () => {

  let appInfo = [
    {
      app_info: "'밥 그릇' 앱은 양자 내성을 가진 암호화폐를 기반으로 한 지갑입니다. 사용자가 보다 안전하게 코인을 관리하고 거래할 수 있도록  서비스를 제공합니다.",
      team: "BoB 10기 보안제품개발트랙 team.Crypthobin",
      member: "장호빈, 신은규, 이승아, 유재겸, 박민혁"
    }
  ]

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Text style={styles.header2}>
          밥 그릇 앱 정보</Text>
        <Text style={styles.header3}>
          '밥 그릇' 이란 ?</Text>
        
            <Text style={styles.textForm}>
              '밥 그릇' 앱은 양자 내성을 가진 암호화폐를 기반으로 한 지갑입니다. 
              {"\n"}사용자가 보다 안전하게 코인을 관리하고 거래할 수 있도록 서비스를 제공합니다.
            </Text>
          
   
        <Text style={styles.header3}>
          만든 이</Text>
        <View style={{ flexDirection: "row", height: "20%", marginBottom: "6%" }}>
          <Image style={styles.image}
            source={require("../images/test.png")}
          />
          <Image style={styles.image}
            source={require("../images/bob.png")}
          />
        </View>
        {appInfo.map((self) => {
          return (
            <Text style={styles.textForm2}>{self.team}</Text>
          )
        })}
        {appInfo.map((self) => {
          return (
            <Text style={styles.textForm2}>{self.member}</Text>
          )
        })}
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    alignItems: "center",
    backgroundColor: "white",
  },
  header2: {
    fontSize: 35,
    alignSelf: "flex-start",
    paddingTop: "10%",
    paddingHorizontal: "6%",
    fontFamily: "Mybold",
  },
  header3: {
    fontSize: 25,
    alignSelf: "center",
    paddingTop: "5%",
    paddingBottom: "3%",
    paddingHorizontal: "7%",
    fontFamily: "Mybold",
  },
  image: {
    width: "39%",
    height: "100%",
    resizeMode: "contain",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "black",
    margin: "1%",
  },
  textForm: {
    borderWidth: 2,
    borderColor: 'black',
    width: '80%',
    height: '21%',
    padding: "8%",
    marginBottom: "5%",
    alignSelf: "center",
    borderRadius: 10,
    fontFamily: "My",
    fontSize: 18,
    alignItems:"center",
    justifyContent:"center",
    textAlign:"center",
    textAlignVertical:"center",
  },
  textForm2: {
    width: '80%',
    padding: "1%",
    alignSelf: "center",
    borderRadius: 5,
    fontFamily: "My",
    fontSize: 18,
    textAlign: "center",
  },
  buttonArea: {
    width: '80%',
    height: "10%",
    alignSelf: "center",
  },
  sendButton: {
    borderRadius: 5,
    width: "40%",
    backgroundColor: "#D8D8D8",
    alignSelf: "center",
  },
  sendText: {
    color: "black",
    fontWeight: "400",
    fontSize: 15,
    fontFamily: "My",
  },
});

export default App_info;