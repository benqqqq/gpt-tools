import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import { OpenAIProvider } from '../services/OpenAiContext'
import { SettingProvider } from '../services/SettingContext'
import FixedSystemPromptChat from '../components/FixedSystemPromptChat/FixedSystemPromptChat'

export default function FixedSystemPromptChatPage(): ReactElement {
	return (
		<>
			<Head title='Fixed System Prompt Chat' />
			<SettingProvider>
				<OpenAIProvider>
					<FixedSystemPromptChat />
				</OpenAIProvider>
			</SettingProvider>
		</>
	)
}
