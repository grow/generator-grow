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

  initializing() {
    this.props = {};

    var optionKeys = [
      'description', 'authorName', 'authorEmail', 'authorUrl', 'homepage'];
    for (var i in optionKeys.length) {
      var key = optionKeys[i];
      if (this.options[key]) {
        this.props[key] = this.options[key];
      }
    }
  }

  prompting() {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const prompts = [{
      name: 'description',
      message: 'Description',
      when: !this.props.description
    }, {
      name: 'homepage',
      message: 'Project homepage url',
      when: !this.props.homepage
    }, {
      name: 'authorName',
      message: 'Author\'s Name',
      when: !this.props.authorName,
      default: this.user.git.name(),
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email',
      when: !this.props.authorEmail,
      default: this.user.git.email(),
      store: true
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage',
      when: !this.props.authorUrl,
      store: true
    }, {
      name: 'keywords',
      message: 'Package keywords (comma to split)',
      when: !pkg.keywords,
      filter(words) {
        return words.split(/\s*,\s*/g);
      }
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  writing() {
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    var pkg = extend({
      name: _.kebabCase(this.options.name),
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      keywords: ['grow'],
      devDependencies: {}
    }, currentPkg);

    // Combine the keywords
    if (this.props.keywords && this.props.keywords.length) {
      pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
    }

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
