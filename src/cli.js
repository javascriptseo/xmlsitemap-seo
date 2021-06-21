import arg from "arg";
import inquirer from "inquirer";
import { generateSitemapXML } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--path": String,
      "-p": "--path",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    path: args["--path"] || null,
  };
}

async function promptForMissingOptions(options) {
  const questions = [];

  if (!options.path) {
    questions.push({
      type: "input",
      name: "path",
      message: "Please enter directory path for sitemap.xml file",
      default: "public",
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    path: options.path || answers.path,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await generateSitemapXML(options);
}
