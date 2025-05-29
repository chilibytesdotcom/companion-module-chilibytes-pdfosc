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
		this.log('debug', 'PDFOSC: Constructor called')
	}

	/**
	 * @description triggered on instance being enabled
	 */
	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.oscListener = new OSCListener(this)
		await this.oscListener.connect()

		this.oscClient = new Client(this.config.host, this.config.port)

		this.updateStatus(InstanceStatus.Ok)
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()
		this.log('debug', 'PDFOSC: Module initialization complete')
	}

	/**
	 * @description triggered on instance being disabled/removed
	 */
	async destroy(): Promise<void> {
		this.log('debug', 'PDFOSC: Destroying module')
		if (this.oscListener) {
			await this.oscListener.close()
			this.oscListener = undefined
		}

		if (this.oscClient) {
			this.oscClient.close()
			this.oscClient = undefined
		}
	}

	/**
	 * @description triggered when config is updated
	 */
	async configUpdated(config: ModuleConfig): Promise<void> {
		this.log('debug', 'PDFOSC: Config updated')
		this.config = config
		this.log('debug', 'PDFOSC: Sending OSC actions to ' + this.config.host + ':' + this.config.port)
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
		this.log('debug', 'PDFOSC: Setting action definitions')
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		this.log('debug', 'PDFOSC: Setting feedback definitions')
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		this.log('debug', 'PDFOSC: Setting variable definitions')
		UpdateVariableDefinitions(this)
	}

	updatePresets(): void {
		this.log('debug', 'PDFOSC: Setting preset definitions')
		const presets = UpdatePresets(this)
		this.log('debug', `PDFOSC: Registering ${Object.keys(presets).length} presets`)
		this.setPresetDefinitions(presets)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
