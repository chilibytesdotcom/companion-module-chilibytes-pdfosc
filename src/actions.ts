import type { ModuleInstance } from './main.js'

/**
 * Helper function to send OSC messages
 */
async function sendOscMessage(self: ModuleInstance, address: string): Promise<void> {
	try {
		if (!self.oscClient) {
			throw new Error('OSC client not initialized')
		}
		self.oscClient.send(address)
		self.log('debug', `Sent ${address} to ${self.config.host}:${self.config.port}`)
	} catch (error) {
		self.log('warn', `Failed to send OSC message: ${error}`)
	}
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		next: {
			name: 'Next',
			options: [],
			callback: async () => sendOscMessage(self, '/pdfosc/next'),
		},
		previous: {
			name: 'Previous',
			options: [],
			callback: async () => sendOscMessage(self, '/pdfosc/previous'),
		},
		firstPage: {
			name: 'First Page',
			options: [],
			callback: async () => sendOscMessage(self, '/pdfosc/firstpage'),
		},
		lastPage: {
			name: 'Last Page',
			options: [],
			callback: async () => sendOscMessage(self, '/pdfosc/lastpage'),
		},
		enablePresentation: {
			name: 'Enable Presentation Mode',
			options: [],
			callback: async () => sendOscMessage(self, '/pdfosc/presentation'),
		},
		disablePresentation: {
			name: 'Disable Presentation Mode',
			options: [],
			callback: async () => sendOscMessage(self, '/pdfosc/exitpresentation'),
		},
		togglePresentationMode: {
			name: 'Toggle Presentation Mode',
			options: [],
			callback: async () => {
				const isPresentation = self.getVariableValue('isPresentation')
				if (isPresentation === 'Yes') {
					await sendOscMessage(self, '/pdfosc/exitpresentation')
					self.setVariableValues({
						isPresentation: 'No',
						state: 'Normal',
					})
					self.checkFeedbacks('presentationModeIndicator')
					self.checkFeedbacks('showState')
				} else {
					await sendOscMessage(self, '/pdfosc/presentation')
					self.setVariableValues({
						isPresentation: 'Yes',
						state: 'Presentation',
					})
					self.checkFeedbacks('presentationModeIndicator')
					self.checkFeedbacks('showState')
				}
			},
		},
	})
}
