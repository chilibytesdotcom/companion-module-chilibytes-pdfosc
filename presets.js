const pagesPresets = require('./presets/pages.js')

module.exports = function (self) {
	let presets = { ...pagesPresets }
	self.setPresetDefinitions(presets)
}
