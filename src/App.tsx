import LoadingOrError from 'components/common/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'

const HomePage = lazy(async () => import('pages/HomePage'))
const EnglishCorrectnessCheckerPage = lazy(
	async () => import('pages/EnglishCorrectnessCheckerPage')
)
const FixedSystemPromptChatPage = lazy(
	async () => import('pages/FixedSystemPromptChatPage')
)

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<CssBaseline />
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route
						path='/english-correctness-checker-page'
						element={<EnglishCorrectnessCheckerPage />}
					/>
					<Route
						path='/fixed-system-prompt-chat/:id?/'
						element={<FixedSystemPromptChatPage />}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
