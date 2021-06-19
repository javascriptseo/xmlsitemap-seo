import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--path": String,
      "--yes": Boolean,
      "--install": Boolean,
      "-p": "--path",
      "-y": "--yes",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    path: args["--path"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "javascript";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["javascript", "typescript"],
      defalt: defaultTemplate,
    });
  }

  if (!options.path) {
    questions.push({
      type: "input",
      name: "path",
      message: "Please enter directory path for sitemap.xml file",
      default: "./",
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    path: options.path || answers.path,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
