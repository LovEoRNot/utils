const { transformFromAst } = require('@babel/core');
const parser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const fs = require('fs');
const path = require('path');

module.exports = {
    getAst: function getAst(path) {
        const content = fs.readFileSync(path, 'utf-8');
        return parser.parse(content, {
            sourceType: 'module'
        })
    },
    getDependencies: function getDependencies(ast, filename) {
        const dependencies = {};

        traverse(ast, {
            ImportDeclaration({ node }) {
                const dirname = path.dirname(filename);
                const filepath = './' + path.join(dirname, node.source.value);
                dependencies[node.source.value] = filepath
            }
        })

        return dependencies;
    },
    getCode: function getCode(ast) {
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        });

        return code;
    }
}