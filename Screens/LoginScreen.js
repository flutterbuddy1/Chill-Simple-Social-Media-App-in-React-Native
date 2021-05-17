import React, { Component } from 'react';
import { View , Text , StyleSheet, Image , TextInput , Linking ,Dimensions , TouchableWithoutFeedback , KeyboardAvoidingView} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
} from '@react-native-community/google-signin';
import { Icon , Input , Button  } from 'react-native-elements';
import { Alert } from 'react-native';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export default class LoginScreen extends React.Component {

	constructor(props) {
		super(props);
	  
		this.state = {
			isLoading:false,
			email:'',
			password:'',
			// items:[],
		};
	  }
	componentDidMount(){
		
	}

	async onLoginButtonPress() {
		this.setState({isLoading:true})

		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
		.then((userCredential) => {
		this.setState({isLoading:false})
		this.props.navigation.replace('containerScreen');
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			Alert.alert("Information",errorMessage);
		});
		
	}

	render() {
		return (
		<View style={{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>

			<Text
			style={{
				fontSize:50,
				fontWeight:'bold',
				color:'#26B0FE',
				textAlign:'center',
				marginBottom:50,
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 3,
				},
				shadowOpacity: 0.29,
				shadowRadius: 4.65,

				elevation: 7,
			}}
			>CHILL</Text>




		<KeyboardAvoidingView
            behavior="height"
            style={{
					width:'90%',
					height:'60%',
					backgroundColor:'#ffffff',
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 3,
					},
					shadowOpacity: 0.29,
					shadowRadius: 4.65,

					elevation: 7,
					borderRadius:10,
					padding:10,
					
					}}>
				<Text
					style={{
						fontSize:30,
						fontWeight:'bold',
						color:'#121212',
						textAlign:'center',
                        marginBottom:10

					}}
					>Login</Text>

					<Input
					disabled={this.state.isLoading}
                    onChangeText={(text)=>this.setState({email:text})}
					label="Email"
					placeholder="email@address.com"
					leftIcon={{ type: 'font-awesome', name: 'user' }}
					/>
					
					<Input
					disabled={this.state.isLoading}
                    onChangeText={(text)=>this.setState({password:text})}
					label="Password"
					placeholder="Password"
					secureTextEntry={true}
					leftIcon={{ type: 'font-awesome', name: 'lock' }}
					/>
					{/* <TouchableWithoutFeedback
					onPress={()=>console.log("pass For")}
					>
					<Text style={{marginLeft:20,marginBottom:20}}>
						Forget Password ?
					</Text>
					</TouchableWithoutFeedback> */}

					<Button
					title="Login"
					loading={this.state.isLoading}
					onPress={()=>this.onLoginButtonPress()}
					containerStyle={{marginHorizontal:10}}
					buttonStyle={{width:'100%',padding:15 , borderRadius:50, backgroundColor: '#26B0FE'}}
					/>

				</KeyboardAvoidingView>
				<View style={{marginTop:height*5/100}}>
					<Button
						title="Create New One"
						disabled={this.state.isLoading}
						buttonStyle={{width:'100%',padding:15 , borderRadius:50, backgroundColor: '#121212'}}
						onPress={()=>this.props.navigation.navigate('Register')}
						/>
				</View>
	
		</View>


		);
	}
}
const styles = StyleSheet.create({
body:{
	height:"60%",
	width:"100%",
	backgroundColor: '#26B0FE',
	display: 'flex',
	justifyContent: 'center',
	alignItems:'center', 
	position:'relative',
},
innerCircle:{
	width:500,
	height: 500,
	backgroundColor: '#26B0FE',
	borderRadius: 700,
	position: 'absolute',
	bottom:-80,
},
phoneInputField:{
	height:30,
	width:'80%',
	display: 'flex',
	justifyContent:'center',
	alignItems:'center',
	backgroundColor: '#26B0FE',
	padding:20,
	borderRadius:50,
	marginTop:'10%',

}


})