try {
    const dotenv = require('dotenv');
    console.log('dotenv loaded');
    const bcrypt = require('bcryptjs');
    console.log('bcryptjs loaded');
    process.exit(0);
} catch (e) {
    console.error('FAILED TO LOAD:', e.message);
    process.exit(1);
}
