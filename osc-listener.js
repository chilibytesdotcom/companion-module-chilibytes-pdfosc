const osc = require('osc')
const { InstanceStatus } = require('@companion-module/base')

const oscListener = {
	udpPort: null,

	close: async function () {
		if (this.udpPort) {
			try {
				await this.udpPort.close()
			} catch {
				// Ignore errors during close - port may already be closed
			}
			this.udpPort = null
		}
	},

	connect: async function (self) {
		// Close any existing connection first
		await this.close()

		return new Promise((resolve, reject) => {
			try {
				this.udpPort = new osc.UDPPort({
					localAddress: '0.0.0.0',
					localPort: self.config.localport,
					metadata: true,
				})

				this.udpPort.on('ready', () => {
					self.log('info', `Listening for PDFOSC messages on port ${self.config.localport}`)
					self.updateStatus(InstanceStatus.Ok, 'Connected.')
					resolve()
				})

				this.udpPort.on('error', (error) => {
					self.log('error', `OSC listener error: ${error.message}`)

					if (error.code === 'EADDRINUSE') {
						self.updateStatus(InstanceStatus.ConnectionFailure, `Port ${self.config.localport} is already in use`)
					} else if (error.code === 'EACCES') {
						self.updateStatus(InstanceStatus.ConnectionFailure, `Permission denied for port ${self.config.localport}`)
					} else {
						self.updateStatus(InstanceStatus.ConnectionFailure, error.message)
					}

					// Reject only if we haven't resolved yet (error during startup)
					reject(error)
				})

				this.udpPort.on('message', (oscMsg) => {
					this.handleMessage(oscMsg, self)
				})

				this.udpPort.open()
			} catch (error) {
				self.log('error', `Failed to create OSC listener: ${error.message}`)
				self.updateStatus(InstanceStatus.ConnectionFailure, error.message)
				reject(error)
			}
		})
	},

	handleMessage: function (oscMsg, self) {
		const path = oscMsg.address
		const args = oscMsg.args

		// Log all incoming messages for debugging
		self.log('debug', `Received OSC message: ${path}`)

		// Validate message structure
		if (!path || typeof path !== 'string') {
			self.log('warn', 'Received malformed OSC message: missing or invalid address')
			return
		}

		switch (path) {
			case '/pdfosc/current':
				this.handleCurrentPage(args, self)
				break

			case '/pdfosc/total':
				this.handleTotalPages(args, self)
				break

			case '/pdfosc/state':
				this.handleState(args, self)
				break

			default:
				// Handle any other PDFOSC messages
				this.processOtherMessage(oscMsg, self)
				break
		}
	},

	handleCurrentPage: function (args, self) {
		if (!args || args.length === 0 || args[0]?.value === undefined) {
			self.log('warn', 'Received /pdfosc/current with missing or invalid arguments')
			return
		}

		const value = parseInt(args[0].value, 10)
		if (isNaN(value)) {
			self.log('warn', `Received /pdfosc/current with non-numeric value: ${args[0].value}`)
			return
		}

		const displayValue = value === 0 ? '-' : value
		self.setVariableValues({
			current: displayValue,
		})
	},

	handleTotalPages: function (args, self) {
		if (!args || args.length === 0 || args[0]?.value === undefined) {
			self.log('warn', 'Received /pdfosc/total with missing or invalid arguments')
			return
		}

		const value = parseInt(args[0].value, 10)
		if (isNaN(value)) {
			self.log('warn', `Received /pdfosc/total with non-numeric value: ${args[0].value}`)
			return
		}

		const displayValue = value === 0 ? '-' : value
		self.setVariableValues({
			total: displayValue,
		})
	},

	handleState: function (args, self) {
		if (!args || args.length === 0 || args[0]?.value === undefined) {
			self.log('warn', 'Received /pdfosc/state with missing or invalid arguments')
			return
		}

		const state = parseInt(args[0].value, 10)
		if (isNaN(state)) {
			self.log('warn', `Received /pdfosc/state with non-numeric value: ${args[0].value}`)
			return
		}

		self.log('debug', `Received state: ${state}`)

		// Determine if this is likely a test message
		// We consider it a test if it's state 3 AND current or total pages are 99
		const currentPage = self.getVariableValue('current')
		const totalPages = self.getVariableValue('total')
		const isTestMessage = state === 3 && (currentPage === 99 || totalPages === 99)

		// Convert numeric state to descriptive text
		let stateText = 'Unknown'
		switch (state) {
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
				isPresentation: state === 3 ? 'Yes' : 'No',
				isTestMode: 'No',
			})
			// Update both feedback types
			self.checkFeedbacks('showState')
			self.checkFeedbacks('presentationModeIndicator')
		}
	},

	processOtherMessage: function (oscMsg, self) {
		const msgParts = oscMsg.address.split('/')
		if (msgParts[1] !== 'pdfosc') return

		let argLog = ''
		if (oscMsg.args && oscMsg.args.length > 0 && oscMsg.args[0]?.value !== undefined) {
			argLog = String(oscMsg.args[0].value)
			if (argLog.length > 100) {
				argLog = argLog.substring(0, 100) + '...'
			}
		}

		self.log('info', `OSC message received: ${oscMsg.address} ${argLog}`)
	},
}

module.exports = oscListener
