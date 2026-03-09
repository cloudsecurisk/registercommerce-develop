/**
 * start
 * Allow us to start the server after everything is ready
 * and loaded
 * @param {object} application - Object that represents app
 */
function start(application, port = 3000) {
  application.listen(port, () => {
    console.log(`🚀 Server is running at port: ${port}`);
  });
}

module.exports = {
  start
};
