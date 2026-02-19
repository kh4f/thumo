import { createRoot } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { ThumbnailWidget } from './widget'

export const mountThumbnailWidget = async (videoId: string) => {
	const sidebar = await waitForEl('.watch-root-element #secondary')
	log('Sidebar element found:', sidebar)

	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
	log('Thumbnail URL:', thumbnailUrl)

	let widgetEl = document.getElementById('thumo-thumbnail-widget')
	if (widgetEl) return log('Thumbnail widget already exists:', widgetEl)
	else {
		widgetEl = Object.assign(document.createElement('div'), { id: 'thumo-thumbnail-widget' })
		sidebar.prepend(widgetEl)
		createRoot(widgetEl).render(<ThumbnailWidget url={thumbnailUrl}/>)
		log('Thumbnail widget mounted:', widgetEl)
	}
}