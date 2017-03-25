'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stellar ' + chalk.red('grow') + ' generator!'
    ));

    this.log('Unfortunately, we don\'t have the grow generator created yet.');

    const prompts = [];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    // Nothing yet...
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {
    //this.installDependencies();
  }
};
