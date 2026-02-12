import { log, injectCss, getPageType } from '@/utils'
import { mountThumbnailWidget } from '@/features/thumbnail-widget'
import { mountPlaylistsWidget } from '@/features/playlist-sorting'
import type { PageType } from '@/types'

log('Content script is running')
void injectCss()

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
		case 'watch': {
			const videoId = /watch\?v=([^&]+)/.exec(url)![1]
			log('Video ID:', videoId)
			await mountThumbnailWidget(videoId)
			break
		}
		case 'playlists': {
			await mountPlaylistsWidget()
			break
		}
	}
}

void gcss`
	body[data-page-type="home"] {
		ytd-rich-item-renderer {
			width: 300px;
		}
	}
`