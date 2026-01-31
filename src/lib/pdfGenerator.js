import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateBookingPDF = (booking) => {
    const doc = new jsPDF();

    // -- Header --
    // Logo (Simulated with text for now, ideally use doc.addImage)
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80); // Navy Blue
    doc.text("Airport Taxi Tours", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("118/5 St. Joseph Street, Grandpass, Colombo 14", 105, 26, { align: "center" });
    doc.text("Hotline: 0722 885 885 | Email: info@airporttaxi.lk", 105, 31, { align: "center" });

    // -- Title --
    doc.setDrawColor(200);
    doc.line(10, 38, 200, 38); // Horizontal Line

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("BOOKING RECEIPT", 14, 50);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Booking Ref: #${booking._id.slice(-6).toUpperCase()}`, 14, 56);
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 14, 61);

    // -- Customer Info --
    const customerData = [
        ['Customer Name', booking.customerName || 'Guest'],
        ['Email', booking.customerEmail || 'N/A'],
        ['Phone', booking.guestPhone || 'N/A'],
        ['Trip Type', booking.tripType === 'oneway' ? 'One Way' : 'Return'],
    ];

    doc.autoTable({
        startY: 68,
        head: [],
        body: customerData,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
    });

    // -- Journey Details --
    doc.text("Journey Details", 14, doc.lastAutoTable.finalY + 10);
    doc.setDrawColor(200);
    doc.line(14, doc.lastAutoTable.finalY + 12, 100, doc.lastAutoTable.finalY + 12);

    const journeyData = [
        ['Pickup Location', booking.pickupLocation.address],
        ['Dropoff Location', booking.dropoffLocation.address],
        ['Date & Time', `${booking.scheduledDate} at ${booking.scheduledTime}`],
        ['Vehicle Type', booking.vehicleType],
        ['Passengers', booking.passengers],
        ['Distance', `${booking.distance} km`],
    ];

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [],
        body: journeyData,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
    });

    // -- Pricing --
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount: Rs ${booking.totalPrice?.toLocaleString()}`, 14, finalY + 10);

    if (booking.paymentStatus === 'paid') {
        doc.setTextColor(0, 150, 0);
        doc.text("PAID IN FULL", 150, finalY + 10);
    } else {
        doc.setTextColor(200, 100, 0);
        doc.text("PAYMENT PENDING", 150, finalY + 10);
    }

    // -- Footer --
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for choosing Airport Taxi Tours!", 105, 280, { align: "center" });
    doc.text("This is a computer generated receipt.", 105, 285, { align: "center" });

    // Save
    doc.save(`Receipt_${booking._id.slice(-6)}.pdf`);
};
