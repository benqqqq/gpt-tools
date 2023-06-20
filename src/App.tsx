import LoadingOrError from 'components/common/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { getConfig } from './config'

const GptPlaygroundPage = lazy(async () => import('pages/GptPlayground'))
const PromptListPage = lazy(async () => import('pages/PromptList'))

export default function App(): ReactElement {
	return (
		<BrowserRouter basename={getConfig().basename}>
			<CssBaseline />
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					<Route
						path='/'
						element={<Navigate to='/gpt-playground/' replace />}
					/>
					<Route path='/gpt-playground/:id?/' element={<GptPlaygroundPage />} />
					<Route path='/prompt-list' element={<PromptListPage />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
