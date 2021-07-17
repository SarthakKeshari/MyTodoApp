import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

export default class TodoList extends Component {
  state = {
    tasks: [],
    text: "",
    showBtn:true
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { tasks, text, showBtn } = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text }),
            text: "",
            showBtn:!showBtn
          };
        },
        () => Tasks.save(this.state.tasks)
      );
    }
  };

  deleteTask = i => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();

        tasks.splice(i, 1);

        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
  };

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
  }

  render() {
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewPadding }]}
      >
        <FlatList
          style={styles.list}
          data={this.state.tasks}
          renderItem={({ item, index }) =>
            <View style={{marginBottom:10}}>
              <View style={styles.listItemCont}>
                <Text style={styles.listItem}>
                  {item.text}
                </Text>
                <Button title="X" color="#841584" onPress={() => this.deleteTask(index)} />
              </View>
              {/* <View style={styles.hr} /> */}
            </View>}
        />
        
        {this.state.showBtn
        ?
        <TouchableOpacity onPress={()=>{this.setState({showBtn:false})}} style={{elevation:10,alignSelf:'flex-end', width:50,height:50,borderRadius:25,backgroundColor:'#149906',alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:30,fontWeight:'bold',color:'white'}}>+</Text>
        </TouchableOpacity>
        :
        <View style={{flexDirection:'row',}}>
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addTask}
          value={this.state.text}
          placeholder="Add Tasks"
          returnKeyType="done"
          returnKeyLabel="done"
        />
         <TouchableOpacity style={styles.doneBtn} onPress={()=>{this.addTask()}}>
           <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Done</Text>
         </TouchableOpacity>
        </View>
        }
        
      </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: viewPadding,
    paddingTop: 20
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius:5,
    borderWidth:2,
    borderColor:'#dcdcdc',
    padding:5
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%",
    backgroundColor:'#ececec',
    borderTopLeftRadius:5,
    borderBottomLeftRadius:5,
    width:300
  },
  doneBtn:{
    backgroundColor:'#519c06',padding:5,elevation:2,
    alignItems:'center',justifyContent:'center',
    borderTopRightRadius:5,borderBottomRightRadius:5 
  }
});

