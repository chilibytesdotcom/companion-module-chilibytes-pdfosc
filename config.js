const { Regex } = require('@companion-module/base')

const configFields = [
	{
		id: 'important-line',
		type: 'static-text',
		label: 'Setting up PDFOSC',
		value: `PDFOSC module enables monitoring and controlling PDF playback.<br/>
		It requires PDFOSC app installed and configured on show machines.<br/>
		For setup instructions and details, visit: <a href='https://github.com/chilibytesdotcom/pdfosc'><b>PDFOSC</b></a>`,
		width: 12,
	},
	{
		id: 'important-line',
		type: 'static-text',
		label: 'Multiple PDFOSC machines',
		value: `You'll need to set up and configure a module per PDFOSC machine.<br/>
		Each module's ports must be configured for OSC control and feedback.<br/>
		See <a href='https://github.com/chilibytesdotcom/pdfosc'><b>configuration</b></a> for details.`,
		width: 12,
	},
	{
		type: 'textinput',
		id: 'remotehost',
		label: 'Remote IP (Actions)',
		width: 8,
		regex: Regex.IP,
		default: '127.0.0.1',
	},
	{
		type: 'textinput',
		id: 'remoteport',
		label: 'Remote port',
		width: 4,
		regex: Regex.PORT,
		default: 55550,
	},
	{
		id: 'important-line',
		type: 'static-text',
		label: '',
		value: `The IP address and port of your PDFOSC machine. Default: <b>127.0.0.1:55550</b><br/>
		Values can be changed from the <b>Config OSC</b> menu in PDFOSC.<br/>
		Port value must be the same as the <b>Listen Port</b> in the PDFOSC machine.`,
		width: 12,
	},
	{
		type: 'textinput',
		id: 'localport',
		label: 'Listen port (Feedbacks)',
		width: 8,
		regex: Regex.PORT,
		default: 55551,
	},
	{
		id: 'important-line',
		type: 'static-text',
		label: '',
		value: `This port will listen for OSC messages from PDFOSC. Default: <b>55551</b><br/>
		Values can be changed from the <b>Config OSC</b> menu in PDFOSC.<br/>
		Port value must be the same as the <b>Output Port</b> in the PDFOSC machine.`,
		width: 12,
	},
]

module.exports = configFields
