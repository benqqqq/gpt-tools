import type {
	IDataCorrection,
	IDataJsonLine,
	IDataReason,
	IJSONAnswer
} from './types'
import { useMemo, useState } from 'react'
import { diffWords } from 'diff'

export default function useStreamingOutputDigest(
	answer: string
): [IJSONAnswer, Error?] {
	const [error, setError] = useState<Error>()

	const jsonAnswer = useMemo(() => {
		const jsonLines: IDataJsonLine[] = []
		for (const answerLine of answer.split('\n')) {
			try {
				jsonLines.push(JSON.parse(answerLine) as IDataJsonLine)
			} catch {
				// pass
			}
		}

		const result: IJSONAnswer = {
			corrections: [],
			grade: {
				grade_reasons: [],
				improve_directions: []
			}
		}

		for (const jsonLine of jsonLines) {
			if (jsonLine.type === 'correction') {
				const data = jsonLine.data as IDataCorrection
				result.corrections.push({
					sentence: data.line,
					original: data.original,
					refined: data.refined,
					score: data.score,
					reasons: [],
					diff: diffWords(data.original, data.refined)
				})
			}
			if (jsonLine.type === 'reason') {
				const data = jsonLine.data as IDataReason
				const correction = result.corrections.find(
					c => c?.sentence === data.line
				)
				correction?.reasons.push(data.reason)
				if (!correction) {
					setError(new Error(`cannot find ${data.line}`))
				}
			}
			if (jsonLine.type === 'grade') {
				result.grade.score = jsonLine.data as number
			}

			if (jsonLine.type === 'grade_reason') {
				result.grade.grade_reasons.push(jsonLine.data as string)
			}
			if (jsonLine.type === 'improve_direction') {
				result.grade.improve_directions.push(jsonLine.data as string)
			}
		}

		return result
	}, [answer])
	return [jsonAnswer, error]
}
