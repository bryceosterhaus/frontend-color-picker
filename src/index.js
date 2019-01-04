import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from './ColorPicker';

/**
 * This is the main entry point of the portlet.
 *
 * See https://tinyurl.com/js-ext-portlet-entry-point for the most recent 
 * information on the signature of this function.
 *
 * @param  {Object} params a hash with values of interest to the portlet
 * @return {void}
 */
export default function main({portletNamespace, contextPath, portletElementId, configuration}) {	
	function App() {
		const [color, setColor] = useState();
		const [color2, setColor2] = useState();
		const [customColors, setCustoms] = useState([
			'#008000',
			'#00FFFF',
			'#0000FF'
		]);
	
		return (
			<div>
				<ColorPicker
					allowAny
					label="Default Colors"
					onValueChange={setColor}
					value={color}
				/>
	
				<ColorPicker
					colors={customColors}
					label="Custom Colors"
					onColorsChange={setCustoms}
					onValueChange={setColor2}
					value={color2}
				/>
			</div>
		);
	}
	
	ReactDOM.render(<App />, document.getElementById(portletElementId));
}