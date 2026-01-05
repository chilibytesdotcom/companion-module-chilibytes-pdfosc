const { combineRgb } = require('@companion-module/base')

module.exports = {
	pagesActionHeader: {
		category: 'PDF control and feedback',
		name: 'Page control',
		type: 'text',
		text: 'Move through document',
	},
	prev: {
		type: 'button',
		category: 'PDF control and feedback',
		name: `Previous page`,
		style: {
			text: `🢔`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'previous' }], up: [] }],
		feedbacks: [],
	},

	next: {
		type: 'button',
		category: 'PDF control and feedback',
		name: `Next page`,
		style: {
			text: '🢖',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'next' }], up: [] }],
		feedbacks: [],
	},

	pageNumbers: {
		type: 'button',
		category: 'PDF control and feedback',
		name: `Current/Total pages`,
		style: {
			text: 'Page\n$(PDFOSC:current)/$(PDFOSC:total)',
			size: 'auto',
			alignment: 'center:top',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'presentationModeIndicator',
				style: {
					bgcolor: combineRgb(80, 0, 0),
				},
			},
			{
				feedbackId: 'showState',
				style: {
					bgcolor: combineRgb(0, 200, 0), // Green if from test
				},
			},
		],
	},

	// New presets for first and last page
	firstPage: {
		type: 'button',
		category: 'PDF control and feedback',
		name: `First page`,
		style: {
			text: `FIRST\nPAGE`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 100),
		},
		steps: [{ down: [{ actionId: 'firstPage' }], up: [] }],
		feedbacks: [],
	},

	lastPage: {
		type: 'button',
		category: 'PDF control and feedback',
		name: `Last page`,
		style: {
			text: `LAST\nPAGE`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 100),
		},
		steps: [{ down: [{ actionId: 'lastPage' }], up: [] }],
		feedbacks: [],
	},

	// Combined start/stop presentation button
	presentationToggle: {
		type: 'button',
		category: 'PDF control and feedback',
		name: `Toggle presentation mode`,
		style: {
			text: `▶️\nP. MODE`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(100, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'togglePresentation',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'presentationModeIndicator',
				style: {
					text: '⏹️\nP. MODE',
					bgcolor: combineRgb(200, 0, 0),
				},
			},
		],
	},
}
