import { log } from '@/utils'

export const ThumbnailWidget = ({ url }: { url: string }) => {
	log('Thumbnail widget rendered with URL:', url)

	return <a href={url} target="_blank" rel="noreferrer">
		<img src={url} alt="thumbnail"/>
	</a>
}

void css`
	.watch-root-element #secondary {
		display: flex;
		flex-direction: column;

		#thumo-thumbnail-widget {
			order: -1;
			overflow: hidden;
			margin-bottom: 16px;
			border-radius: 12px;
			border: 1px solid hsla(0, 0%, 100%, 0.1);

			a {
				display: flex;
				justify-content: center;

				img { width: 100%; }
			}
		}
	}
`