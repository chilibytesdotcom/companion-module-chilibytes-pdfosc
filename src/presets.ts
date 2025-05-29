import { type CompanionPresetDefinition, combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdatePresets(_instance: ModuleInstance): { [key: string]: CompanionPresetDefinition } {
	_instance.log('debug', 'PDFOSC: Creating presets...')
	const presets: { [key: string]: CompanionPresetDefinition } = {
		pageActionHeader: {
			category: 'PDF control and feedback',
			name: 'Page control',
			type: 'button',
			style: {
				text: 'Move through document',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [],
			feedbacks: [],
		},
		prev: {
			type: 'button',
			category: 'PDF control and feedback',
			name: `Previous page`,
			style: {
				text: `🢔`,
				size: '24',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [{ down: [{ actionId: 'previous', options: {} }], up: [] }],
			feedbacks: [],
		},
		next: {
			type: 'button',
			category: 'PDF control and feedback',
			name: `Next page`,
			style: {
				text: '🢖',
				size: '24',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [{ down: [{ actionId: 'next', options: {} }], up: [] }],
			feedbacks: [],
		},
		pageNumbers: {
			type: 'button',
			category: 'PDF control and feedback',
			name: `Current/Total pages`,
			style: {
				text: 'Page\n$(PDFOSC:current)/$(PDFOSC:total)',
				size: '24',
				alignment: 'center:top',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [],
			feedbacks: [
				{
					feedbackId: 'presentationModeIndicator',
					options: {},
					style: {
						bgcolor: combineRgb(80, 0, 0),
					},
				},
				{
					feedbackId: 'showState',
					options: {},
					style: {
						bgcolor: combineRgb(0, 200, 0),
					},
				},
			],
		},
		firstPage: {
			type: 'button',
			category: 'PDF control and feedback',
			name: `First page`,
			style: {
				text: `FIRST\nPAGE`,
				size: '24',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 100),
			},
			steps: [{ down: [{ actionId: 'firstPage', options: {} }], up: [] }],
			feedbacks: [],
		},
		lastPage: {
			type: 'button',
			category: 'PDF control and feedback',
			name: `Last page`,
			style: {
				text: `LAST\nPAGE`,
				size: '24',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 100),
			},
			steps: [{ down: [{ actionId: 'lastPage', options: {} }], up: [] }],
			feedbacks: [],
		},
		presentationToggle: {
			type: 'button',
			category: 'PDF control and feedback',
			name: `Toggle presentation mode`,
			style: {
				text: `▶️\nP. MODE`,
				size: '24',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(100, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'togglePresentationMode',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'presentationModeIndicator',
					options: {},
					style: {
						text: '⏹️\nP. MODE',
						bgcolor: combineRgb(200, 0, 0),
					},
				},
			],
		},
	}

	_instance.log('debug', `PDFOSC: Created ${Object.keys(presets).length} presets`)
	_instance.log('debug', 'PDFOSC: Preset structure: ' + JSON.stringify(presets, null, 2))
	return presets
}
