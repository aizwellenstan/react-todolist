import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export class TodoForm extends React.Component {
    constructor() {
        super();
        this.state = {
            startDate: new Date(),
            endDate: new Date()
        };
        this.addTask = this.addTask.bind(this);
    }

    addTask(e) {
        e.preventDefault();
        var inp = document.getElementById('todoInput');
        var val = inp.value;
        inp.value = '';
        var start = this.state.startDate
        var end = this.state.endDate
        this.props.addTask(val, start, end);
    }

    setStartDate = date => {
        this.setState({
            startDate: date
        });
    };

    setEndDate = date => {
        if (date > this.state.startDate) {
            this.setState({
                endDate: date
            });
        }
    };

    render() {
        return (
            <div>
                <div className="todo type1">
                    <form className="input-wrapper" onSubmit={this.addTask}>
                        <input id="todoInput" type="text" className="add-todo" name="add-todo" placeholder="やるべき事?" />
                        <center>
                            <div>
                                Start
                            <DatePicker
                                    selected={this.state.startDate}
                                    onChange={date => this.setStartDate(date)}
                                    showTimeSelect
                                    timeFormat="p"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="Pp"
                                    width="200px"
                                />&nbsp;
                                End
                            <DatePicker
                                    selected={this.state.endDate}
                                    onChange={date => this.setEndDate(date)}
                                    showTimeSelect
                                    timeFormat="p"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="Pp"
                                    width="200px"
                                />
                            </div>
                        </center>

                    </form>
                </div>
                <button type="button" onClick={this.addTask} className="add-btn" />
            </div>
        )
    }
}
