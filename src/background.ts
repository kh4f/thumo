chrome.tabs.onUpdated.addListener((tabId, onUpdatedInfo, tab) => {
	if (onUpdatedInfo.status === 'complete')
		void chrome.tabs.sendMessage(tabId, { action: 'tab-updated', tabInfo: tab }).catch(() => null)
})