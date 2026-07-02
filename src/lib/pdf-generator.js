export const downloadInvoice = async (booking) => {
    try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF();
        
        doc.setFillColor(5, 150, 105);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('AIRPORT TAXIS PVT (LTD)', 20, 25);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Sri Lanka's Premium 24/7 Transport Service", 20, 32);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE / BOOKING CONFIRMATION', 20, 55);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 130, 55);
        doc.text(`Booking #: ${booking._id.slice(-6).toUpperCase()}`, 130, 60);
        
        doc.setFont('helvetica', 'bold');
        doc.text('CUSTOMER INFO:', 20, 75);
        doc.setFont('helvetica', 'normal');
        doc.text(booking.customerName || 'N/A', 20, 82);
        doc.text(booking.customerEmail || 'N/A', 20, 87);
        doc.text(booking.guestPhone || booking.phone || 'N/A', 20, 92);
        
        doc.setFont('helvetica', 'bold');
        doc.text('TRIP DETAILS:', 110, 75);
        doc.setFont('helvetica', 'normal');
        doc.text(`Pickup: ${booking.pickupLocation?.address?.substring(0, 40) || 'N/A'}`, 110, 82);
        doc.text(`Dropoff: ${booking.dropoffLocation?.address?.substring(0, 40) || 'N/A'}`, 110, 87);
        doc.text(`Date: ${booking.scheduledDate} ${booking.scheduledTime}`, 110, 92);
        
        autoTable(doc, {
            startY: 110,
            head: [['Description', 'Vehicle', 'Distance', 'Price']],
            body: [
                [booking.type === 'tour' ? 'Tour Package' : 'Airport Transfer / Taxi Ride', booking.vehicleType || 'N/A', booking.distanceKm ? `${booking.distanceKm} km` : '-', `LKR ${booking.totalPrice}`],
            ],
            headStyles: { fillColor: [5, 150, 105] },
            theme: 'striped'
        });
        
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL AMOUNT:', 140, finalY + 10);
        doc.setFontSize(16);
        doc.setTextColor(5, 150, 105);
        doc.text(`LKR ${booking.totalPrice}`, 140, finalY + 20);
        
        doc.save(`Invoice_${booking._id}.pdf`);
    } catch(e) {
        alert('Error generating PDF: ' + e.message);
    }
};
