import React from 'react';
import PropTypes from 'prop-types';

class Hue extends React.Component {
	constructor(props) {
		super(props);

		this._container = React.createRef();

		this.state = {
			left: 0
		};
	}

	componentWillUnmount() {
		this.unbindEventListeners();
	}

	componentDidMount() {
		this.setInitialCoordinates(this.props.value);
	}

	componentWillReceiveProps(nextProps) {
		this.setInitialCoordinates(nextProps.value);
	}

	setInitialCoordinates(hue) {
		const container = this._container.current;

		const containerRect = container.getBoundingClientRect();

		const newLeft = (hue / 360) * containerRect.width;

		this.setState({
			left: newLeft
		});
	}

	handleChange = (event, skip) => {
		const container = this._container.current;

		const containerRect = container.getBoundingClientRect();

		const x =
			typeof event.pageX === 'number'
				? event.pageX
				: event.touches[0].pageX;

		let left = x - (containerRect.left + window.pageXOffset);

		left =
			left < 0
				? 0
				: left > containerRect.width
				? containerRect.width
				: left;

		const selectedHue = (left / containerRect.width) * 360;

		this.props.onChange(selectedHue);

		this.setState({
			left: left
		});
	};

	handleMouseDown = event => {
		this.handleChange(event, true);

		window.addEventListener('mousemove', this.handleChange);
		window.addEventListener('mouseup', this.handleMouseUp);
	};

	handleMouseUp = () => {
		this.unbindEventListeners();
	};

	unbindEventListeners = () => {
		window.removeEventListener('mousemove', this.handleChange);
		window.removeEventListener('mouseup', this.handleMouseUp);
	};

	render() {
		const {left} = this.state;
		const {value} = this.props;

		return (
			<div
				className="hue-selector"
				onMouseDown={this.handleMouseDown}
				onTouchMove={this.handleChange}
				onTouchStart={this.handleChange}
				ref={this._container}
			>
				<span
					className="pointer"
					style={{
						left: left - 7,
						background: `hsl(${value}, 100%, 50%)`
					}}
				/>
			</div>
		);
	}
}

Hue.propTypes = {
	value: PropTypes.number,
	onChange: PropTypes.func
};

Hue.defaultProps = {
	value: 0,
	onChange: () => {}
};

export default Hue;
