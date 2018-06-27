import * as React from 'react';

interface Props {
    socket: SocketIOClient.Socket;
}
interface State {
    serverTime: string;
}
export class Sample extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            serverTime: 'N/A'
        };
        this.props.socket.on('server-time', payload => {
            this.setState({ serverTime: payload });
        });
    }
    clicked() {
        console.log('clicked');
    }
    componentWillUnmount() {
        this.props.socket.off('server-time');
    }
    render() {
        return <>
            <h1>This is an application</h1>
            <p>Server time is currently: <span id="serverTime">{this.state.serverTime}</span></p>
            <button id="btn" className="interactible" onClick={this.clicked}>Test</button>
        </>;
    }
}