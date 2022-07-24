const { getAst, getDependencies, getCode } = require("./Parser");
const path = require('path')
const fs = require('fs')

class Compiler {
    constructor(options = {}) {
        const { entry, output } = options;

        this.entry = entry;
        this.output = output;

        this.modules = [];
    }

    run() {
        const info = this.build(this.entry);
        this.modules.push(info);
        for(const module of this.modules) {
            const { dependencies } = module;
            if (dependencies) {
                for(const dependency in dependencies) {
                    const module = this.build(dependencies[dependency]);
                    this.modules.push(module);
                }
            }
        }

        const dependencyGraph = this.modules.reduce(
            (graph, item) => ({
                ...graph,
                [item.filename]: {
                    dependencies: item.dependencies,
                    code: item.code
                }
            }),
            {}
        )

        this.generate(dependencyGraph)
    }

    build(filename) {
        const ast = getAst(filename);
        const dependencies = getDependencies(ast, filename);
        const code = getCode(ast);

        return {
            filename,
            dependencies,
            code
        }
    }

    generate(dependencyGraph) {
        const filepath = path.join(this.output.path, this.output.filename);

        const bundle = `
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
    require('${this.entry}')
})(${JSON.stringify(dependencyGraph)})`

        fs.writeFileSync(filepath, bundle, 'utf-8')
    }
}

module.exports = Compiler;