import React, { Component } from 'react';
import {View , Image} from 'react-native';
import firebase from '@react-native-firebase/app';

export default class SplashScreen extends React.Component {
    componentDidMount(){
        const navigator = this.props.navigation;

		  var user = firebase.auth().currentUser;
			if (user) {
				setTimeout(function() 
				{
				   navigator.replace('containerScreen');
				},
				2000);
			} else {
				setTimeout(function() 
				{
				   navigator.replace('Login');
				},
				2000);

			}
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:'center',alignItems: 'center',backgroundColor: '#26B0FE',}}>
                <Image source={require('../src/logoSplash.png')} style={{height:80,width:200, resizeMode: 'stretch',}} />
            </View>
        )
    }
}
