import React from 'react';
import { render } from 'react-dom';

import { Header } from './inc/header';
import { Footer } from './inc/footer';
import { TodoForm } from './todoForm';
import { TodoList } from './todoList';
import { Login } from './login';

class TodoApp extends React.Component {

    constructor() {
        super();

        this.state = {
            userSession: TodoApp.getUserSessionData(),
            tasks: [],
            currentTask: ''
        };
        this.addTask = this.addTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.doneTask = this.doneTask.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.uri = 'https://fivexruby-server.herokuapp.com/tasks/'
    }

    componentWillMount() {
        this.refreshTasks()
    }

    refreshTasks() {
        function handleErrors(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }

        fetch(this.uri, {
            method: 'get'
        })
            .then(handleErrors)
            .then(
                response =>
                    response.json().then(data => ({
                        data: data,
                        status: response.status
                    }))
            )
            .then(res => {
                if (res.data) {
                    this.setState({
                        tasks: res.data
                    });
                }
            })
            .catch(function (err) {
                alert('Fetch エラー : サーバー死んだ');
            });
    }

    static getUserSessionData() {
        let loginData = localStorage.getItem('login');
        loginData = JSON.parse(loginData);
        if (loginData !== null && loginData.login === true) {
            return { userName: loginData.userName };
        } else {
            return false;
        }
    }

    static isLogged() {
        let loginData = localStorage.getItem('login');
        loginData = JSON.parse(loginData);
        if (loginData !== null && loginData.login === true) {
            return true;
        }
        return false;
    }

    doLogin(userName) {
        let loginData = {
            login: true,
            userName: userName
        };
        this.setState({
            userSession: {
                userName: loginData.userName,
            }
        });
        loginData = JSON.stringify(loginData);
        localStorage.setItem('login', loginData);
    }

    addTask(task) {
        // let updatedList = this.state.tasks;
        // updatedList.push({ text: task, status: 'passive' });
        // this.setState({ tasks: updatedList });
        // this.updateLocalStorage(updatedList);

        if (task !== '') {
            fetch(this.uri, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(
                    { text: task, status: 'onhand' }
                )
            })
                .then(
                    this.setState({
                        tasks: []
                    }),
                    setTimeout(() => {
                        this.refreshTasks()
                    }, 1000)
                )
        } else {
            alert('何もない')
        }

        // .then(
        //     response =>
        //         response.json().then(data => ({
        //             data: data,
        //             status: response.status
        //         }))
        // )
        // .then(res => {
        //     if (res.data) {
        //         this.setState({
        //             tasks: res.data
        //         });
        //     }
        // })
    }

    removeTask(task_id) {
        // let updatedList = this.state.tasks;
        // updatedList.splice(task_id.replace('task_', ''), 1);
        // this.setState({ tasks: updatedList });
        // this.updateLocalStorage(updatedList);

        fetch(this.uri + task_id, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
            .then(
                this.setState({
                    tasks: []
                }),
                setTimeout(() => {
                    this.refreshTasks()
                }, 1000)
            )
    }

    doneTask(task_id) {
        // let updatedList = this.state.tasks;
        // let currentStatus = updatedList[task_id.replace('task_', '')].status;
        // let newStatus = 'active';
        // if (currentStatus === 'active') {
        //     newStatus = 'passive';
        // }
        // updatedList[task_id.replace('task_', '')].status = newStatus;
        // this.setState({ tasks: updatedList });
        // this.updateLocalStorage(updatedList);

        function handleErrors(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }


        fetch(this.uri + task_id, {
            method: 'get'
        })
            .then(handleErrors)
            .then(
                response =>
                    response.json().then(data => ({
                        data: data,
                        status: response.status
                    }))
            )
            .then(res => {
                if (res.data) {
                    delete res.data.id
                    this.setState({
                        currentTask: res.data
                    });
                }
            })
            .then(
                setTimeout(() => {
                    var data = this.state.currentTask

                    data.status == 'passive' ?
                        data.status = 'active' : data.status = 'passive'
                    fetch(this.uri + task_id, {
                        method: 'put',
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(
                            data
                        )
                    })
                }, 1000)
            )
            .then(
                this.setState({
                    tasks: []
                }),
                setTimeout(() => {
                    this.refreshTasks()
                }, 200)
            )
            .catch(function (err) {
                console.log(err)
                alert('Fetch エラー : サーバー死んだ');
            });
    }

    // updateLocalStorage(updatedList) {
    //     var updatedList = JSON.stringify(updatedList);
    //     localStorage.setItem('tasks', updatedList);
    //     return true;
    // }

    render() {
        let layout = (<Login doLogin={this.doLogin} />);
        if (TodoApp.isLogged() === true) {
            layout = (
                <div>
                    <Header loginData={TodoApp.getUserSessionData} />
                    <TodoForm addTask={this.addTask} />
                    <TodoList myList={this.state.tasks} addTask={this.addTask} removeTask={this.removeTask}
                        doneTask={this.doneTask} />
                    <Footer />
                </div>
            );
        }
        return (
            <div>
                <div className="content">
                    {layout}
                </div>
            </div>
        )
    }
}

render(<TodoApp />, document.getElementById('appRoot'));
