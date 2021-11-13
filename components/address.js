import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput } from "react-native";
import { NativeBaseProvider } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { IconButton } from 'react-native-paper';
import Modal from 'react-native-simple-modal';

import addressData from "../data/addressData";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <NativeBaseProvider>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.logoText}
              onPress={() => {
                this.props.navigation.navigate("Wallet_main");
              }}>밥 그릇</Text>
            <IconButton
              style={{ marginRight: "5%", }}
              icon={() => (
                <MaterialCommunityIcons name="bowl-mix-outline" size={26} color="black"
                  style={styles.appinfo}
                />
              )}
              onPress={() => {
                this.props.navigation.navigate("App_info");
              }}
            />
          </View>
          <View style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: screenWidth

          }}>
            <Text style={styles.header2}>
              주소록</Text>
            <IconButton size={30}
              style={{ marginLeft: "55%", }}
              icon={() => (
                <Ionicons name="ios-person-add-outline" size={33} color="black" style={{ alignSelf: "center", paddingTop: "0.5%" }} />
              )}
              onPress={() => {
                this.setState({ open: true })
              }}
            />
          </View>
          <ScrollView>
            <View style={styles.container3}>
              {addressData.map((card, i) => {
                return (
                  <View style={styles.cardContainer} key={i}>
                    <View style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: "2%",
                    }}>
                      <Ionicons name="ios-person-circle" size={60} color="orange" />
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: "2%",
                        }}
                      >
                        <View style={styles.name}>
                          <Text style={{ fontSize: 25, fontFamily: "Mybold", }}>{card.name}</Text>
                        </View>
                        <View style={styles.address}>
                          <Text style={{ fontSize: 15, fontFamily: "My", }}>
                            {card.address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <Modal
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({ open: false })}
            modalStyle={styles.modal}
          >
            <View style={styles.modal}>
              <Text style={styles.header5}>주소 추가하기</Text>
              <View style={styles.formArea}>
                <Text style={styles.header4}>
                  이름</Text>
                <TextInput
                  style={styles.textForm}
                  placeholder={"ex) 이승아"} />
                <Text style={styles.header4}>
                  주소</Text>
                <TextInput
                  style={styles.textForm}
                  placeholder={"ex) pqc1 ... "} />
              </View>
              <TouchableOpacity
                style={{ margin: 5 }}
                onPress={() => this.setState({ open: false })}>
                <Text style={styles.header3}>완료</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </NativeBaseProvider>
    );
  }
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
  image: {
    width: "90%",
    height: "30%",
    resizeMode: "cover",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
  },
  container3: {
    flex: 1,
    width: screenWidth,
    height: "60%",
    alignItems: "center",
    backgroundColor: "white",
  },
  cardContainer: {
    alignContent: "center",
    backgroundColor: "white",
    width: "90%",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: "2%",
    borderColor: "black"
  },
  name: {
    padding: "1%",
  },
  address: {
    padding: "1%",
  },
  modal: {
    alignSelf: "center",
    alignItems: 'center',
    width: "80%",
    height: "60%",
    padding: "3%",
    backgroundColor: "white"
  },
  header5: {
    fontSize: 35,
    alignSelf: "center",
    paddingTop: "3%",
    paddingBottom: "3%",
    fontFamily: "Mybold",
  },
  header3: {
    fontSize: 25,
    alignSelf: "center",
    paddingTop: "20%",
    paddingBottom: "20%",
    fontFamily: "My",
  },
  header4: {
    fontSize: 25,
    alignSelf: "flex-start",
    paddingTop: "5%",
    paddingBottom: "2%",
    fontFamily: "My",
  },
  formArea: {
    width: "100%",
    height: "100%",
    marginTop: "10%",
    paddingBottom: '10%',
    alignSelf: "center",
  },
  textForm: {
    borderWidth: 2,
    borderRadius: 5,
    width: '100%',
    height: '25%',
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: "1%",
    alignSelf: "center",
    fontFamily: "My",
    fontSize: 18,
  },
});
