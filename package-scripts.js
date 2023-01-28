const { series, rimraf } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps start',
    start: {
      script: 'cd dist && cross-env NODE_ENV=production node ./src/index.js',
      description: 'Start building the app',
    },
    dev: {
      script: 'cross-env NODE_ENV=local nodemon -L --exec ts-node -- ./src/index.ts',
      description: 'Starting the local development environment',
    },
    lint: {
      script: 'tslint -t stylish --project "tsconfig.json" --fix',
      hiddenFromHelp: true,
    },
    build: {
      script: series('nps banner.build', 'nps lint', 'nps clean.dist', 'nps transpile', 'nps copy.config'),
      description: 'Builds the app into the dist directory',
    },
    test: {
      script: series('nps banner.test', 'npm run build'),
      description: 'Run untary test of app',
    },
    clean: {
      default: {
        script: series(`nps banner.clean`, `nps clean.dist`),
        description: 'Deletes the ./dist folder',
      },
      dist: {
        script: rimraf('./dist'),
        hiddenFromHelp: true,
      },
    },
    transpile: {
      script: `tsc`,
      hiddenFromHelp: true,
    },
    copy: {
      default: {
        script: series(`nps copy.config`, `nps copy.swagger`),
        hiddenFromHelp: true,
      },
      config: {
        script: copyDir('./config', './dist/config'),
        hiddenFromHelp: true,
      },
    },
    banner: {
      build: banner('build'),
      test: banner('test'),
      release: banner('release'),
      clean: banner('clean project'),
    },
    release: {
      script: series('nps banner.release', 'taggit'),
      description: 'Tag git commit',
    },
  },
};

function banner(name) {
  return {
    hiddenFromHelp: true,
    silent: true,
    description: `Shows ${name} banners to the console`,
    script: runFast(`./commands/banner.ts Reinnovatech "${name}"`),
  };
}

function copyDir(source, target) {
  return `ncp ${source} ${target}`;
}

function runFast(path) {
  return `ts-node --transpile-only ${path}`;
}
