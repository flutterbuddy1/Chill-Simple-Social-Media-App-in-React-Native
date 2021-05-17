import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'react-native-elements';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';


export default class containerScreen extends Component {


  constructor(props){
    super(props)
  }

  render() {
        const Tab = createMaterialBottomTabNavigator();
        return (
            <>
        <Tab.Navigator
        initialRouteName="Home"
        shifting
        sceneAnimationEnabled
        activeColor="#fff"
        inactiveColor="#fff"
        barStyle={{backgroundColor:'#26B0FE'}}
        >
            <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                 <Icon
                    name="home-outline"
                    type='ionicon'
                    size={20}
                    color={color}
                    />
                ),
              }}
            />
            <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color }) => (
                 <Icon
                    name="person-outline"
                    type='ionicon'
                    size={20}
                    color={color}
                    />
                ),
              }}
            />
        </Tab.Navigator>
        </>
        )
    }
}
