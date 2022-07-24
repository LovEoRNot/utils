const Compiler = require('../src/myWebpack');

const options = {
    entry: './webpack.test/index.js',
    output: {
        path: './webpack.test',
        filename: 'bundle.js'
    }
}

new Compiler(options).run()