import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Button, NativeBaseProvider } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";
import Modal from 'react-native-simple-modal';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import MyTxPage from './myTxPage';

import walletData from '../data/walletData';
import { callBackend } from "../utils/backend";
import { justifyContent } from "styled-system";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      isDatePickerVisible: false,
      setDatePickerVisibility: false,
      include: false,
      isLoading: true,
      data: null
    };

    this.fetchData()
    setInterval(this.fetchData.bind(this), 10000)
  }
  
  async fetchData () {
    this.setState({ isLoading: true })
    
    const res = await callBackend('GET', '/api/wallets')
    if (res.success) this.setState({ data: res.data[0]})
    
    this.setState({ isLoading: false })
  }

  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  render() {
    return (
      <NativeBaseProvider>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.logoText}
            >밥 그릇</Text>
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
          <Text style={styles.header2}>
            {this.state.data?.alias || '로딩중'} {this.state.isLoading && <ActivityIndicator  color="black"/>}</Text>
          <View style={styles.container2}>
            <ImageBackground
              style={styles.image}
              source={require("../images/sot.png")}>
              <Text style={styles.logo2} >Crypthobin PQC Wallet</Text>
              <Text style={styles.logo3} > {this.state.data?.balance || '0'} TOL</Text>
              <Button style={{height:"30%", width:"20%", alignSelf:"flex-end", backgroundColor:"#00ff0000",resizeMode: "contain", 
            }}
            onPress={() => {
              this.setState({ open: true })
            }}
            >
              {/* <IconButton size={50}
                style={ styles.qricon }
                icon={() => (
                  <Ionicons name="ios-qr-code" size={40} color="orange"
                  
                  />
                )}
                onPress={() => {
                  this.setState({ open: true })
                }}
              /> */}
              <Ionicons name="ios-qr-code" size={40} color="orange"/>

              </Button>
            </ImageBackground>
          </View>
          {this.state.data && <MyTxPage walletId={this.state.data.id} />}
          <Modal
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({ open: false })}
            modalStyle={styles.modal}
          >
            <View style={{ justifyContent: "center", width: "100%", height:"100%", }}>
             
                <Image style={{ width:"90%", height:"60%", resizeMode: "contain",
    alignItems: "center", alignSelf:"center" }} source={{ uri: `${Constants.manifest.extra.BACKEND_URL}/qr/${this.state.data?.qrKey}.png` }}/>
             
              <View style={{ backgroundColor: "#FFE5CC", borderRadius: 5,height:"20%", alignSelf:"center", justifyContent:"center",}}>
                <Text style={styles.header4} >{this.state?.data?.address}</Text>
              </View>
              <TouchableOpacity
              style={{ height:"15%", backgroundColor:"green"}}
                onPress={() => this.setState({ open: false })}>
                <View style={styles.small_btn}>
                  <Text style={styles.small_text}>닫기</Text>
                </View>
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
    flex: 1,
    width: screenWidth,
    height: screenHeight - 60,
    alignItems: "center",
    backgroundColor: "white",
  },
  container2: {
    width: "90%",
    height: "30%",
    alignItems: "center",
    backgroundColor: "white",
  },
  container3: {
    flex: 1,
    width: screenWidth,
    height: "60%",
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
  logo2: {
    alignSelf: "flex-start",
    fontSize: 22,
    color: "white",
    fontFamily: "Mybold",
    paddingTop: "3%",
    marginLeft: "5%",
    height:"20%",
  },
  logo3: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
    fontFamily: "Mybold",
    marginLeft: "5%",
    height:"40%",
    paddingTop:"10%",
  },
  qricon: {
    paddingLeft:"5%",
    backgroundColor:"blue",
    alignSelf:"center"
  },
  header2: {
    fontSize: 35,
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingHorizontal: "6%",
    fontFamily: "Mybold",
  },
  header11: {
    fontSize: 25,
    alignSelf: "flex-start",
    paddingTop: "5%",
    paddingBottom: "3%",
    paddingHorizontal: "1%",
    paddingRight: "8%",
    fontFamily: "Mybold",
    color: "black"
  },
  header3: {
    fontSize: 25,
    alignSelf: "center",
    paddingTop: "20%",
    fontFamily: "My",
  },
  header4: {
    fontSize: 20,
    alignSelf: "center",
    padding: "3%",
    fontFamily: "My",
    textAlign: "center",
    color: "black"
  },
  small_header: {
    fontSize: 25,
    alignSelf: "flex-start",
    paddingLeft: "5%",
    paddingTop: "3%",
    paddingBottom: "3%",
    fontFamily: "Mybold",
  },
  image: {
    width: "100%",
    height: screenWidth/2.1,
    resizeMode: "cover",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: "black",
    borderWidth: 2,
  },
  cardContainer: {
    alignContent: "center",
    backgroundColor: "white",
    width: "90%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black",
    marginBottom: "2%",
  },
  type: {
    padding: "2%",
    alignSelf: "center",
  },
  date: {
    padding: "4%",
    alignSelf: "center",
  },
  address: {
    padding: "4%",
    justifyContent: "center",
    width: "40%",
    paddingLeft: "10%",
  },
  amount: {
    padding: "4%",
    justifyContent: "center",
    width: "40%",
  },
  modal: {
    alignSelf: "center",
    justifyContent:"space-between",
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: "5%",
    paddingTop: "10%"
  },
  small_btn: {
    alignSelf: "center",
    marginTop: "5%",
    padding: "2%",
    paddingHorizontal: "20%",
    fontSize: 25,
    backgroundColor: "orange",
    borderRadius: 5,
  },
  small_text: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: "My",
    color: "white",
  }
});
