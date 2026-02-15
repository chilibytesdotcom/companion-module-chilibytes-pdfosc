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
	init(config) {
		this.config = config

		if (!this.validateConfig()) {
			return
		}

		this.log('info', `PDFOSC module started`)
		this.log('info', `Sending OSC actions to ${this.config.remotehost}:${this.config.remoteport}`)
		this.updateStatus(InstanceStatus.Connecting, `Connecting to port ${this.config.localport}...`)

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresetDefinitions()

		oscListener.connect(this)

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

	destroy() {
		oscListener.close()
	}

	configUpdated(config) {
		this.config = config
		this.log('info', 'Config has changed, updating...')

		if (!this.validateConfig()) {
			return
		}

		this.log('info', `Now sending OSC actions to ${this.config.remotehost}:${this.config.remoteport}`)
		this.updateStatus(InstanceStatus.Connecting, 'Reconnecting...')

		oscListener.connect(this)
	}

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
