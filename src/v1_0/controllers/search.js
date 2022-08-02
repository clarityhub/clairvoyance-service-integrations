const { ok, error } = require('service-claire/helpers/responses');
const logger = require('service-claire/helpers/logger');

const {
  Integration,
} = require('../../models');

const search = async (req, res) => {
  const { query } = req.body;

  try {
    const q = query.replace(/[^\w\s]+/g, '')
      .split(' ')
      .filter(Boolean)
      .map(s => `${s}:*`)
      .join(' & ');
    const result = await Integration.sequelize.query(`
SELECT
  document."id",
  ts_rank_cd(query, search) AS rank
FROM
  (
    SELECT
      "id",
      "name" || ' ' || "shortDescription"
    FROM "Integrations"
    WHERE
      "status" = 'public' AND
      (
        "deletedAt" IS NULL OR
        "deletedAt" > now()
      )
  ) AS document,
  to_tsvector(document."?column?") AS query,
  to_tsquery(:q) AS search
WHERE
  query @@ search
ORDER BY rank DESC
LIMIT 10;
    `, {
        type: Integration.sequelize.QueryTypes.SELECT,
        replacements: {
          q,
        },
      });

    if (result && result.length > 0) {
      const integrations = await Integration.findAll({
        where: {
          id: {
            $in: result.map(r => r.id),
          },
        },
        attributes: Integration.cleanPublicAttributes,
      });

      ok(res)({ integrations });
    } else {
      ok(res)({ integrations: [] });
    }
  } catch (err) {
    logger.error(err);
    error(res)(err);
  }
};

module.exports = {
  search,
};

// XXX create an index on title and shortDescription as a disctionary
