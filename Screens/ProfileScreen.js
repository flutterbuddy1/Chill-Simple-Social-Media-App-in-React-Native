import React, { Component } from 'react';
import { View , StyleSheet,Dimensions,Text ,LogBox ,ScrollView,ImageBackground,Alert ,TextInput, RefreshControl,Image ,ActivityIndicator, TouchableOpacity} from 'react-native';
import firebase from '@react-native-firebase/app';
import {Button , Avatar , Icon , Accessory , Overlay} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { FlatGrid } from 'react-native-super-grid';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export default class ProfileScreen extends Component {
    constructor(props) {
		super(props);
	  
		this.state = {
            data:[],
            username:'',
            profileImage:'',
            email:'',
            uid:'',
            following:'',
            isLoading:false,
            refreshing:false,
            openImagePopup:false,
            popupData:[],
            editable:false,
            updatedTitle:'',
            openLoadingPop:false,
            details:[],
            // logout:this.props.route.params.logout ? this.props.route.params.logout : false,

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
                    username:details.Name,
                    profileImage:details.ProfileImage,
                    email:details.Email,
                    details:data.data(),
                })

            })
        
            await firestore()
            .collection('Posts')
            .orderBy('date','desc')
            .get()
            .then(querySnapshot => {
                const posts = [];
              querySnapshot.forEach(documentSnapshot => {
                if(documentSnapshot.data().uid == user.uid){
                    posts.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                      }); 
                }
              });
              this.setState({data:posts,isLoading:false})
            });
            console.log(this.state.data);
          }else{
            navigation.replace('Login');
          }

    }
    render() {
        return (
            <ScrollView 
            refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={()=>{
                      this.componentDidMount();
                  }}
                />}
                >

                <View style={styles.profileHeader}>
                <Icon
                    name="log-in-outline"
                    type='ionicon'
                    size={30}
                    color="red"
                    containerStyle={{position:'absolute',right:30,top:20,zIndex:100,}}
                    onPress={()=>{
                        firebase.auth().signOut().then(() => {
                            this.props.navigation.replace('Login');
                          }).catch((error) => {
                              console.log(error);
                          });
                    }}
                    />

                    <Avatar
                    source={{uri:this.state.profileImage}}
                    size='large'
                    containerStyle={{marginLeft:30, height:100,width:100,elevation:6,}}
                    avatarStyle={{borderRadius:100,borderWidth:1,borderColor:'#26B0FE'}}
                    >
                        <Accessory
                        onPress={()=>this.props.navigation.navigate('editProfile',{post:this.state.data})}
                        name="create-outline"
                        type='ionicon'
                        size={30}
                        color="white"
                        />
                        </Avatar>
                    <Text style={{ position: 'absolute',left:140,fontWeight:'bold',color:'#000',fontSize:20 }}>
                        {this.state.username}
                    </Text>
                    <Text style={{ position: 'absolute',left:140,fontWeight:'bold',color:'#000',fontSize:14 ,top:'60%'}}>
                        {this.state.email}
                    </Text>

                </View>

                <View style={styles.userAccountDetails}>
                    <View style={styles.text}>
                        <Text style={{fontWeight:'bold',fontSize:18,color:'#000'}}>Followers</Text>
        <Text style={{fontWeight:'bold',fontSize:25,color:'#000',textAlign:'center'}}>{this.state.details.followers}</Text>
                    </View>
                    <View style={styles.text}>
                        <Text style={{fontWeight:'bold',fontSize:18,color:'#000'}}>Followings</Text>
                        <Text style={{fontWeight:'bold',fontSize:25,color:'#000',textAlign:'center'}}>{this.state.details.following}</Text>
                    </View>
                </View>
                <FlatGrid
                    data={this.state.data}
                    style={styles.gridView}
                    spacing={10}
                    renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=>{
                        this.setState({openImagePopup:true,popupData:item,updatedTitle:item.title});}}
                        onLongPress={()=>{
                            Alert.alert(
                                "Alert",
                                "Are You Sure To Delete This Post ?",
                                [
                                  {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                  },
                                  { text: "OK", onPress: () => {
                                    firestore()
                                    .collection('Posts')
                                    .doc(item.key)
                                    .delete()
                                    .then(()=>{this.componentDidMount()});
                                  }}
                                ],
                                { cancelable: false }
                              );
                            
                        }}
                    >
                        <ImageBackground source={{uri:item.Video}} 
                        style={{ 
                            justifyContent: 'flex-end',
                            borderRadius: 10,
                            height: 150,
                         }}>
                             <View style={{height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.6)',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                 <Icon 
                                name="heart"
                                type='ionicon'
                                size={30}
                                color="white"
                                 /><Text style={{fontSize:40,color:'#fff'}}>{item.likes}</Text>
                             </View>
                             </ImageBackground>
                             </TouchableOpacity>
                    )}

                    />
                <Overlay 
                onBackdropPress={()=>this.setState({openImagePopup:false,editable:false})}
                isVisible={this.state.openImagePopup} overlayStyle={{backgroundColor:'#fff',flexDirection:'column',alignItems:'center'}}>
                    <Image source={{uri:this.state.popupData.Video}} style={{height:300,width:300}} />
                    <View style={{flexDirection:'column',alignItems:"center",marginTop:20,}}>
                        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#dfe6e9',borderRadius:10}}>
                        <TextInput
                            style={{height:50,width:280,padding:10}}
                            onChangeText={(text)=>this.setState({updatedTitle:text})}
                            value={this.state.updatedTitle}
                            editable={this.state.editable}
                            placeholderTextColor="#888"
                            />
                            <Icon
                             name="create-outline"
                             type='ionicon'
                             size={30}
                             color="black"
                             style={{marginRight:10}}
                             onPress={()=>this.setState({editable:true})}
                            />
                            </View>
                         <View style={{flexDirection:'row',alignItems:"center"}}>
                             <Button
                             buttonStyle={{backgroundColor:'#26B0FE',borderRadius:10}}
                             containerStyle={{borderRadius:10,padding:10}}
                             title="Update Post"
                             onPress={async()=>{
                                 this.setState({
                                     openImagePopup:false,
                                     openLoadingPop:true,
                                 })
                                await firestore()
                                .collection('Posts')
                                .doc(this.state.popupData.key)
                                .update(
                                    {
                                    title: this.state.updatedTitle,
                                })
                                .then(() => {
                                    this.setState({
                                        openLoadingPop:false,
                                        editable:false,
                                    })
                                    this.componentDidMount();
                                });
                             }}
                             />
                             <Button
                             buttonStyle={{backgroundColor:'red',borderRadius:10}}
                             containerStyle={{borderRadius:10,padding:10}}
                             title="Cancel"
                             onPress={()=>{
                                 this.setState({openImagePopup:false,editable:false})
                             }}
                             />
                         </View>
                    </View>
                </Overlay> 

                <Overlay isVisible={this.state.openLoadingPop} overlayStyle={{backgroundColor:'#fff'}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                  <ActivityIndicator size="large" color="#26B0FE" />
                  <Text style={{marginLeft:10}}>Updating...</Text>
                  </View>
                </Overlay> 

                <Overlay isVisible={this.state.isLoading} overlayStyle={{backgroundColor:'#fff'}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                  <ActivityIndicator size="large" color="#26B0FE" />
                  <Text style={{marginLeft:10}}>Loading...</Text>
                  </View>
                </Overlay> 

    </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    profileHeader:{
        height:height/4,
        width:width,
        // backgroundColor:'#26B0FE',
        display: 'flex',
        justifyContent:'center'

    },
    gridView: {
        marginTop: 10,
        flex: 1,
        width:width,
      },
    userAccountDetails:{
        height:80,
        width:width,
        display: 'flex',
        flexDirection:'row',
        justifyContent:'center'
    },
    text:{
        marginTop:0,
        marginLeft:20,
        marginRight:20
    }

})