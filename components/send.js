import React, { Component, useState } from "react";
import { StyleSheet, Text, View, Dimensions,  TextInput, TouchableOpacity } from "react-native";
import { Icon, Container, Content, Header, Left, Body, Right, Button, NativeBaseProvider, ThreeDotsIcon } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton, Colors } from 'react-native-paper';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import Modal from 'react-native-simple-modal';
import Checkbox from 'expo-checkbox';
import addressData from "../data/addressData";
import walletData from "../data/walletData";
import { CurrentRenderContext } from "@react-navigation/core";
import { borderColor } from "styled-system";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

// for picker data
var pickerData = new Array();
for (var i=0; i<addressData.length; i++){
  var jsonObject = JSON.parse(JSON.stringify(addressData[i]));
  var aJson = new Object();
  aJson.label = jsonObject.name;
  aJson.value = jsonObject.address;
  pickerData.push(aJson);
}

  export default class App extends Component {
    constructor(props) {
      super(props);

      this.state = {
        name: pickerData[0].label,
        address: pickerData[0].value,
        amount: 0,
        balance: walletData.balance,
        ss: false,
        open: false,
        select: false,
      };
    }
    

    checkAddress = () => {
      this.setState({open: true});
    };
    
    render(){
      const placeholder = {
        label: '주소를 선택해주세요.',
        value: null,
        color: 'black',
      };

    return(
      <NativeBaseProvider>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}
        onPress={() => {
          navigation.navigate("Wallet_main");
        }}>밥 그릇</Text>
        <IconButton 
        style={{marginRight:"5%",}}
          icon={() => (
        <MaterialCommunityIcons name="bowl-mix-outline" size={26} color="black" 
        style={styles.appinfo}
        /> 
        )} 
        onPress={() => {
        navigation.navigate("App_info");}}
    /> 
      </View>
        <Text style={styles.header2}>
        송금하기</Text>
        <View style={styles.formArea}>
        
        <View style={{flexDirection:"row", paddingBottom:"3%"}}>
        <Text style={styles.header3}>
        보낼 주소</Text>
        
        <Checkbox
          style={{marginRight: "2%", marginTop:"1%", marginLeft:"20%"}}
          value={this.state.select}
          onValueChange = {select => this.setState({select: !this.state.select} ) }
          color={this.state.select ? 'orange' : undefined}
        />
        <Text style={{fontFamily:"My", fontSize:20, marginTop:"0.5%",}}>직접 입력</Text>

        </View>

        { this.state.select &&
        <TextInput 
                        style={styles.textForm} 
                        placeholder={"pqc1qyau3w0qkv4v3rla6fq5enjy4yhs23mrhyw7sde"}
                        returnKeyType="done"
                        onChangeText={(value) => {
                          this.setState({
                            address: value,
                          });
                          }
                        }
                        />}



        { !(this.state.select) &&
        <RNPickerSelect
            placeholder={placeholder}
            items={pickerData}
            onValueChange={(value, i) => {
              this.setState({
                address: value,
                name: pickerData[i-1].label,
              });
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: "15%",
                right: "13%",
              },
            }}
           
            value={this.state.address}
            useNativeAndroidPickerStyle={false}
            textInputProps={{ underlineColor: 'yellow' }}
            Icon={() => {
              return <Ionicons name="md-arrow-down" size={24} color="black" />;
            }}
          />}
          <View style={{paddingBottom:"3%", paddingTop:"5%"}}>
      <Text style={styles.header3}>
        보낼 금액 (단위: TOL)</Text>
        </View>
                    <TextInput 
                        style={styles.textForm} 
                        placeholder={"ex) 30"}
                        returnKeyType="done"
                        keyboardType="number-pad"
                        onChangeText={amount => {
                          if (amount == ""){
                          this.setState({ amount: 0 });
                          this.setState({ balance: walletData.balance });
                          } else {
                          this.setState({ amount });
                          this.setState({ balance: parseInt(walletData.balance) - parseInt(amount) });
                          }
                          }
                        }
                        />
                   
                
        <Text style={styles.header4}>
                  (송금 후 잔액: {this.state.balance} TOL)</Text>
    
                </View>


                <View style={styles.buttonArea}>

                <IconButton size={50}
                onPress={this.checkAddress}
        style={{ alignSelf: "center"}}
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
        modalDidClose={() => this.setState({open: false})}
        modalStyle={styles.modal}
        >
        <View style= {styles.modal}>
          <Text style={styles.header7}>{this.state.name}님께</Text>
          <Text style={styles.header6}>({this.state.address})</Text>
          <Text style={styles.header7}>{this.state.amount} TOL을 송금하시겠습니까?</Text>    
          <Text style={styles.header8}>잘못된 주소일 경우, 거래를 되돌릴 수 없습니다.</Text>
            <View style = {{flexDirection: "column",alignSelf:"center"}}>
          
          
          <View style = {{width:"60%", alignSelf:"center", marginBottom:"5%", borderRadius:5,
    borderWidth:2,
    backgroundColor:"orange",}}>
          <TouchableOpacity
            onPress={() => this.setState({open: false})}>
            <Text style={styles.header9}>송금하기</Text>
          </TouchableOpacity>
          </View>
          
          <View style = {{width:"60%", alignSelf:"center", borderRadius:5,
    borderWidth:2,
    backgroundColor:"gray",}}>
          <TouchableOpacity
            onPress={() => this.setState({open: false})}>
            <Text style={styles.header9}>돌아가기</Text>
          </TouchableOpacity>
          </View>



          </View>

        </View>
      </Modal>    
      </NativeBaseProvider>
  );}

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
    borderBottomColor:"black",
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
    fontWeight: "bold",
    fontSize: 28,
    color: "black",
    fontFamily: "Mybold",
    paddingLeft:"6%",
  },
  appinfo:{
    paddingRight:"5%",
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
    paddingHorizontal: "10%",
    fontFamily: "My",
  },
  header9: {
    fontSize: 30,
    alignSelf: "center",
    fontFamily: "My",
    color:"white",
    paddingHorizontal:"10%",
    paddingVertical:"1%",
    borderColor:"orange"
  },
  header10: {
    fontSize: 25,
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "5%",
    paddingHorizontal: "10%",
    fontFamily: "My",
    color:"gray",
  },
  header4: {
    fontSize: 22,
    alignSelf: "flex-end",
    marginTop:"10%",
    paddingTop: "3%",
    paddingBottom: "5%",
    paddingHorizontal: "10%",
    fontFamily: "Mybold",
    color:"orange"
  },
  modal:{
    alignSelf: "center",
    alignItems: 'center',
    width: "90%",
    height: "50%",
    paddingTop: "7%",
    backgroundColor: "white"
  },
  header5: {
    fontSize: 23,
    alignSelf: "center",
    paddingTop: "7%",
    paddingBottom: "3%",
    fontFamily: "Mybold",
  },
  header6: {
    fontSize: 17,
    textAlign:"center",
    alignSelf:"center",
    width:"100%",
    height:"20%",
    fontFamily: "Mybold",
    color:"black",
  },
  header7: {
    fontSize: 23,
    alignSelf: "center",
    paddingBottom: "1%",
    fontFamily: "Mybold",
  },
  header8: {
    fontSize: 21,
    alignSelf: "center",
    paddingTop: "10%",
    paddingBottom: "7%",
    fontFamily: "Mybold",
    color:"orange"
  },
  image: {
    width:"90`%",
    height: "30%",
    resizeMode: "cover",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
  },
  formArea: {
    width: "80%",
    height: "40%",
    marginTop: "10%",
    paddingBottom: '5%',
    justifyContent:"center",
},
textForm: {
    borderWidth: 2,
    borderRadius: 5,
    width: '80%',
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    alignSelf:"center",
    fontSize: 18,
    fontFamily:"My",
    width: '80%',
    height: 45,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    paddingLeft: "5%",
    
  },
  inputAndroid: {
    alignSelf:"center",
    fontSize: 18,
    fontFamily:"My",
    width: '80%',
    height: 45,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    paddingLeft: "5%",
    
  },
});

//export default Page2;