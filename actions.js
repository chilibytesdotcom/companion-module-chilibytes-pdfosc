// const { Regex } = require('@companion-module/base')

module.exports = function (self) {
	self.setActionDefinitions({
		next: {
			name: 'Next',
			options: [],
			callback: async (_event) => {
				sendOscMessage('/pdfosc/next', [])
			},
		},
		previous: {
			name: 'Previous',
			options: [],
			callback: async (_event) => {
				sendOscMessage('/pdfosc/prev', [])
			},
		},
		// New actions for presentation mode and navigation
		firstPage: {
			name: 'First Page',
			options: [],
			callback: async (_event) => {
				sendOscMessage('/pdfosc/firstpage', [])
			},
		},
		lastPage: {
			name: 'Last Page',
			options: [],
			callback: async (_event) => {
				sendOscMessage('/pdfosc/lastpage', [])
			},
		},
		enterPresentation: {
			name: 'Enter Presentation Mode',
			options: [],
			callback: async (_event) => {
				sendOscMessage('/pdfosc/presentation', [])
			},
		},
		exitPresentation: {
			name: 'Exit Presentation Mode',
			options: [],
			callback: async (_event) => {
				// Send Escape key command via OSC
				sendOscMessage('/pdfosc/exitpresentation', [])
			},
		},
		togglePresentation: {
			name: 'Toggle Presentation Mode',
			options: [],
			callback: async (_event) => {
				// Check current presentation mode status
				const isPresentation = self.getVariableValue('isPresentation')

				if (isPresentation === 'Yes') {
					// Currently in presentation mode, so exit
					sendOscMessage('/pdfosc/exitpresentation', [])
					self.log('debug', 'Toggle Presentation: Exiting presentation mode')

					// Update variable immediately for better UI responsiveness
					self.setVariableValues({
						isPresentation: 'No',
						state: 'Normal',
					})
					// Check feedbacks to update UI
					self.checkFeedbacks('presentationModeIndicator')
					self.checkFeedbacks('showState')
				} else {
					// Not in presentation mode, so enter
					sendOscMessage('/pdfosc/presentation', [])
					self.log('debug', 'Toggle Presentation: Entering presentation mode')

					// Update variable immediately for better UI responsiveness
					self.setVariableValues({
						isPresentation: 'Yes',
						state: 'Presentation',
					})
					// Check feedbacks to update UI
					self.checkFeedbacks('presentationModeIndicator')
					self.checkFeedbacks('showState')
				}
			},
		},
	})

	const sendOscMessage = (path, args) => {
		console.log(
			'info',
			`Sending OSC ${path} ${args.length > 0 ? args[0].value : ''}${args.length > 1 ? args[1].value : ''}`,
		)
		self.oscSend(self.config.remotehost, self.config.remoteport, path, args)
	}
}
