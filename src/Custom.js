import React, {useState} from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import Hue from './Hue';
import Splotch from './Splotch';
import GradientSelector from './GradientSelector';
import {HEX_REGEX} from './util';

function CustomColorIcon() {
	return (
		<svg
			width="12"
			height="17"
			viewBox="0 0 12 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M11 11C11 13.7614 8.76142 16 6 16C3.23858 16 1 13.7614 1 11C1 9.79197 1.58669 8.71677 2.65995 7.20346C2.85539 6.92789 3.06515 6.64012 3.28534 6.33805C4.11185 5.20415 5.08532 3.86863 6 2.22004C6.91468 3.86863 7.88816 5.20415 8.71467 6.33805C8.93485 6.64013 9.14461 6.92789 9.34005 7.20346C10.4133 8.71677 11 9.79197 11 11Z"
				stroke="#6B6C7E"
				strokeWidth="2"
			/>
			<path
				d="M12 11.0001C12 14.3138 9.31371 17.0001 6 17.0001C2.68629 17.0001 0 14.3138 0 11.0001C2 10 3.5 12.5001 6 11.0001C8.5 9.5 10 10 12 11.0001Z"
				fill="#6B6C7E"
			/>
		</svg>
	);
}

RGBInput.propTypes = {
	onChange: PropTypes.func,
	name: PropTypes.string,
	value: PropTypes.number
};

function RGBInput({onChange, name, value}) {
	return (
		<div className="form-group rgb-info">
			<div className="input-group">
				<div className="input-group-item input-group-item-shrink input-group-prepend">
					<span className="input-group-text">
						{name.toUpperCase()}
					</span>
				</div>
				<div className="input-group-append input-group-item">
					<input
						value={value}
						className="form-control"
						type="text"
						onChange={event => {
							const newVal = Number(event.target.value);

							onChange({[name]: newVal});
						}}
					/>
				</div>
			</div>
		</div>
	);
}

Custom.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.string),
	label: PropTypes.string,
	onChange: PropTypes.func,
	onColorsChange: PropTypes.func,
	value: PropTypes.string
};

function Custom({colors, label, onChange, onColorsChange, value}) {
	const color = tinycolor(value);

	const [activeSplotchIndex, setActiveSplotchIndex] = useState(0);
	const [hue, setHue] = useState(0);
	const [editorActive, setEditorActive] = useState(false);
	const [inputVal, setInputValue] = useState(color.toHex());

	const {r, g, b} = color.toRgb();
	const {s, v} = color.toHsv();

	const rgbArr = [[r, 'r'], [g, 'g'], [b, 'b']];

	const handleNewInputValue = value => {
		const match = value.match(HEX_REGEX);

		setInputValue(match ? match[0] : '');
	};

	const setNewColor = (colorValue, setInput = true) => {
		const hexString = colorValue.toHexString();

		const newColors = [...colors];

		newColors[activeSplotchIndex] = hexString;

		onColorsChange(newColors);

		onChange(hexString);

		if (setInput) {
			handleNewInputValue(colorValue.toHex());
		}
	};

	return (
		<div>
			{label && (
				<div className="label-container">
					<label>{label}</label>
					<button
						onClick={() => setEditorActive(!editorActive)}
						className={`${
							editorActive ? 'active ' : ''
						}btn btn-monospaced btn-sm`}
						type="button"
					>
						<CustomColorIcon />
					</button>
				</div>
			)}

			<div className="splotch-grid">
				{colors.map((hex, i) => (
					<Splotch
						active={i === activeSplotchIndex}
						onClick={() => {
							if (hex === '#FFFFFF') {
								setEditorActive(true);
							}

							setActiveSplotchIndex(i);

							setHue(tinycolor(hex).toHsv().h);

							onChange(hex);
						}}
						key={i}
						value={hex}
					/>
				))}
			</div>

			{editorActive && (
				<React.Fragment>
					<div className="gradient-info">
						<GradientSelector
							hue={hue}
							color={color}
							onChange={(saturation, visibility) => {
								setNewColor(
									tinycolor({
										h: hue,
										s: saturation,
										v: visibility
									})
								);
							}}
						/>

						<div>
							{rgbArr.map(([val, key]) => (
								<RGBInput
									key={key}
									value={val}
									name={key}
									onChange={newVal => {
										const color = tinycolor({
											r,
											g,
											b,
											...newVal
										});

										setHue(color.toHsv().h);

										setNewColor(color);
									}}
								/>
							))}
						</div>
					</div>

					<Hue
						onChange={hue => {
							setHue(hue);

							setNewColor(tinycolor({h: hue, s, v}));
						}}
						value={hue}
					/>

					<div className="input-group hex-info">
						<div className="input-group-append input-group-item">
							<input
								value={
									'#' + inputVal.toUpperCase().substring(0, 6)
								}
								className="form-control"
								type="text"
								onChange={event => {
									const inputValue = event.target.value;

									handleNewInputValue(inputValue);

									const newColor = tinycolor(inputValue);

									if (newColor.isValid()) {
										setHue(newColor.toHsv().h);
										setNewColor(newColor, false);
									}
								}}
								onBlur={event => {
									const newColor = tinycolor(
										event.target.value
									);

									if (newColor.isValid()) {
										handleNewInputValue(newColor.toHex());
									} else {
										handleNewInputValue(color.toHex());
									}
								}}
							/>
						</div>
					</div>
				</React.Fragment>
			)}
		</div>
	);
}

export default Custom;
