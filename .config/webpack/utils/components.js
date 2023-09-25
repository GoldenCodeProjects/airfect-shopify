const fs = require('fs')
const path = require('path')

const getEntriesByFolder = (folder, type) => {
  const entrypoints = {}

  fs.readdirSync(folder).forEach((file) => {
    const fileBase = path.parse(file).base;
    const fileName = path.parse(file).name;
    const fullLocation = path.join(folder, fileBase)
    if (fileName.startsWith('_')) return;
    if (!fs.existsSync(fullLocation)) return;

    const compiledName = `component-${fileName}-${type}`;
    if (entrypoints.hasOwnProperty(compiledName)) return;
    entrypoints[compiledName] = [fullLocation]
  })

  return entrypoints
}

module.exports = function (stylesDir, scriptsDir) {
  const componentsStyles = path.join(stylesDir, 'components')
  const componentsScripts = path.join(scriptsDir, 'components')

  return {
    ...getEntriesByFolder(componentsStyles, 'style'),
    ...getEntriesByFolder(componentsScripts, 'script')
  }
}
