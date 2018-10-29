'use strict';

const childProcess = require('child_process');
const fs = require('fs');

const markdownPattern = /\.md$/;

const filesToCompile = fs
    .readdirSync('./source')
    .filter(fileName => markdownPattern.test(fileName));

console.log('Compiling docs...');

function compileDocs(docList) {
    const currentFile = docList.pop();
    const outfile = currentFile.split('.')[0] + '.generated.md';

    const currentProcess = childProcess.fork(
        './node_modules/booklisp/index.js',
        [
            `./source/${currentFile}`,
            `./${outfile}`
        ]);

    currentProcess.on('close', function () {
        console.log(`Compiled file: ./${outfile}`);

        if (docList.length > 0) {
            compileDocs(docList);
        } else {
            console.log('DONE!');
        }
    })
}

compileDocs(filesToCompile);