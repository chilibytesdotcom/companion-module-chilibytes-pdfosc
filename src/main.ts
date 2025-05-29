import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import OSCListener from './osc-listener.js'
import { Client } from 'node-osc'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	public oscListener?: OSCListener
	public oscClient?: Client

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		// Create OSC listener instance
		this.oscListener = new OSCListener(this)
		await this.oscListener.connect()

		// Create OSC client instance
		this.oscClient = new Client(this.config.host, this.config.port)

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets
	}

	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')

		if (this.oscListener) {
			await this.oscListener.close()
			this.oscListener = undefined
		}

		if (this.oscClient) {
			this.oscClient.close()
			this.oscClient = undefined
		}
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.log('debug', 'Sending OSC actions to ' + this.config.host + ':' + this.config.port)
		this.updateStatus(InstanceStatus.Connecting, 'Reconnecting...')

		// Recreate OSC listener with new config
		if (this.oscListener) {
			await this.oscListener.close()
		}
		this.oscListener = new OSCListener(this)
		await this.oscListener.connect()

		// Recreate OSC client with new config
		if (this.oscClient) {
			this.oscClient.close()
		}
		this.oscClient = new Client(this.config.host, this.config.port)

		this.updateStatus(InstanceStatus.Ok, 'Connected.')
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	updatePresets(): void {
		this.setPresetDefinitions(UpdatePresets(this))
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
