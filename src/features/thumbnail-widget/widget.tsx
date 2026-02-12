export const ThumbnailWidget = ({ url }: { url: string }) => {
	return (
		<a className={link} href={url} target="_blank" rel="noreferrer">
			<img src={url} alt="thumbnail"/>
		</a>
	)
}

const link = css`
	display: flex;
	justify-content: center;

	img { width: 100%; }
`