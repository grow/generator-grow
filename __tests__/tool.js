'use strict';
const _ = require('lodash');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('grow:tool', () => {
  beforeEach(() => {
    jest.mock('npm-name', () => {
      return () => Promise.resolve(true);
    });
  });

  describe('running on new project', () => {
    it('scaffold a full project', () => {
      const answers = {
        name: 'grow-tool-test',
        description: 'A grow tool test',
        homepage: 'http://grow.io',
        authorName: 'The Grow Team',
        authorEmail: 'hi@grow.io',
        authorUrl: 'http://grow.io',
        keywords: ['foo', 'bar']
      };
      return helpers.run(require.resolve('../generators/tool'))
        .withPrompts(answers)
        .then(() => {
          assert.file('package.json');
          assert.jsonFileContent('package.json', {
            name: 'grow-tool-test',
            version: '0.0.0',
            description: answers.description,
            homepage: answers.homepage,
            author: {
              name: answers.authorName,
              email: answers.authorEmail,
              url: answers.authorUrl
            },
            keywords: answers.keywords
          });

          assert.file('README.md');
          assert.fileContent('README.md', '# Test');
          assert.fileContent('README.md', '$ npm install --save grow-tool-test');
          assert.fileContent('README.md', '- kind: test');

          assert.file('tool.css');
          assert.fileContent('tool.css', '.grow__icon_test');

          assert.file('tool.js');
          assert.fileContent('tool.js', 'kind: \'test\',');
          assert.fileContent('tool.js', 'name: \'Test\',');
        });
    });
  });

  describe('running on existing project', () => {
    it('extend package.json fields', () => {
      const pkg = {
        version: '1.0.3',
        description: 'so many tools',
        homepage: 'http://grow.io',
        repository: 'grow/grow-tool-test',
        author: 'The Grow Team',
        keywords: ['foo', 'bar']
      };
      return helpers.run(require.resolve('../generators/tool'))
        .withPrompts({name: 'grow-tool-test'})
        .on('ready', gen => {
          gen.fs.writeJSON(gen.destinationPath('package.json'), pkg);
        })
        .then(() => {
          const newPkg = _.extend({name: 'grow-tool-test'}, pkg);
          assert.jsonFileContent('package.json', newPkg);
        });
    });
  });
});
