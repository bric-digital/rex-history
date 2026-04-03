import http from 'node:http'

const host = '127.0.0.1'
const port = 3001

function html(response, body) {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  response.end(body)
}

function json(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(body))
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${host}:${port}`)

  if (url.pathname === '/health') {
    json(response, 200, { ok: true })
    return
  }

  if (url.pathname === '/allowlisted') {
    const marker = url.searchParams.get('marker') ?? ''
    html(response, `<html><body><h1>Allowlisted page</h1><p>marker=${marker}</p></body></html>`)
    return
  }

  if (url.pathname === '/not-allowlisted') {
    const marker = url.searchParams.get('marker') ?? ''
    html(response, `<html><body><h1>Not allowlisted page</h1><p>marker=${marker}</p></body></html>`)
    return
  }

  if (url.pathname === '/journey/home') {
    const marker = url.searchParams.get('marker') ?? ''
    html(response, `<html><body><h1>Journey Home</h1><a id="article-a-link" href="/journey/article-a?marker=${encodeURIComponent(marker)}">Article A</a><a id="article-b-link" href="/journey/article-b?marker=${encodeURIComponent(marker)}">Article B</a></body></html>`)
    return
  }

  if (url.pathname === '/journey/article-a') {
    const marker = url.searchParams.get('marker') ?? ''
    html(response, `<html><body><h1>Journey Article A</h1><a id="home-link" href="/journey/home?marker=${encodeURIComponent(marker)}">Back Home</a></body></html>`)
    return
  }

  if (url.pathname === '/journey/article-b') {
    const marker = url.searchParams.get('marker') ?? ''
    html(response, `<html><body><h1>Journey Article B</h1><a id="home-link" href="/journey/home?marker=${encodeURIComponent(marker)}">Back Home</a></body></html>`)
    return
  }

  json(response, 404, { ok: false })
})

server.listen(port, host, () => {
  console.log(`Rex-history test server running at http://${host}:${port}`)
})
