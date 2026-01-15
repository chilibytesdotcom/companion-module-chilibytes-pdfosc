const { InstanceBase, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpdatePresetDefinitions = require('./presets')
const oscListener = require('./osc-listener')
const configFields = require('./config')
const variableDefaults = require('./variable-defaults')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.files = []

		if (!this.validateConfig()) {
			return
		}

		this.log('info', `PDFOSC module started`)
		this.log('info', `Sending OSC actions to ${this.config.remotehost}:${this.config.remoteport}`)
		this.updateStatus(InstanceStatus.Connecting, `Connecting to port ${this.config.localport}...`)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresetDefinitions() // export preset definitions

		try {
			await oscListener.connect(this)
		} catch (error) {
			this.log('error', `Failed to start OSC listener: ${error.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, error.message)
		}

		//set some defaults for the variables
		this.setVariableValues(variableDefaults)
	}

	validateConfig() {
		if (!this.config.remotehost) {
			this.updateStatus(InstanceStatus.BadConfig, 'Remote IP is required')
			this.log('error', 'Configuration error: Remote IP is required')
			return false
		}

		const remotePort = parseInt(this.config.remoteport, 10)
		if (isNaN(remotePort) || remotePort < 1 || remotePort > 65535) {
			this.updateStatus(InstanceStatus.BadConfig, 'Invalid remote port')
			this.log('error', 'Configuration error: Remote port must be between 1 and 65535')
			return false
		}

		const localPort = parseInt(this.config.localport, 10)
		if (isNaN(localPort) || localPort < 1 || localPort > 65535) {
			this.updateStatus(InstanceStatus.BadConfig, 'Invalid listen port')
			this.log('error', 'Configuration error: Listen port must be between 1 and 65535')
			return false
		}

		return true
	}

	// When module gets deleted
	async destroy() {
		try {
			await oscListener.close()
		} catch (error) {
			this.log('debug', `Error closing OSC listener: ${error.message}`)
		}
	}

	async configUpdated(config) {
		this.config = config
		this.log('info', 'Config has changed, updating...')

		if (!this.validateConfig()) {
			return
		}

		this.log('info', `Now sending OSC actions to ${this.config.remotehost}:${this.config.remoteport}`)
		this.updateStatus(InstanceStatus.Connecting, 'Reconnecting...')

		try {
			await oscListener.close()
		} catch (error) {
			this.log('debug', `Error closing OSC listener: ${error.message}`)
		}

		try {
			await oscListener.connect(this)
		} catch (error) {
			this.log('error', `Failed to reconnect OSC listener: ${error.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, error.message)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return configFields
	}

	updateActions() {
		UpdateActions(this)
	}
	updateFeedbacks() {
		UpdateFeedbacks(this)
	}
	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
	updatePresetDefinitions() {
		UpdatePresetDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
