import type { ReactElement } from 'react'
import { prompts } from '../components/GptPlayground/prompts'
import Markdown from '../components/GptPlayground/Markdown'

export default function PromptList(): ReactElement {
	return (
		<div className='flex w-full'>
			<div className='flex h-screen w-[250px] flex-col items-start bg-gray-800 p-3'>
				<h2 className='text-white'>Prompt List</h2>

				{prompts.map(({ key }) => (
					<li key={key} className='text-gray-400'>
						{key}
					</li>
				))}
			</div>

			<div className='flex h-screen max-w-[calc(100vw-250px)] flex-grow flex-col overflow-y-auto p-5 text-gray-800'>
				<Markdown
					content={prompts
						.map(({ key, systemPrompt }) => `## ${key}\n---\n${systemPrompt}`)
						.join('\n')}
				/>
			</div>
		</div>
	)
}
