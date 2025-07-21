export const searchWithEngine = (
	engine: string,
	query: string,
	searchEngineUrl: string,
) => {
	switch (engine) {
		case "google":
			return `https://www.google.com/search?q=${query}`;
		case "bing":
			return `https://www.bing.com/search?q=${query}`;
		case "duckduckgo":
			return `https://www.duckduckgo.com/search?q=${query}`;
		case "startpage":
			return `https://www.startpage.com/search?q=${query}`;
		case "qwant":
			return `https://www.qwant.com/?q=${query}`;
		case "searx":
			return `https://searx.org/?q=${query}`;
		case "custom":
			if (searchEngineUrl.includes("[q]")) {
				return searchEngineUrl.replace("[q]", query);
			}

			return `${searchEngineUrl}?q=${query}`;
	}
};
