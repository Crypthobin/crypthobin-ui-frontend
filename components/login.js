import React, { Component, useState } from "react";
import { Text, Alert, View, StyleSheet, Dimensions, TextInput } from "react-native";
import {  NativeBaseProvider, Button } from "native-base";
import * as Font from 'expo-font';

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      password: "",
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

  onLogin = () => {
      // 로그인 기능 (값 맞는지 확인하는 로직)
      // 토스트 넣기
    this.props.navigation.navigate("After"); 
  };

//   _get() {
//   }

//   componentDidMount() {
//     this._get();
//   }

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
                        placeholder={"아이디"}/>
                    <TextInput 
                        style={styles.textForm} 
                        secureTextEntry={true}
                        placeholder={"비밀번호"}/>
                </View>
          <View style={styles.buttonArea}>
            <Button block style={styles.loginButton} 
                    onPress={this.onLogin}>
              <Text style={styles.loginText}>로그인</Text>
            </Button>
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
    //fontWeight: "400",
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
    paddingRight:"5%",
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