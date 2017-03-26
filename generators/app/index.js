'use strict';
const _ = require('lodash');
const Generator = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const extend = _.merge;
const parseAuthor = require('parse-author');
const path = require('path');

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
      return Promise.resolve();
    }

    return askName({
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
      filter: _.kebabCase,
      validate(str) {
        return str.length > 0;
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
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  prompting() {
    return this._askForModuleName()
      .then(this._askFor.bind(this));
  }

  default() {
    this.composeWith(require.resolve('../base'), this.props);
  }

  installing() {
    this.npmInstall();
  }
};
