import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = {
    brand: [154, 107, 0],    // #9A6B00 — Airport Taxis dark gold
    accent: [180, 130, 10],  // #B4820A — lighter gold for highlights
    amber: [245, 158, 11],   // #f59e0b
    slate: [71, 85, 105],    // #475569
    black: [15, 23, 42]      // #0f172a
};

export const generateBookingPDF = (booking) => {
    const doc = new jsPDF();
    const isCash = booking.paymentMethod === 'cash';
    const accentColor = COLORS.brand;

    // -- Helper: Add Text Logo Only --
    doc.setFontSize(22);
    doc.setTextColor(...COLORS.brand);
    doc.setFont(undefined, 'bold');
    doc.text("AIRPORT TAXIS", 15, 20);
    doc.setFontSize(8);
    doc.text("PVT (LTD)", 15, 25);

    // -- Header Details (Top Right) --
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'bold');
    doc.text(isCash ? "CASH RECEIPT" : "TAX INVOICE", 195, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate);
    doc.setFont(undefined, 'normal');
    doc.text(`Ref: #${booking._id.slice(-8).toUpperCase()}`, 195, 28, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 195, 33, { align: "right" });

    // -- Letterhead / Business Info --
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'bold');
    doc.text("Airport Taxis Pvt (Ltd)", 15, 38);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...COLORS.slate);
    doc.setFontSize(8);
    doc.text("118/5 St. Joseph Street, Grandpass, Colombo 14", 15, 43);
    doc.text("Hotline: +94 722 885 885 | 0719 885 885 | 0712 100 500", 15, 48);
    doc.text("Email: info@srilankantaxi.lk | Web: www.srilankantaxi.lk", 15, 53);

    // -- Accent Line --
    doc.setDrawColor(...COLORS.brand);
    doc.setLineWidth(1);
    doc.line(15, 62, 195, 62);

    // -- Recipient Section --
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.brand);
    doc.setFont(undefined, 'bold');
    doc.text("BILL TO:", 15, 72);

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(13);
    doc.text(booking.customerName || 'Valued Guest', 15, 79);

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate);
    doc.setFont(undefined, 'normal');
    doc.text(`Phone: ${booking.guestPhone || 'N/A'}`, 15, 85);
    doc.text(`Email: ${booking.customerEmail || 'N/A'}`, 15, 90);

    if (booking.billingDetails?.billingAddress) {
        const addr = `${booking.billingDetails.billingAddress}, ${booking.billingDetails.city || ''}, ${booking.billingDetails.country || ''}`;
        doc.text(`Address: ${addr}`, 15, 95, { maxWidth: 100 });
    }

    // -- Trip Status Badge --
    const badgeX = 140;
    const badgeY = 72;
    doc.setFillColor(...(booking.paymentStatus === 'paid' ? COLORS.brand : [220, 38, 38]));
    doc.roundedRect(badgeX, badgeY, 55, 18, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text("PAYMENT STATUS", badgeX + 27.5, badgeY + 6, { align: 'center' });
    doc.setFontSize(10);
    doc.text(booking.paymentStatus?.toUpperCase() || 'PENDING', badgeX + 27.5, badgeY + 12, { align: 'center' });

    // -- Journey Table --
    const journeyBody = [
        ['Transfer Type', booking.tripType?.toUpperCase().replace('-', ' ') || 'Airport Transfer'],
        ['Pick-up', booking.pickupLocation?.address || 'N/A'],
        ['Drop-off', booking.dropoffLocation?.address || 'N/A'],
        ['Vehicle', booking.vehicleType?.toUpperCase() || 'Standard'],
        ['Passengers', `${booking.passengerCount?.adults || 1} ADL, ${booking.passengerCount?.children || 0} CHL`],
        ['Date / Time', `${booking.scheduledDate} at ${booking.scheduledTime}`],
    ];

    if (booking.flightNumber && booking.flightNumber !== 'N/A') {
        const fdate = booking.flightArrivalDate || booking.scheduledDate;
        const ftime = booking.flightArrivalTime || booking.scheduledTime;
        journeyBody.push(['Flight Details', `${booking.flightNumber} - Arrival: ${fdate} at ${ftime}`]);
    }

    autoTable(doc, {
        startY: 105,
        head: [['Description', 'Trip Information']],
        body: journeyBody,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: 4,
            font: 'helvetica',
            lineWidth: 0.2,
            lineColor: [0, 0, 0], // Darker lines
            textColor: [0, 0, 0]  // Darker text
        },
        headStyles: { fillColor: COLORS.brand, textColor: 255, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40, fillColor: [248, 250, 252] } },
    });

    // -- Totals Section --
    let currentY = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate);
    doc.setFont(undefined, 'normal');

    const labelX = 125;
    const valueX = 195;
    const currencyLabel = booking.currency || 'LKR';
    const isLKR = currencyLabel === 'LKR';

    // Amount to display - use displayPrice if not LKR
    const basePrice = (!isLKR && booking.displayPrice) ? booking.displayPrice : (booking.totalPrice || 0);
    const formatOptions = isLKR ? { minimumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 };

    // Subtotal (Before discounts)
    // Note: In this system, 'totalPrice' usually already includes discounts if coming from DB.
    // However, if we want to show a transparent breakdown, we need the original total.
    // Looking at the model, totalPrice is what we store.
    // Let's check how we can show discounts if they were applied.

    doc.text("Subtotal:", labelX, currentY);
    doc.text(`${currencyLabel} ${basePrice.toLocaleString(undefined, formatOptions)}`, valueX, currentY, { align: 'right' });
    currentY += 7;

    // List Applied Coupons/Discounts
    if (booking.appliedCoupons && booking.appliedCoupons.length > 0) {
        booking.appliedCoupons.forEach(coupon => {
            doc.setFontSize(9);
            doc.setTextColor(...COLORS.brand);
            doc.text(`Coupon (${coupon}):`, labelX, currentY);
            doc.text(`Applied`, valueX, currentY, { align: 'right' });
            currentY += 6;
        });
    }

    // Taxes & Fees
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate);
    doc.text("Taxes & Fees:", labelX, currentY);
    doc.text(`${currencyLabel} ${isLKR ? '0' : '0.00'}`, valueX, currentY, { align: 'right' });
    currentY += 3;

    doc.setDrawColor(230);
    doc.line(labelX, currentY + 2, valueX, currentY + 2);
    currentY += 10;

    doc.setFontSize(12);
    doc.setTextColor(...COLORS.black);
    doc.setFont(undefined, 'bold');
    doc.text("Total Amount:", labelX, currentY);
    doc.setTextColor(...COLORS.brand);
    doc.text(`${currencyLabel} ${basePrice.toLocaleString(undefined, formatOptions)}`, valueX, currentY, { align: 'right' });
    currentY += 10;

    // Partial Payment Breakdown
    if (booking.paymentType === 'partial') {
        doc.setFontSize(11);
        doc.setTextColor(...COLORS.black);
        doc.setFont(undefined, 'bold');
        doc.text("Amount Paid (50%):", labelX, currentY);
        doc.setTextColor(...COLORS.brand);
        const paidAmount = (!isLKR && booking.displayPaidAmount) ? booking.displayPaidAmount : (booking.paidAmount || 0);
        doc.text(`${currencyLabel} ${paidAmount.toLocaleString(undefined, formatOptions)}`, valueX, currentY, { align: 'right' });
        currentY += 7;

        doc.setTextColor(...COLORS.black);
        doc.text("Balance Due (to Driver):", labelX, currentY);
        doc.setTextColor(220, 38, 38); // Red color for balance
        const balanceAmount = (!isLKR && booking.displayBalanceAmount) ? booking.displayBalanceAmount : (booking.balanceAmount || 0);
        doc.text(`${currencyLabel} ${balanceAmount.toLocaleString(undefined, formatOptions)}`, valueX, currentY, { align: 'right' });
    }

    // -- Terms and Branding --
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.black); // Darker heading
    doc.setFont(undefined, 'bold');

    // Position Important Info relative to bottom to avoid overlap
    const infoY = 238;
    doc.text("Important Information:", 15, infoY);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    const terms = [
        "1. This is a legally valid computer-generated " + (isCash ? "receipt" : "invoice") + ".",
        "2. Highway ticket is not included. It must be paid at the counter.",
        "3. Rates are inclusive of fuel and driver fees unless stated otherwise.",
        "4. Waiting charges: Rs. 500 per hour (First 30 minutes free for Airport pickups).",
        "5. If paying by Cash or 50% Advance, the remaining balance must be paid in LKR to the driver.",
        "6. The balance amount shown is calculated and must be settled in Sri Lankan Rupees (LKR).",
        "7. Contact us immediately for any changes to your travel schedule."
    ];
    terms.forEach((line, i) => doc.text(line, 15, infoY + 6 + (i * 5)));

    // -- Footer --
    doc.setFillColor(...COLORS.brand);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("Thank you for traveling with Airport Taxis!", 105, 288, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text("24/7 Hotline: +94 722 885 885 | 0719 885 885 | 0712 100 500 | info@srilankantaxi.lk", 105, 292, { align: 'center' });

    // Save
    const fileName = `${isCash ? 'Receipt' : 'Invoice'}_${booking._id.slice(-8).toUpperCase()}.pdf`;
    doc.save(fileName);
};
