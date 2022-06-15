# urltool
 Node Module & Browser Library for parsing, formatting and serializing URLs

# Import
 In the browser, you can use `UrlTool` to access urltool
 However in node.js, you have to use `require('urltool')` to access urltool

# Usage
## Url
 This class is used to parse and format URLs.
 ```js	
 const url = new UrlTool.Url('http://example.com/path/to/file.html?param=value#hash')
 ```
### .format(?template)
Format the URL.
```js	
url.format()
```

You can use custom templates by passing it as an argument. The default template is: `{protocol}://{host}/{path}/{query}{hash}`. Available properties are `protocol`, `host`, `path`, `query`, `hostWithoutPort`, `port` and `hash`.

### .protocol
 The protocol of the URL.
 e.g.: `http`

### .host
 The host of the URL.
 If the port isn't the default port for the given protocol, it will be included.
 e.g.: `example.com`, `example.com:8080`

### .hostWithoutPort
 The host of the URL **ALWAYS** without the port.
 e.g.: `example.com`

### .port
 The port of the URL.
 e.g.: `80`

### .path
 The path of the URL.
 e.g.: `/path/to/file.html`

### .query
 The query of the URL.
 e.g.: `?param=value`

### .hash
 The hash of the URL.
 e.g.: `#hash`

## parseQuerystring(querystring)
 Parse a querystring into an object.
 ```js	
 UrlTool.parseQuerystring('param=value&param2=value2') // { param: 'value', param2: 'value2' }
 ```

## stringifyQuerystring(query)
 Stringify a query object into a querystring.
 ```js	
 UrlTool.stringifyQuerystring({ param: 'value', param2: 'value2' }) // 'param=value&param2=value2'
 ```