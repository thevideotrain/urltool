const UrlTool = require('./src.js')

const testingUrls = {
    'http://www.google.com': 'http://www.google.com/',
    'https://www.google.com': 'https://www.google.com/',
    'http://www.google.com/': 'http://www.google.com/',
    'https://www.google.com/': 'https://www.google.com/',
    'http://www.google.com/search?q=test': 'http://www.google.com/search?q=test',
    'https://www.google.com/search?q=test': 'https://www.google.com/search?q=test',
    'http://www.google.com/search?q=test#test': 'http://www.google.com/search?q=test#test',
    'https://www.google.com/search?q=test#test': 'https://www.google.com/search?q=test#test',
    'example.com': 'http://example.com/',
    'example.com/': 'http://example.com/',
    'example.com/test': 'http://example.com/test/',
    'google.com': 'http://google.com/',
    'google.com:80/': 'http://google.com/',
    'google.com:80/test': 'http://google.com/test/',
    'google.com:443/': 'https://google.com/',
    'google.com:443/test': 'https://google.com/test/',
    'google.com:8080/': 'http://google.com:8080/',
    '://google.com': 'http://google.com/',
    '://google.com/': 'http://google.com/',
    '://google.com/test': 'http://google.com/test/',
    '//google.com': 'http://google.com/',
}

test('Urls format should be like expected', () => {
    for (const [testurl, expected] of Object.entries(testingUrls)) {
        expect(new UrlTool.Url(testurl).toString()).toBe(expected)
    }
})

test('Parsing Querystrings', () => {
    expect(UrlTool.parseQuery('?test=test')).toEqual({ test: 'test' })
    expect(UrlTool.parseQuery('test=test')).toEqual({ test: 'test' })
    expect(UrlTool.parseQuery('test=test&test2=test2')).toEqual({ test: 'test', test2: 'test2' })
    expect(UrlTool.parseQuery('test=test&test2=test2&test3=test3')).toEqual({ test: 'test', test2: 'test2', test3: 'test3' })
    expect(UrlTool.parseQuery('?test=test&test2=test2&test3=test3&test4=test4')).toEqual({ test: 'test', test2: 'test2', test3: 'test3', test4: 'test4' })
    expect(UrlTool.parseQuery('?test=test&test2=test2')).toEqual({ test: 'test', test2: 'test2' })
    expect(UrlTool.parseQuery('?test=test&test2=test2&test3=test3')).toEqual({ test: 'test', test2: 'test2', test3: 'test3' })
    expect(UrlTool.parseQuery('?test=test&test2=test2&test3=test3&test4=test4')).toEqual({ test: 'test', test2: 'test2', test3: 'test3', test4: 'test4' })
    expect(UrlTool.parseQuery('?')).toEqual({})
    expect(UrlTool.parseQuery('')).toEqual({})
    expect(UrlTool.parseQuery(' ')).toEqual({})
})

test('Stringifying Querystrings', () => {
    expect(UrlTool.stringifyQuery({ test: 'test' })).toBe('?test=test')
    expect(UrlTool.stringifyQuery({ test: 'test' }, '')).toBe('test=test')
    expect(UrlTool.stringifyQuery({ test: 'test' }, '?')).toBe('?test=test')
    expect(UrlTool.stringifyQuery({ test: 'test', a: 'b' })).toBe('?test=test&a=b')
    expect(UrlTool.stringifyQuery({ test: 'test', a: 'b' }, '?')).toBe('?test=test&a=b')
})

test('Custom Formats', () => {
    expect(new UrlTool.Url('https://google.com/search?q=ok').format('{host}')).toBe('google.com')
    expect(new UrlTool.Url('https://google.com/search?q=ok').format('{host}/')).toBe('google.com/')
    expect(new UrlTool.Url('https://google.com/search?q=ok').format('{host}/{path}')).toBe('google.com/search')
    expect(new UrlTool.Url('https://google.com/search?q=ok').format('{host}/{path}/')).toBe('google.com/search')
    expect(new UrlTool.Url('https://google.com/search?q=ok').format('{host}/{path}/{query}')).toBe('google.com/search?q=ok')
    expect(new UrlTool.Url('https://google.com/search?q=ok').format('{host}/{path}/{query}/')).toBe('google.com/search?q=ok/')
    expect(new UrlTool.Url('https://google.com/search?q=ok').format('{host}/{path}/{query}')).toBe('google.com/search?q=ok')
})