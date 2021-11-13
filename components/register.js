import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, TextInput } from "react-native";
import { Button, NativeBaseProvider } from "native-base";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

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

  handleSubmit() {
    const user = {
      id: this.state.id,
      password: this.state.password,
      password_confirm: this.state.password_confirm,
    };
    if (!user.id || !user.password || !user.password_confirm) {
      alert("모두 입력해주세요");
      return;
    }
    else if (user.password_confirm != user.password){
        alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    //post
    //...
    this.props.navigation.navigate("Create_wallet");
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
        <TextInput 
            style={styles.textForm}
		    value={this.state.id} 
           placeholder={"아이디"}
		    autoCorrect={false}
		    onChangeText={(id) => {
              this.setState({ id });
            }}
		/>
        <TextInput 
           style={styles.textForm}
		    value={this.state.password} 
            placeholder={"비밀번호"}
		    autoCorrect={false}
		    onChangeText={(password) => {
              this.setState({ password });
            }}
		/>
        <TextInput 
            style={styles.textForm}
		    value={this.state.password_confirm} 
            placeholder={"비밀번호 확인"}
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
    width: '70%',
    height: '40%',
    paddingLeft: "5%",
    paddingRight:"5%",
    marginBottom: "5%",
    alignSelf: "center",
    fontFamily: "My",
},
  register_btn: {
    borderRadius: 5,
    marginTop: "20%",
    width: "40%",
    backgroundColor: "black",
    alignSelf: "center",
  },
  registerText: {
    textAlign: "center",
    marginTop: "5%",
    color: "white",
    fontSize: 15,
    fontFamily: "Mybold",
  },
});
