import { mountThumbnailWidget, mountPlaylistsWidget } from '@/features'
import { log, injectCss, getPageType } from '@/utils'
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
	body[data-page-type="playlists"] {
		#contents.ytd-rich-grid-renderer {
			box-sizing: border-box;
			padding-left: 24px;
			gap: 19px 16px;

			ytd-rich-item-renderer {
				width: 200px;
				margin: 6px 0 0 0;
				border-radius: 12px;
				background-color: #ffffff05;

				> #content > yt-lockup-view-model > div > a {
					padding-bottom: 0px;

					.ytThumbnailViewModelAspectRatio16By9 {
						padding-top: 48%;
					}

					+ div {
						padding: 6px 12px;

						h3 span {
							font-size: 14px;
						}

						.yt-lockup-metadata-view-model__metadata {
							position: absolute;
							z-index: 2;
							right: 0;
							margin-right: -3px;
							margin-top: -98px;

							&:not(ytd-rich-item-renderer:has(.yt-spec-touch-feedback-shape--hovered)
							.yt-lockup-metadata-view-model__metadata) {
								display: none;
							}

							.yt-content-metadata-view-model__metadata-row {
								justify-content: end;

								span {
									font-size: 9px;
									line-height: 1;
									color: hsl(0, 0%, 80%);
								}
							}
						}
					}
				}
			}
		}
	}
`