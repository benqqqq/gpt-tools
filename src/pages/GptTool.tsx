import Head from 'components/Head'
import type { ReactElement } from 'react'
import EnglishCorrectnessChecker from '../components/EnglishCorrectnessChecker'
import { OpenAIProvider } from '../services/OpenAiContext'
import { SettingProvider } from '../services/SettingContext'

export default function GptToolPage(): ReactElement {
	// const { isLoading, isError, error, data } = useQuery(['fruits'], getFruits)
	// if (isLoading || isError) {
	// 	return <LoadingOrError error={error as Error} />
	// }

	return (
		<>
			<Head title='GPT Tools' />
			<div className='m-2 grid min-h-screen grid-cols-[minmax(0,384px)] place-content-center gap-2 md:m-0 md:grid-cols-[repeat(2,minmax(0,384px))] xl:grid-cols-[repeat(3,384px)]'>
				<SettingProvider>
					<OpenAIProvider>
						<EnglishCorrectnessChecker />
					</OpenAIProvider>
				</SettingProvider>
			</div>
		</>
	)
}
