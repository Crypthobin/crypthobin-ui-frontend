import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput } from "react-native";
import { Button, NativeBaseProvider } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { IconButton } from 'react-native-paper';
import Modal from './Modal';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { callBackend } from "../utils/backend";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friend: {},
      name: "",
      address: "",
      open_add: false,
      edit: false,
      check: [],
      false_data: [],
      open_del: false,
      open_menu: [],
      isLoading: true,
      addresses: []
    };

    this.fetchData()
    setInterval(this.fetchData.bind(this), 10000);
  }

  async fetchData () {
    this.setState({ isLoading: true });

    const res = await callBackend('GET', '/api/addresses')

    var check_data = this.state.check;
    var false_data = [];
    for (var i = 0; i < this.state.addresses.length; i++) {
      if (!check_data[i]) check_data[i] = false;
      false_data[i] = false;
    }

    this.setState({
      check: check_data,
      false_data,
      addresses: res.data,
      isLoading: false
    });
  }

  checkDel = (i) => {
    this.state.check[i] = !this.state.check[i];
    this.state.addresses[i].isDel = this.state.check[i];
    this.setState({ check: this.state.check, addresses: this.state.addresses });
  }

  async onDel() {
    for (var i = 0; i < this.state.check.length; i++) {

      // -- backend
      if (this.state.check[i])  {
        const delRes = await callBackend('DELETE', `/api/addresses/${this.state.addresses[i].id}`)
        if (!delRes.success) {
          alert(`알 수 없는 오류 발생: ${delRes.message}`)
          return
        }
      }

      this.fetchData();
      // -- backend fin.

      this.state.check[i] = false;
    }
    this.setState({ check: this.state.check })
    this.setState({ open_del: false })
    this.setState({ edit: false })
  }

  async onAdd() {

    const friend = {
      name: this.state.name,
      address: this.state.address,
    };
    if (!friend.name || !friend.address) {
      alert("모두 입력해주세요");
      return;
    }
    if (friend.address.length != 43) {
      alert("주소를 다시 한 번 확인해주세요.");
      return;
    }

    const addRes = await callBackend('POST', '/api/addresses', {
      explanation: friend.name,
      address: friend.address
    })

    if (!addRes.success) {
      alert(`알 수 없는 오류 발생: ${addRes.message}`)
      return
    }

    this.setState({ open_add: false });
    this.fetchData()
  }

  onReset() {
    for (var i = 0; i < this.state.addresses.length; i++) {
      this.state.check[i] = false;
      this.state.addresses[i].isDel = false;
    }
    this.setState({ edit: false, check: this.state.check, addresses: this.state.addresses });
  }

  onSingleDel(i) {
    this.state.check[i] = !this.state.check[i];
    this.state.addresses[i].isDel = this.state.check[i];
    this.setState({
      check: this.state.check, 
      addresses: this.state.addresses,
      open_menu: this.state.open_menu.fill(false),
      open_del: true
    });
  }

  render() {
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
          <View style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: screenWidth
          }}>
            <Text style={styles.header2}>
              주소록</Text>
            <IconButton size={30}
              style={{ marginLeft: "42%", marginTop: "3%" }}
              icon={() => {
                if (!this.state.edit) {
                  return (
                    <Ionicons name="trash-bin" size={25} color="black" />
                  );
                } else return (
                  <Text style={{ fontFamily: "Mybold", fontSize: 25 }}>취소</Text>
                );
              }}
              onPress={() => {
                if (!this.state.edit) {
                  this.setState({ edit: true })
                } else {
                  this.onReset();
                }
              }}
            />
            <IconButton size={30}
              style={{ marginTop: "3%" }}
              icon={() => {
                var count = 0;
                if (!this.state.edit) {
                  return (
                    <MaterialIcons name="person-add-alt" size={30} color="black" />
                  );
                } else {

                  for (i = 0; i < this.state.check.length; i++) {
                    if (this.state.check[i]) {
                      count += 1;
                    }
                  }
                  return (
                    <View style={{ flexDirection: "row" }}>
                      <Ionicons name="trash-bin" size={25} color="orange" />
                      <Text style={{ marginTop: "30%", color: "orange", fontFamily: "Mybold", fontSize: 15 }}>({count})</Text>
                    </View>
                  );
                }
              }}
              onPress={() => {
                if (!this.state.edit) {
                  this.setState({ open_add: true })
                } else {
                  if (JSON.stringify(this.state.check) != JSON.stringify(this.state.false_data)) {
                    this.setState({ open_del: true });
                  } else {
                    alert("삭제할 주소를 선택해주세요.");
                  }
                }
              }}
            />
          </View>
          <ScrollView>
            <View style={styles.container3}>
              {this.state.addresses.map((card, i) => {
                if (this.state.edit) {
                  return (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: "5%" }}>
                      <View style={styles.shortCardContainer} key={i}>
                        <View style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: "2%",
                        }}>
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "space-between",
                              padding: "2%",
                            }}
                          >
                            <View style={styles.name}>
                              <Text style={{ fontSize: 25, fontFamily: "Mybold", }}>{card.explanation}</Text>
                            </View>
                            <View style={styles.address}>
                              <Text style={{ fontSize: 15, fontFamily: "My", }}>
                                {card.walletAddress}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <IconButton size={45}
                        style={{ marginTop: "2%" }}
                        icon={() => {
                          if (this.state.check[i]) {
                            return (
                              //<FontAwesome name="check-circle" size={30} color="orange" />
                              <FontAwesome name="check-square" size={25} color="orange" />
                            );
                          }
                          else return (
                            //<FontAwesome name="circle-o" size={30} color="black" />
                            <FontAwesome name="square-o" size={25} color="black" />
                          );
                        }}
                        onPress={
                          () => this.checkDel(i)
                        }
                      />
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.cardContainer} key={i}>
                      <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "2%",
                      }}>
                        <Ionicons name="ios-person-circle" size={60} color="orange" />
                        <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "2%",
                          }}
                        >
                          <View style={styles.name}>
                            <Text style={{ fontSize: 25, fontFamily: "Mybold", }}>{card.explanation}</Text>
                          </View>
                          <View style={styles.address}>
                            <Text style={{ fontSize: 15, fontFamily: "My", }}>
                              {card.walletAddress}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Menu
                            visible={this.state.open_menu[i]}
                            anchor={
                              <IconButton
                                icon={() => <FontAwesome name="ellipsis-v" size={30} color="black" />}
                                onPress={() => {
                                  this.state.open_menu[i] = true
                                  this.setState({ open_menu: this.state.open_menu })
                                }}/>}>
                            <MenuItem onPress={() => this.onSingleDel(i)}>삭제</MenuItem>
                            <MenuItem onPress={() => this.setState({ open_menu: this.state.open_menu.fill(false)})}>취소</MenuItem>
                          </Menu>
                        </View>
                      </View>
                    </View>
                  );
                }
              })}
            </View>
          </ScrollView>
          <Modal
            offset={this.state.offset}
            open={this.state.open_add}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({ open_add: false })}
            modalStyle={styles.modal}
          >
            <View>
              <FontAwesome name="address-card" size={60} color="orange" />
              <View style={styles.formArea}>
                <Text style={styles.header4}>
                  이름을 정해주세요.</Text>
                <TextInput
                  style={styles.textForm}
                  value={this.state.name}
                  maxLength={15}
                  onChangeText={(name) => {
                    this.setState({ name });
                  }}
                  placeholder={"15자까지 입력 가능"} />
                <Text style={styles.header4}>
                  주소를 입력해주세요.</Text>
                <TextInput
                  style={styles.textForm}
                  value={this.state.address}
                  onChangeText={(address) => {
                    this.setState({ address });
                  }}
                  placeholder={"ex) pqc1 ... "} />
                  <TouchableOpacity
                    style={styles.small_btn}
                    onPress={() => { this.onAdd(); }}>
                    <Text style={styles.small_text}>추가하기</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            offset={this.state.offset}
            open={this.state.open_del}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({ open_del: false })}
            modalStyle={styles.modal2}
          >
            <MaterialCommunityIcons name="account-multiple-remove" size={60} color="orange" />
            <Text style={{ fontSize: 23, fontFamily: "Mybold", paddingTop: "10%", paddingBottom: "10%" }}>아래 주소를 삭제하시겠습니까?</Text>
            <View style={{ width: "80%", height: "30%", backgroundColor: "#FFE5CC", padding: "3%", borderRadius: 10 }}>
              <ScrollView>
                {this.state.addresses.map((card, i) => {
                  if (this.state.check[i]) {
                    return (
                      <Text style={{ fontFamily: "My", fontSize: 20, marginBottom: "3%", marginLeft: "5%" }}>{card.explanation}</Text>
                    );
                  }
                })}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.small_btn}
              onPress={() => {
                this.onDel();

              }}>
              <Text style={styles.small_text}>삭제</Text>
            </TouchableOpacity>
          </Modal>
        </View>
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight - 60,
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
    fontWeight: "bold",
    fontSize: 28,
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
  image: {
    width: "90%",
    height: "30%",
    resizeMode: "cover",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 30,
  },
  container3: {
    flex: 1,
    width: screenWidth,
    height: "60%",
    alignItems: "center",
    backgroundColor: "white",
  },
  cardContainer: {
    alignContent: "center",
    backgroundColor: "white",
    width: "90%",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: "2%",
    borderColor: "black"
  },
  shortCardContainer: {
    alignContent: "center",
    backgroundColor: "white",
    width: "77%",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: "2%",
    borderColor: "black"
  },
  name: {
    padding: "1%",
  },
  address: {
    padding: "1%",
  },
  modal: {
    alignSelf: "center",
    alignItems: 'center',
    width: "85%",
    height: "60%",
    padding: "5%",
    backgroundColor: "white",
    borderRadius: 15,
  },
  modal2: {
    alignSelf: "center",
    alignItems: 'center',
    width: "85%",
    height: "60%",
    padding: "5%",
    paddingTop: "10%",
    backgroundColor: "white",
    borderRadius: 15
  },
  header5: {
    fontSize: 35,
    alignSelf: "center",
    paddingTop: "3%",
    paddingBottom: "3%",
    fontFamily: "Mybold",
  },
  header3: {
    fontSize: 25,
    alignSelf: "center",
    paddingTop: "20%",
    paddingBottom: "20%",
    fontFamily: "My",
  },
  header33: {
    fontSize: 25,
    alignSelf: "center",
    paddingTop: "5%",
    paddingBottom: "10%",
    fontFamily: "My",
  },
  header4: {
    fontSize: 23,
    alignSelf: "center",
    paddingTop: "8%",
    paddingBottom: "4%",
    fontFamily: "My",
  },
  formArea: {
    width: "100%",
    height: "100%",
    marginTop: "10%",
    paddingBottom: '10%',
    alignSelf: "center",
  },
  textForm: {
    borderWidth: 2,
    borderRadius: 5,
    width: '100%',
    height: '20%',
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: "1%",
    alignSelf: "center",
    fontFamily: "My",
    fontSize: 18,
  },
  small_btn: {
    alignSelf: "center",
    marginTop: "10%",
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
  }
});
