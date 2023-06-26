import type { ReactElement } from 'react'

interface IGenerateSequenceDiagramIconProps {
	color?: string
}

function GenerateFlowchartIcon({
	color = 'white'
}: IGenerateSequenceDiagramIconProps): ReactElement {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			width='24'
			height='24'
		>
			<rect x='3' y='2' width='18' height='4' rx='1' ry='1' />
			<rect x='3' y='8' width='18' height='4' rx='1' ry='1' />
			<rect x='3' y='14' width='18' height='4' rx='1' ry='1' />
			<path d='M8 4h8M8 10h8M8 16h8' />
		</svg>
	)
}

GenerateFlowchartIcon.defaultProps = {
	color: 'white'
}

export default GenerateFlowchartIcon
