function timestamp() {
  return new Date().toISOString();
}

function format(level, message) {
  console.log(`[${timestamp()}] [${level}] ${message}`);
}

function info(message) {
  format('INFO', message);
}

function warn(message) {
  format('WARN', message);
}

function error(message) {
  format('ERROR', message);
}

function action(message) {
  format('ACTION', message);
}

function pageLogger(pageName) {
  const prefix = pageName ? `[${pageName}] ` : '';
  return {
    info: (message) => format('INFO', `${prefix}${message}`),
    warn: (message) => format('WARN', `${prefix}${message}`),
    error: (message) => format('ERROR', `${prefix}${message}`),
    action: (message) => format('ACTION', `${prefix}${message}`),
    print: (message) => format('INFO', `${prefix}${message}`),
  };
}

module.exports = {
  info,
  warn,
  error,
  action,
  pageLogger,
  print: info,
};
