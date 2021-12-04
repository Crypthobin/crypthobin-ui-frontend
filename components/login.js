import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, TextInput } from "react-native";
import { NativeBaseProvider, Button } from "native-base";
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { callBackend } from "../utils/backend";
import { ActivityIndicator } from "react-native-paper";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      password: "",
      isLoading: false,
      fontsLoaded: false,
    };
  }

  async loadFonts() {
    await Font.loadAsync({
      My: require('../assets/fonts/BinggraeSamanco.ttf'),
      'Mybold': {
        uri: require('../assets/fonts/BinggraeSamanco-Bold.ttf'),
        display: Font.FontDisplay.FALLBACK,
      },
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }

  onLogin = async () => {
    this.setState({ isLoading: true });

    const loginRes = await callBackend('POST', '/auth/login', {
      id: this.state.id,
      password: this.state.password
    })

    if (loginRes.success) {
      await AsyncStorage.setItem('token', loginRes.data.token);
      this.props.navigation.navigate("After");
      this.setState({ isLoading: false });
    }

    if (!loginRes.success) {
      alert('올바른 아이디 혹은 비밀번호를 입력해 주세요.');
      this.setState({ isLoading: false });
      return
    }
  };

  render() {
    if (this.state.fontsLoaded) {
      return (
        <NativeBaseProvider>
          <View style={styles.container}>
            <View>
              <Text style={styles.title}>밥 그 릇</Text>
            </View>
            <View style={styles.formArea}>
              <TextInput
                style={styles.textForm}
                onChangeText={(id) => this.setState({ id })}
                placeholder={"아이디"} />
              <TextInput
                style={styles.textForm}
                secureTextEntry={true}
                onChangeText={(password) => this.setState({ password })}
                placeholder={"비밀번호"} />
            </View>
            <View style={styles.buttonArea}>
              {this.state.isLoading && <ActivityIndicator color="orange" />}
              {!this.state.isLoading &&
                <Button block style={styles.loginButton}
                  onPress={this.onLogin}>
                  <Text style={styles.loginText}>로그인</Text>
                </Button>}
            </View>
            <Text
              style={styles.registerText}
              onPress={() => {
                this.props.navigation.navigate("Register");
                //this.props.gotoPage('Register');
              }}
            >
              <Text style={{ color: "black", textDecorationLine: "underline" }}>
                밥은 먹고 다니냐?
              </Text>
            </Text>
          </View>
        </NativeBaseProvider>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "white",
  },
  title: {
    fontSize: 40,
    marginTop: "50%",
    alignSelf: "center",
    fontFamily: "Mybold",
  },
  formArea: {
    width: "80%",
    height: "20%",
    marginTop: "10%",
    paddingBottom: '10%',
    alignSelf: "center",
  },
  textForm: {
    borderWidth: 2,
    borderRadius: 5,
    width: '70%',
    height: '40%',
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: "5%",
    alignSelf: "center",
    fontFamily: "My",
  },
  buttonArea: {
    width: '80%',
    alignSelf: "center",
  },
  loginButton: {
    borderRadius: 5,
    width: "40%",
    backgroundColor: "black",
    alignSelf: "center",
  },
  loginText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Mybold",
  },
  registerText: {
    textAlign: "center",
    marginTop: "10%",
    color: "black",
    fontSize: 20,
    fontFamily: "My",
  },
});