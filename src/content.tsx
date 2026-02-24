import { mountThumbnailWidget, mountPlaylistGrid } from '@/features'
import { log, injectCss, getPageType } from '@/utils'
import type { PageType } from '@/types'
import { hydrateStore } from '@/store'

log('Content script is running')
void injectCss()
void hydrateStore()

let pageType: PageType = 'unknown'
let prevUrl = ''

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

	switch (pageType) {
		case 'watch':
			const videoId = /watch\?v=([^&]+)/.exec(url)![1]
			log('Video ID:', videoId)
			await mountThumbnailWidget(videoId)
			break
		case 'playlists':
			await mountPlaylistGrid()
			break
	}
}

void gcss`
	body[data-page-type="home"] {
		ytd-rich-item-renderer {
			width: 300px;
		}
	}
`