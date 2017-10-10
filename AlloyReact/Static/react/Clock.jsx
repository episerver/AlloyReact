import React from "react";

export default class Clock extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            time: this.getTimeString()
        };

        this.timerHandle = setInterval(this.refreshTime.bind(this), 1000);
    }

    getTimeString() {
        var date = new Date(),
            hours = date.getHours().toString(),
            minutes = date.getMinutes().toString(),
            seconds = date.getSeconds().toString();

        return hours + ":" + (minutes.length === 1 ? ("0" + minutes) : minutes) + ":" + (seconds.length === 1 ? ("0" + seconds) : seconds);
    }

    refreshTime() {

        this.setState({
            time: this.getTimeString()
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerHandle);
    }

    render() {
        return <span>{this.state.time}</span>;
    }

}