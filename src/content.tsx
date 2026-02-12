import { log, injectCss, waitForSidebar, getPageType } from '@/utils'
import { mountThumbnailWidget } from '@/features/thumbnail-widget'
import type { PageType } from '@/types'

log('Content script is running')
void injectCss()

let pageType: PageType = 'unknown'
let prevUrl: string

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
		mountThumbnailWidget(videoId, sidebar)
	}
}

void gcss`
	body[data-page-type="home"] {
		ytd-rich-item-renderer {
			width: 300px;
		}
	}
`