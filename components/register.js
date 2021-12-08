import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, TextInput, Alert } from "react-native";
import { Button, NativeBaseProvider } from "native-base";
import { callBackend } from "../utils/backend";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const num = /[0-9]/;
const eng = /[a-zA-Z]/;
const sym = /[~!@#$%^&*()_+=<>?:{}]/;
const kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
const white_space = /\s/;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      id: "",
      password: "",
      password_confirm: "",
      fontsLoaded: false,
    };
  }

  async idCheck() {
    if (!this.state.id) {
      Alert.alert("","아이디를 입력해 주세요.",[{text:"확인"}]);
      return;
    }
    if (white_space.test(this.state.id)) {
      Alert.alert("","공백은 포함할 수 없습니다.",[{text:"확인"}]);
      return;
    }
    if (kor.test(this.state.id) || sym.test(this.state.id) || this.state.id.length < 5) {
      Alert.alert("","아이디는 5자 이상의 영문, 숫자만 사용할 수 있습니다.",[{text:"확인"}]);
      return;
    }

    const res = await callBackend('GET', `/auth/claimed?id=${this.state.id}`)
    if (res.claimed) Alert.alert("중복된 아이디","다른 아이디를 입력해 주세요.",[{text:"확인"}]);
    else Alert.alert("","사용 가능한 아이디입니다.",[{text:"확인"}]);
  }

  async handleSubmit() {
    const user = {
      id: this.state.id,
      password: this.state.password,
      password_confirm: this.state.password_confirm,
    };
    if (!user.id || !user.password || !user.password_confirm) {
      Alert.alert("","모두 입력해 주세요.",[{text:"확인"}]);
      return;
    }
    else if (user.password_confirm != user.password) {
      Alert.alert("","비밀번호가 일치하지 않습니다.",[{text:"확인"}]);
      return;
    }
    if (white_space.test(user.id) || white_space.test(user.password)) {
      Alert.alert("","공백은 포함할 수 없습니다.",[{text:"확인"}]);
      return;
    }
    if (kor.test(this.state.id) || sym.test(this.state.id) || this.state.id.length < 5) {
      Alert.alert("","아이디는 5자 이상의 영문, 숫자만 사용할 수 있습니다.",[{text:"확인"}]);
      return;
    }
    if (!num.test(this.state.password) || !eng.test(this.state.password) || !sym.test(this.state.password) || kor.test(this.state.password) || this.state.password.length < 10) {
      Alert.alert("","비밀번호는 영문, 숫자, 특수문자 혼합 10자 이상이어야 합니다.",[{text:"확인"}]);
      return;
    }

    const res = await callBackend('GET', `/auth/claimed?id=${this.state.id}`)
    if (res.claimed) Alert.alert("중복된 아이디","다른 아이디를 입력해 주세요.",[{text:"확인"}]);
    else {
      await AsyncStorageLib.setItem('reg_id', this.state.id);
      await AsyncStorageLib.setItem('reg_pw', this.state.password);
      await AsyncStorageLib.setItem('reg_pwc', this.state.password_confirm);

      this.props.navigation.navigate("Create_wallet");
     
}
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
            <Text style={styles.title}>밥그릇 회원가입 ( 1 / 2 )</Text>
          </View>
          <Text style={styles.title2}>계정 정보를 입력하세요.</Text>
          <View style={styles.formArea}>
            <View style={{ flexDirection: "row", marginHorizontal: "10%", justifyContent: "space-between", width: "80%", height:"40%", marginBottom:"3%"}}>
              <TextInput
                style={styles.textForm2}
                value={this.state.id}
                placeholder={"아이디"}
                maxLength={30}
                autoCorrect={false}
                onChangeText={(id) => {
                  this.setState({ id });
                }}
              />
              <Button style={{ width: "30%", backgroundColor: "orange", fontFamily: "My", height:"100%", alignSelf:"center" }}
                onPress={this.idCheck.bind(this)}>
                <Text style={{ fontFamily: "Mybold", color: "white", fontSize: 18 }} >중복확인</Text>
              </Button>
            </View>
            {
              (white_space.test(this.state.id)) &&
              <View>
                <Text style={{ fontFamily: "My", fontSize: 18, color: "orange", alignSelf: "center", marginBottom: "5%" }}>공백은 포함할 수 없습니다 !</Text>
              </View>
            }
            {(!white_space.test(this.state.id) && (kor.test(this.state.id) || sym.test(this.state.id) || this.state.id.length < 5))
              &&
              <View>
                <Text style={{ fontFamily: "My", fontSize: 18, color: "orange", alignSelf: "center", marginBottom: "5%" }}>5~30자의 영문, 숫자만 사용 가능합니다.</Text>
              </View>
            }
            <TextInput
              style={styles.textForm}
              value={this.state.password}
              placeholder={"비밀번호"}
              maxLength={100}
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={(password) => {
                this.setState({ password });
              }}
            />
            {
              (white_space.test(this.state.password)) &&
              <View>
                <Text style={{ fontFamily: "My", fontSize: 18, color: "orange", alignSelf: "center", marginBottom: "5%" }}>공백은 포함할 수 없습니다 !</Text>
              </View>
            }
            {(!white_space.test(this.state.password) && (!num.test(this.state.password) || !eng.test(this.state.password) || !sym.test(this.state.password) || kor.test(this.state.password) || this.state.password.length < 10))
              &&
              <View>
                <Text style={{ fontFamily: "My", fontSize: 18, color: "orange", alignSelf: "center", marginBottom: "5%" }}>10자 이상의 영문, 숫자, 특수문자를 사용하세요.</Text>
              </View>
            }
            <TextInput
              style={styles.textForm}
              value={this.state.password_confirm}
              placeholder={"비밀번호 확인"}
              maxLength={100}
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={(password_confirm) => {
                this.setState({ password_confirm });
              }}
            />
          </View>
          <Button
            block
            style={styles.register_btn}
            onPress={this.handleSubmit.bind(this)}
          >
            <Text
              style={styles.registerText}
            >
              다음
            </Text>
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
    alignSelf: "center",
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
    fontWeight: "400",
    marginTop: "5%",
    color: "black",
    alignSelf: "center",
    fontFamily: "My",
  },
  formArea: {
    width: "80%",
    height: "20%",
    marginTop: "20%",
    paddingBottom: '10%',
    alignSelf: "center",
  },
  textForm: {
    borderWidth: 2,
    borderRadius: 5,
    width: '80%',
    height: '40%',
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: "3%",
    alignSelf: "center",
    fontFamily: "My",
    fontSize: 18
  },
  textForm2: {
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: "5%",
    width: '66%',
    height: '100%',
    alignSelf: "center",
    fontFamily: "My",
    fontSize: 18,
  },
  register_btn: {
    borderRadius: 5,
    marginTop: "25%",
    width: "40%",
    backgroundColor: "black",
    alignSelf: "center",
  },
  registerText: {
    textAlign: "center",
    marginTop: "5%",
    color: "white",
    fontSize: 18,
    fontFamily: "Mybold",
  },
});
