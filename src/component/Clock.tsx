import * as React from 'react';
interface IProps {

}
interface IState {
	date: Date;
}
export class Clock extends React.Component<IProps, IState> {
	timerID: number;
	constructor(props: IProps) {
		super(props);
		this.state = { date: new Date() };
	}
	
	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(), 1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		this.setState({
			date: new Date()
		});
	}

	render() {
		return (
			<div>
				<h1>Hello, World!</h1>
				<h2>It is {this.state.date.toLocaleTimeString()}</h2>
			</div>
		);
	}

}