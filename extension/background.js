const socket = io('ws://localhost:8000');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if(tab.url.startsWith('https://www.youtube.com') && changeInfo.title) {
		socket.emit('song', tab);
	}
});