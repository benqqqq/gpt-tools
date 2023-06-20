import LoadingOrError from 'components/common/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'

const GptPlaygroundPage = lazy(async () => import('pages/GptPlayground'))

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<CssBaseline />
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					<Route
						path='/'
						element={<Navigate to='/gpt-playground/' replace />}
					/>
					<Route path='/gpt-playground/:id?/' element={<GptPlaygroundPage />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
