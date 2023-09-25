const fs = require('fs')
const path = require('path')


const getEntriesByFolder = (folder, type) => {
    const entrypoints = {};

    fs.readdirSync(folder).forEach((file) => {
        const isDirectory = fs.statSync(path.join(folder, file)).isDirectory();
        if(!isDirectory) return;
        const directory = path.join(folder, file);
        const directoryName = path.basename(directory);
        if(directoryName === 'components') return;

        // search file with same name as directory
        const files = fs.readdirSync(directory);
        const entry = files.find((file) => {
            const name = path.basename(file, path.extname(file));
            return name === directoryName;
        });
        if(!entry) return;
        entrypoints[`folder-${directoryName}`] = path.join(directory, entry);
    });

    return entrypoints
}

module.exports = function (scriptsDir) {
  const componentsScripts = path.join(scriptsDir)

  return {
    ...getEntriesByFolder(componentsScripts, 'script')
  }
}
