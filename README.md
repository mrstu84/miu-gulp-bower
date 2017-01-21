# miu-gulp-bower

Gulp asset compiler to be used as a base for website development.  Uses a combination of Yarn and Bower to pull in assets ready to begin front end site builds.

Pre-packaged in the base repo are jQuery, Twitter Bootstrap and Font Awesome to simplify start-up.

## Installation

Node, Gulp, Bower and Yarn need to be installed and accessible globally.

### Node

To install Node, visit their [website](https://nodejs.org/en/download/) and follow the instructions provided for your operating system.

Once Node has been installed globally Gulp, Bower and Yarn can be installed with Node's package manager (npm) via the command line.

### Gulp, Bower and Yarn

The required Gulp, Bower and Yarn can be globally installed simultaneously by running the following command

	npm install -g gulp bower yarn

## Getting Started

### Yarn

A few commands are required to get your project up and running, here we will install the Gulp package dependencies outlined in the `packages.json` file using Yarn. Execute the following command in the root directory of your project, where the `packages.json` file can be located.

	yarn install
	
### Bower

Next up we require our Bower packages (jQuery, Bootrap and Font Awesome in our case). These will install into the `src/vendor`, this can be changed in the `.bowerrc` file. To install the Bower packages simply run the following in your command line.

	bower install
	
### Gulp

That will be all we need to do to get up and running with out frontend developement asset stack. To begin development and to start compiling our site assets (configured in the `gulpconfig.json` file) run the following via command line.

	gulp
	
Gulp will no be running on your system, this can be tested by saving one of your site assets underneath the `src`.

## Gulp Packages

_Information on Gulp packages to come_.
	
## Further Information

Issues have been encountered in the past with `node_modules` clogging up precious hard drive space, thankfully the developers at Facebook and have up with a neat solution with their Yarn dependency manager. If you are unfamililar with Yarn, head over to their [website](https://yarnpkg.com/) for the lowdown.