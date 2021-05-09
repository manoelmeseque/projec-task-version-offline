import React, { Component } from 'react'
import { Text, View, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native'

import commonStyles from '../commonStyles'
import todayImage from '../../assets/imgs/today.jpg'

import Icon from 'react-native-vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/pt-br'
import Task from '../components/Task'
import AddTask from './AddTask'




export default class TaskList extends Component{

    state = {
        showDoneTasks: true,
        showAddTask: false,
        visibleTask: [],
        tasks:[
            {
                id: Math.random(),
                desc: "Comprar Livro de React Native",
                estimateAt: new Date(),
                doneAt: new Date()
            },
            {
                id: Math.random(),
                desc: "Ler Livro de React Native",
                estimateAt: new Date(),
                doneAt: null 
            },
        ]
    }

    // quando o componente for montado
    componentDidMount = () => {
        this.filterTasks()
    }

    toggleFilter = () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)
    }

    filterTasks = () => {
        let visibleTasks = null
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks]
        }else{
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({ visibleTasks })
    }

    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task => {
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({tasks}, this.filterTasks)
    }

    render(){
        const today = moment().locale('pt-br').format('ddd, D [de], MMMM')
        return (
            
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onCancel={() => this.setState({showAddTask: false})}
                />
                <ImageBackground 
                    source={todayImage}
                    style={styles.background}
                >
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon 
                                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
                                size={20}
                                color={commonStyles.colors.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subTitle}>{today}</Text>
                    </View>

                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList 
                        data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask} />}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={() => this.setState({ showAddTask: true })}
                    >
                    <Icon name="plus" size={20} color={commonStyles.colors.secondary}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    background:{
        flex: 3,
    },
    taskList:{
        flex: 7,
    },
    titleBar:{
        flex: 1,
        justifyContent: "flex-end"
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    subTitle:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    iconBar:{
        flexDirection: "row",
        justifyContent: 'flex-end',
        marginHorizontal: 20,
        marginTop: Platform.OS === 'ios' ? 40 : 10,
    },
    addButton:{
        backgroundColor: commonStyles.colors.today,
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    }
})