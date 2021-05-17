import React, { Component } from 'react';
import { View , Image,Dimensions,TextInput,LogBox} from 'react-native';
import {Button , Icon,Overlay} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import firebase , { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { Text } from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export default class UploadScreen extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
            isLoading:false,
            data:[],
            uid:'',
            refURI:'',
            file:'',
            random:'',
            title:'',
            uploading:false,
		};
      }

      async componentDidMount(){
        LogBox.ignoreLogs(['source.uri should not be an empty string']);
        this.imagePicking();
        var user = firebase.auth().currentUser;
        if (user) {
            this.setState({
                uid:user.uid,
            })
            await firestore()
                .collection('Users')
                .doc(user.uid)
                .onSnapshot(querySnapshot =>{
                    // console.log('User exists: ', querySnapshot.data());
                    // console.log('Total users: ', querySnapshot.data());
                    this.setState({
                        data:querySnapshot.data(),
                        following:querySnapshot.size,
                    })
                })
          } else {
            // No user is signed in.
          }
         this.setState({uid:this.state.data.uid})
      }

      imagePicking(){
        ImagePicker.openPicker({
          width:400,
          height:400,
          cropping: true
        }).then(video =>{
            const random = Math.floor((Math.random()*1000)+1);
          console.log(video.path);
          const reference = storage().ref('Content/'+this.state.uid+random+'.jpg');
          this.setState({refURI:reference,file:video.path,random:random});
        }).catch(error=>{
          this.props.navigation.goBack();
        })
      }

    render() {
        return (
            <View>
              <Text style={{fontSize:20,marginLeft:50,marginTop:15}}>
                Upload Post
              </Text>
              <View style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
              <Image source={{uri:this.state.file}} style={{height:300,width:300,margin:10}}></Image>
              <TextInput
              style={{height:50,width:'90%',backgroundColor:'#dfe6e9',borderRadius:10,padding:10,}}
              onChangeText={text=>this.setState({title:text})}
              placeholder="Enter Fun..."
              placeholderTextColor="#888"
              />
              </View>
              <View style={{flexDirection:'row'}}>
            <Icon
                containerStyle={{height:100,width:100,backgroundColor:'#dfe6e9',borderRadius:20,display:'flex',justifyContent:'center',alignItems:'center',margin:20,}}
                name="cloud-upload-outline"
                type='ionicon'
                size={35}
                color='#26B0FE'
                onPress={async ()=>{
                    try{
                       console.log('Uploading started...')
                       this.setState({uploading:true});

                        const pathToFile = this.state.file ;
                        const task  = this.state.refURI.putFile(pathToFile);

                        task.on('state_changed', taskSnapshot => {
                          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                        });

                        task.then(async () => {
                          // console.log('Image uploaded to the bucket!');
                          console.log('Success');
                          const url = await storage()
                          .ref('Content/'+this.state.uid+this.state.random+'.jpg')
                          .getDownloadURL();

                          await firestore()
                            .collection('Posts')
                            .add({
                              Video:url,
                              title: this.state.title,
                              uid:this.state.data.uid,
                              profileURL:this.state.data.ProfileImage,
                              name:this.state.data.Name,
                              date:firestore.FieldValue.serverTimestamp(),
                              likes:0,
                              likedUsers:[],
                            })
                            .then(() => {
                              console.log('Success');
                               this.setState({uploading:false});
                               this.props.navigation.navigate('containerScreen') ;
                            });


                        });



                    }catch{(err)=>{
                        console.log(err)
                    }
                }
                }}
                />

</View>

            <Overlay isVisible={this.state.uploading} overlayStyle={{backgroundColor:'#fff'}}>
            <Text>Uploading...</Text>
                        </Overlay>

            </View>
        )
    }
}
