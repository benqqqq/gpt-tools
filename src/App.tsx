import LoadingOrError from 'components/common/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { getConfig } from './config'
import { SettingProvider } from './services/SettingContext'
import { OpenAIProvider } from './services/OpenAiContext'

const GptPlaygroundPage = lazy(async () => import('pages/GptPlayground'))
const PromptListPage = lazy(async () => import('pages/PromptList'))
const VocabularyPage = lazy(async () => import('pages/Vocabulary'))

export default function App(): ReactElement {
	return (
		<BrowserRouter basename={getConfig().basename}>
			<CssBaseline />
			<SettingProvider>
				<OpenAIProvider>
					<Suspense fallback={<LoadingOrError />}>
						<Routes>
							<Route
								path='/'
								element={<Navigate to='/gpt-playground/' replace />}
							/>
							<Route
								path='/gpt-playground/:id?/'
								element={<GptPlaygroundPage />}
							/>
							<Route path='/prompt-list' element={<PromptListPage />} />
							<Route path='/vocabulary' element={<VocabularyPage />} />
						</Routes>
					</Suspense>
				</OpenAIProvider>
			</SettingProvider>
		</BrowserRouter>
	)
}
