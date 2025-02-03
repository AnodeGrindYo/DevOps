// lib/filesystem.js
export class FileSystem {
  constructor() {
    this.root = {
      type: 'directory',
      name: '/',
      contents: {
        home: {
          type: 'directory',
          contents: {
            user: {
              type: 'directory',
              contents: {
                Documents: { type: 'directory', contents: {} },
                Images: { type: 'directory', contents: {} },
                projet1: { type: 'directory', contents: {} },
                projet2: { type: 'directory', contents: {} }
              }
            }
          }
        }
      }
    };
    this.currentPath = ['/home/user'];
  }

  getCurrentDirectory() {
    let current = this.root;
    const path = this.currentPath[0].split('/').filter((p) => p);
    for (const dir of path) {
      current = current.contents[dir];
    }
    return current;
  }

  mkdir(name) {
    const current = this.getCurrentDirectory();
    if (current.contents[name]) {
      return false;
    }
    current.contents[name] = {
      type: 'directory',
      contents: {}
    };
    return true;
  }

  cd(path) {
    if (path === '..') {
      if (this.currentPath[0] !== '/home/user') {
        this.currentPath[0] = this.currentPath[0].split('/').slice(0, -1).join('/');
        return true;
      }
      return false;
    }
    const current = this.getCurrentDirectory();
    if (current.contents[path]) {
      this.currentPath[0] += '/' + path;
      return true;
    }
    return false;
  }

  ls() {
    return Object.keys(this.getCurrentDirectory().contents);
  }
}
