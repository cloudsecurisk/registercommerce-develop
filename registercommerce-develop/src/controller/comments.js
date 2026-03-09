const commentsRepository = require('../repository/comments');
const response = require('../utils/response');

function createComment(req, res, next) {
  const { idCommerce, comment } = req.body;
  const idUser = res.locals.user;

  return commentsRepository.save({
    idCommerce,
    idUser,
    comment
  }).then(() => {
    res.status(201).json(response.successMessage('Comentario guardado'));
  }).catch((error) => {
    console.log(error);
    next(response.errorMessage(500, 'Internal Server Error'));
  });
}

module.exports = {
  createComment
};
