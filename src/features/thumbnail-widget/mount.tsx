import { createRoot, type Root } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { ThumbnailWidget } from './widget'

let root: Root | null = null

export const mountThumbnailWidget = async (videoId: string) => {
	const sidebar = await waitForEl('.watch-root-element #secondary')
	log('Sidebar element found:', sidebar)

	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
	log('Thumbnail URL:', thumbnailUrl)

	let widgetEl = document.getElementById('thumo-thumbnail-widget')
	if (!widgetEl) {
		widgetEl = Object.assign(document.createElement('div'), { id: 'thumo-thumbnail-widget' })
		sidebar.prepend(widgetEl)
		root = createRoot(widgetEl)
		log('Thumbnail widget mounted:', widgetEl)
	}

	root!.render(<ThumbnailWidget url={thumbnailUrl}/>)
}