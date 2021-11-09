import React, { Component } from "react";
import { Text, Alert, View, StyleSheet, Dimensions, TextInput, Image } from "react-native";
import { Container, Item, Form, Input, Label, Button,CheckBox, AsyncStorage, NativeBaseProvider } from "native-base";
import { flushSync } from "react-dom";
//import * as Font from 'expo-font';

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      wallet_name: "",
    };
  }

//   _post(user) {
//       return fetch(`../data/account.json`, {
//         method: "POST",
//         body: JSON.stringify(user),
//       })
//         .then((res) => {
//           if (res.status != 200) {
//             throw new Error(res.statusText);
//           }
//           return res.json();
//         })
//         .then((data) => {
//           AsyncStorage.setItem('wallet_name', this.state.wallet_name);
//           AsyncStorage.setItem('userData', this.state.user);
//           this.props.navigation.navigate("Login");
//         });
//   }

  handleWalletNameChange = (e) => {
    this.setState({
        wallet_name: e.target.value,
    });
  };

  handleSubmit() {
    const user = {
        wallet_name: this.state.wallet_name,
    };
    if (!user.wallet_name) {
      alert("지갑 이름을 입력해주세요.");
      return;
    }
    //this._post(user);
    this.props.navigation.navigate("Login");
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
          <Text
            style={styles.registerText}
          >
            가입하기
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
    paddingRight:"5%",
    marginBottom: "5%",
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 5,
    fontFamily: "My",
},
  register_btn: {
    borderRadius: 10,
    marginTop: "10%",
    width: "40%",
    backgroundColor: "black",
    alignSelf: "center",
    fontFamily: "My",
  },
  registerText: {
    textAlign: "center",
    marginTop: "5%",
    color: "white",
    fontSize: 15,
    fontFamily: "Mybold",
  },
});
