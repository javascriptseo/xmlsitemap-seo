import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const access = promisify(fs.access);

function appendPath(url, append) {
  // append directory or file path
  let newPath = path.resolve(
    new URL(url).pathname.substring(new URL(url).pathname.indexOf("/") + 1),
    append
  );
  return newPath;
}

async function createFile(options) {
  const { targetDirectory } = options;

  let policies;

  try {
    policies = require("../../../xmlsitemap.config");
  } catch (err) {
    const msg = "%s Your xmlsitemap.config.js file is not found!";
    console.error(msg, chalk.red.bold("ERROR:"));
    process.exit(1);
  }

  let urls = policies.policy.urls;
  let filepath = policies.fileDestination;

  if (targetDirectory) {
    // create file path from CLI
    filepath = appendPath(targetDirectory, "sitemap.xml");
  }

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }

  let siteXml = fs.createWriteStream(filepath, {
    flags: "a", // 'a' means appending (old data will be preserved)
  });

  siteXml.write('<?xml version="1.0" encoding="UTF-8"?>' + "\n");
  siteXml.write(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "\n"
  );
  urls.forEach((item, index) => {
    siteXml.write("<url>" + "\n");
    siteXml.write("<loc>" + item.url + "</loc>" + "\n");
    siteXml.write("<lastmod>" + item.lastMod + "</lastmod>" + "\n");
    siteXml.write("</url>" + "\n");
  });
  siteXml.write("</urlset>" + "\n");

  siteXml.end();

  return true;
}

export async function generateSitemapXML(options) {
  options = {
    ...options,
    targetDirectory: process.cwd(),
  };

  // current working directory
  const cwd = process.cwd();
  // target directory
  const targetDir = appendPath(cwd, options.path.toLowerCase());

  options.targetDirectory = targetDir;

  try {
    await access(targetDir, fs.constants.R_OK);
  } catch (err) {
    const msg = "%s Provided folder path is invalid!";
    console.error(msg, chalk.red.bold("ERROR:"));
    process.exit(1);
  }

  await createFile(options);

  console.log("%s Your sitemap.xml is ready!", chalk.green.bold("DONE:"));
  return true;
}
