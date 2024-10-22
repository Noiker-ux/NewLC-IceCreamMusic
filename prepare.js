// @ts-check
const { cpSync } = require("fs");
const { join } = require("path");

cpSync(
  join(__dirname, ".next", "static"),
  join(__dirname, ".next", "standalone", ".next", "static"),
  {
    recursive: true,
    force: true,
  }
);

cpSync(
  join(__dirname, "public"),
  join(__dirname, ".next", "standalone", "public"),
  {
    recursive: true,
    force: true,
  }
);
