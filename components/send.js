import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Alert } from "react-native";
import { NativeBaseProvider } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-simple-modal';
import Checkbox from 'expo-checkbox';
import { FontAwesome5 } from '@expo/vector-icons';
import { callBackend } from "../utils/backend";
import { justifyContent, right, width } from "styled-system";
import { LogBox } from 'react-native';

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const send_value = /^[0-9]+[.][0-9]*[1-9]$|^[0-9]*[1-9]+[0]*$|^[0]+[.][0-9]*[1-9]$|(^[0-9]+[.][0-9]*[1-9]+[0]+)$|^[0-9]*[1-9]+[0-9]*[.][0]+$/;

function isInt(n){
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}

function calc(arr){
  var decimalN = 0; 

  for(var j=0; j<arr.length; j++ ){
    
    var n = arr[j]; 
   
     if ( !isInt(n) && !isFloat(n) ){
       return("오류");
     }

     if(!Number.isInteger(n)){ 
       var d = String(n).split('.')[1].length; 
       if(decimalN < d) decimalN = d; 
      } 
    } 
    //return decimalN;
    var res = parseFloat(arr[0]-arr[1]).toFixed(decimalN);
    return res;
  }

 function search(str) {
  var count = 0;
  var searchChar = '.'; 
  var pos = str.indexOf(searchChar);

  while (pos !== -1) {
    count++;
    pos = str.indexOf(searchChar, pos + 1);
  }

  return count;
   
 }

 function search1(str) {
  var count = 0;
  var searchChar = '-'; 
  var pos = str.indexOf(searchChar);

  while (pos !== -1) {
    count++;
    pos = str.indexOf(searchChar, pos + 1);
  }

  return count;
   
 }

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: "",
      amount: 0,
      balance: 0,
      walletId: '',
      open: false,
      select: false,
      isLoading: true,
      pickerData: [],
      picker_value: 0,
    };

    this.fetchData()
    setInterval(this.fetchData.bind(this), 10000)
  }

  async fetchData () {
    this.setState({ isLoading: true });

    const addrRes = await callBackend('GET', '/api/addresses')
    const walletRes = await callBackend('GET', '/api/wallets')

    this.setState({
      balance: walletRes.data[0].balance,
      walletId: walletRes.data[0].id,
      pickerData: addrRes.data.map((v) => ({
        label: v.explanation,
        value: v.walletAddress
      }))
    })

    this.setState({ isLoading: false });
  }

  checkInput = () => {
    const send = {
      address: this.state.address,
      amount: this.state.amount,
      balance: this.state.balance
    };
    if (!send.address || !send.amount) {
      Alert.alert("","주소와 금액을 정확히 입력해 주세요.",[{text:"확인"}]);
      return;
    }
    if (send.address.length != 43  || !(/pqc/).test(this.state.address)) {
      Alert.alert("","올바른 주소를 입력해 주세요.\n(43자리)",[{text:"확인"}]);
      return;
    }
    if (send.balance < 0) {
      Alert.alert("잔액 부족","송금액은 내 잔액을 초과할 수 없습니다.",[{text:"확인"}]);
      return;
    }

    if (!send_value.test(this.state.amount)) {
      Alert.alert("송금액 형식 오류","송금액을 다시 한 번 확인해 주세요.\n(0TOL 송금 불가능)",[{text:"확인"}]);
      return;
    }

    if (this.state.select == true) {
      this.state.name = "(저장되지 않은 주소)";
    }
    this.setState({ open: true });
  };

  async onSend() {
    // 송금 프로세스
    const sendRes = await callBackend('POST', `/api/wallets/${this.state.walletId}/remittance`, {
      to: this.state.address,
      amount: parseFloat(this.state.amount)
    })

    if (!sendRes.success) {
      //alert(`예상치 못한 오류: ${sendRes.message}\n수수료를 낼수 있는 금액인지 확인해 보세요.`)
      Alert.alert("송금 실패",`${sendRes.message}\n수수료를 낼 수 있는 금액인지 확인해 보세요.`,[{text:"확인"}]);
      return
    }

    // 모달 창 닫기
    this.setState({ open: false, amount: 0 });
    this.setState({ address: "" });
    this.setState({ amount: 0 });
    this.setState({ select: false });
    Alert.alert("","송금 완료 !",[{text:"확인"}]);
  };

  render() {
    LogBox.ignoreAllLogs();

    const placeholder = {
      label: '주소를 선택해주세요.',
      value: null,
      color: 'black',
    };

    return (
      <NativeBaseProvider>
        <View
            style={{ width:"100%", height:"100%", backgroundColor:"white"
            }}
            >
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
          <Text style={styles.header2}>
            송금하기</Text>
          <View style={styles.formArea}>
            <View style={{ flexDirection: "row", paddingBottom: "3%" }}>
              <Text style={styles.header33}>
                보낼 주소</Text>
                <View style={{ flexDirection: "row", width:"40%", justifyContent:"flex-end"}}>
              <Checkbox
                value={this.state.select}
                onValueChange={() => {this.setState({ select: !this.state.select })
                this.setState({ address: ""  })}}
                color={this.state.select ? 'orange' : undefined}
                style={{alignSelf:"center"}}
              />
              <Text onPress={() => {
            this.setState({ address: ""  })
            this.setState({ select: !this.state.select })
            }
            } style={{ alignSelf:"center", paddingLeft:"10%", fontFamily: "My", fontSize: 20 }}>직접 입력</Text>
              </View>
            </View>
            {this.state.select &&
              <TextInput
                value={this.state.address}
                style={styles.textForm}
                placeholder={"ex) pqc1qyau3w0qkv4v3rla6fq5enjy4yhs23mrhyw7sde"}
                returnKeyType="done"
                maxLength={43}
                onChangeText={(value) => {
                  this.setState({
                    address: value,
                  });
                }}
              />}
            {!(this.state.select) &&
              <RNPickerSelect
                placeholder={placeholder}
                items={this.state.pickerData}
                onValueChange={(value) => {
                  if (!value) return
                  this.setState({
                    address: value,
                    name: this.state.pickerData.find((v) => v.value === value).label,
                  });
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top:"15%",
                    right:"2%",
                  },
                }}
                value={this.state.address}
                useNativeAndroidPickerStyle={false}
                textInputProps={{ underlineColor: 'yellow' }}
                Icon={() => {
                  return <Ionicons name="md-arrow-down" size={24} color="black" />;
                }}
              />}
            <View style={{ paddingBottom: "3%", paddingTop: "5%" }}>
              <Text style={styles.header3}>
                보낼 금액 (단위: TOL)</Text>
            </View>
            <TextInput
              value={this.state.amount}
              style={styles.textForm}
              placeholder={"ex) 30"}
              maxLength={10}
              returnKeyType="done"
              keyboardType="number-pad"
              onChangeText={amount => {
                if (amount == "" || search(amount) > 1 || search1(amount) > 0  ) { // 혹은 .이 여러번 들어가면
                  this.setState({ amount: 0 });
                } else {
                  this.setState({ amount });
                }
              }
              }
            />
            <View
            style={{alignSelf: "flex-end",
            marginTop: "5%",
            paddingTop: "3%",
            paddingBottom: "5%",
            }}
            >
            <Text style={(this.state.balance - this.state.amount < 0) ? {
              color: "red", fontSize: 22,
              fontFamily: "Mybold",
            } : {
              color: "orange", fontSize: 22,
              fontFamily: "Mybold",
            }
            }>(송금 후 잔액: {this.state.isLoading ? <ActivityIndicator color="orange"
            size={15}
            /> :   calc([parseFloat(this.state.balance),parseFloat(this.state.amount)])
            } TOL)</Text>
            </View>
            
          </View>
          <View style={styles.buttonArea}>
            <IconButton size={50}
              onPress={this.checkInput}
              style={{ alignSelf: "center" }}
              icon={() => (
                <MaterialCommunityIcons name="send-circle" size={70} color="orange"
                />
              )}
            />
          </View>
        </View>
        <Modal
          offset={this.state.offset}
          open={this.state.open}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={() => this.setState({ open: false })}
          modalStyle={styles.modal}
        >
          
          <View style={{ 
            height:"30%",
            justifyContent:"center"
           }}>
            <FontAwesome5 name="coins" size={60} color="orange"
            style={{alignSelf:"center"}} />
          </View>
          
          <View style={{ 
            height:"10%"
           }}>
          <Text style={styles.header7}>{this.state.name}님께</Text>
          </View>


         
            <View style={{ height: "15%", width:"100%"  }}>
              <Text style={styles.header6}>{this.state.address}</Text>
            </View>

<View style={{ 
            height:"10%"
           }}>
          <Text style={styles.header7}>{this.state.amount} TOL을 송금하시겠습니까?</Text>
          </View>

  
          <View style={{ 
            height:"15%"
           }}>
          <Text style={styles.header8}>잘못된 주소일 경우, 거래를 되돌릴 수 없습니다.</Text>
          
          </View>

          <View style={{ height:"20%",flexDirection: "column", alignSelf: "center",
         width:"100%"}}>
            
            <View 
            style={{height:"50%", justifyContent:"center"}}
            >
              <TouchableOpacity
                onPress={() => this.setState({ open: false })}>
                <Text style={styles.small_text2}>돌아가기</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.small_btn}>
              <TouchableOpacity
                onPress={this.onSend.bind(this)}>
                <Text style={styles.small_text}>송금하기</Text>
              </TouchableOpacity>
            </View>

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
    position:"absolute"
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
    fontSize: 35,
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingHorizontal: "6%",
    fontFamily: "Mybold",
  },
  header3: {
    fontSize: 25,
    alignSelf: "flex-start",
    fontFamily: "My",
    width:"100%"
  },
  header33: {
    fontSize: 25,
    alignSelf: "flex-start",
    fontFamily: "My",
    width:"60%"
  },
  header9: {
    fontSize: 30,
    alignSelf: "center",
    fontFamily: "My",
    color: "white",
    paddingHorizontal: "10%",
    paddingVertical: "1%",
    borderColor: "orange"
  },
  header10: {
    fontSize: 25,
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "5%",
    paddingHorizontal: "10%",
    fontFamily: "My",
    color: "gray",
  },
  header4: {
    fontSize: 22,
    alignSelf: "flex-end",
    marginTop: "10%",
    paddingTop: "3%",
    paddingBottom: "5%",
    paddingHorizontal: "10%",
    fontFamily: "Mybold",
    color: "orange"
  },
  modal: {
    alignSelf: "center",
    alignItems: 'center',
    width: "90%",
    height: "62%",
    position:"absolute",

    backgroundColor: "white",
    borderRadius: 15,
  },
  header5: {
    fontSize: 23,
    alignSelf: "center",
    paddingTop: "7%",
    paddingBottom: "3%",
    fontFamily: "Mybold",
  },
  header6: {
    fontSize: 15,
    textAlign: "center",
    alignSelf: "center",
    width: "80%",
    fontFamily: "Mybold",
    color: "black",
    padding: "3%",
    backgroundColor: "#FFE5CC",
    borderRadius: 5,
  },
  header7: {
    fontSize: 25,
    alignSelf: "center",
    paddingTop: "2%",
    fontFamily: "Mybold",
  },
  header8: {
    fontSize: 17,
    alignSelf: "center",
    fontFamily: "My",
    color: "orange"
  },
  image: {
    width: "90`%",
    height: "30%",
    resizeMode: "cover",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
  },
  formArea: {
    width: "65%",
    height: "40%",
    marginTop: "10%",
    paddingBottom: '5%',
    justifyContent: "center",
  },
  textForm: {
    borderWidth: 2,
    borderRadius: 5,
    width: '100%',
    height: 45,
    paddingLeft: "5%",
    alignSelf: "center",
    fontFamily: "My",
    fontSize: 18,
  },
  buttonArea: {
    width: '80%',
    height: "10%",
    alignSelf: "center",
  },
  sendButton: {
    borderRadius: 5,
    width: "40%",
    backgroundColor: "black",
    alignSelf: "center",
  },
  sendText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Mybold",
  },
  small_btn: {
    alignSelf: "center",
    height:"50%",
    fontSize: 25,
    backgroundColor: "orange",
    borderRadius: 5,
    width:"50%",
    textAlign:"center",
    justifyContent:"center"
  },
  small_text: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: "My",
    color: "white",
  },
  small_text2: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: "Mybold",
    color: "black",
    textDecorationLine: "underline",
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    alignSelf: "center",
    fontSize: 18,
    fontFamily: "My",
    width: '100%',
    height: 45,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    paddingLeft: "5%",

  },
  inputAndroid: {
    alignSelf: "center",
    fontSize: 18,
    fontFamily: "My",
    width: '100%',
    height: 45,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    paddingLeft: "5%",

  },
});
