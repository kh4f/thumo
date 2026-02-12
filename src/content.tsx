import { createRoot, type Root } from 'react-dom/client'
import { ThumbnailWidget } from '@/components'
import { log, injectCss, waitForSidebar, getPageType } from '@/utils'
import type { PageType } from '@/types'

log('Content script is running')
void injectCss()

let pageType: PageType = 'unknown'
let prevUrl: string
let widgetEl: HTMLElement | null = null
let widgetRoot: Root | null = null

chrome.runtime.onMessage.addListener((message: { action: string, tabInfo: chrome.tabs.Tab }) => {
	if (message.action === 'tab-updated') void onTabLoad(message.tabInfo)
})

const onTabLoad = async (tabInfo: chrome.tabs.Tab) => {
	const url = tabInfo.url ?? ''
	log('Tab updated:', url)

	pageType = getPageType(url)

	if (url === prevUrl) {
		log('URL unchanged, skipping')
		return
	}
	prevUrl = url

	log('Page type:', pageType)
	document.body.dataset.pageType = pageType

	if (pageType === 'watch') {
		const videoId = /watch\?v=([^&]+)/.exec(url)![1]
		log('Video ID:', videoId)

		const sidebar = await waitForSidebar()
		renderWidget(videoId, sidebar)
	}
}

const renderWidget = (videoId: string, sidebar: HTMLElement) => {
	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
	log('Thumbnail URL:', thumbnailUrl)

	widgetEl = widgetEl
		?? document.getElementById('thumo-widget')
		?? Object.assign(document.createElement('div'), { id: 'thumo-widget' })

	if (widgetEl.parentElement !== sidebar) sidebar.prepend(widgetEl)
	widgetRoot = widgetRoot ?? createRoot(widgetEl)

	widgetRoot.render(<ThumbnailWidget url={thumbnailUrl}/>)
	log('Thumbnail widget rendered:', widgetEl)
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