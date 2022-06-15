const UrlTool = {
    defaultFormattingTemplate: '{protocol}://{host}/{path}/{query}{hash}',
    parseQuery (queryString) {
        if (queryString === undefined || queryString === null || queryString === '') {
            return {}
        }
        queryString = queryString.trim()
        if (queryString.startsWith('?')) {
            queryString = queryString.substring(1)
        }

        const query = {}
        const queryParts = queryString.split('&')
        for (const queryPart of queryParts) {
            const [key, value] = queryPart.split('=')
            query[decodeURIComponent(key) || ''] = decodeURIComponent(value || '')
        }
        try { delete query[''] } catch {}
        return query
    },
    stringifyQuery (query, questionMark = '?') {
        const queryParts = []
        for (const [key, value] of Object.entries(query)) {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        }
        return queryParts.length ? `${questionMark}${queryParts.join('&')}` : ''
    },
    Url: class Url {

        constructor (urlstring) {
            if (typeof urlstring !== 'string') throw new TypeError('Url must be a string')

            this._protocol = ''
            this._host = ''
            this._port = ''
            this._path = ''
            this._query = ''
            this._hash = ''

            this._raw = urlstring

            this._parse()
        }

        _parse () {
            // Check if protocol is provided
            let rawWithoutProtocol = this._raw
            if (this._raw.match(/([a-zA-Z-_\d]*?):\/\//) && this._raw.match(/([a-zA-Z-_\d]*?):\/\//).index === 0) {
                // Protocol provided
                const _foundProtocol = this._raw.match(/([a-zA-Z-_\d]*?):\/\//)[1]
                if (_foundProtocol.length > 0) {
                    this._protocol = _foundProtocol
                } else {
                    this._protocol = null
                }

                if (this._protocol === null) {
                    rawWithoutProtocol = this._raw.substring(this._raw.indexOf('://') + 3)
                } else {
                    rawWithoutProtocol = this._raw.substring(this._raw.match(/([a-zA-Z-_\d]*?):\/\//)[0].length)
                }
            } else if (this._raw.startsWith('//')) {
                this._protocol = 'http'
            } else {
                this._protocol = null
            }
            while (rawWithoutProtocol.startsWith('/')) {
                rawWithoutProtocol = rawWithoutProtocol.substring(1)
            }

            const splittedBySlashes = rawWithoutProtocol.split('/')
            let host = splittedBySlashes[0] || ''
            const pathQueryHash = splittedBySlashes.slice(1).join('/') || ''
            const splittedByQuestionMark = pathQueryHash.split('?')
            const path = splittedByQuestionMark[0] || ''
            let query = splittedByQuestionMark.length > 1 ? splittedByQuestionMark.slice(1).join('?') : ''
            const hash = pathQueryHash.split('#').length > 1 ? pathQueryHash.split('#').slice(1).join('#') : ''

            // Make sure query doesn't include the hash at the end
            if (query.endsWith('#' + hash)) {
                query = query.substring(0, query.length - hash.length - 1)
            }

            // Get port if provided
            let port = null
            if (host.includes(':')) {
                const hostParts = host.split(':')
                host = hostParts[0]
                port = hostParts[1]
            } else {
                if (this._protocol === 'https') {
                    port = '443'
                } else if (this._protocol === 'http') {
                    port = '80'
                } else if (this._protocol === 'ftp') {
                    port = '21'
                } else if (this._protocol === 'ftps') {
                    port = '990'
                } else if (this._protocol === 'sftp' || this._protocol === 'ssh') {
                    port = '22'
                } else if (this._protocol === 'telnet') {
                    port = '23'
                } else if (this._protocol === 'gopher') {
                    port = '70'
                } else {
                    port = '80'
                }
            }

            this._hash = hash
            this._path = path
            this._query = query
            this._host = host
            this._port = port

            if (this._query.length > 0) this._query = '?' + this._query
            if (this._hash.length > 0) this._hash = '#' + this._hash

            if (!this._protocol && port) {
                if (port === '443') {
                    this._protocol = 'https'
                } else if (port === '80') {
                    this._protocol = 'http'
                } else if (port === '21') {
                    this._protocol = 'ftp'
                } else if (port === '990') {
                    this._protocol = 'ftps'
                } else if (port === '22') {
                    this._protocol = 'ssh'
                } else if (port === '23') {
                    this._protocol = 'telnet'
                } else if (port === '70') {
                    this._protocol = 'gopher'
                } else {
                    this._protocol = 'http'
                }
            }

            this._raw = this.format()
        }

        format (template = UrlTool.defaultFormattingTemplate) {
            let result = template

            result = result.replace(/{protocol}/g, this.protocol)
            result = result.replace(/{hostWithoutPort}/g, this.hostWithoutPort)
            result = result.replace(/{host}/g, this.host)
            result = result.replace(/{path}\//g, this.pathWithSlash)
            result = result.replace(/{path}/g, this.path)
            result = result.replace(/{query}/g, this.query)
            result = result.replace(/{hash}/g, this.hash)
            result = result.replace(/{port}/g, this.port)

            return result
        }

        toString () {
            return this.format()
        }

        get protocol() {
            return this._protocol
        }
        set protocol(n) {
            this._protocol = n
            this._parse()
        }

        get hostWithoutPort () {
            return this._host
        }
        set hostWithoutPort (_) {
            throw new Error('Can\'t set hostWithoutPort. Use host instead.')
        }

        get host() {
            return this._host + this.port
        }
        set host(n) {
            this._host = n
            this._parse()
        }

        get port() {
            if (this._port.length <= 0) return ''
            if ((this.protocol === 'https' && this._port === '443') || (this.protocol === 'http' && this._port === '80')) return ''
            return ':' + this._port
        }
        set port(n) {
            this._port = n
            this._parse()
        }

        get path() {
            return this._path
        }
        set path(n) {
            this._path = n
            this._parse()
        }

        get pathWithSlash () {
            if (this._path.length <= 0) return ''
            if (this.query.length > 0) return this.path
            return this._path.endsWith('/') ? this._path : this._path + '/'
        }
        set pathWithSlash (_) {
            throw new Error('Can\'t set pathWithSlash. Use path instead.')
        }

        get query() {
            return this._query
        }
        set query(n) {
            this._query = n
            this._parse()
        }

        get hash() {
            return this._hash
        }
        set hash(n) {
            this._hash = n
            this._parse()
        }

    }
}

// Export:
try {
    if (module && module.exports) {
        module.exports = UrlTool
    }
} catch {}

try {
    if (window) {
        window.UrlTool = UrlTool
    }
} catch {}