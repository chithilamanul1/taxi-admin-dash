import { generateBookingPDF } from './pdfGenerator';

export const downloadInvoice = async (booking) => {
    generateBookingPDF(booking);
};
