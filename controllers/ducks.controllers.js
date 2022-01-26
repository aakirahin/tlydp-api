const {
  selectDucks,
  selectFoundDucks,
  selectUnfoundDucks,
  selectDuckById,
  updateDuckById,
  insertDuck,
} = require("../models/ducks.models");
const { checkExists, typeChecker } = require("../utils");

exports.getDucks = async (req, res, next) => {
  try {
    const { maker_id } = req.query;

    if (maker_id) {
      isNaN(maker_id)
        ? await Promise.reject({ status: 400, msg: "Invalid Maker ID" })
        : await checkExists("users", "user_id", maker_id);
    }

    const ducks = await selectDucks(maker_id);

    res.status(200).send({ ducks });
  } catch (err) {
    next(err);
  }
};

exports.getFoundDucks = async (req, res, next) => {
  try {
    const { finder_id, maker_id } = req.query;

    if (maker_id || finder_id) {
      let query = maker_id ? maker_id : finder_id ? finder_id : null;

      isNaN(query)
        ? await Promise.reject({ status: 400, msg: "Invalid user ID" })
        : await checkExists("users", "user_id", query);
    }

    const ducks = await selectFoundDucks(finder_id, maker_id);

    res.status(200).send({ ducks });
  } catch (err) {
    next(err);
  }
};

exports.getUnfoundDucks = async (req, res, next) => {
  try {
    const ducks = await selectUnfoundDucks();

    res.status(200).send({ ducks });
  } catch (err) {
    next(err);
  }
};

exports.getDuckById = async (req, res, next) => {
  try {
    const { duck_id } = req.params;

    isNaN(duck_id)
      ? await Promise.reject({ status: 400, msg: "Invalid duck ID" })
      : await checkExists("ducks", "duck_id", duck_id);

    const duck = await selectDuckById(duck_id);

    res.status(200).send({ duck });
  } catch (err) {
    next(err);
  }
};

exports.patchDuckById = async (req, res, next) => {
  try {
    const { duck_id } = req.params;

    isNaN(duck_id)
      ? await Promise.reject({ status: 400, msg: "Invalid duck ID" })
      : await checkExists("ducks", "duck_id", duck_id);

    const {
      finder_id,
      location_found_lat,
      location_found_lng,
      image,
      comments,
    } = req.body;

    const numberTypes = [finder_id, location_found_lat, location_found_lng];
    const numberFields = [
      "finder_id",
      "location_found_lat",
      "location_found_lng",
    ];

    const stringTypes = [image, comments];
    const stringFields = ["image", "comments"];

    if (numberTypes.some((item) => isNaN(item))) {
      const field = typeChecker(numberTypes, numberFields, "number");

      await Promise.reject({ status: 400, msg: `${field} must be a number` });
    }

    if (stringTypes.some((item) => !isNaN(item))) {
      const field = typeChecker(stringTypes, stringFields, "string");

      await Promise.reject({ status: 400, msg: `${field} must be a string` });
    }

    const duck = await updateDuckById(duck_id, req.body);

    res.status(200).send({ duck });
  } catch (err) {
    next(err);
  }
};

exports.postDuck = async (req, res, next) => {
  const body = req.body;

  const duck = await insertDuck(body);

  res.status(201).send({ duck });
};
