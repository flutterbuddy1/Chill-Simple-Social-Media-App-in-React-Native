import React, { Component } from 'react'
import { View ,Image ,Dimensions ,TextInput ,Alert ,Text , ActivityIndicator,LogBox} from 'react-native'
import {Button , Avatar , Icon , Accessory ,Overlay} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class CreateProfile extends Component {

    constructor(props) {
		super(props);
	  
		this.state = {
            data:[],
            username:'',
            profileImage:'',
            email:'',
            uid:'',
            file:'',
            refURI:'',
            random:'',
            uploading:false,
            details:'',
            isLoading:false,
            key:null,
		};
	  }
   async componentDidMount(){
    LogBox.ignoreLogs(['source.uri should not be an empty string']);

     this.setState({isLoading:true})
        var user = firebase.auth().currentUser;
        if (user) {
          await firestore()
          .collection('Users')
          .doc(user.uid)
          .get()
          .then((data)=>{
              let details = data.data();
              this.setState({
                  details:data.data(),
                  uid:details.uid,
                  username:details.Name,
                  profileImage:details.ProfileImage,
                  email:details.Email,
              })
          })
          .then(()=>{
            this.setState({isLoading:false})
          })
    }
}

imagePicking(){
    ImagePicker.openPicker({
      width:400,
      height:400,
      cropping: true
    }).then(video =>{
        const random = Math.floor((Math.random()*1000)+1);
      console.log(video.path);
      const reference = storage().ref('ProfileImages/'+this.state.uid+random+'.jpg');
      this.setState({refURI:reference,profileImage:video.path,random:random});
    }).catch(error=>{
        console.log(error)
      this.props.navigation.goBack();
    })
  }


async updateProfile(){
    var user = firebase.auth().currentUser;
    const the = this;
    if (user) {
      try{
        console.log('Uploading started...')
        this.setState({uploading:true});
        
      if(this.state.profileImage != this.state.details.ProfileImage){
          const pathToFile = this.state.profileImage ;
          const task  = this.state.refURI.putFile(pathToFile);
          
          task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
          });
          
          task.then(async () => {
            console.log('Success');
            const url = await storage()
            .ref('ProfileImages/'+this.state.uid+this.state.random+'.jpg')
            .getDownloadURL();
            await firestore()  
            .collection('Users')
            .doc(user.uid)
              .update({
                Name:this.state.username,
                ProfileImage:url,
              })
              .then(async() => {
                  console.log('Success');
                    this.setState({uploading:false});
                    this.props.navigation.replace('containerScreen') ;
              });
            });

            }else{
              await firestore()  
            .collection('Users')
            .doc(user.uid)
              .update({
                Name:this.state.username,
              })
              .then(async() => {
                  console.log('Success');
                    this.setState({uploading:false});
                    this.props.navigation.replace('containerScreen') ;
              });
            }

        }catch{(err)=>{
          console.log(err)
      }
    }
  }
}

    render() {
        return (
            <View>
                <View style={{width:'95%',height:200,justifyContent:'center',alignItems:'center'}}>
                <Avatar
                    source={{uri:this.state.profileImage}}
                    size='large'
                    containerStyle={{marginLeft:30, height:100,width:100,}}
                    avatarStyle={{borderRadius:100}}
                    >
                        <Icon
                        containerStyle={{position:'absolute',height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:100}}
                        name='camera'
                        type='ionicon'
                        color='#26B0FE'
                        onPress={()=>this.imagePicking()}
                        />
                   </Avatar>
                </View>

                <View style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                <TextInput
                    style={{height:50,width:'90%',marginBottom:20,backgroundColor:'#dfe6e9',borderRadius:10,padding:10,}}
                    onChangeText={text=>this.setState({username:text})}
                    placeholder="Enter Your Name"
                    placeholderTextColor="#888"
                />
                <View style={{width:'90%'}}>
                    <Button 
                        onPress={()=> this.updateProfile()}
                        buttonStyle={{width:'50%',padding:20 , borderRadius:50, backgroundColor: '#26B0FE'}}
                        title="Create"
                        loading={this.state.loadingState}
                        />
                </View>
                </View>


                <Overlay isVisible={this.state.uploading} overlayStyle={{backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
                  <ActivityIndicator size="large" color="#26B0FE" />
                  <Text style={{marginLeft:10}}>Updating...</Text>
                </Overlay> 

                <Overlay isVisible={this.state.isLoading} overlayStyle={{backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
                  <ActivityIndicator size="large" color="#26B0FE" />
                  <Text style={{marginLeft:10}}>Loading...</Text>
                </Overlay>    
            </View>
        )
    }
}
