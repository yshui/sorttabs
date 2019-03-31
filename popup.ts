type Tab = browser.tabs.Tab
function title_cmp(a: Tab, b: Tab) {
	return (a.title && b.title) ? (a.title < b.title ? -1 : (a.title > b.title ? 1 : 0)) : 0
}
function domain_cmp(a: Tab, b: Tab) {
	if (a.url === undefined || b.url === undefined) {
		return 0
	}
	let au = new URL(a.url), bu = new URL(b.url)
	return au.host < bu.host ? -1 : (au.host > bu.host ? 1 : 0)
}
async function sorttab(cmp: (a: browser.tabs.Tab, b: browser.tabs.Tab) => number) {
	let tabs = await browser.tabs.query({ currentWindow: true, pinned: false })
	tabs.sort(cmp)
	//console.log(tabs)
	await browser.notifications.create({ type: "basic", message: "", title: "Applying sorted order" })

	let order = []
	for (let t of tabs) {
		if (t.id !== undefined) {
			order.push(t.id)
		}
	}
	await browser.tabs.move(order, { index: -1 })
	await browser.notifications.create({ type: "basic", message: "", title: "Tabs sorted" })
}


let buttons = document.querySelectorAll("button")
if (buttons) {
	buttons.forEach((v, _key, _p) => {
		v.onclick = function () { sorttab((<any>window)[v.innerText+"_cmp"]) }
	})
}
