'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const extend = require('deep-extend');
const parseAuthor = require('parse-author');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });

    this.option('description', {
      type: String,
      required: true,
      desc: 'Project description'
    });

    this.option('authorName', {
      type: String,
      required: true,
      desc: 'Author name'
    });

    this.option('authorEmail', {
      type: String,
      required: true,
      desc: 'Author email'
    });

    this.option('authorUrl', {
      type: String,
      required: true,
      desc: 'Author url'
    });

    this.option('homepage', {
      type: String,
      required: true,
      desc: 'Project homepage'
    });
  }

  writing() {
    console.log('writing', this.options);
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    var pkg = extend({
      name: _.kebabCase(this.options.name),
      version: '0.0.0',
      description: this.options.description,
      homepage: this.options.homepage,
      author: {
        name: this.options.authorName,
        email: this.options.authorEmail,
        url: this.options.authorUrl
      },
      keywords: ['grow'],
      devDependencies: {}
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    const templateVars = extend({
      nameLong: _.startCase(pkg.name)
    }, pkg);

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      templateVars
    );

    this.fs.copyTpl(
      this.templatePath('podspec.yaml'),
      this.destinationPath('podspec.yaml'),
      templateVars
    );

    this.fs.copy(
      this.templatePath('content/**/*'),
      this.destinationPath('content/')
    );

    this.fs.copy(
      this.templatePath('source/**/*'),
      this.destinationPath('source/')
    );

    this.fs.copy(
      this.templatePath('views/**/*'),
      this.destinationPath('views/')
    );
  }

  installing() {
    this.npmInstall();
  }
};
