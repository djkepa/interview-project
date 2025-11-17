// Import testing library matchers
require('@testing-library/jest-dom');

// Mock i18n module
jest.mock('@/lib/i18n', () => ({
  t: (key) => key,
  setLocale: jest.fn(),
  getLocale: () => 'en',
  translations: { en: {} },
}));

// Mock fs module globally
global.fs = {
  existsSync: jest.fn(),
  accessSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
};

// Mock path module globally
global.path = {
  join: jest.fn((...args) => args.join('/')),
  extname: jest.fn((filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  }),
};

// Mock File, Blob, FormData for Node environment
global.File = class File {
  constructor(bits, name, options) {
    this.bits = bits;
    this.name = name;
    this.type = options?.type || '';
    this.size = bits.reduce((acc, bit) => acc + bit.length, 0);
  }
};

global.Blob = class Blob {
  constructor(bits, options) {
    this.bits = bits;
    this.type = options?.type || '';
    this.size = bits.reduce((acc, bit) => acc + bit.length, 0);
  }
};

global.FormData = class FormData {
  constructor() {
    this.data = new Map();
  }
  append(key, value) {
    this.data.set(key, value);
  }
  get(key) {
    return this.data.get(key);
  }
  has(key) {
    return this.data.has(key);
  }
};

global.FileReader = class FileReader {
  readAsDataURL() {
    setTimeout(() => {
      this.result = 'data:image/png;base64,mockbase64';
      if (this.onload) this.onload({ target: this });
    }, 0);
  }
};
