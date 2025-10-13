const osc = require('osc')
const { InstanceStatus } = require('@companion-module/base')

const oscListener = {
	close: async function () {
		await this.udpPort.close()
	},

	connect: async function (self) {
		this.udpPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: self.config.localport,
			metadata: true,
		})

		this.udpPort.open()

		this.udpPort.on('ready', () => {
			self.log('info', `Listening for PDFOSC messages on port ${self.config.localport}`)
			self.updateStatus(InstanceStatus.Ok, 'Connected.')
		})

		this.udpPort.on('message', (oscMsg) => {
			const path = oscMsg.address
			const args = oscMsg.args

			// Log all incoming messages for debugging
			self.log('debug', `Received OSC message: ${path}`)

			switch (path) {
				case '/pdfosc/current':
					if (args && args.length > 0) {
						const value = parseInt(args[0].value)
						const displayValue = value === 0 ? '-' : value
						self.setVariableValues({
							current: displayValue,
						})
					}
					break

				case '/pdfosc/total':
					if (args && args.length > 0) {
						const value = parseInt(args[0].value)
						const displayValue = value === 0 ? '-' : value
						self.setVariableValues({
							total: displayValue,
						})
					}
					break

				case '/pdfosc/state':
					if (args && args.length > 0) {
						const state = args[0].value
						self.log('debug', `Received state: ${state}`)

						// Determine if this is likely a test message
						// We consider it a test if it's state 3 AND current or total pages are 99
						const currentPage = self.getVariableValue('current')
						const totalPages = self.getVariableValue('total')
						const isTestMessage = parseInt(state) === 3 && (currentPage === 99 || totalPages === 99)

						// Convert numeric state to descriptive text
						let stateText = 'Unknown'
						switch (parseInt(state)) {
							case 0:
								stateText = 'Exited'
								break
							case 1:
								stateText = 'Normal'
								break
							case 3:
								stateText = 'Presentation'
								break
							default:
								stateText = `State ${state}`
								break
						}

						// Set different variables based on whether this is a test message or real state change
						if (isTestMessage) {
							self.log('debug', 'Detected test message pattern - activating test mode indicators only')
							self.setVariableValues({
								state: stateText,
								isTestMode: 'Yes',
							})
							// Only update the test indicator
							self.checkFeedbacks('showState')
						} else {
							self.log('debug', 'Normal state change detected')
							self.setVariableValues({
								state: stateText,
								isPresentation: parseInt(state) === 3 ? 'Yes' : 'No',
								isTestMode: 'No',
							})
							// Update both feedback types
							self.checkFeedbacks('showState')
							self.checkFeedbacks('presentationModeIndicator')
						}
					}
					break
			}

			// Process the message through the processData function as well
			this.processData(oscMsg, self)
		})
	},

	processData: function (oscMsg, self) {
		// Skip processing if already handled in the main message handler
		if (['/pdfosc/current', '/pdfosc/total', '/pdfosc/state'].includes(oscMsg.address)) {
			return
		}

		let argLog = oscMsg.args[0]?.value
		if (typeof argLog === 'string' && argLog.length > 100) {
			argLog = argLog.substring(0, 100) + '...'
		}

		self.log('info', `OSC message received: ${oscMsg.address} ${argLog || ''}`)

		const msgParts = oscMsg.address.split('/')
		if (msgParts[1] != 'pdfosc') return

		// Handle any other specialized OSC messages here
	},
}

module.exports = oscListener
