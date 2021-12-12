import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, TextInput, Alert } from "react-native";
import { NativeBaseProvider, Button } from "native-base";
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Wallet_main from "./wallet_main";
import { LogBox, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { callBackend } from "../utils/backend";
import { ActivityIndicator } from "react-native-paper";

import {CommonActions} from '@react-navigation/native';
import { NavigationActions } from 'react-navigation';

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

      this.setState({ isLoading: false });
      this.setState({ id: "" });
      this.setState({ password: "" });
      this.props.navigation.navigate("After");
      
    }

    if (!loginRes.success) {
      Alert.alert("","올바른 아이디 혹은 비밀번호를 입력해 주세요.",[{text:"확인"}]);
      this.setState({ id: "" });
      this.setState({ password: "" });
      this.setState({ isLoading: false });
      return
    }
  };

  render() {
    LogBox.ignoreAllLogs();
    if (this.state.fontsLoaded) {
      return (
        <NativeBaseProvider>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{ width:"100%", height:"100%", backgroundColor:"white"
            }}
            >
          <View style={styles.container}>
            <View>
              <Text style={styles.title}>밥 그 릇</Text>
            </View>
            <View style={styles.formArea}>
              <TextInput
                style={styles.textForm}
                value={this.state.id}
                onChangeText={(id) => this.setState({ id })}
                placeholder={"아이디"} />
              <TextInput
                style={styles.textForm}
                value={this.state.password}
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
                this.setState({ id: "" });
      this.setState({ password: "" });
      this.setState({ isLoading: false });
              }}
            >
              <Text style={{ color: "black", textDecorationLine: "underline" }}>
                밥은 먹고 다니냐?
              </Text>
            </Text>
          </View>
          </View>
          </TouchableWithoutFeedback>
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
    //height: "100%",
    height: screenHeight,
    backgroundColor: "white",
    flex: 1,
    position: 'absolute',
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