import React, { Component } from 'react';
import { View ,Text ,Dimensions ,Alert , FlatList , ScrollView ,LogBox , Image , ActivityIndicator ,TouchableOpacity , TextInput , KeyboardAvoidingView} from 'react-native';
import { Button, Overlay , Icon , Avatar} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class PostScreen extends Component {
    constructor(props){
        super(props);
        this.state ={
            data:this.props.route.params.data,
            focus:this.props.route.params.isFocus,
            user:[],
            comment:'',
            comments:[],
            iscommentLoading:false,
            liked:false,
            likes:'',
            likedUsers:[],
            isLoading:false,
        }
    }


    async getComments(){
        await firestore()
        .collection('Comments')
        .orderBy('time','desc')
        .get()
        .then((query)=>{
            const list = [];
            query.forEach(item => {
                if(item.data().postId === this.state.data.key){
                    list.push({
                        ...item.data(),
                        id: item.id,
                    })
                }
            });
            this.setState({comments:list,iscommentLoading:false});
            console.log(this.state.comments);
        })
    }

    
    async getPosts(){
        await firestore()
        .collection('Posts')
        .doc(this.state.data.key)
        .get()
        .then(querySnapshot => {
            this.setState({likes:querySnapshot.data().likes,likedUsers:querySnapshot.data().likedUsers})
              if(querySnapshot.data().likedUsers.includes(this.state.user.uid)){
                this.setState({liked:true});
            }else{
                this.setState({liked:false});
            }
            this.setState({isLoading:false})
        });
      }
      


    async componentDidMount(){
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        this.setState({iscommentLoading:true,isLoading:true});
        this.getComments();
        var user = firebase.auth().currentUser;
          if (user) {
            await firestore()
            .collection('Users')
            .doc(user.uid)
            .get()
            .then((data)=>{
                const details = data.data();
                this.setState({
                    user:details,
                })

            })
            }
        this.getPosts();
    }


    async commentKardi(){
        if(this.state.comment != ""){
            await firestore()
            .collection('Comments')
            .add({
                uid:this.state.user.uid,
                profile:this.state.user.ProfileImage,
                name:this.state.user.Name,
                time:firestore.FieldValue.serverTimestamp(),
                comment:this.state.comment,
                postId:this.state.data.key,
            })
            .then(()=>{
                this.getComments();
                this.setState({focus:false,comment:"",}),
                console.log('Success !');
            })
        }else{
            Alert.alert("Warning","Please Enter Something to Send !");
        }

    }


    async likeKaro(){
        if(this.state.likedUsers.includes(this.state.user.uid)){
            await firestore()
            .collection('Posts')
            .doc(this.state.data.key)
            .update(
                {
                likes: firestore.FieldValue.increment(-1),
                likedUsers:firestore.FieldValue.arrayRemove(this.state.user.uid),
                })
            .then(() => {
                console.log('Unliked');
                this.getPosts();
            });
        }else{

            await firestore()
            .collection('Posts')
            .doc(this.state.data.key)
            .update(
                {
                likes: firestore.FieldValue.increment(1),
                likedUsers:firestore.FieldValue.arrayUnion(this.state.user.uid),
            })
            .then(() => {
                console.log('Liked');
                this.getPosts();
            });

        }
  }


    render() {
        return (
            <KeyboardAvoidingView
            behavior='position'
              style={{
                marginTop:50,
                backgroundColor: '#fff',
                minHeight:height*95/100
              }}
            >
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{height:'90%',padding:10,}}
            >
                <Image
                source={{uri:this.state.data.Video}}
                style={{
                    height:400,
                    width:width,
                }}
                />
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%',height:60,paddingLeft:10,paddingRight:10,}}>
                    <View style={{flexDirection:'row'}}>
                    <Icon
                        name={this.state.liked ? "heart" :"heart-outline"}
                        type='ionicon'
                        size={30}
                        color='#26B0FE'
                        onPress={()=> this.likeKaro()}
                        />
                        <Text style={{fontSize:20,color:'#26B0FE'}}>{this.state.likes}</Text>


                        <Icon
                        name="chatbubble-outline"
                        type='ionicon'
                        size={25}
                        color='#26B0FE'
                        containerStyle={{marginLeft:10,marginRight:10,}}
                        onPress={()=>this.props.navigation.navigate('PostScreen',{data:this.state.data})}
                        />

                        <Icon
                        name="share-social-outline"
                        type='ionicon'
                        size={25}
                        color='#26B0FE'
                        onPress={()=>console.log('Share')}
                        />

                    </View>

                    <Icon
                        name="bookmark-outline"
                        type='ionicon'
                        size={25}
                        color='#26B0FE'
                        onPress={()=> console.log('Save')}
                        />
                </View>
                {this.state.iscommentLoading ?
                    <View style={{height:100,width:width,display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator color="#26B0FE" size="large"/>
                </View>
                :
                <FlatList
                data={this.state.comments}
                renderItem={({item})=>{
                    return(
                            <View style={{position:'relative'}}>
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('userProfile',{uid:item.uid})}style={{flexDirection:'row',alignItems:'center',width:'80%',margin:10}}>
                                    <Avatar 
                                    source={{uri:item.profile}}
                                    size='medium'
                                    avatarStyle={{borderRadius:100,borderWidth:1,borderColor:'#999'}} />
                                <View>
                                    <Text style={{marginLeft:10,fontSize:18}}>{item.name}</Text>
                                    <Text style={{marginLeft:10,fontSize:12,fontWeight:'900',}}></Text>
                                </View>
                                </TouchableOpacity>
                                <Text style={{marginLeft:80, backgroundColor:'rgba(116, 185, 255,0.8)',padding:10,borderTopRightRadius:10,borderBottomLeftRadius:10,borderBottomRightRadius:10,}}>{item.comment}</Text>
                                {item.uid == this.state.user.uid ? 
                                <Icon
                                type="font-awesome"
                                name="trash"
                                color="red"
                                size={20}
                                onPress={()=>{
                                    Alert.alert(
                                        "Alert",
                                        "Are You Sure To Delete This Comment ?",
                                        [
                                          {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                          },
                                          { text: "OK", onPress: () => {
                                            firestore()
                                            .collection('Comments')
                                            .doc(item.id)
                                            .delete()
                                            .then(()=>this.getComments());
                                          }}
                                        ],
                                        { cancelable: false }
                                      );
                                }}
                                containerStyle={{position:'absolute',top:20,right:10,}}
                                />:
                                <View/>
                                }
                            </View>
                        )
                    
                }}
                keyExtractor={(item,index)=> item.id}
                />

                }
        </ScrollView>
        <View style={{width:width,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10,position:'relative'}}>
        <TextInput
              keyboardType="default"
              style={{height:50,width:width*85/100,backgroundColor:'#dfe6e9',borderRadius:10,padding:10,}}
              onChangeText={text=>this.setState({comment:text})}
              placeholder="Enter Comment"
              placeholderTextColor="#888"
              autoFocus={this.state.focus}
              />
              <Icon
              type="ionicons"
              name="send"
              color="#26B0FE"
              containerStyle={{marginLeft:5}}
              size={35}
              onPress={()=>this.commentKardi()}
              />
        </View>

        <Overlay isVisible={this.state.isLoading} overlayStyle={{backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
                  <ActivityIndicator size="large" color="#26B0FE" />
                  <Text style={{marginLeft:10}}>Loading...</Text>
                </Overlay> 
            </KeyboardAvoidingView>

        )
    }
}
