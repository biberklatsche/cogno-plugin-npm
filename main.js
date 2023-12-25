const path = require('path');
const fs = require('fs');
const os = require('os');


async function suggestStart(data) {
    console.log('################ suggest start');
    if(os.platform() === 'win32') {
        data.directory[0] = data.directory[0]+':'
    } else {
        data.directory.unshift('/');
    }

    const dir = path.join(...data.directory);
    const packageJsonPath = path.join(dir, 'package.json');
    console.log(packageJsonPath);
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
        if(packageJson.scripts) {
            const keys = Object.keys(packageJson.scripts);
            const partOfScriptName = data.currentInput.input.replace(/npm\srun\s/g, '').trim();
            console.log('################', data.currentInput.input, partOfScriptName);
            const filter = keys.filter((key) => key.startsWith(partOfScriptName));
            console.log('################', filter);
            return filter.map(f => ({label: f, command: `npm run ${f}`}));
        }
    } catch(e) {
        console.log('################', e);
        return [];
    }
}

/**
 *
 * @param {{location: Location; directory: string[]; currentInput: {input: string; startLine: number; lines: {line: number; content: string}[]}; cursorPosition: CursorPosition; pressedKey: string;}} data
 * @returns
 */
async function suggest(data) {
    if(/npm\srun.*/g.test(data.currentInput.input)) {
        return await suggestStart(data);
    }
    return [];
};

module.exports = {suggest};
