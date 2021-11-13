import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons } from "@expo/vector-icons";
import Wallet_main from "./wallet_main";
import Send from "./send";
import Address from "./address";
import App_info from "./app_info";
import Dashboard_main from "./dashboard_main";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const WalletStack = createStackNavigator({
  Wallet_main: { screen: Wallet_main, navigationOptions: { headerShown: false } },
  App_info: { screen: App_info, navigationOptions: { headerShown: false } },
});
const SendStack = createStackNavigator({
  Send: { screen: Send, navigationOptions: { headerShown: false } },
  App_info: { screen: App_info, navigationOptions: { headerShown: false } },
});
const AddressStack = createStackNavigator({
  Address: { screen: Address, navigationOptions: { headerShown: false } },
  App_info: { screen: App_info, navigationOptions: { headerShown: false } },
});
const DashboardStack = createStackNavigator({
  Dashboard_main: { screen: Dashboard_main, navigationOptions: { headerShown: false } },
  App_info: { screen: App_info, navigationOptions: { headerShown: false } },
});

const Bottom_navigation = createBottomTabNavigator(
  {
    Wallet: {
      screen: WalletStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-wallet"
            size={25}
            style={{ color: tintColor }} />
        ),
      },
    },
    Send: {
      screen: SendStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons
            name="send"
            size={25}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    Address: {
      screen: AddressStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            name="address-card"
            size={25}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    Dashboard: {
      screen: DashboardStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name="dashboard"
            size={25}
            style={{ color: tintColor }}
          />
        ),
      },
    },
  },
  {
    initialRouteName: "Wallet",
    tabBarOptions: {
      showLabel: false,
      style: {
        height: 60,
        backgroundColor: "white",
        borderTopColor: "black",
        borderTopWidth: 2
      },
      inactiveTintColor: "black",
      activeTintColor: "orange",
    },
  }
);

export default Bottom_navigation;