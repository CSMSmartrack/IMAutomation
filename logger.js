const winston = require("winston");
//const { createLogger, format, transports } = require('winston');
//const { combine, timestamp, label, printf } = winston.format;
require("winston-daily-rotate-file");

const path = require("path");
//var pjson = require('./package.json');
const PROJECT_ROOT = path.join(__dirname, "..");

const logFormat = winston.format.combine(
  //winston.format.label({ label: "smartrack" }),
  winston.format.timestamp({
    format: "HH:mm:ss DD-MM-YYYY",
  }),
  winston.format.prettyPrint(),
  winston.format.colorize(),
  winston.format.align(),
  winston.format.printf((info) => {
    return `${info.timestamp} [${info.level}]: ${info.message}`;
  })
);

// Custom format for logger
const myformat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => `${info.timestamp} | ${info.level} | ${info.message}`)
);

// Console Transport
const consoleLogger = new winston.transports.Console({
  format: logFormat,
  level: process.env.LOG_LEVEL || "info",
  colorize: true,
});

// File Transport
const fileLogger = new winston.transports.DailyRotateFile({
  format: logFormat,
  level: process.env.LOG_LEVEL || "info",
  filename: `${process.env.LOG_DIR}/IMAutomation-%DATE%.log`,
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "5m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  transports: [consoleLogger, fileLogger],
});

module.exports.info = function () {
  logger.info.apply(logger, formatLogArguments(arguments));
};
module.exports.log = function () {
  logger.log.apply(logger, formatLogArguments(arguments));
};
module.exports.warn = function () {
  logger.warn.apply(logger, formatLogArguments(arguments));
};
module.exports.debug = function () {
  logger.debug.apply(logger, formatLogArguments(arguments));
};
module.exports.verbose = function () {
  logger.verbose.apply(logger, formatLogArguments(arguments));
};

module.exports.error = function () {
  logger.error.apply(logger, formatLogArguments(arguments));
};

function formatLogArguments(args) {
  args = Array.prototype.slice.call(args);
  const stackInfo = getStackInfo(1);

  if (stackInfo) {
    const calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`;
    if (typeof args[0] === "string") {
      args[0] = args[0] + " " + calleeStr;
    } else {
      args.unshift(calleeStr);
    }
  }
  return args;
}

function getStackInfo(stackIndex) {
  const stacklist = new Error().stack.split("\n").slice(3);
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  const s = stacklist[stackIndex] || stacklist[0];
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join("\n"),
    };
  }
}

logger.exitOnError = false;
