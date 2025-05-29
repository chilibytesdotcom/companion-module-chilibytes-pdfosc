interface OSCArg {
	type: string
	value: Uint8Array | string
}

interface TextHelper {
	extractText: (args: OSCArg[], self: { log: (level: string, message: string) => void }) => string
}

const textHelper: TextHelper = {
	extractText(args, self) {
		//self.log('debug', `Extracting text from OSC message: ${JSON.stringify(args)}`)
		if (args.length == 0) return ''

		for (let i = 0; i < args.length; i++) {
			if (args[i].type == 'b') {
				//self.log('debug', `Found blob argument at index ${i}`)
				//convert the blob to UTF-8
				const decoder = new TextDecoder('utf-8')
				const utf8String = decoder.decode(args[i].value as Uint8Array)
				self.log('console', `Extracted text: ${utf8String}`)
				return utf8String
			}
		}

		for (let i = 0; i < args.length; i++) {
			if (args[0].type == 's') {
				self.log('console', `Extracted text: ${args[0].value as string}`)
				return args[0].value as string
			}
		}

		return ''
	},
}

export default textHelper
