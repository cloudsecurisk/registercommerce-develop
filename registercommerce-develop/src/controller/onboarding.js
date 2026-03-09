const {
  findOne,
  findByPk,
  save,
  update
} = require('../repository/onboarding');
const { successData, errorMessage } = require('../utils/response');

async function onboarding(req, res) {
  const { idCommerce, idOnboarding } = req.body;

  const onboardingProcess = await findOne({
    where: {
      idUser: res.locals.user.id,
      ...((idCommerce === null || idCommerce === undefined) ? {} : { idCommerce }),
      ...((idOnboarding === null || idOnboarding === undefined) ? {} : { id: idOnboarding }),
    }
  });

  if (!onboardingProcess) {
    const newOnboarding = await save({
      idUser: res.locals.user.id
    });
    return res.status(201).json(successData(newOnboarding, 201));
  }

  return res.status(200).json(successData(onboardingProcess));
}

async function updateOnboarding(req, res, next) {
  const { idOnboarding } = req.params;
  const updateFields = req.body;

  try {
    const onboardingResult = await findByPk(idOnboarding);
    if (!onboardingResult) {
      return next(errorMessage(404, 'Onboarding no encontrado'));
    }

    const allowedFields = ['idCommerce', 'registrationProcess', 'commerceTypeSelected', 'readQuickGuide',
      'uploadedDocuments', 'docsHaveIncidents', 'fieldsCompleted', 'contractCompleted', 'steeCards', 'mposEcommerce', 'accountType'
    ];
    const attributes = Object.fromEntries(
      Object.entries(updateFields).filter(([key]) => allowedFields.includes(key))
    );
    const where = {
      id: onboardingResult.id
    };
    const updated = await update(attributes, where);
    return res.json(successData(updated[0]));
  } catch (error) {
    console.log(error);
    return next(errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  onboarding,
  updateOnboarding
};
