chrome.tabs.onUpdated.addListener((tabId, onUpdatedInfo, tab) => {
	if (onUpdatedInfo.status === 'complete')
		void chrome.tabs.sendMessage(tabId, { action: 'tab-updated', tabInfo: tab }).catch(() => null)
})

chrome.webRequest.onCompleted.addListener(details => {
	console.log('[THUMO|BG] Detected playlist changes, forcing YT grid refresh')

	void chrome.scripting.executeScript({
		target: { tabId: details.tabId },
		world: 'MAIN',
		func: () => {
			type GridRenderer = Element & {
				data: any // eslint-disable-line @typescript-eslint/no-explicit-any
				resolveCommand: (cmd: unknown) => boolean
				forceRefreshAndLog: () => void
			}

			const gridRenderer = document.querySelector<GridRenderer>('ytd-rich-grid-renderer:has(#thumo-playlist-grid)')!
			console.log('[THUMO|WORLD] Found grid renderer:', gridRenderer)

			const res = gridRenderer.resolveCommand(gridRenderer.data.header.chipBarViewModel.chips[0].chipViewModel.tapCommand.innertubeCommand.showSheetCommand.panelLoadingStrategy.inlineContent.sheetViewModel.content.listViewModel.listItems[0].listItemViewModel.rendererContext.commandContext.onTap.innertubeCommand) // eslint-disable-line
			console.log('[THUMO|WORLD] Command execution result:', res)

			gridRenderer.forceRefreshAndLog()
		},
	})
}, { urls: ['https://www.youtube.com/youtubei/v1/browse/edit_playlist*'] })