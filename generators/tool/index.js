'use strict';
const Generator = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const chalk = require('chalk');
const extend = require('deep-extend');
const parseAuthor = require('parse-author');
const path = require('path');
const yosay = require('yosay');
const _ = require('lodash');

const toolPrefix = 'grow-tool-';

function makeToolName(name) {
  name = _.kebabCase(name);
  name = name.indexOf(toolPrefix) === 0 ? name : toolPrefix + name;
  return name;
}

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: false,
      desc: 'Project name'
    });
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage
    };

    if (_.isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (_.isString(this.pkg.author)) {
      const info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  }

  _askForModuleName() {
    if (this.pkg.name || this.options.name) {
      this.props.name = this.pkg.name || _.kebabCase(this.options.name);
      return;
    }

    return askName({
      name: 'name',
      message: 'Module Name',
      default: makeToolName(path.basename(process.cwd())),
      filter: makeToolName,
      validate(str) {
        return str.length > toolPrefix.length;
      }
    }, this).then(answer => {
      this.props.name = answer.name;
    });
  }

  _askFor() {
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
      when: !this.pkg.keywords,
      filter(words) {
        return words.split(/\s*,\s*/g);
      }
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  prompting() {
    return this._askForModuleName()
      .then(this._askFor.bind(this));
  }

  writing() {
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    var pkg = extend({
      name: _.kebabCase(this.props.name),
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      keywords: ['grow-tool'],
      devDependencies: {}
    }, currentPkg);

    // Combine the keywords
    if (this.props.keywords && this.props.keywords.length) {
      pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
    }

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    const templateVars = extend({
      nameLong: _.startCase(this.props.name.substr(toolPrefix.length)),
      nameShort: this.props.name.substr(toolPrefix.length)
    }, pkg);

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      templateVars
    );

    this.fs.copyTpl(
      this.templatePath('tool.css'),
      this.destinationPath('tool.css'),
      templateVars
    );

    this.fs.copyTpl(
      this.templatePath('tool.js'),
      this.destinationPath('tool.js'),
      templateVars
    );
  }

  installing() {
    this.npmInstall();
  }
};
