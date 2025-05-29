import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		showState: {
			name: 'Test Mode Indicator',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 200, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (_feedback) => {
				const isTestMode = self.getVariableValue('isTestMode')
				if (isTestMode === undefined || isTestMode === null) {
					self.log('debug', 'isTestMode is undefined or null')
					return false
				}

				return isTestMode === 'Yes'
			},
		},
		presentationModeIndicator: {
			name: 'Presentation Mode Indicator',
			type: 'boolean',
			label: 'Show Presentation Mode',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (_feedback) => {
				const isPresentation = self.getVariableValue('isPresentation')
				if (isPresentation === undefined || isPresentation === null) {
					self.log('debug', 'isPresentation is undefined or null')
					return false
				}

				return isPresentation === 'Yes'
			},
		},
	})
}
