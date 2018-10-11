const express      = require('express');
const asyncHandler = require('express-async-handler');
const db           = require('../database');
const random       = require('../random');
const router       = express.Router();

/**
  Return new game random integer numbers
  Response example:
   {
     "status": 200,
     "data": {
       "cell1": 1,
       "cell2": 5,
       "cell3": 10,
       "cell4": 20,
       "cell5": 30,
       "cell6": 50,
       "cell7": 100,
       "cell8": 200,
       "cell9": 250
     }
   }
 */
router.get('/game', asyncHandler(async (req, res) => {
  const NumbersCount = 9; //Count of generating numbers
  const MinValue     = 1; //Minimum generating value, inclusive
  const MaxValue     = 9; //Maximum generating value, inclusive

  try {
    //get numbers from random.org
    const randomIntegers = await random.generateSignedIntegers(NumbersCount, MinValue, MaxValue);

    //transform integer array to response data format
    // {"cell1": 1, "cell2": 2, ...}
    const data = {};
    for (let i = 0; i < randomIntegers.numbers.length; i++) {
      data[`cell${i + 1}`] = randomIntegers.numbers[i];
    }

    await db.createGame(randomIntegers.numbers, randomIntegers.signature, randomIntegers.json);

    return res.json({
      status: 200,
      data
    });
  }
  catch (e) {
    console.error(e);
    return res.json({
      status:  500,
      'error': {
        'message': 'Непредвиденная ошибка на сервере! Попробуйте позже.'
      }
    });
  }
}));

/**
 * Return game history sorted by created at desc
 * Have query params
 * @param page {number} Page number
 * @param pageSize {number} Page size
 * @returns {object[]} Array of game objects from database
 */
router.get('/history', asyncHandler(async (req, res) => {
  const DefaultPage = 0;
  const DefaultPageSize = 50;

  const pageNumber = req.query.page ? parseInt(req.query.page) : DefaultPage;
  const pageSize   = req.query.pageSize ? parseInt(req.query.pageSize) : DefaultPageSize;

  let result;
  try {
    result = await db.readGames(pageNumber, pageSize);
  }
  catch (e) {
    return res.json({
      status:  500,
      'error': {
        'message': e.message
      }
    });
  }
  return res.json(result);
}));

module.exports = router;
