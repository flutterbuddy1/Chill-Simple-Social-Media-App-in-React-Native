import React, { Component } from 'react';
import { View , Text , StyleSheet, Image , TextInput , Linking,KeyboardAvoidingView ,Dimensions,ActivityIndicator , TouchableWithoutFeedback} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
// import firebaseConfig from '../config';
import firestore from '@react-native-firebase/firestore';
// import {
//   GoogleSignin,
// } from '@react-native-community/google-signin';
import { Icon , Input , Button ,Overlay  } from 'react-native-elements';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export default class RegisterScreen extends React.Component {

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

		// firebase.initializeApp(firebaseConfig);

		
	}

	async onRegisterButtonPress() {
		const the = this;
		this.setState({isLoading:true})
        auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
            console.log('User account created & signed in!');
            var user = firebase.auth().currentUser;
            if (user) {
            firestore()
            .collection('Users')
            .doc(user.uid)
            .set({
                Email:this.state.email,
                password:this.state.password,
                Name:user.displayName ? user.displayName : "user"+Math.floor((Math.random()+1)*100000),
                uid:user.uid,
                ProfileImage:`https://avatars.abstractapi.com/v1/?api_key=1fb1343e469048919bb45a93d789a680&name=${this.state.email}`,
                followers:0,
                following:0,
                followedUsers:firestore.FieldValue.arrayUnion(),
                followingUsers:firestore.FieldValue.arrayUnion(),
            })
            .then(()=>{
    		    this.setState({isLoading:false})
                this.props.navigation.replace('CreateProfile');
            })

        }
    })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            }

            console.error(error);
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
					>Create Account</Text>

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
					title="Create"
                    loading={this.state.isLoading}
                    onPress={()=>this.onRegisterButtonPress()}
					containerStyle={{marginHorizontal:10}}
					buttonStyle={{width:'100%',padding:15 , borderRadius:50, backgroundColor: '#26B0FE'}}
					/>
            </KeyboardAvoidingView>
				<View style={{marginTop:height*5/100}}>
					<Button
						title="Already have an account"
						disabled={this.state.isLoading}
						buttonStyle={{width:'100%',padding:15 , borderRadius:50, backgroundColor: '#121212'}}
                        onPress={()=>this.props.navigation.goBack()}
						/>
				</View>
                {/* <Overlay isVisible={this.state.isLoading} overlayStyle={{backgroundColor:'#fff'}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                  <ActivityIndicator size="large" color="#26B0FE" />
                  <Text style={{marginLeft:10}}>Loading...</Text>
                  </View>
                </Overlay> */}
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