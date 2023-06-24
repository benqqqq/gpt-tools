import type { ReactElement } from 'react'

interface IGenerateSequenceDiagramIconProps {
	color?: string
}

function GenerateSequenceDiagramIcon({
	color = 'white'
}: IGenerateSequenceDiagramIconProps): ReactElement {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill={color}
		>
			<path d='M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 10H6v-2h12v2zm0-4H6V9h12v2zm-3-6h-2v4h2V5zM6 5h2v4H6V5zm8 0h2v4h-2V5z' />
		</svg>
	)
}

GenerateSequenceDiagramIcon.defaultProps = {
	color: 'white'
}

export default GenerateSequenceDiagramIcon
