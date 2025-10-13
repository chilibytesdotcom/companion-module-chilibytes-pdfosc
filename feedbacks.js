const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		showState: {
			name: 'Test Mode Indicator',
			type: 'boolean',
			label: 'Show Test Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 200, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (_feedback) => {
				const isTestMode = self.getVariableValue('isTestMode')
				self.log('debug', `Checking test mode status: ${isTestMode}`)

				if (isTestMode === undefined || isTestMode === null) {
					self.log('debug', 'Test mode status is undefined or null')
					return false
				}

				// Return true if in test mode
				return isTestMode === 'Yes'
			},
		},

		presentationModeIndicator: {
			name: 'Presentation Mode Indicator',
			type: 'boolean',
			label: 'Presentation Active',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0),
				color: combineRgb(255, 255, 255),
				text: 'PRESENTING',
			},
			options: [],
			callback: (_feedback) => {
				const isPresentation = self.getVariableValue('isPresentation')
				self.log('debug', `Checking presentation mode status: ${isPresentation}`)

				return isPresentation === 'Yes'
			},
		},
	})
}
