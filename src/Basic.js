import React from 'react';
import PropTypes from 'prop-types';
import Splotch from './Splotch';

Basic.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.string),
	label: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string
};

function Basic({colors, label, onChange, value}) {
	return (
		<div className="basic-color-picker">
			{label && (
				<div className="label-container">
					<label>{label}</label>
				</div>
			)}

			<div className="splotch-grid">
				{colors.map(hex => (
					<Splotch
						onClick={() => onChange(hex)}
						key={hex}
						value={hex}
					/>
				))}
			</div>
		</div>
	);
}

Basic.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.string),
	label: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string
};

export default Basic;
