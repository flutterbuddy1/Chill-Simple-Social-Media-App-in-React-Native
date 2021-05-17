import * as React from 'react';
import { View ,Text ,Dimensions , FlatList, LogBox , ScrollView , Image , RefreshControl ,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import { Button, Overlay , Icon , Avatar} from 'react-native-elements';
// import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            isLoading:false,
            data:null,
            refreshing:false,
            icons:{
                like:''
            },
            uid:'',


		};
      }

      async getPosts(){
        await firestore()
        .collection('Posts')
        .orderBy('date','desc')
        .get()
        .then(querySnapshot => {
            const posts = [];
          querySnapshot.forEach(documentSnapshot => {
              if(documentSnapshot.data().likedUsers.includes(this.state.uid)){
                posts.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                    liked:true,
                  });
            }else{
                posts.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                    liked:false,
                  });
            }
          });
          this.setState({data:posts,isLoading:false})
        });
      }

        componentDidMount(){
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        this.setState({isLoading:true})
          var user = firebase.auth().currentUser;
          if (user) {
              this.setState({
                  uid:user.uid,
              })
            }
        this.getPosts();

    }

      async likeKaro({item,index}){

            if(item.likedUsers.includes(this.state.uid)){
                await firestore()
                .collection('Posts')
                .doc(item.key)
                .update(
                    {
                    likes: firestore.FieldValue.increment(-1),
                    likedUsers:firestore.FieldValue.arrayRemove(this.state.uid),
                    })
                .then(() => {
                    console.log('User added!');
                    this.getPosts();
                });
            }else{

                await firestore()
                .collection('Posts')
                .doc(item.key)
                .update(
                    {
                    likes: firestore.FieldValue.increment(1),
                    likedUsers:firestore.FieldValue.arrayUnion(this.state.uid),
                })
                .then(() => {
                    console.log('User added!');
                    this.getPosts();
                });

            }
      }

    render() {
    const renderItems = ({item,index})=>{
            return(
                <View
                style={{
                    width:width,
                    display:'flex',
                    // borderRadius:30,
                    justifyContent:'center',
                    alignItems:'center',
                    marginBottom:20,
                    backgroundColor:'#fff',
                    flexDirection:'column',
                    }}>
                        <TouchableOpacity
                        onPress={()=>{
                          if(item.uid == this.state.uid){
                            this.props.navigation.navigate('Profile',{uid:item.uid})
                          }else{
                            this.props.navigation.navigate('userProfile',{uid:item.uid})
                          }

                        }}style={{flexDirection:'row',alignItems:'center',width:'80%',margin:10}}>
                        <Avatar
                        source={{uri:item.profileURL}}
                        size='medium'
                        avatarStyle={{borderRadius:100,borderWidth:1,borderColor:'#999'}} />
                        <View>
                        <Text style={{marginLeft:10,fontSize:18}}>{item.name}</Text>
                        <Text style={{marginLeft:10,fontSize:12,fontWeight:'900',}}>{new Date(item.date.toDate()).toDateString()}</Text>
                        </View>
                        </TouchableOpacity>
                    <Text style={{width:'90%',margin:10,fontSize:20}}>{item.title}</Text>
                    <TouchableWithoutFeedback
                    onPress={()=>this.props.navigation.navigate('PostScreen',{data:item,isFocus:false})}
                    >
                    <Image source={{uri:item.Video}} style={{height:400,width:'100%'}} />
                    </TouchableWithoutFeedback>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'80%',height:60}}>
                        <View style={{flexDirection:'row'}}>
                        <Icon
                            name={item.liked ? "heart" :"heart-outline"}
                            type='ionicon'
                            size={30}
                            color='#26B0FE'
                            onPress={()=> {
                              this.likeKaro({item,index});
                            }}
                            />
                            <Text style={{fontSize:20,color:'#26B0FE'}}>{item.likes}</Text>


                            <Icon
                            name="chatbubble-outline"
                            type='ionicon'
                            size={25}
                            color='#26B0FE'
                            containerStyle={{marginLeft:10,marginRight:10,}}
                            onPress={()=>this.props.navigation.navigate('PostScreen',{data:item,isFocus:true})}
                            />
                        </View>
                    </View>
                </View>
            );
        }
        return(
            <>
        <View style={{position:'relative',height:50,width:width,backgroundColor:'#fff'}}>
            <Text style={{ position:'absolute', left:20, top:5,fontSize:30,fontWeight:'bold',color:'#26B0FE'}}>
            Feeds
            </Text>
         </View>
         {/* <ScrollView style={{height:'95%'}}> */}

         {this.state.isLoading ?
         <SkeletonPlaceholder>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
           <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} margin={10} />
           <SkeletonPlaceholder.Item marginLeft={10}>
             <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
             <SkeletonPlaceholder.Item
               marginTop={6}
               width={80}
               height={20}
               borderRadius={4}
             />
           </SkeletonPlaceholder.Item>
         </SkeletonPlaceholder.Item>
         <SkeletonPlaceholder.Item height={400} width={width} />
         <SkeletonPlaceholder.Item height={20} width={width} flexDirection="row" justifyContent="space-between" alignItems="center">
         </SkeletonPlaceholder.Item>

         <SkeletonPlaceholder>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
           <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} margin={10} />
           <SkeletonPlaceholder.Item marginLeft={10}>
             <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
             <SkeletonPlaceholder.Item
               marginTop={6}
               width={80}
               height={20}
               borderRadius={4}
             />
           </SkeletonPlaceholder.Item>
         </SkeletonPlaceholder.Item>
         <SkeletonPlaceholder.Item height={400} width={width} />
         <SkeletonPlaceholder.Item height={20} width={width} flexDirection="row" justifyContent="space-between" alignItems="center">
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder>


       <SkeletonPlaceholder>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
           <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} margin={10} />
           <SkeletonPlaceholder.Item marginLeft={10}>
             <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
             <SkeletonPlaceholder.Item
               marginTop={6}
               width={80}
               height={20}
               borderRadius={4}
             />
           </SkeletonPlaceholder.Item>
         </SkeletonPlaceholder.Item>
         <SkeletonPlaceholder.Item height={400} width={width} />
         <SkeletonPlaceholder.Item height={20} width={width} flexDirection="row" justifyContent="space-between" alignItems="center">
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder>
       </SkeletonPlaceholder>


       :

        <FlatList
            data={this.state.data}
            renderItem={renderItems}
            keyExtractor={(item,index)=> item.key}
            refreshControl={
                <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>{
                    this.componentDidMount();
                }}
                />}
            />
         }
            {/* </ScrollView> */}
            <Icon
                containerStyle={{
                    position:'absolute',
                    right:20,
                    top:10,
                    zIndex:100,
                    borderRadius:100,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.27,
                    shadowRadius: 4.65,

                    elevation: 6,
                }}
                raised
                name="add"
                type='ionicon'
                size={30}
                color='#26B0FE'
                onPress={()=>this.props.navigation.navigate('UploadScreen')}
                />
            </>
        )
    }
}
