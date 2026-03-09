async function paginate(pagination, model, query = { where: {} }) {
  const itemsNumbers = 20;
  let offset = null;
  let paginationQuery = null;
  let page = null;
  let limit = null;

  if (pagination) {
    if (pagination.limit !== 'all') {
      ({ page, limit } = pagination);
      if (!page || !limit) {
        page = 1;
        limit = itemsNumbers;
      } else {
        if (page < 0) {
          page = 1;
        }
        if (limit < 0) {
          limit = itemsNumbers;
        }
      }
    }

    offset = (page - 1) * limit;

    paginationQuery = {
      offset,
      limit,
      subQuery: false
    };
  }

  return model.findAndCountAll({
    ...query,
    ...paginationQuery
  }).then((result) => {
    const count = result.count.length >= 0 ? result.count.length : result.count;
    return {
      pagination: {
        total: count,
        pages: limit ? Math.ceil(count / limit) : 0,
        page,
        count: result.rows.length
      },
      data: result.rows
    };
  });
}

module.exports = paginate;
