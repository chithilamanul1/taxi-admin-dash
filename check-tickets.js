import dbConnect from './src/lib/db.js';
import Ticket from './src/models/Ticket.js';
import SupportTicket from './src/models/SupportTicket.js';

async function checkTickets() {
    try {
        await dbConnect();
        const ticketCount = await Ticket.countDocuments();
        const supportTicketCount = await SupportTicket.countDocuments();
        console.log(`Ticket collection count: ${ticketCount}`);
        console.log(`SupportTicket collection count: ${supportTicketCount}`);

        if (ticketCount > 0) {
            const tickets = await Ticket.find().limit(5);
            console.log('Sample Tickets:', JSON.stringify(tickets, null, 2));
        }

        if (supportTicketCount > 0) {
            const supportTickets = await SupportTicket.find().limit(5);
            console.log('Sample SupportTickets:', JSON.stringify(supportTickets, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTickets();
