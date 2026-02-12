import type { PageType } from '@/types'

export const log = (...args: unknown[]) => console.log('%cTHUMO', `
	color: #00ccff;
	background: #21202a;
	padding: 1px 5px;
	border-radius: 5px;
	font-size: 11px;
	border: 1px solid #0095ff;
	`, ...args)

export const injectCss = async () => {
	const cssUrl = chrome.runtime.getURL('content.css')
	const response = await fetch(cssUrl)
	const css = await response.text()
	const styleSheet = new CSSStyleSheet()
	styleSheet.replaceSync(css)
	document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet]
}

export const getPageType = (url: string): PageType => {
	if (url.includes('/watch?v=')) return 'watch'
	if (url.includes('/feed/playlists')) return 'playlists'
	if (/\.youtube\.com\/?$/.test(url)) return 'home'
	return 'unknown'
}

export const waitForSidebar = (): Promise<HTMLElement> => {
	const ytdApp = document.querySelector('body > ytd-app')!
	const getSidebar = () => ytdApp.querySelector<HTMLElement>('.watch-root-element #secondary')

	let sidebar = getSidebar()
	if (sidebar) {
		log('Sidebar already loaded:', sidebar)
		return Promise.resolve(sidebar)
	}

	return new Promise(resolve => {
		new MutationObserver((_, obs) => {
			sidebar = getSidebar()
			if (sidebar) {
				log('Sidebar loaded:', sidebar)
				obs.disconnect()
				resolve(sidebar)
			}
		}).observe(ytdApp, { childList: true, subtree: true })
	})
}