import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import Modal from 'react-native-modal'
import Task from '../components/Task'
import AddTaskButton from '../components/buttons/AddTaskButton'
import taskData from '../sample_task_data.json'
import AddTaskForm from '../screens/AddTaskPage'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';


export default function TaskPage() {
    const [tasks, setTasks] = useState(taskData)
    const [addModalVisible, setAddModalVisible] = useState(false)

    //logic for "component did mount" first time organizing of state based on completion
    useEffect(() => {
            let tmpTasks = tasks.slice()
            tmpTasks.sort((a,b) => {return b.completed - a.completed})
            setTasks(tmpTasks.reverse())
    }, [])

    addTask = (text) => {
        let notEmpty = text.trim().length > 0
        if (notEmpty) {
            setTasks(tasks => [...tasks, text])
        }
    }

    remove = (i) => {
        let tmpTasks = tasks.slice()
        tmpTasks.splice(i,1)
        setTasks(tmpTasks)
    }

    showAddForm = () => setAddModalVisible(prev => !prev);

    handleCheck = (index) => {
        let tmpTasks = tasks.slice() 
        tmpTasks[index] = {...tmpTasks[index], completed: !tmpTasks[index].completed} 
        setTasks(tmpTasks)
    }

    showEditForm = () => {
        //TODO Jaon
        alert("Jason")
    }

    return(
        <View> 
            <Modal style={{margin:0, marginTop:60, backgroundColor:"#FFF"}}
                   isVisible={addModalVisible}
                   onSwipeComplete={() => showAddForm()}
                   swipeDirection="down">
                <AddTaskForm showAddForm={this.showAddForm}
                             addTask={this.addTask}/>
            </Modal>
            <FlatList
                data = {tasks}
                renderItem = {({ item, index }) => <Task item={item} 
                                                         index={index}
                                                         showEditForm={this.showEditForm}
                                                         handleCheck={this.handleCheck}/>}   
                //to be used when firebase data comes in
                //keyExtractor={item => item.toString()}
            />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <AddTaskButton showAddForm={this.showAddForm}
                               addTask={this.addTask}/>
            </View >
        </View> 

    )
}