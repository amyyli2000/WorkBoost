import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Alert, Image } from 'react-native';
import Modal from 'react-native-modal'
import Task from '../components/Task'
import AddButton from '../components/buttons/AddButton'
import AddTaskForm from '../screens/AddTaskPage'
const {saveTaskModel, pullTaskDataModel, removesTaskModel, editsTaskModel, completeTaskModel, refreshRemoveTaskModel} = require('../../model/dbModel.js');

export default function TaskPage() {
    const [tasks, setTasks] = useState([])
    const [addModalVisible, setAddModalVisible] = useState(false)
    const [fetching, setFetching] = useState(false)

    function refreshData(snapshot) {
        setFetching(true)
        let today = new Date()
        let curMonth = today.getMonth()+1
        let curDay = today.getDate()
        let curYear = today.getFullYear()
        let arr = []

        snapshot.forEach(shot => {
            if(shot.key != "user") {
                let due = shot.val().dueDate.split("-")
                let dueMonth = due[0]
                let dueDay = due[1]
                let dueYear = due[2]
                //checks to see if the due date has passed
                if(curYear > dueYear || curMonth > dueMonth || (curDay > dueDay && curMonth == dueMonth)) {
                    refreshRemoveTaskModel(shot.key)
                    alert("Some tasks have been removed (past their due dates)")
                }
                else {
                    obj = shot.val()
                    obj.key = shot.key
                    arr.push(obj)
                }
            }
        })
        arr.sort((c,d) => {
            cDueDate = c.dueDate.split("-")
            dDueDate = d.dueDate.split("-")
            dateC = new Date(cDueDate[2], cDueDate[0]-1, cDueDate[1])
            dateD = new Date(dDueDate[2], dDueDate[0]-1, dDueDate[1])
            return dateC - dateD
        })
        arr.sort((a,b) => {return a.completed - b.completed})
        setTasks(arr)
    }

    function setData(snapshot) {
        let arr = []
        snapshot.forEach(shot => {
            if(shot.key != "user") {
                obj = shot.val()
                obj.key = shot.key
                arr.push(obj)
            }
        })
        arr.sort((c,d) => {
            cDueDate = c.dueDate.split("-")
            dDueDate = d.dueDate.split("-")
            dateC = new Date(cDueDate[2], cDueDate[0]-1, cDueDate[1])
            dateD = new Date(dDueDate[2], dDueDate[0]-1, dDueDate[1])
            return dateC - dateD
        })
        arr.sort((a,b) => {return a.completed - b.completed})
        setTasks(arr)
    }

    //logic for "component did mount" first time organizing of state based on completion
    useEffect(() => {
            pullTaskDataModel(refreshData)
            .then(() => setFetching(false))
    }, [])

    //add task
    addTask = (title, description, dueDate) => {
        saveTaskModel(title, description, dueDate)
        pullTaskDataModel(setData)
    }

    //remove task
    remove = (key) => {
        removesTaskModel(key, setData)
    }

    showAddForm = () => setAddModalVisible(prev => !prev);

    //updates completion
    handleTaskCompletion = (key, complete) => {
        completeTaskModel(key, complete, setData)
    }

    //edit task
    editTask =(key, title, description, dueDate) => {
        editsTaskModel(key, title, description, dueDate)
        pullTaskDataModel(setData)
    }
    
    EmptyView = () => {
        return(
            <View>
                <Text style={{textAlign: "center", fontSize: 20, padding:10}}>
                    There are no Tasks for the day. Click the "plus" button to add a new task!
                </Text>
            </View>
        )
    }

    return(
        <View style={styles.container}> 
            <Modal style={{margin:0, marginTop:60, backgroundColor:"#FFF"}}
                   isVisible={addModalVisible}
                   onSwipeComplete={() => showAddForm()}
                   swipeDirection="down">
                <AddTaskForm showAddForm={this.showAddForm}
                             addTask={this.addTask}/>
            </Modal>
             <View style={styles.addTaskRow}>
                <View styles={styles.textStyle}>
                    <Text style={styles.fontStyle}>
                        Tasks
                    </Text>
                </View>
                <View style={styles.addButtonStyle}>
                    <AddButton showAddForm={this.showAddForm}
                                    addHabit={this.addTask}/>
                </View >
            </View>
            <ImageBackground source={require('../pictures/coffeeBackground.png')} style={styles.background}>
                <FlatList
                    data = {tasks}
                    ListEmptyComponent={this.EmptyView}
                    onRefresh={() => pullTaskDataModel(refreshData)
                                    .then(() => setFetching(false))}
                    refreshing={fetching}
                    renderItem = {({ item, index }) => <Task item={item} 
                                                            index={index}
                                                            editTask={this.editTask}
                                                            remove={this.remove}
                                                            handleTaskCompletion={this.handleTaskCompletion}/>}   
                    //to be used when firebase data comes in
                    //keyExtractor={item => item.toString()}
                />
            </ImageBackground>
        </View> 

    )
}

const styles = StyleSheet.create({
    addTaskRow:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        width:'100%'
    },
    addButtonStyle: {
        flex: 1,
        alignContent: "flex-end",
        alignItems: "flex-end"
    },
    textStyle:{
        flex:1,
        alignItems:'center'
    },
    fontStyle:{
        fontWeight: 'bold',
        fontSize: 32,
        paddingLeft:'3%'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
     },
     background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
     }
});