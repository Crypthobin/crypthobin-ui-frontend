import React, { Component, useCallback, useMemo } from "react";
import { StatusBar, SafeAreaView,Alert, BackHandler, StyleSheet, Text, View, Dimensions, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Button, NativeBaseProvider } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-simple-modal';
import MyTxPage from './myTxPage';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-easy-toast';
import { callBackend } from "../utils/backend";
import Constants from 'expo-constants';
import { LogBox } from 'react-native';


const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    //Text.defaultProps = Text.defaultProps || {};
    //Text.defaultProps.allowFontScaling = false;

    this.state = {
      open: false,
      isDatePickerVisible: false,
      setDatePickerVisibility: false,
      include: false,
      isLoading: true,
      data: null,
      toast:"",
    };

    //this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    this.fetchData()
    setInterval(this.fetchData.bind(this), 10000)
  }
  
  async fetchData () {
    this.setState({ isLoading: true })
    
    const res = await callBackend('GET', '/api/wallets')

    if (this.state.data) res.data[0].qrKey = this.state.data.qrKey
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



  // handleBackPress = () => {
  //   Alert.alert("", "로그아웃 하시겠습니까?", [
  //     {
  //       text: "취소",
  //       onPress: () => {return true} ,
  //     },
  //     { text: "확인", onPress: () => {this.props.navigation.navigate("Login");} }
  //   ]);
  //   return true;
  // };



  showCopyToast = () => {
    //toastRef.current.show('주소가 복사되었습니다.');
    toastRef="f"
  };
  
  render() {
    LogBox.ignoreAllLogs();
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
      
          <View style={styles.header2}>
          <Text style={styles.header22}>
            {this.state.data?.alias || '지갑을 불러오는 중입니다.'} </Text>
            </View>
          <View style={styles.container2}>
            <ImageBackground
              style={styles.image}
              source={require("../images/sot.png")}>
              <Text style={styles.logo2} >Crypthobin PQC Wallet</Text>
              <Text style={styles.logo3} > {this.state.data?.balance || '0'} TOL</Text>
              <Button style={{height:"30%", width:"20%", alignSelf:"flex-end", backgroundColor:"#00ff0000", 
              width: "50%",
              height: "40%",
              resizeMode: "contain",
              justifyContent:"flex-end"
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
              <Ionicons name="ios-qr-code" size={50} color="orange"
              />

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
             
              <View style={{ backgroundColor: "#FFE5CC", borderRadius: 5,height:"15%", alignSelf:"center", justifyContent:"center",
            marginVertical:"5%", flexDirection:"row", paddingHorizontal:"3%"}}>
                <Text style={styles.header4} >{this.state?.data?.address}</Text>
          

                <IconButton size={30}
            style={{width:"20%", alignSelf:"center", justifyContent:"center"}}
            icon={() => (
              <MaterialIcons name="content-copy" size={24} color="black" />
            )}
            onPress={() => {
              Clipboard.setString(this.state?.data?.address);
              //this.showCopyToast;
              this.toast.show('주소 복사 완료');
            }}
              />

            <Toast ref={(toast) => this.toast = toast}
            
            positionValue={screenHeight*0.98}
             fadeInDuration={200}
             fadeOutDuration={1000}
             style={{backgroundColor:'rgba(0, 0, 0, 0.7)'}}
             textStyle={{fontFamily:"My", color:"white", fontSize:20}}
            
            />


              </View>
      
              <TouchableOpacity
              style={{height:"15%"}}
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
    paddingTop: Platform.OS === `ios` ? 0 : 12 ,
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
    color: "black",
    width:"80%"
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
    height: "75%",
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
