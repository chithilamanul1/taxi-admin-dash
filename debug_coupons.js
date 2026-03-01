import dbConnect from './src/lib/db.js';
import Coupon from './src/models/Coupon.js';

async function checkCoupons() {
    try {
        await dbConnect();
        const coupons = await Coupon.find({});
        console.log('Found coupons:', JSON.stringify(coupons, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCoupons();
