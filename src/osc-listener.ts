import { InstanceStatus } from '@companion-module/base'
import { Server } from 'node-osc'
import { ModuleConfig } from './config.js'

// OSC States
const OSC_STATE = {
	EXITED: 0,
	NORMAL: 1,
	PRESENTATION: 3,
} as const

// Test mode indicators
const TEST_MODE = {
	PAGE_NUMBER: 99,
	EMPTY_VALUE: 0,
} as const

interface CompanionInstance {
	config: ModuleConfig
	log: (level: 'info' | 'debug' | 'warn', message: string) => void
	updateStatus: (status: InstanceStatus, message: string) => void
	setVariableValues: (values: Record<string, any>) => void
	getVariableValue: (name: string) => any
	checkFeedbacks: (type: string) => void
}

class OSCListener {
	private server?: Server
	private instance: CompanionInstance

	constructor(instance: CompanionInstance) {
		this.instance = instance
	}

	async connect(): Promise<void> {
		try {
			this.server = new Server(this.instance.config.localport, '0.0.0.0')

			// Setup message handlers
			this.setupMessageHandlers()

			this.instance.log('info', `Listening for PDFOSC messages on port ${this.instance.config.localport}`)
			this.instance.updateStatus(InstanceStatus.Ok, 'Connected')
		} catch (error) {
			this.instance.log('warn', `Failed to open OSC port: ${error}`)
			this.instance.updateStatus(InstanceStatus.UnknownError, 'Connection failed')
		}
	}

	private setupMessageHandlers(): void {
		if (!this.server) return

		this.server.on('message', (message, _rinfo) => {
			if (!Array.isArray(message)) return

			const [address, ...args] = message
			if (typeof address !== 'string') return

			switch (address) {
				case '/pdfosc/current': {
					const rawValue = args[0]
					const value =
						typeof rawValue === 'number' ? rawValue : typeof rawValue === 'string' ? parseInt(rawValue) : NaN
					if (!isNaN(value)) {
						const displayValue = value === TEST_MODE.EMPTY_VALUE ? '-' : value
						this.instance.setVariableValues({
							current: displayValue,
						})
					}
					break
				}

				case '/pdfosc/total': {
					const rawValue = args[0]
					const value =
						typeof rawValue === 'number' ? rawValue : typeof rawValue === 'string' ? parseInt(rawValue) : NaN
					if (!isNaN(value)) {
						const displayValue = value === TEST_MODE.EMPTY_VALUE ? '-' : value
						this.instance.setVariableValues({
							total: displayValue,
						})
					}
					break
				}

				case '/pdfosc/state': {
					const rawValue = args[0]
					const value =
						typeof rawValue === 'number' ? rawValue : typeof rawValue === 'string' ? parseInt(rawValue) : NaN
					if (!isNaN(value)) {
						this.instance.log('debug', `Received state: ${value}`)

						// Determine if this is a test message
						const currentPage = this.instance.getVariableValue('current')
						const totalPages = this.instance.getVariableValue('total')
						const isTestMessage =
							value === OSC_STATE.PRESENTATION &&
							(currentPage === TEST_MODE.PAGE_NUMBER || totalPages === TEST_MODE.PAGE_NUMBER)

						// Convert state to text
						const stateText = this.getStateText(value)

						if (isTestMessage) {
							this.instance.log('debug', 'Detected test message pattern - activating test mode indicators only')
							this.instance.setVariableValues({
								state: stateText,
								isTestMode: 'Yes',
							})
							this.instance.checkFeedbacks('showState')
						} else {
							this.instance.log('debug', 'Normal state change detected')
							this.instance.setVariableValues({
								state: stateText,
								isPresentation: value === OSC_STATE.PRESENTATION ? 'Yes' : 'No',
								isTestMode: 'No',
							})
							this.instance.checkFeedbacks('showState')
							this.instance.checkFeedbacks('presentationModeIndicator')
						}
					}
					break
				}
			}
		})
	}

	private getStateText(state: number): string {
		switch (state) {
			case OSC_STATE.EXITED:
				return 'Exited'
			case OSC_STATE.NORMAL:
				return 'Normal'
			case OSC_STATE.PRESENTATION:
				return 'Presentation'
			default:
				return `State ${state}`
		}
	}

	async close(): Promise<void> {
		if (this.server) {
			this.server.close()
			this.server = undefined
		}
	}
}

export default OSCListener
