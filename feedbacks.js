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
			callback: () => {
				const isTestMode = self.getVariableValue('isTestMode')
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
			callback: () => {
				const isPresentation = self.getVariableValue('isPresentation')
				return isPresentation === 'Yes'
			},
		},
	})
}
