import type { ReactElement } from 'react'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import ReactMarkdown from 'react-markdown'

export default function Markdown({
	content
}: {
	content: string
}): ReactElement {
	return (
		<ReactMarkdown
			className='prose max-w-none'
			remarkPlugins={[remarkGfm]}
			components={{
				// eslint-disable-next-line react/no-unstable-nested-components
				code({
					node,
					inline,
					// eslint-disable-next-line unicorn/no-keyword-prefix
					className,
					children,
					...properties
				}): ReactElement {
					// eslint-disable-next-line unicorn/no-keyword-prefix
					const match = /language-(\w+)/.exec(className ?? '')
					const matchIndex = 1
					return !inline && match ? (
						<SyntaxHighlighter
							/* eslint-disable-next-line react/jsx-props-no-spreading */
							{...properties}
							/* eslint-disable-next-line react/no-children-prop */
							children={String(children).replace(/\n$/, '')}
							style={docco}
							language={match[matchIndex]}
							PreTag='div'
							className='rounded-md'
						/>
					) : (
						// eslint-disable-next-line react/jsx-props-no-spreading,unicorn/no-keyword-prefix
						<code {...properties} className={className}>
							{children}
						</code>
					)
				}
			}}
		>
			{content}
		</ReactMarkdown>
	)
}
