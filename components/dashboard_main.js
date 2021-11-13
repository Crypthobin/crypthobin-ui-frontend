import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { NativeBaseProvider } from 'native-base';
import { MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { ScrollView } from "react-native-gesture-handler";

import blockData from "../data/blockData.json";
import networkData from "../data/networkData.json";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const Dashboard = ({ navigation }) => {

  blockData.sort((a, b) => (a.index > b.index ? -1 : 1));

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
        <Text style={styles.header2}>
          대시보드</Text>
        <View style={{ flexDirection: "row", width: "90%", height: "22%", justifyContent: "center" }}>
          <View style={styles.box}>
            <Text style={styles.header3}>
              현재 블록은</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingRight: "8%" }}>
              <FontAwesome name="cubes" size={40} color="white"
                style={{ alignSelf: "flex-end", paddingBottom: "5%", paddingLeft: "8%" }} />
              <View style={{ flexDirection: "row" }}>
                {networkData.map((network) => {
                  return (
                    <Text style={styles.num} > {network.user_num}</Text>
                  );
                })}
                <Text style={styles.header4}>
                  개</Text>
              </View>
            </View>
          </View>
          <View style={styles.box}>
            <Text style={styles.header3}>
              현재 사용자는</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingRight: "8%" }}>
              <FontAwesome5 name="people-carry" size={40} color="white"
                style={{ alignSelf: "flex-end", paddingBottom: "7%", paddingLeft: "8%" }} />
              <View style={{ flexDirection: "row" }}>
                {networkData.map((network) => {
                  return (
                    <Text style={styles.num} > {network.block_num}</Text>
                  );
                })}
                <Text style={styles.header4}>명</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.header33}>
          최근 10개 블록 내역</Text>
        <ScrollView>
          <View style={styles.container3}>
            {blockData.map((card, i) => {
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
                          {card.age}분 전
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardContainer2}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: "5%",
                        }}>
                        <View style={{ flexDirection: "column" }}>

                          <View style={{ alignSelf: "flex-start" }}>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>채굴자</Text>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>{card.miner} 에게</Text>
                          </View>
                          <View style={{ alignSelf: "flex-end" }}>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>{card.reward} TOL 보상</Text>
                          </View>
                          <View style={styles.tx_num}>
                            <Text style={{ fontSize: 17, fontFamily: "My", }}>확정 받은 거래 수는 {card.tx_num} 개</Text>
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
    fontWeight: "bold",
    fontSize: 28,
    color: "black",
    fontFamily: "Mybold",
    paddingLeft: "6%",
  },
  appinfo: {
    paddingRight: "5%",
  },
  header2: {
    fontSize: 35,
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingHorizontal: "6%",
    fontFamily: "Mybold",
  },
  header3: {
    fontSize: 22,
    alignSelf: "flex-start",
    paddingTop: "5%",
    paddingHorizontal: "6%",
    paddingBottom: "12%",
    fontFamily: "My",
    color: "black",
  },
  header33: {
    fontSize: 22,
    alignSelf: "flex-end",
    paddingHorizontal: "8%",
    fontFamily: "My",
    paddingBottom: "2%",
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
    width: "47%",
    height: "80%",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    margin: "2%",
    backgroundColor: "orange",
    paddingBottom: "1%",
  },
  num: {
    fontSize: 50,
    alignSelf: "flex-end",
    fontFamily: "My",
    color: "black",
  },
  header4: {
    fontSize: 22,
    alignSelf: "flex-end",
    paddingTop: "5%",
    paddingBottom: "7%",
    fontFamily: "My",
    paddingLeft: "1%",
    color: "black",
  },
  container3: {
    flex: 1,
    width: screenWidth,
    height: "50%",
    alignItems: "center",
    backgroundColor: "white",
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