import React, {Component, PropTypes} from 'react';
import {
    View, Alert ,Text, Image, StyleSheet, Animated, InteractionManager, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Platform
} from 'react-native';
import { Container, Header, Item, Input, Button } from 'native-base';
import SearchBar from 'react-native-elements'
import {Logo, Heading, BackgroundWrapper, AlertStatus, BudgetSnapshot, GoalsSnapshot, FriendsSnapshot, PointsSnapshot} from '../components';
import { Actions, ActionConst } from 'react-native-router-flux';
import { getPlatformValue } from '../utils';
import { Colors, Metrics, Fonts, ApplicationStyles } from '../theme/'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bar } from 'react-native-pathjs-charts';
import * as firebase from 'firebase'

var CustomLayoutAnimation = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export default class Friends extends Component{

  constructor(){
    super();
    this.state = {
      friends: [],
      friendChange: '',
      addFriendOffset: -200,
      searchBarOffset: 0,
      searchBarOffsetWrapper: 0,
      searchResults: []
    };
  }


  componentDidMount() {
    this.props.hideSideMenu()
  }


  componentWillMount(){
    this.setFriends();

  }

  async setFriends(){
    try{
      const _this = this
      await this.props.Firebase.auth().currentUser;

      var uid =  this.props.Firebase.auth().currentUser.uid;
      var ref = this.props.Firebase.database().ref();
      var userFriendsRef = ref.child('userReadable/userFriends').child(uid);
      userFriendsRef.child('1').orderByKey().once('value').then(function(snap){
        var friendList=[]
        snap.forEach(function(snapshot){
          friendList.push({'name': snapshot.val().name })
        })
        var friendList = snap.val().friends;
        return friendList
      }).then(function(value){
        if((value.length > 0) ){
          _this.setState({
            friends: value
          })
        } else {
          Alert.alert('Please add some friends!')
          _this.setState({
            friends: []
          })
        }
      })
    }
    catch(e){
      console.log(error);
    }
  }


  async _updateFriends() {

    try{
      var ref = this.props.Firebase.database().ref();
      var user = this.props.Firebase.auth().currentUser;
      var uid = user.uid;
      var userFriendsRef = ref.child('userReadable/userFriends').child(uid);

      const newFriend = this.state.friendsChange
      const newFriends = [...this.state.friends, newFriend]

      const _this = this

      if (newFriends.length > 0) {
        // var curentUser = this.props.Firebase.database().ref().child(uid);
        userFriendsRef.update({ friends: newFriends })
        userFriendsRef.once('value').then(function(snap){
          var updatedValue = snap.val().friends;
          return updatedValue
        }).then(function(value){
          LayoutAnimation.configureNext(CustomLayoutAnimation)
          _this.setState({
            friends: value
          })
        })
      }
    }
    catch(e){
      console.log(e);
    }
    this.showAddFriend()
  }

  _buttonAddFriend() {
    this.showAddFriend()
  }

  showAddFriend() {
    var offSet = (Platform.OS === 'ios') ? 220 : 0;
    LayoutAnimation.configureNext(CustomLayoutAnimation)
    if (this.state.addFriendOffset == -200) {
      this.setState({ addFriendOffset: offSet }) //Set to 0 for android
    } else {
      this.setState({
        addFriendOffset: -200,
        friendChange: ''
      })
    }
  }

//USERS FRIENDS TO BE RENDERED ON PAGE WILL BE QUERY OF THE SORT BELOW

// var payload=[];  // RESULT OF SEARCH INDEX or USERS FRIENDS TO BE THROWN TO RENDER

// _updateFriends = () => {
//   userFriends.child('2/friends').once('value').then(function(snap) {
//     snap.forEach(function(snapshot){
//       payload.push([snapshot.val().displayName, snapshot.val().uid]);
//     }); return Promise.all(payload);
//   }).then(function(payload){
//       return payload
//     })
   //  .then(function(payload){  //PAYLOAD WILL HOLD UIDS
   //        console.log(payload);
   //     })


   //  });
  // }

  _searchUsers(searchString) {
    console.log(searchString)
    var ref = firebase.database().ref('/people');
    var userRef = ref.child('userPoints');
    var userFriends = ref.child('userFriends');
    var peopleRef = ref.child('/people')
    var people = []
    var _this = this

    if (searchString == '') {
      this.setState({
        searchResults: []
      })
    } else {
      ref.orderByChild('displayName').startAt(searchString).limitToFirst(10).once('value')
        .then(function(snap){
          snap.forEach(function(snapshot){
              people.push({'displayName':  snapshot.val().displayName, 'uid': snapshot.val().uid})
          })
          return Promise.all(people)
        }).then(function(people){
          const userId = Object.keys(people);
          userId.forEach(userId => {
            var name = people[userId].displayName;
            if (!name.startsWith(searchString)){
              delete people[userId];
            }
          })
          var results_without_empties = []
          people.forEach( item => {
            if (item != '') {
              results_without_empties.push(item)
            }
          })
          _this.setState({
            searchResults: results_without_empties
          })
        })
      }
    }

  _addFriend (displayName, uid){
    var _this = this
    var ref = firebase.database().ref();
    var currentUid = firebase.auth().currentUser.uid;
    var userFriendsRef = ref.child('userReadable/userFriends');


    userFriendsRef.child(currentUid+ '/'+uid).set({
      displayName: displayName,
      uid: uid
    });
  }

showSearchBar() {
  LayoutAnimation.configureNext(CustomLayoutAnimation)
  if (this.state.searchBarOffset != 0) {
    this.setState({
      searchBarOffset: 0,
      searchBarOffsetWrapper: 0
    })
  } else {
    this.setState({
      searchBarOffset: 250,
      searchBarOffsetWrapper: 300
    })
  }

}

 render() {
   const people = [ { displayName: 'cjordan2', uid: '29gc030449ud' },
   { displayName: 'anichols2', uid: 'UID2764789g4' },
   { displayName: 'jbishop2', uid: 'UID294581934' },
   { displayName: 'mbell2', uid: 'UID232391934' },
   { displayName: 'aturner4', uid: 'UID231934' },
   { displayName: 'jflores2', uid: 'UID563244' },
   { displayName: 'athompson4', uid: 'UID22044' },
   { displayName: 'aowens2', uid: 'UID22045' },
   { displayName: 'twilliams2', uid: 'UID402644' },
   { displayName: 'ahamilton2', uid: 'UID5832962' },
   { displayName: 'bbradley2', uid: 'UID11004962' },
   { displayName: 'JonnyIve', uid: 'UID13429932' },
   { displayName: 'WashingtonBarker', UID: '13f39932' } ];

    var _this = this;

    users = [];
    var search = []
    var i = 1

      people.forEach(function(element){
        users.push(
          <View  style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: 'transparent', marginLeft: 10, marginRight: 10, paddingTop: 5, paddingBottom: 5}}>
            <TouchableOpacity onPress = {_this._addFriend.bind(this, element.displayName, element.uid)}>
            <Icon name='user-circle-o' size={50} color='#e0e0e0' style={{ alignItems:'flex-end', borderRadius: 25, borderColor: 'transparent', borderWidth: 1, width: 50, height: 50, overflow: 'hidden', backgroundColor: 'white'}} />
            <Text style={{flex: 1, textAlign: 'left', color: '#424242'}} > {element.displayName} </Text>
            <View style={{flex: 1}}>
              {/* <Text style={{flex: 1, textAlign: 'left', color: '#424242'}} >200pts</Text> */}
              {/* <Text style={{flex: 1, textAlign: 'left', color: '#a5d6a7'}} >Level 1</Text> */}
            </View>
            </TouchableOpacity>
          </View>
        )
      })
        console.log(this.state.searchResults)
        this.state.searchResults.forEach(function(element){
          search.push(
            <View  style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: 'transparent', marginLeft: 10, marginRight: 10, paddingTop: 5, paddingBottom: 5}}>
              <TouchableOpacity onPress = {_this._addFriend.bind(this, element.displayName, element.uid)} style={{alignItems: 'flex-start'}}>
                <Icon name='user-circle-o' size={50} color='#e0e0e0' style={{ alignItems:'flex-end', borderRadius: 25, borderColor: 'transparent', borderWidth: 1, width: 50, height: 50, overflow: 'hidden', backgroundColor: 'white'}} />
                <Text style={{flex: 1, textAlign: 'left', color: 'white'}} > {element.displayName} </Text>
                <View style={{flex: 1}}>
                  {/* <Text style={{flex: 1, textAlign: 'left', color: '#424242'}} >200pts</Text> */}
                  {/* <Text style={{flex: 1, textAlign: 'left', color: '#a5d6a7'}} >Level 1</Text> */}
                </View>
              </TouchableOpacity>
            </View>
          )
        })

    const friends_two = []
    for (var x = 10; x <= 12; x++) {
      friends_two.push(
        <View key={x} style={{alignItems: 'center', margin: 10, marginTop: 5, marginBottom: 20}}>
            <Icon name='user-circle-o' size={40} color='#e0e0e0' style={{overflow: 'hidden', borderRadius: 0, backgroundColor: 'transparent', width: 40, height: 43,}} />
          <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{padding: 5}}>
            <Icon name='check-circle' color={'#424242'} size={25}/>
          </TouchableOpacity>
          <TouchableOpacity style={{padding: 5}}>
            <Icon name='times-circle' color={'#ef5350'} size={25}/>
          </TouchableOpacity>
          </View>
        </View>
      )
     }
       return (
          <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Icon name='bars'
              size={30}
              color='white'
              onPress={this.props.sideMenu}/>
            </TouchableOpacity>
            <Text style={{
              fontSize: 25,
              textAlign: 'center',
              width: 250,
              color: 'white',
              fontWeight: '300',
              marginBottom: 5
            }}>
              FRIENDS
            </Text>
            <TouchableOpacity onPress={this.showSearchBar.bind(this)} >
              <Icon name='search' size={20} color='white' />
            </TouchableOpacity>
            <View style={{height: 30, justifyContent: 'center', width: this.state.searchBarOffsetWrapper, position: 'absolute', right: 10, top: 22, flexDirection: 'row', backgroundColor: '#424242'}}>
              <TextInput
                placeholder='Search for friends'
                autoCapitalize='none'
                style={{backgroundColor: '#e0e0e0', width: this.state.searchBarOffset, height: 30, borderRadius: 5, fontSize: 12}}
                onChangeText={this._searchUsers.bind(this)}/>
              <TouchableOpacity activeOpacity={.7} onPress={this.showSearchBar.bind(this)} >
                <Text style={{padding: 6, color: 'white', marginLeft: 2}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{position: 'absolute', top: 60, left: 0, right: 0, zIndex: 999999, backgroundColor: 'rgba(0,0,0,.8)'}}>
            <ScrollView horizontal={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{}}>
              { search }
            </ScrollView>
          </View>
          <View style={{flex: 0, backgroundColor: '#a5d6a7', borderTopWidth: 1, borderColor: '#e0e0e0'}}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{backgroundColor: 'transparent'}}>
              { friends_two }
            </ScrollView>
          </View>
          <View style={{flex: 1}}>
            <ScrollView horizontal={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{}}>
              { users }
            </ScrollView>
          </View>

            <TouchableOpacity style={styles.addFriend} activeOpacity={.7} onPress={this.showAddFriend.bind(this)}>
              <Icon name='plus-circle' size={50} color='white' style={{backgroundColor: 'transparent'}}/>
            </TouchableOpacity>
            <View style={{
              position: 'absolute',
              bottom: this.state.addFriendOffset,
              width: 300,
              height: 200,
              left: 35,
              borderWidth: 1,
              borderRadius: 15,
              borderColor: 'black',
              backgroundColor: 'white',
              justifyContent: 'center',
            }}>
              <Text style={{textAlign: 'center', color: 'black', fontFamily: 'OpenSans' }}>
                ADD FRIENDS
              </Text>
              <Text style={{color: 'red', fontSize: 10, textAlign: 'center'}}>user not found</Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', padding: 20}}>
                <Text style={{color: 'white',fontSize: 35}}>
                </Text>
                <View style={{borderBottomWidth: 1, borderColor: '#e0e0e0'}}>
                  <TextInput
                    style={{height: 40, width: 150, borderColor: 'white', backgroundColor: 'white', borderWidth: 1, textAlign: 'left'}}
                    onChangeText={(friendChange) => this.setState({friendChange})}
                    value={''+this.state.friendChange+''}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={this._addFriend.bind(this)}
                style={styles.addFriendButton}

              >
                <Text style={{textAlign: 'center', color: 'white' }}>
                  ADD FRIEND
                </Text>
              </TouchableOpacity>
            </View>
          </View>
         )
       }
     }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: 'white',
   },
   header: {
       paddingTop: getPlatformValue('android', 25, 20),
       flex: 0,
       flexDirection: 'row',
       height: 60,
       backgroundColor: '#424242',
       justifyContent: 'space-around',
       alignItems: 'center',
       borderBottomWidth: 1,
       borderColor: '#424242'
    },
    addFriend: {
       position: 'absolute',
       top: 75,
       right: 20,
    },
    addFriendButton: {
       height: 45,
       width: 200,
       backgroundColor: '#3949ab',
       borderRadius: 10,
       marginLeft: 55,
       overflow: 'hidden',
       justifyContent: 'center'
    }
 });
