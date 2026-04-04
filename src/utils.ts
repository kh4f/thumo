import type { PageType } from '@/content'

export const log = (...args: unknown[]) => console.log('%cTHUMO', `
	color: #00ccff;
	background: #21202a;
	padding: 1px 5px;
	border-radius: 5px;
	font-size: 11px;
	border: 1px solid #0095ff;
	`, ...args)

export const injectCss = async () => {
	const cssUrl = chrome.runtime.getURL('style.css')
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

export const waitForEl = (selector: string): Promise<HTMLElement> => {
	const ytdApp = document.querySelector('body > ytd-app')!
	const getElement = () => ytdApp.querySelector<HTMLElement>(selector)

	let element = getElement()
	if (element) return Promise.resolve(element)

	return new Promise(resolve => {
		new MutationObserver((_, obs) => {
			element = getElement()
			if (element) {
				obs.disconnect()
				resolve(element)
			}
		}).observe(ytdApp, { childList: true, subtree: true })
	})
}