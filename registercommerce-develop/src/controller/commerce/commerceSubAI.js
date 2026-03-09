
const { response } = require('../../utils');
const {
  getAccountsAi,
  // getMposAi,
  // getEcommerceAi,
  // getCardsAi
} = require('../../utils/subAI');

const generalInfoRepository = require('../../repository/generalInfo');

const {
  executives: Executives,
  commerces: Commerces,
} = require('../../../models');


async function commerceSubAI(req, res, next) {
  try {
    const { idCommerce } = req.params;

    if (!idCommerce) {
      return next(response.errorMessage(500, 'Internal Server Error'));
    }

    const isTrue = v => v === '1' || v === 'true';

    const {
      stee,
      mpos,
      ecommerce,
      cards,
      idStee
    } = req.query;

    let responseBody = {};

    const query = {
      attributes: [
        'socialReason'
      ],
      include: [
        {
          model: Commerces,
          as: 'commerce',
          required: false,
          attributes: [
            'id'
          ],
          include: [
            {
              model: Executives,
              as: 'commerceDistributor',
              required: false,
              attributes: [
                'id',
                'name'
              ],
            },
            {
              model: Executives,
              as: 'commerceSubDistributor',
              required: false,
              attributes: [
                'id',
                'name'
              ],
            },
            {
              model: Executives,
              as: 'commerceExecutive',
              required: false,
              attributes: [
                'id',
                'name'
              ],
            },
            {
              model: Executives,
              as: 'commerceGroup',
              required: false,
              attributes: [
                'id',
                'name'
              ],
            }
          ]
        },
      ],
      where: {
        idCommerce
      }
    };


    const commerce = await generalInfoRepository.findOne(query);
    if (!commerce) {
      return next(response.errorMessage(404, 'Commerce not found'));
    }

    responseBody = {
      legalName: commerce.socialReason || '',
      distributor: {
        id: commerce.commerce.commerceDistributor ? commerce.commerce.commerceDistributor.id : 0,
        name: commerce.commerce.commerceDistributor ? commerce.commerce.commerceDistributor.name : ''
      },
      subDistributor: {
        id: commerce.commerce.commerceSubDistributor
          ? commerce.commerce.commerceSubDistributor.id : 0,
        name: commerce.commerce.commerceSubDistributor ? commerce.commerce.commerceSubDistributor.name : ''
      },
      executive: {
        id: commerce.commerce.commerceExecutive ? commerce.commerce.commerceExecutive.id : 0,
        name: commerce.commerce.commerceExecutive ? commerce.commerce.commerceExecutive.name : ''
      },
      group: {
        id: commerce.commerce.commerceGroup ? commerce.commerce.commerceGroup.id : 0,
        name: commerce.commerce.commerceGroup ? commerce.commerce.commerceGroup.name : ''
      }
    };

    if (isTrue(stee) && (idStee || idCommerce)) {
      responseBody.stee = await getAccountsAi({ idStee, idCommerce }, req.get('x-api-key'));
    }

    if (isTrue(mpos)) {
      // responseBody.mpos = await getMposAi(idCommerce);
      responseBody.mpos = {
        mposCount: 1
      };
    }

    if (isTrue(ecommerce)) {
      // responseBody.ecommerce = await getEcommerceAi(idCommerce);
      responseBody.ecommerce = {
        commerceCount: 1
      };
    }

    if (isTrue(cards)) {
      // responseBody.cards = await getCardsAi(idCommerce);
      responseBody.cards = {
        cardCount: 0
      };
    }

    return res.json(response.successData(responseBody));
  } catch (error) {
    console.log(error);
    return next(response.errorMessage(500, error));
  }
}

module.exports = {
  commerceSubAI
};
