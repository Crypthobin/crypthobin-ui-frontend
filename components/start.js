import React from 'react';
import { createAppContainer } from "react-navigation";
import Start_navigation from "./start_navigation";
import Bottom_navigation from "./bottom_navigation";
import { createStackNavigator } from "react-navigation-stack";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from 'react-native';

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

  const start = () => {

    const Navi = createAppContainer(temp);

    LogBox.ignoreAllLogs();

    return (
        <NavigationContainer
        >
          <Navi />
      </NavigationContainer>
      );
  }

  export default start;
  