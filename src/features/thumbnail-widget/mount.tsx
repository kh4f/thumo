import { createRoot, type Root } from 'react-dom/client'
import { log } from '@/utils'
import { ThumbnailWidget } from './widget'

let widgetEl: HTMLElement | null = null
let widgetRoot: Root | null = null

export const mountThumbnailWidget = (videoId: string, sidebar: HTMLElement) => {
	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
	log('Thumbnail URL:', thumbnailUrl)

	widgetEl ??= document.getElementById('thumo-widget')
		?? Object.assign(document.createElement('div'), { id: 'thumo-widget' })

	if (widgetEl.parentElement !== sidebar) sidebar.prepend(widgetEl)
	widgetRoot ??= createRoot(widgetEl)

	widgetRoot.render(<ThumbnailWidget url={thumbnailUrl}/>)
	log('Thumbnail widget mounted:', widgetEl)
}

void gcss`
	body[data-page-type="watch"] .watch-root-element #secondary {
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