import React, { Component, useState } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ImageBackground } from "react-native";
import { Icon, Container, Content, Header, Left, Body, Right, Button, NativeBaseProvider } from 'native-base';
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton, Colors } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-simple-modal';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import walletData from '../data/walletData';
import txData from '../data/txData';


const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

//const {address, balance} = walletData;

// 날짜 순으로
txData.sort((a, b) => (a.date > b.date ? -1 : 1));

//const Wallet_main = ({ navigation }) => {

  export default class App extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        open: false,
      };
    }

    render() {
    return(
      <NativeBaseProvider>
        <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.logoText}
        >밥 그릇</Text>
        <IconButton 
        style={{marginRight:"5%",}}
          icon={() => (
        <MaterialCommunityIcons name="bowl-mix-outline" size={26} color="black" 
        style={styles.appinfo}
        /> 
        )} 
        onPress={() => {
          this.props.navigation.navigate("App_info");}}
    /> 
      </View>
          <Text style={styles.header2}>
            내 지갑</Text>
              <View style={styles.container2}>
          <ImageBackground
          style={styles.image}
          source={require("../images/sot.png")}>
            <Text style={styles.logo2} >Crypthobin PQC Wallet</Text>
            
            <Text style={styles.logo3} > {walletData.balance} TOL</Text>
            
               <IconButton size={70}
        style={{marginLeft:"79%", paddingBottom: "15%"}}
          icon={() => (
              <Ionicons name="ios-qr-code" size={50} color="orange"
               />
              )} 
        onPress={() => { this.setState({open: true})
        }}
    /> 
            </ImageBackground>
            </View>
            <View style={{flexDirection: "row", justifyContent:"space-between", width:"100%"}}>
            <Text style={styles.header2}>
            거래 내역</Text>
            <FontAwesome5 name="filter" size={22} color="orange" 
            style={{paddingTop:"5%", paddingLeft:"36%"}}/>
            <Text style={styles.header11}>
            필터</Text>
            </View>
            <ScrollView>
          <View style={styles.container3}>
            {txData.map((card, i) => {
              return (
                <View style={styles.cardContainer} key={i}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding:"3%",
                      }}
                    >
                      <View style={{ flexDirection: "column", width:"20%", justifyContent:"center" }}>
                        
                        { card.type == "보내기" &&
                        <View style={styles.type}>
                          <MaterialIcons name="call-made" size={30} color="orange" />
                        </View>
                        }

                        { card.type == "받기" &&
                        <View style={styles.type}>
                          <MaterialIcons name="call-received" size={30} color="orange" />
                        </View>
                        }
                           
                        <View style={styles.date}>
                        <Text style={{ fontSize: 15, fontFamily: "My", }}>{card.date}</Text>
                      </View>
                      </View>
                      
                      { card.type == "받기" &&
                      <View style={styles.address}>
                        <Text style={{ fontSize: 20, fontFamily: "My", }}>받은 주소</Text>
                      <Text style={{ fontSize: 20, fontFamily: "My", }}>{card.address}</Text>
                    </View>
            }
            { card.type == "보내기" &&
                      <View style={styles.address}>
                        <Text style={{ fontSize: 20, fontFamily: "My", }}>보낸 주소</Text>
                      <Text style={{ fontSize: 20, fontFamily: "My", }}>{card.address}</Text>
                    </View>
            }
                    
                    <View style={styles.amount}>
                      <Text style={{ fontSize: 25, fontFamily: "My",alignSelf:"flex-end", }}>{card.amount} TOL</Text>
                    </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <Modal
        offset={this.state.offset}
        open={this.state.open}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={() => this.setState({open: false})}
        modalStyle={styles.modal}
        >
        <View style= {styles.modal}>
          <Text style={styles.header5}>내 주소</Text>
          
            <Text style={styles.header4} >{walletData.address}</Text>
  
          <View >
          <QRCode content='https://reactnative.com'
                  outerEyeStyle='circle'
                  codeStyle='circle'
                  innerEyeStyle='circle'
                  logo={require('../images/test.png')}
                  size = '200'
          />
          </View>
          <TouchableOpacity
            style={{margin: 5}}
            onPress={() => this.setState({open: false})}>
            <Text style={styles.header3}>닫기</Text>
          </TouchableOpacity>
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
    height: screenHeight-60,
    alignItems: "center",
    backgroundColor: "white",
  },
  container2: {
    width: "90%",
    height: "30%",
    alignItems: "center",
    backgroundColor: "white",
  },
  container3: {
    flex: 1,
    width: screenWidth,
    height: "60%",
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
  logo2: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: 22,
    color: "white",
    fontFamily: "Mybold",
    paddingTop: "3%",
    marginLeft: "5%",
    
  },
  logo3: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 40,
    color: "white",
    fontFamily: "Mybold",
    paddingTop: "10%",
    marginLeft: "5%",
    
  },
  header2: {
    fontSize: 35,
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingHorizontal: "6%",
    fontFamily: "Mybold", 
  },
  header11: {
    fontSize: 25,
    alignSelf: "flex-start",
    paddingTop: "5%",
    paddingBottom: "3%",
    paddingHorizontal: "1%",
    paddingRight:"8%",
    fontFamily: "Mybold", 
    color:"black"
  },
  header3: {
    fontSize: 25,
    alignSelf: "center",
    paddingTop: "20%",
    //paddingBottom: "3%",
    fontFamily: "My",
  },
  header4: {
    fontSize: 22,
    alignSelf: "center",
    paddingTop: "3%",
    paddingBottom: "10%",
    fontFamily: "My",
    textAlign: "center"
  },
  header5: {
    fontSize: 35,
    alignSelf: "center",
    paddingTop: "3%",
    paddingBottom: "3%",
    fontFamily: "Mybold",
  },
  image: {
    width:"100%",
    height: "100%",
    resizeMode: "cover",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: "black",
    borderWidth: 2,
  },
  cardContainer: {
    alignContent: "center",
    backgroundColor: "white",
    width: "90%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black",
    marginBottom:"2%", 
  },
  type: {
    padding:"2%",
    //paddingLeft:"15%",
    alignSelf:"center",
  },
  date: {
    padding:"4%",
    alignSelf:"center",
  },
  address: {
    padding:"4%",
    justifyContent:"center",
    width:"40%",
    paddingLeft:"10%",
  },
  amount: {
    padding:"4%",
    justifyContent:"center",
    width:"40%",
  },
  modal:{
    alignSelf: "center",
    alignItems: 'center',
    width: "80%",
    height: "70%",
    //padding: "3%",
    backgroundColor: "white"
  }
});


//export default Wallet_main;