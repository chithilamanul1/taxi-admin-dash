const express = require('express');
const router = express.Router();
const { getPricing, updatePricing, initPricing } = require('../controllers/pricingController');
// const { protect, admin } = require('../middleware/authMiddleware'); // Middleware to be added

router.route('/').get(getPricing);
router.route('/:id').put(updatePricing); // Add protect/admin middleware here later
router.route('/init').post(initPricing);

module.exports = router;
