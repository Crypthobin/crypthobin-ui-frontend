import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from "react-native";
import { NativeBaseProvider } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-simple-modal';
import Checkbox from 'expo-checkbox';
import { FontAwesome5 } from '@expo/vector-icons';
import { callBackend } from "../utils/backend";
import { justifyContent, right } from "styled-system";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

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
      pickerData: []
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
      balance: this.state.balance - this.state.amount,
    };
    if (!send.address || !send.amount) {
      alert("모두 입력해주세요.");
      return;
    }
    if (send.address.length != 43) {
      alert("올바른 주소를 입력해주세요.");
      return;
    }
    if (send.balance-send.amount < 0) {
      alert("송금액은 내 잔액을 초과할 수 없습니다.");
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
      amount: parseInt(this.state.amount)
    })

    if (!sendRes.success) {
      alert(`예상치 못한 오류: ${sendRes.message}\nfee를 낼수 있는 금액인지 확인해 보세요.`)
      return
    }

    // 모달 창 닫기
    this.setState({ open: false, amount: 0 });
    alert("송금이 완료되었습니다.");
  };

  render() {
    const placeholder = {
      label: '주소를 선택해주세요.',
      value: null,
      color: 'black',
    };

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
          <Text style={styles.header2}>
            송금하기</Text>
          <View style={styles.formArea}>
            <View style={{ flexDirection: "row", paddingBottom: "3%" }}>
              <Text style={styles.header33}>
                보낼 주소</Text>
                <View style={{ flexDirection: "row", width:"40%", justifyContent:"flex-end"}}>
              <Checkbox
                value={this.state.select}
                onValueChange={() => this.setState({ select: !this.state.select })}
                color={this.state.select ? 'orange' : undefined}
                style={{alignSelf:"center"}}
              />
              <Text onPress={() => this.setState({ select: !this.state.select })} style={{ alignSelf:"center", paddingLeft:"10%", fontFamily: "My", fontSize: 20 }}>직접 입력</Text>
              </View>
            </View>
            {this.state.select &&
              <TextInput
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
              style={styles.textForm}
              placeholder={"ex) 30"}
              returnKeyType="done"
              keyboardType="number-pad"
              onChangeText={amount => {
                if (amount == "") {
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
            /> : this.state.balance-this.state.amount} TOL)</Text>
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
          {(this.state.name != "(저장되지 않은 주소)") &&
            <View style={{ paddingBottom: "3%" }}>
            </View>
          }
          <View style={{ paddingBottom: "5%" }}>
            <FontAwesome5 name="coins" size={60} color="orange" />
          </View>
          {(this.state.name != "(저장되지 않은 주소)") &&
            <View style={{ paddingBottom: "3%" }}>
            </View>
          }
          <Text style={styles.header7}>{this.state.name}님께</Text>
          {(this.state.name == "(저장되지 않은 주소)") &&
            <View style={{ backgroundColor: "#FFE5CC", borderRadius: 5, marginVertical: "3%" }}>
              <Text style={styles.header6}>{this.state.address}</Text>
            </View>
          }
          <Text style={styles.header7}>{this.state.amount} TOL을 송금하시겠습니까?</Text>
          {(this.state.name != "(저장되지 않은 주소)") &&
            <View style={{ paddingBottom: "5%" }}>
            </View>
          }
          <Text style={styles.header8}>잘못된 주소일 경우, 거래를 되돌릴 수 없습니다.</Text>
          {(this.state.name != "(저장되지 않은 주소)") &&
            <View style={{ paddingBottom: "5%" }}>
            </View>
          }
          <View style={{ flexDirection: "column", alignSelf: "center" }}>
            <View >
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
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
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
    padding: "5%",
    paddingTop: "10%",
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
    width: "100%",
    fontFamily: "Mybold",
    color: "black",
    padding: "3%"
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
    paddingTop: "3%",
    paddingBottom: "7%",
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
  },
  small_text2: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: "Mybold",
    color: "black",
    textDecorationLine: "underline"
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
