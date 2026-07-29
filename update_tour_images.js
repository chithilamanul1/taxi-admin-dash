require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function updateTours() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Define Tour schema locally for the script
        const tourSchema = new mongoose.Schema({
            title: String,
            image: String,
            heroImage: String,
            images: [String]
        }, { strict: false });

        const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours`);

        for (const tour of tours) {
            console.log(`Tour: ${tour.title}`);
            console.log(`  Current image: ${tour.image}`);
            console.log(`  Current heroImage: ${tour.heroImage}`);

            // Map of tour titles to local images
            const imageMap = {
                'Anuradhapura': '/images/tours/anuradhapura.jpg',
                'Kitulgala': '/images/tours/kitulgala.jpg',
                'Nuwara Eliya': '/images/tours/nuwara-eliya.jpg',
                'Sinharaja': '/images/tours/sinharaja.jpg',
                'Polonnaruwa': '/images/tours/polonnaruwa.jpg',
                'Ratnapura': '/images/tours/ratnapura.jpg',
                'Sigiriya': '/images/tours/sigiriya.jpg',
                'Kandy': '/images/tours/kandy.jpg',
                'Galle': '/images/tours/galle.jpg',
                'Yala': '/images/tours/yala.jpg',
                'Udawalawe': '/images/tours/udawalawe.jpg',
                'Mirissa': '/images/tours/mirissa.jpg',
                'Ella': '/images/tours/ella.jpg',
                'Dambulla': '/images/tours/dambulla.jpg',
                'Trincomalee': '/images/tours/trincomalee.jpg',
                'Arugam Bay': '/images/tours/arugam-bay.jpg',
                'Pinnawala': '/images/tours/pinnawala.jpg',
                'Horton Plains': '/images/tours/horton-plains.jpg',
                'Adam\\'s Peak': '/images/tours / adams - peak.jpg',
                'Colombo': '/images/tours/colombo.jpg',
                'Negombo': '/images/tours/negombo.jpg',
                'Bentota': '/images/tours/bentota.jpg',
                'Hikkaduwa': '/images/tours/hikkaduwa.jpg',
                'Unawatuna': '/images/tours/unawatuna.jpg',
                'Weligama': '/images/tours/weligama.jpg',
                'Tangalle': '/images/tours/tangalle.jpg',
                'Kataragama': '/images/tours/kataragama.jpg',
                'Jaffna': '/images/tours/jaffna.jpg',
                'Minneriya': '/images/tours/minneriya.jpg',
                'Wilpattu': '/images/tours/wilpattu.jpg',
                'Bundala': '/images/tours/bundala.jpg',
                'Kumana': '/images/tours/kumana.jpg',
                'Wasgamuwa': '/images/tours/wasgamuwa.jpg',
                'Gal Oya': '/images/tours/gal-oya.jpg',
                'Maduru Oya': '/images/tours/maduru-oya.jpg',
                'Somawathiya': '/images/tours/somawathiya.jpg',
                'Lahugala': '/images/tours/lahugala.jpg',
                'Lunugamvehera': '/images/tours/lunugamvehera.jpg',
                'Madu Ganga': '/images/tours/madu-ganga.jpg',
                'Muthurajawela': '/images/tours/muthurajawela.jpg',
                'Knuckles': '/images/tours/knuckles.jpg',
                'Pidurutalagala': '/images/tours/pidurutalagala.jpg',
                'Hakgala': '/images/tours/hakgala.jpg',
                'Peradeniya': '/images/tours/peradeniya.jpg',
                'Henarathgoda': '/images/tours/henarathgoda.jpg',
                'Seethawaka': '/images/tours/seethawaka.jpg',
                'Mirijjawila': '/images/tours/mirijjawila.jpg',
                'Dry Zone': '/images/tours/dry-zone.jpg',
                'Wet Zone': '/images/tours/wet-zone.jpg',
                'Intermediate Zone': '/images/tours/intermediate-zone.jpg',
            };

            let matchedImage = null;
            for (const [key, value] of Object.entries(imageMap)) {
                if (tour.title.toLowerCase().includes(key.toLowerCase())) {
                    matchedImage = value;
                    break;
                }
            }

            if (matchedImage) {
                console.log(`  => Updating to: ${matchedImage}`);
                tour.image = matchedImage;
                tour.heroImage = matchedImage;
                tour.images = [matchedImage];
                await tour.save();
            } else {
                console.log(`  => No match found, using placeholder`);
                tour.image = '/images/tours/placeholder.jpg';
                tour.heroImage = '/images/tours/placeholder.jpg';
                tour.images = ['/images/tours/placeholder.jpg'];
                await tour.save();
            }
        }

        console.log('Done updating tours');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateTours();
