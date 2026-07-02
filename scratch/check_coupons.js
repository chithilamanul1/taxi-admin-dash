import mongoose from 'mongoose';

const mongoURI = 'mongodb://chithila:chithila123@187.77.128.167:27017/admin?authSource=admin';

const couponSchema = new mongoose.Schema({
    code: String,
    applicableLocations: [String]
}, { strict: false });

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

async function run() {
    await mongoose.connect(mongoURI, { dbName: 'taxiadmindash' });
    const coupons = await Coupon.find({});
    console.log("Coupons:", JSON.stringify(coupons, null, 2));
    mongoose.disconnect();
}
run();
