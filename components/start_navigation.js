import Login from "./login";
import Register from "./register";
import Create_wallet from "./createwallet";
import { createStackNavigator } from "react-navigation-stack";

const Start_navigation = createStackNavigator({
  //Start: { screen: Start, navigationOptions: { headerShown: false } },
  Login: { screen: Login, navigationOptions: { headerShown: false } },
  Register: { screen: Register, navigationOptions: { headerShown: false } },
  Create_wallet: { screen: Create_wallet, navigationOptions: { headerShown: false } },
});

export default Start_navigation;
