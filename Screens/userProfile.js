import React, { Component } from 'react'
import { View , StyleSheet,Dimensions,Text , ScrollView,ImageBackground ,TextInput, RefreshControl,Image ,ActivityIndicator, TouchableOpacity} from 'react-native';
import {Button , Avatar , Icon , Accessory , Overlay} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { FlatGrid } from 'react-native-super-grid';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export default class userProfile extends Component {

    constructor(props){
        super(props);
        this.state = {
            uid:this.props.route.params.uid,
            data:[],
            isLoading:false,
            currentUID:'',
            followed:null,
            posts:[],
            popupData:[],
            openImagePopup:false
        }
    }

    async getUser(){
        await firestore()
        .collection('Users')
        .doc(this.state.uid)
        .get()
        .then((userData)=>{
            if(userData.data().followedUsers.includes(this.state.currentUID)){
                this.setState({followed:true})
            }else{
              this.setState({followed:false})
            }
            this.setState({data:userData.data()})
        })
        .then(()=>{
        this.setState({isLoading:false})
        })
    }

    async getUserPosts(){
        await firestore()
            .collection('Posts')
            .orderBy('date','desc')
            .get()
            .then(querySnapshot => {
                const posts = [];
              querySnapshot.forEach(documentSnapshot => {
                if(documentSnapshot.data().uid == this.state.uid){
                    posts.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                      }); 
                }
              });
              this.setState({posts:posts,isLoading:false})
            });
            console.log(this.state.data);
        }


    componentDidMount(){
        this.setState({isLoading:true})
        var user = firebase.auth().currentUser;
        if (user) {
            this.setState({
                currentUID:user.uid,
            })
          }
       this.getUserPosts();
        this.getUser();
        
    }

    async followAccount(){
        if (this.state.followed) {
            await firestore()
            .collection('Users')
            .doc(this.state.uid)
            .update({
                followers:firestore.FieldValue.increment(-1),
                followedUsers:firestore.FieldValue.arrayRemove(this.state.currentUID)
            })
            .then(async()=>{
            
                await firestore()
                .collection('Users')
                .doc(this.state.currentUID)
                .update({
                    following:firestore.FieldValue.increment(-1),
                    followingUsers:firestore.FieldValue.arrayRemove(this.state.uid)
                })
                .then(()=>{
                    this.getUser();
                })
            
            
            })
        }else{
            await firestore()
            .collection('Users')
            .doc(this.state.uid)
            .update({
                followers:firestore.FieldValue.increment(+1),
                followedUsers:firestore.FieldValue.arrayUnion(this.state.currentUID)
            })
            .then(async()=>{
            
                await firestore()
                .collection('Users')
                .doc(this.state.currentUID)
                .update({
                    following:firestore.FieldValue.increment(+1),
                    followingUsers:firestore.FieldValue.arrayUnion(this.state.uid)
                })
                .then(()=>{
                    this.getUser();
                })
            
            
            })
        }
    }


    render() {
        return (
            <View>
            <View style={styles.profileHeader}>
                    <Avatar
                    source={{uri:this.state.data.ProfileImage}}
                    size='large'
                    containerStyle={{marginLeft:30, height:100,width:100,elevation:6,marginTop:20,}}
                    avatarStyle={{borderRadius:100,borderWidth:1,borderColor:'#26B0FE'}}
                    />
                    <Text style={{ position: 'absolute',left:140,fontWeight:'bold',color:'#000',fontSize:20 }}>
                        {this.state.data.Name}
                    </Text>
                    <Text style={{ position: 'absolute',left:140,fontWeight:'bold',color:'#000',fontSize:14 ,top:'60%'}}>
                        {this.state.data.Email}
                    </Text>
                </View>
                <View style={{position:'relative',height:50,}}>
                <Button
                    title={this.state.followed ? "Following" :"Follow"}
                    containerStyle={{position:'absolute',right:70,top:-40,width:150}}
                    buttonStyle={{backgroundColor:this.state.followed ? "#999999" :"#26B0FE" }}
                    onPress={()=>this.followAccount()}
                    />
                    </View>

<View style={styles.userAccountDetails}>
                    <View style={styles.text}>
                        <Text style={{fontWeight:'bold',fontSize:18,color:'#000'}}>Followers</Text>
        <Text style={{fontWeight:'bold',fontSize:25,color:'#000',textAlign:'center'}}>{this.state.data.followers}</Text>
                    </View>
                    <View style={styles.text}>
                        <Text style={{fontWeight:'bold',fontSize:18,color:'#000'}}>Followings</Text>
                        <Text style={{fontWeight:'bold',fontSize:25,color:'#000',textAlign:'center'}}>{this.state.data.following}</Text>
                    </View>
                </View>


                        <FlatGrid
                    data={this.state.posts}
                    style={styles.gridView}
                    spacing={10}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={()=>{
                            this.setState({openImagePopup:true,popupData:item});
                            
                        }}>
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
                </Overlay> 



                <Overlay isVisible={this.state.isLoading} overlayStyle={{backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
                  <ActivityIndicator size="large" color="#26B0FE" />
                  <Text style={{marginLeft:10}}>Updating...</Text>
                </Overlay> 
            </View>
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
});