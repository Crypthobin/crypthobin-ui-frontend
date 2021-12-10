import React from 'react';
import { createAppContainer } from "react-navigation";
import Start_navigation from "./start_navigation";
import Bottom_navigation from "./bottom_navigation";
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

  const start = () => {

    const Navi = createAppContainer(temp);

    return (
        <NavigationContainer
        >
          <Navi />
      </NavigationContainer>
      );
  }

  export default start;
  