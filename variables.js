module.exports = function (self) {
	self.setVariableDefinitions([
		{ variableId: 'current', name: 'Current page number' },
		{ variableId: 'total', name: 'Total pages number' },
		{ variableId: 'state', name: 'Document view state' },
		{ variableId: 'isPresentation', name: 'Is presentation mode active' },
		{ variableId: 'isTestMode', name: 'Is test mode active' },
	])
}
