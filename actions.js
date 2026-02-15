module.exports = function (self) {
	self.setActionDefinitions({
		next: {
			name: 'Next',
			options: [],
			callback: (_event) => {
				sendOscMessage('/pdfosc/next', [])
			},
		},
		previous: {
			name: 'Previous',
			options: [],
			callback: (_event) => {
				sendOscMessage('/pdfosc/prev', [])
			},
		},
		firstPage: {
			name: 'First Page',
			options: [],
			callback: (_event) => {
				sendOscMessage('/pdfosc/firstpage', [])
			},
		},
		lastPage: {
			name: 'Last Page',
			options: [],
			callback: (_event) => {
				sendOscMessage('/pdfosc/lastpage', [])
			},
		},
		enterPresentation: {
			name: 'Enter Presentation Mode',
			options: [],
			callback: (_event) => {
				sendOscMessage('/pdfosc/presentation', [])
			},
		},
		exitPresentation: {
			name: 'Exit Presentation Mode',
			options: [],
			callback: (_event) => {
				sendOscMessage('/pdfosc/exitpresentation', [])
			},
		},
		togglePresentation: {
			name: 'Toggle Presentation Mode',
			options: [],
			callback: (_event) => {
				const isPresentation = self.getVariableValue('isPresentation')

				if (isPresentation === 'Yes') {
					sendOscMessage('/pdfosc/exitpresentation', [])
					self.log('debug', 'Toggle Presentation: Exiting presentation mode')
				} else {
					sendOscMessage('/pdfosc/presentation', [])
					self.log('debug', 'Toggle Presentation: Entering presentation mode')
				}
			},
		},
	})

	const sendOscMessage = (path, args) => {
		self.log(
			'debug',
			`Sending OSC ${path} ${args.length > 0 ? args[0].value : ''}${args.length > 1 ? args[1].value : ''}`,
		)
		self.oscSend(self.config.remotehost, self.config.remoteport, path, args)
	}
}
