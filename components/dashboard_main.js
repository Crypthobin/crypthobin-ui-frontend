import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { NativeBaseProvider } from 'native-base';
import { MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { ScrollView } from "react-native-gesture-handler";

import { callBackend } from "../utils/backend";
import { displayedAt } from "../utils/convert";
import { width } from "styled-system";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const Dashboard = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [networkData, setNetworkData] = useState({
    userCount: 0,
    blockCount: 0,
    blocks: []
  });

  useEffect(() => {
    fetchData()
    setInterval(fetchData, 10000)
  }, [])

  async function fetchData () {
    setIsLoading(true)
    const res = await callBackend('GET', '/api/info')
    if (res.success) setNetworkData(res.data)
    setIsLoading(false)
  }
  
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logoText}
            onPress={() => {
              navigation.navigate("Wallet_main");
            }}>밥 그릇</Text>
          <IconButton
            style={{ marginRight: "5%", }}
            icon={() => (
              <MaterialCommunityIcons name="bowl-mix-outline" size={26} color="black"
                style={styles.appinfo}
              />
            )}
            onPress={() => {
              navigation.navigate("App_info");
            }}
          />
        </View>
        <View style={styles.header2}>
          <Text style={styles.header22}>
            대시보드 </Text>
            {isLoading && <Text
            style={{ alignSelf:"center"}}
            > <ActivityIndicator  color="orange"
            /></Text> }
            </View>
        <View style={{ flexDirection: "column", width: "90%", height: screenWidth/2, justifyContent: "space-between",
       }}>
          <View style={styles.box}>
            <Text style={styles.header3}>
              현재 블록은</Text>
            <View style={{ width:"100%",  height:"60%",flexDirection: "row", justifyContent: "space-between", paddingRight: "2%"
           }}>
              <FontAwesome name="cubes" size={40} color="white"
                style={{ width:"25%",alignSelf: "flex-end", paddingBottom: "3%", paddingLeft: "8%",
                 }} />
              <View style={{  width:"60%", flexDirection: "row", marginRight:"3%" }}>
                <Text style={styles.num} > {networkData.blockCount}</Text>
                <Text style={styles.header4}>개</Text>
              </View>
            </View>
          </View>
          <View style={styles.box}>
            <Text style={styles.header3}>
              현재 사용자는</Text>
              <View style={{ 
                width:"100%",  height:"60%",flexDirection: "row", justifyContent: "space-between", paddingRight: "2%" }}>
              <FontAwesome5 name="people-carry" size={40} color="white"
                style={{ width:"25%", alignSelf: "flex-end", paddingBottom: "3%", paddingLeft: "8%" }} />
              <View style={{ width:"60%", flexDirection: "row", marginRight:"3%" }}>
                <Text style={styles.num} > {networkData.userCount}</Text>
                <Text style={styles.header4}>명</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.header33}>최근 10개 블록 내역</Text>
        <ScrollView>
          <View style={styles.container3}>
            {networkData.blocks.map((card, i) => {
              if (i <= 9) {
                return (
                  <View style={styles.cardContainer} key={i}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: "2%", paddingHorizontal: "2%" }}>
                      <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons name="pickaxe" size={24} color="orange" />
                        <Text style={{ fontSize: 25, fontFamily: "Mybold", paddingLeft: "2%" }}>{card.index}번째 블록</Text>
                      </View>
                      <View style={{ alignSelf: "flex-end" }}>
                        <Text style={{ fontSize: 20, fontFamily: "My", }}>
                          {displayedAt(card.time)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardContainer2}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: "5%",
                          alignSelf:"center",
                        }}>
                        <View style={{ flexDirection: "column", alignSelf:"center", width:"100%" }}>

                          <View style={{ alignSelf: "flex-start" }}>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>채굴자</Text>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>{card.miner} 에게</Text>
                          </View>
                          <View style={{ alignSelf: "flex-end" }}>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>{card.minerReturns} TOL 보상</Text>
                          </View>
                          <View style={styles.tx_num}>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>확정 받은 거래 수는 {card.txCount} 개</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }
            })}
          </View>
        </ScrollView>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight - 60,
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    width: screenWidth,
    backgroundColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    paddingBottom: "0%",
    paddingTop: "5%",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    // shadowColor: "rgb(50, 50, 50)",
    //     shadowOpacity: 0.2,
    //     shadowRadius: 5,
    //     shadowOffset: {
    //       height: -3,
    //       width: 0,
    //     },
  },
  logoText: {
    textAlign: "center",
    fontSize: 35,
    color: "black",
    fontFamily: "Mybold",
    paddingLeft: "6%",
  },
  appinfo: {
    paddingRight: "5%",
  },
  header2: {
    flexDirection:"row",
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingHorizontal: "6%",
  },
  header22: {
    fontFamily: "Mybold",
    fontSize: 35,
  },
  header3: {
    fontSize: 22,
    alignSelf: "flex-start",
    paddingHorizontal: "6%",
    fontFamily: "My",
    color: "black",
    height:"40%",
    alignContent:"center",
    paddingTop:"2%"
  },
  header33: {
    fontSize: 22,
    alignSelf: "flex-end",
    paddingHorizontal: "8%",
    fontFamily: "My",
    paddingTop: "4%",
  },
  image: {
    width: "90%",
    height: "30%",
    resizeMode: "cover",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
  },
  box: {
    width: "100%",
    height: "48%",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "orange",
  },
  num: {
    fontSize: 50,
    alignSelf: "flex-end",
    fontFamily: "My",
    color: "black",
    paddingBottom:"5%",
    paddingRight:"2%",
    textAlign:"right",
    width:"90%",
  },
  header4: {
    fontSize: 22,
    alignSelf: "flex-end",
    marginBottom: "8%",
    fontFamily: "My",
    marginRight:"2%",
    paddingLeft: "1%",
    color: "black",
    width:"10%",
  },
  container3: {
    flex: 1,
    width: screenWidth,
    height: "60%",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop:"3%",
  },
  cardContainer: {
    alignContent: "center",
    backgroundColor: "white",
    width: "90%",
    paddingBottom: "5%",
  },
  cardContainer2: {
    alignContent: "center",
    backgroundColor: "white",
    width: "100%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black",
  },
});

export default Dashboard;