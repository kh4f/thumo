export const ThumbnailWidget = ({ url }: { url: string }) => {
	return (
		<a className={link} href={url} target="_blank" rel="noreferrer">
			<img src={url} alt="thumbnail"/>
		</a>
	)
}

const link = css`
	width: 100%;
	display: flex;
	justify-content: center;

	img { width: 100%; }
`