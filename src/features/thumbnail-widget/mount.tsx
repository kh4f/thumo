import { createRoot, type Root } from 'react-dom/client'
import { log, waitForEl } from '@/utils'
import { ThumbnailWidget } from './widget'

let widgetEl: HTMLElement | null = null
let widgetRoot: Root | null = null

export const mountThumbnailWidget = async (videoId: string) => {
	const sidebar = await waitForEl('.watch-root-element #secondary')
	log('Sidebar element found:', sidebar)

	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
	log('Thumbnail URL:', thumbnailUrl)

	widgetEl ??= document.getElementById('thumo-widget')
		?? Object.assign(document.createElement('div'), { id: 'thumo-widget' })

	if (widgetEl.parentElement !== sidebar) sidebar.prepend(widgetEl)
	widgetRoot ??= createRoot(widgetEl)

	widgetRoot.render(<ThumbnailWidget url={thumbnailUrl}/>)
	log('Thumbnail widget mounted:', widgetEl)
}