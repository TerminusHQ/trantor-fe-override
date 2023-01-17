const uploadForOSS = require("./upload");
const config = require("../oss.config.json");

const { program } = require("commander");

program.option("--path <char>");

program.option("--type <char>");

program.parse();

const options = program.opts();

uploadForOSS({
  ...config,
  path: options.path,
  uploadType: options.type,
});
