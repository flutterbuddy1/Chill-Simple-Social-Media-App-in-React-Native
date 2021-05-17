import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './Screens/SplashScreen';
import containerScreen from './Screens/containerScreen';
import UploadScreen from './Screens/UploadScreen';
import Login from './Screens/LoginScreen';
import EditProfile from './Screens/EditProfile';
import userProfile from './Screens/userProfile';
import PostScreen from './Screens/actions/PostScreen';
import RegisterScreen from './Screens/RegisterScreen';
import CreateProfile from './Screens/CreateProfile';




const App = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
        headerTitle:false,
        headerTintColor:'#000',
        headerTransparent:true,
        }}
      >
        
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="containerScreen" component={containerScreen} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="editProfile" component={EditProfile} />
        <Stack.Screen name="userProfile" component={userProfile} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
