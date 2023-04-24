import { Hono } from "hono";

const app = new Hono();

app.get('/todos'), async (c) => {
	const request = new Request(
		'https://todo-nextjs-vo7nvkd2xa-an.a.run.app/todos', {
			headers: c.req.headers
		}
	)

	const cache = cache.defaults
	let response = await cache.match(request)
	
	if (response) {
		return response
	}

	response = await fetch(request)

	response = new Response(response.body, response)
	response.header.set("Cache-Control", "s-max-age=30")
	c.executionCtx.waitUntil(cache.put(request, response.clone))

	return response
}

app.all('*'), (c) => {
	const url = new URL(c.req.url)
	url.hostname ='todo-nextjs-vo7nvkd2xa-an.a.run.app'
	url.protocol = 'https'
	return fetch(url)
}

export default app