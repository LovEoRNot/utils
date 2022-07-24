
(function(graph) {
    const module_cache = {}
    function require(module) {
        function localRequire(relativePath) {
            if (module_cache[relativePath]) {
                return module_cache[relativePath];
            }

            const code = require(graph[module].dependencies[relativePath]);
            module_cache[relativePath] = code;

            return code;
        }
        var exports = {}; 
        ;(function(require, exports, code) {
            eval(code);
        })(localRequire, exports, graph[module].code);
        return exports;
    }
    require('./webpack.test/index.js')
})({"./webpack.test/index.js":{"dependencies":{"./a.js":"./webpack.test\\a.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nvar a = (0, _a.log)();\n\nfunction tell() {\n  return a + 'b';\n}\n\ntell();"},"./webpack.test\\a.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.log = log;\nvar a = 'asd';\n\nfunction log() {\n  return a;\n}"}})