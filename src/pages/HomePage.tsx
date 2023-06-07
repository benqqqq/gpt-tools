import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

export default function HomePage(): ReactElement {
	return (
		<>
			<Head title='GPT Tool - Home' />

			<div className='flex h-screen w-screen flex-col items-center justify-center bg-gray-800'>
				<div className='flex h-1/3 flex-col items-center justify-around'>
					<h1 className='text-4xl text-white'>GPT Tool - Home</h1>

					<Link to='/english-correctness-checker-page'>
						<Button variant='contained' size='large'>
							English Correctness Checker
						</Button>
					</Link>
					<Link to='/fixed-system-prompt-chat'>
						<Button variant='contained' size='large'>
							Fixed System Prompt Chat
						</Button>
					</Link>
				</div>
			</div>
		</>
	)
}
