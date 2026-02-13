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

void gcss`
	.watch-root-element #secondary {
		display: flex;
		flex-direction: column;

		#thumo-widget {
			order: -1;
			overflow: hidden;
			margin-bottom: 16px;
			border-radius: 12px;
			border: 1px solid hsla(0, 0%, 100%, 0.1);
		}
	}
`