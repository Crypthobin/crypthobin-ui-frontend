import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, TextInput, Image } from "react-native";
import { Button, NativeBaseProvider } from "native-base";
import { callBackend } from "../utils/backend";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      wallet_name: "",
      isLoading: false
    };
  }

  async handleSubmit() {
    this.setState({ isLoading: true });

    const user = {
      wallet_name: this.state.wallet_name,
    };
    if (!user.wallet_name) {
      alert("지갑 이름을 입력해주세요.");
      this.setState({ isLoading: false });
      return;
    }

    const id = await AsyncStorageLib.getItem('reg_id')
    const password = await AsyncStorageLib.getItem('reg_pw')
    const passwordCheck = await AsyncStorageLib.getItem('reg_pwc')

    const registRes = await callBackend('POST', '/auth/regist', {
      id, password, passwordCheck
    });

    await AsyncStorageLib.setItem('token', registRes.data.token)

    const createWalletRes =  await callBackend('POST', '/api/wallets', {
      alias: user.wallet_name
    })

    if (createWalletRes.error) {
      alert('월렛 생성에 문제가 발생하였습니다. 다시 시도해 주세요.') 
      this.setState({ isLoading: false });
      return
    }

    this.props.navigation.navigate("After");
  }

  render() {
    return (
      <NativeBaseProvider>
        <View style={styles.container}>
          <View
            style={{
              marginTop: "20%",
            }}
          >
            <Text style={styles.title}>밥그릇 회원가입 ( 2 / 2 )</Text>
          </View>
          <Text style={styles.title2}>지갑 이름을 정해주세요.</Text>
          <View style={styles.formArea}>
            <TextInput
              style={styles.textForm}
              value={this.state.wallet_name}
              placeholder={"지갑 이름"}
              maxLength={14}
              autoCorrect={false}
              onChangeText={(wallet_name) => {
                this.setState({ wallet_name });
              }}
            />
          </View>
          <Button
            block
            style={styles.register_btn}
            onPress={this.handleSubmit.bind(this)}
          >
            {this.state.isLoading && <ActivityIndicator />}
            {!this.state.isLoading &&
              <Text style={styles.registerText}>
                가입하기
              </Text>}
          </Button>
        </View>
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "white",
  },
  title: {
    fontSize: 25,
    fontWeight: "500",
    marginTop: "5%",
    color: "black",
    alignSelf: "center",
    fontFamily: "Mybold",
  },
  title2: {
    fontSize: 20,
    marginTop: "5%",
    color: "black",
    alignSelf: "center",
    fontFamily: "My",
  },
  formArea: {
    width: "80%",
    height: "20%",
    marginTop: "30%",
    paddingBottom: '10%',
    alignSelf: "center",
  },
  textForm: {
    width: '70%',
    height: '40%',
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: "5%",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 5,
    fontFamily: "My",
    fontSize: 18,
  },
  register_btn: {
    borderRadius: 5,
    marginTop: "10%",
    width: "40%",
    backgroundColor: "orange",
    alignSelf: "center",
    fontFamily: "My",
  },
  registerText: {
    textAlign: "center",
    marginTop: "5%",
    color: "white",
    fontSize: 18,
    fontFamily: "Mybold",
  },
});
