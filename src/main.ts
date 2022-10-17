import xss from './xss.js';

// export

const helloWorld = (req, res) => {
  res.send('Hello World!');
};

module.exports = {
  xss,
};
