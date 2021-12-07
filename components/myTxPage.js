import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { paginate } from '../utils/paginate';
import { NativeBaseProvider } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

//import txData from '../data/txDataEmpty'; 
import { callBackend } from '../utils/backend';
import moment from 'moment';

const screenWidth = Math.round(Dimensions.get("window").width);

const myTxPage = ({ walletId }) => {
  const [txs, setTxs] = useState({
    data: [],
    pageSize: 10,
    currentPage: 1,
  });

  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (page) => {
    if (0 < page && page <= pages) {
      setTxs({ ...txs, currentPage: page });
    }
  }

  const { data, pageSize, currentPage } = txs;
  const pagedTxs = paginate(data, currentPage, pageSize);
  const length = txs.data.length;
  const pageCount = Math.ceil(length / pageSize);
  const pages = pageCount;
  const [addresses, setAddresses] = useState([])


  async function fetchData() {
    setIsLoading(true);
    const addrRes = await callBackend('GET', '/api/addresses')

    txs.data = []
    
    for (let i = 0; true; i++) {
      const txRes = await callBackend('GET', `/api/wallets/${walletId}/transactions?count=100&page=${i}`)
      if (!txRes.success || txRes.data.length < 1) {
        break
      }

      txs.data.push(...txRes.data)
    }
    
    if (addrRes.success) setAddresses(addrRes.data)
    setTxs({ ...txs, data: txs.data.filter((v) => v.confirmations).sort((a, b) => b.time - a.time) })

    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
    setInterval(fetchData, 10000);
  }, [])

  if (txs.data.length == 0) {
    return (
      <NativeBaseProvider>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: screenWidth }}>
          <Text style={styles.header2}>
            거래 내역 ({txs.data.length})</Text>
        </View>
        <Text style={{ alignSelf:"center", paddingTop: "20%", fontFamily: "My", fontSize: 25 }}>거래 내역이 없습니다.</Text>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: screenWidth }}>
        <Text style={styles.header2}>
          거래 내역 ({txs.data.length})</Text>
        <View style={{ flexDirection: "row" }}>
          <IconButton size={30}
            style={{ paddingTop: "5%" }}
            icon={() => (
              <AntDesign name="left" size={24} color="black" />
            )}
            onPress={() => {
              handlePageChange(currentPage - 1)
            }}
          />
          <Text style={styles.text1}>{currentPage} / {pages}</Text>
          <IconButton size={30}
            style={{ paddingTop: "5%" }}
            icon={() => (
              <AntDesign name="right" size={24} color="black" />
            )}
            onPress={() => {
              handlePageChange(currentPage + 1)
            }}
          />
        </View>
      </View>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.container3}>
          {pagedTxs.map((card, i) => {
            return (
              <View style={styles.cardContainer} key={i}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: "3%",
                    }}
                  >
                    <View style={{ flexDirection: "column", width: "20%", justifyContent: "center" }}>
                      {card.category == "send" &&
                        <View style={styles.type}>
                          <MaterialIcons name="call-made" size={30} color="orange" />
                        </View>
                      }
                      {card.category == "receive" &&
                        <View style={styles.type}>
                          <MaterialIcons name="call-received" size={30} color="orange" />
                        </View>
                      }
                      <View style={styles.date}>
                        <Text style={{ fontSize: 15, fontFamily: "My", }}>{moment(card.timerecived).format('YYYY.MM.DD')}</Text>
                      </View>
                    </View>
                    <View style={styles.address}>
                      <Text style={{ fontSize: 20, fontFamily: "My", }}>{addresses?.find((v) => v.otherAddresses.includes(card.address))?.explanation || '(등록되지 않은 월렛)'}</Text>
                      <Text style={{ fontSize: 20, fontFamily: "My", color: "orange" }}>{card.address.substring(0, 10)}...{card.address.substring(38)}</Text>
                    </View>
                    <View style={styles.amount}>
                      <Text style={{ fontSize: 25, fontFamily: "My", alignSelf: "flex-end", }}>{Math.abs(card.amount)} TOL</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
          }
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container3: {
    flex: 1,
    width: screenWidth,
    height: "60%",
    alignItems: "center",
  },
  header2: {
    fontSize: 35,
    alignSelf: "flex-start",
    paddingTop: "3%",
    paddingBottom: "3%",
    paddingHorizontal: "6%",
    fontFamily: "Mybold",
  },
  cardContainer: {
    alignContent: "center",
    backgroundColor: "white",
    width: "90%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black",
    marginBottom: "2%",
  },
  type: {
    padding: "2%",
    alignSelf: "center",
  },
  date: {
    padding: "4%",
    alignSelf: "center",
  },
  address: {
    paddingLeft: "5%",
    justifyContent: "center",
    width: "45%",
    backgroundColor: "white",
    alignItems: "center"
  },
  amount: {
    paddingRight: "4%",
    justifyContent: "center",
    width: "35%",
    backgroundColor: "white"
  },
  text1: {
    fontSize: 20,
    paddingTop: "6%",
    paddingBottom: "3%",
    fontFamily: "Mybold",
  },
});

export default myTxPage;