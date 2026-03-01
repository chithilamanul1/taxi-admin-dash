try {
    const mongoose = require('mongoose');
    console.log('mongoose loaded');
    process.exit(0);
} catch (e) {
    console.error('FAILED TO LOAD MONGOOSE:', e.stack);
    process.exit(1);
}
