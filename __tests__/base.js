'use strict';
const _ = require('lodash');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('grow:base', () => {
  beforeEach(() => {
    jest.mock('npm-name', () => {
      return () => Promise.resolve(true);
    });
  });

  describe('running on new project', () => {
    it('scaffold a full project', () => {
      const answers = {
        description: 'A grow base test',
        homepage: 'http://grow.io',
        authorName: 'The Grow Team',
        authorEmail: 'hi@grow.io',
        authorUrl: 'http://grow.io',
        keywords: ['test', 'words']
      };
      return helpers.run(require.resolve('../generators/base'))
        .withOptions({
          name: 'grow-test'
        })
        .withPrompts(answers)
        .then(() => {
          assert.file('package.json');
          assert.jsonFileContent('package.json', {
            name: 'grow-test',
            version: '0.0.0',
            description: answers.description,
            homepage: answers.homepage,
            author: {
              name: answers.authorName,
              email: answers.authorEmail,
              url: answers.authorUrl
            },
            keywords: ['test', 'words', 'grow']
          });

          assert.file('README.md');
          assert.fileContent('README.md', '# Grow Test');
          assert.fileContent('README.md', 'A grow base test');

          assert.file('podspec.yaml');
          assert.fileContent('podspec.yaml', 'title: "Grow Test"');

          assert.file([
            'content/pages/_blueprint.yaml',
            'content/pages/about.md',
            'content/pages/home.yaml',
            'content/pages/projects.md',

            'source/images/favicon.png',
            'source/sass/_button.sass',
            'source/sass/_config.sass',
            'source/sass/_footer.sass',
            'source/sass/_global.sass',
            'source/sass/_header.sass',
            'source/sass/_main.sass',
            'source/sass/_modifiers.sass',
            'source/sass/_nav.sass',
            'source/sass/main.sass',

            'views/partials/hero.html',
            'views/_footer.html',
            'views/_header.html',
            'views/base.html'
          ]);
        });
    });
  });

  describe('running on existing project', () => {
    it('extend package.json fields', () => {
      const pkg = {
        version: '1.0.3',
        description: 'so many sites',
        homepage: 'http://grow.io',
        repository: 'grow/grow-base-test',
        author: 'The Grow Team'
      };
      return helpers.run(require.resolve('../generators/base'))
        .withOptions({name: 'grow-test'})
        .on('ready', gen => {
          gen.fs.writeJSON(gen.destinationPath('package.json'), pkg);
        })
        .then(() => {
          const newPkg = _.extend({name: 'grow-test'}, pkg);
          assert.jsonFileContent('package.json', newPkg);
        });
    });
  });
});
