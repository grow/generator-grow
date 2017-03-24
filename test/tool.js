'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-grow:tool', () => {
  before(() => {
    return helpers.run(path.join(__dirname, '../generators/tool'))
      .withPrompts({someAnswer: true});
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      'README.md',
      'tool.css',
      'tool.js'
    ]);
  });
});
