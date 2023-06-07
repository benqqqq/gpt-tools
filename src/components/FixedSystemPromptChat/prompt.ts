import type { IPrompt } from './types'

export const defaultSystemPrompt = `If you talk about the code, please use markdown.`
export const prompts: IPrompt[] = [
	{
		key: 'react expert',
		systemPrompt: `Act as a react expert`
	},
	{
		key: 'angular expert',
		systemPrompt: `Act as a angular expert`
	}
]

export default {}
