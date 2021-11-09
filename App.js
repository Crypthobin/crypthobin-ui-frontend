import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from "react-native";
import { createAppContainer } from "react-navigation";
import Start_navigation from "./components/start_navigation";
import Bottom_navigation from "./components/bottom_navigation";
import { createStackNavigator } from "react-navigation-stack";
import { NavigationContainer } from "@react-navigation/native";

const temp = createStackNavigator(
  {
    Before: {
      screen: Start_navigation,
      navigationOptions: { headerShown: false },
    },
    After: {
      screen: Bottom_navigation,
      navigationOptions: { headerShown: false },
    },
  },
  {
    initialRouteName: "Before",
  }
);

export default function App() {

  const Navi = createAppContainer(temp);

  return (
    <NavigationContainer>
      <Navi/>
    </NavigationContainer>
  );
}