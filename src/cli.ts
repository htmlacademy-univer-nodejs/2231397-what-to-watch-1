#!/usr/bin/env node
import 'reflect-metadata';
import VersionCommand from './cli-command/version.command.js';
import HelpCommand from './cli-command/help.command.js';
import ImportCommand from './cli-command/import.command.js';
import CLIApplication from './app/cli-application.js';
import GenerateCommand from './cli-command/generate.command.js';

const application = new CLIApplication();
application.registerCommands([
  new HelpCommand, new VersionCommand, new ImportCommand, new GenerateCommand
]);
application.processCommand(process.argv);
