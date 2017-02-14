import BabelRootImportHelper from './helper';
import fs from 'fs';

export default function() {
  class BabelRootImport {
    constructor() {
      return {
        'visitor': {
          ImportDeclaration(path, state) {
            const defaultPath = path.node.source.value;

            fs.writeFile( 'D:\\1\\client\\dev\\message.txt', JSON.stringify(path), 'utf8');

            let rootPath = process.cwd();
            let rootPathPrefix = '.';

            if (state && state.opts) {
              if (state.opts.rootPath && typeof state.opts.rootPath === 'string') {
                rootPath = `/${state.opts.rootPath.replace(/^(\/)|(\/)$/g, '')}`;
              }
            }

            if (BabelRootImportHelper().hasRootPathPrefixInString(defaultPath, rootPathPrefix)) {
              path.node.source.value = BabelRootImportHelper().transformRelativeToRootPath(defaultPath, rootPath, rootPathPrefix);
            }
          }
        }
      };
    }
  }

  return new BabelRootImport();
}
