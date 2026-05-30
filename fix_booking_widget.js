const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'BookingWidget.jsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('const [normalTours, setNormalTours] = useState([])')) {
    content = content.replace(
        /const \[destinations, setDestinations\] = useState\(\[\]\);/,
        `const [destinations, setDestinations] = useState([]);\n    const [airportTours, setAirportTours] = useState([]);\n    const [normalTours, setNormalTours] = useState([]);`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Added normalTours and airportTours state declarations to BookingWidget.jsx');
} else {
    console.log('State declarations already exist.');
}
