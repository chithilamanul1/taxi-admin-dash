import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = {
    emerald: [6, 78, 59], // #064e3b
    amber: [245, 158, 11], // #f59e0b
    slate: [71, 85, 105], // #475569
    black: [15, 23, 42]   // #0f172a
};

export const generateBookingPDF = (booking) => {
    const doc = new jsPDF();
    const isCash = booking.paymentMethod === 'cash';
    const accentColor = COLORS.emerald;

    // -- Helper: Add Logo --
    // We try to add the logo. If it fails (e.g. path issues in some environments), we fallback to text.
    try {
        doc.addImage('/invoice_logo.png', 'PNG', 15, 12, 35, 35);
    } catch (e) {
        doc.setFontSize(22);
        doc.setTextColor(...COLORS.emerald);
        doc.setFont(undefined, 'bold');
        doc.text("AIRPORT TAXIS", 15, 25);
        doc.setFontSize(8);
        doc.text("SRI LANKA (PVT) LTD", 15, 30);
    }

    // -- Header Details (Top Right) --
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'bold');
    doc.text(isCash ? "CASH RECEIPT" : "TAX INVOICE", 195, 25, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate);
    doc.setFont(undefined, 'normal');
    doc.text(`Ref: #${booking._id.slice(-8).toUpperCase()}`, 195, 32, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 195, 37, { align: "right" });

    // -- Letterhead / Business Info --
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'bold');
    doc.text("Airport Taxi Tours Sri Lanka", 60, 20);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...COLORS.slate);
    doc.text("118/5 St. Joseph Street, Grandpass, Colombo 14", 60, 25);
    doc.text("Hotline: +94 722 885 885 | +94 777 123 456", 60, 30);
    doc.text("Email: info@airporttaxis.lk | Web: www.airporttaxis.lk", 60, 35);

    // -- Accent Line --
    doc.setDrawColor(...COLORS.amber);
    doc.setLineWidth(1);
    doc.line(15, 52, 195, 52);

    // -- Recipient Section --
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.emerald);
    doc.setFont(undefined, 'bold');
    doc.text("BILL TO:", 15, 62);

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(13);
    doc.text(booking.customerName || 'Valued Guest', 15, 69);

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate);
    doc.setFont(undefined, 'normal');
    doc.text(`Phone: ${booking.guestPhone || 'N/A'}`, 15, 75);
    doc.text(`Email: ${booking.customerEmail || 'N/A'}`, 15, 80);

    // -- Trip Status Badge --
    const badgeX = 140;
    const badgeY = 62;
    doc.setFillColor(...(booking.paymentStatus === 'paid' ? COLORS.emerald : [220, 38, 38]));
    doc.roundedRect(badgeX, badgeY, 55, 18, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text("PAYMENT STATUS", badgeX + 27.5, badgeY + 6, { align: 'center' });
    doc.setFontSize(10);
    doc.text(booking.paymentStatus?.toUpperCase() || 'PENDING', badgeX + 27.5, badgeY + 12, { align: 'center' });

    // -- Journey Table --
    autoTable(doc, {
        startY: 90,
        head: [['Description', 'Trip Information']],
        body: [
            ['Transfer Type', booking.tripType?.toUpperCase().replace('-', ' ') || 'Airport Transfer'],
            ['Pick-up', booking.pickupLocation?.address || 'N/A'],
            ['Drop-off', booking.dropoffLocation?.address || 'N/A'],
            ['Vehicle', booking.vehicleType?.toUpperCase() || 'Standard'],
            ['Passengers', `${booking.passengerCount?.adults || 1} ADL, ${booking.passengerCount?.children || 0} CHL`],
            ['Date / Time', `${booking.scheduledDate} at ${booking.scheduledTime}`],
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 4, font: 'helvetica' },
        headStyles: { fillColor: COLORS.emerald, textColor: 255, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40, fillColor: [248, 250, 252] } },
    });

    // -- Totals Section --
    const finalY = doc.lastAutoTable.finalY + 15; // Increased spacing

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate);
    doc.setFont(undefined, 'normal');

    const labelX = 125; // Shifted further left
    const valueX = 195;

    // Use displayPrice/displayPaidAmount if available (already converted), otherwise fallback to totalPrice
    const displayTotal = booking.displayPrice || booking.totalPrice || 0;
    const currencyLabel = booking.currency || 'LKR';

    doc.text("Subtotal:", labelX, finalY);
    doc.text(`${currencyLabel} ${displayTotal.toLocaleString()}`, valueX, finalY, { align: 'right' });

    doc.text("Taxes & Fees:", labelX, finalY + 7);
    doc.text(`${currencyLabel} 0.00`, valueX, finalY + 7, { align: 'right' });

    doc.setDrawColor(230);
    doc.line(labelX, finalY + 10, valueX, finalY + 10);

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'bold');
    doc.text("Total Amount:", labelX, finalY + 18);
    doc.setTextColor(...COLORS.emerald);
    doc.text(`${currencyLabel} ${displayTotal.toLocaleString()}`, valueX, finalY + 18, { align: 'right' });

    // -- Terms and Branding --
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.slate);
    doc.setFont(undefined, 'bold');
    doc.text("Important Information:", 15, finalY + 40);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    const terms = [
        "1. This is a legally valid computer-generated " + (isCash ? "receipt" : "invoice") + ".",
        "2. Rates are inclusive of toll fees and fuel unless stated otherwise.",
        "3. Waiting charges: Rs. 500 per hour (First 30 minutes free for Airport pickups).",
        "4. Contact us immediately for any changes to your travel schedule."
    ];
    terms.forEach((line, i) => doc.text(line, 15, finalY + 46 + (i * 5)));

    // -- Footer --
    doc.setFillColor(...COLORS.emerald);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("Thank you for traveling with Airport Taxis!", 105, 288, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text("24/7 Hotline: +94 722 885 885 | info@airporttaxis.lk | www.airporttaxis.lk", 105, 292, { align: 'center' });

    // Save
    const fileName = `${isCash ? 'Receipt' : 'Invoice'}_${booking._id.slice(-8).toUpperCase()}.pdf`;
    doc.save(fileName);
};
