import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

const reviews = [
    { name: "Hashini Wickramatunga", text: "I am thankful for this taxi service. I booked a ride for my parents from the airport to Ratnapura. They communicated with me about three times very actively and arranged it for me. Additionally, I appreciate them taking my parents home safe." },
    { name: "Nazik Mohamed", text: "I book this airport taxi tours service.from airport to Kurunegala.safe and well organized.the driver was very friendly.they sent driver details and car photos in advance.the service was very neat I like there service.And the price was very lower then others cab services.I’m 100% happy for there service.In future also keep it up….." },
    { name: "Maduranga Deshapriya", text: "I took a taxi from Airport Taxis Pvt Ltd on 5th November, and I’m really happy with their service. The price was very reasonable, and the driver was polite, friendly, and helpful throughout the journey. Excellent service overall." },
    { name: "Dulinda Ananda", text: "Best service with safe and secure. Highly recommend this taxi service to make your journey easier. Recommend and appreciate your service 👍" },
    { name: "Thiwanka Nuwan", text: "Highly recommend service for airport pick up and drop off. They are providing customer friendly and safety service for the passengers with a reasonable cost." },
    { name: "Dinesh Krishnabalan", text: "It's very good service onetime pickup and drop It's fabulous Airport taxi service. and taxi driver safely ,friendly so I recommend to everyone try this service price also reasonable" },
    { name: "Nissanka Dissanayake", text: "This Airport Taxi service is highly recommended as truly worthy for the money the service they offer. Mr Chamara runs this service with his team of friendly drivers. They are reliable, easy to contact even at late night and punctual on time. Thanks for the excellent service." },
    { name: "Shamila Moomin", text: "Very polite, and understanding and co-operative service provided by Mr. Kajuwatte. He is trustable and I recommend him 100% to anyone." },
    { name: "uresh silva", text: "Excellent service and fair price . On time pick up and safe drive. Highly recommend. If you need a taxi from airport to your home safe drive. This is the only place that you can get ." },
    { name: "Nuwan Thushara", text: "The driver you work with is very good. He is very friendly, polite, and drives legally. I really appreciate your service." },
    { name: "Priyantha Gunawardena", text: "This is a one of a best service I have ever experienced in Sri Lanka, these young guys are very efficient and punctual. They shows up in the Katunayake air port even before the expected time. Really recommend them . Thank you guys." },
    { name: "Sandun Samarasinghe", text: "I used their service yesterday and it was good. Driver name was Kasun sandamal is supportive role and make comfortable my ride. Next time also will call them. And of course wanna mention here about price and it’s fair. Driver he knows how to drive safely . Good job🙌👍" },
    { name: "Iroshan Lakmal", text: "Very good service and safe drive. If you need a driver,this is the guy. Highly recommended!" },
    { name: "Praween Rupasinghe", text: "I had a best experience with Airport Taxi crew with in last few days. They provided us better service with reasonable rates. And also drivers are so friendly and vehicles also super clean. Im highly recommend their service to everyone who looking for the safe journey." },
    { name: "Ravindu Menaka", text: "Great service and very good driving skills. Mr. Kajuwaththa was the best driver in cab service.Highly recommended. Thank you for your service. Looking forward to travel with you again!." },
    { name: "pubudu Chathuranga", text: "Very professional service was offered by company and driver from the beginning of process. And worthy of money we paid the for the cab service. Driver is very friendly,committed and trustworthy guy." },
    { name: "prasad MS", text: "While looking for a cab to go from Kurunegala to the airport at a reasonable price, I found this on Facebook. And it was a public holiday in Sri Lanka, like April 14. But the cab was in front of the house even before the scheduled time. It is a really valuable service. Highly recommended." },
    { name: "Thusitha Athapaththu Mudiyanselage", text: "1st time used Airport Taxi when I came to SL this time. Impressive service for a very reasonable price. It was easy to book online and the efficient customer service through Whatsapp was amazing." },
    { name: "Laurent D.", text: "Great service ! Cheap prices, booking in advance, great drivers / cars and a full customer service directly in WhatsApp for any questions or to make any arrangements. Thank you for making our trip in Sri Lanka much easier to organize !" },
    { name: "Niranjan Jonam", text: "Excellent service with well-maintained vehicles at reasonable rates. The booking process was smooth, and the staff was professional and helpful. Highly recommend for a hassle-free rental experience!" },
    { name: "Momina Mazhar", text: "We got lucky and had Lal pick us up from the airport through the PickMe app and it turned out to be the best thing that happened to us on our trip. Lal recommended so many great little hidden gems like waterfalls, food spots, stands" },
    { name: "AnuXO vlogs", text: "Thank you for safe ride. Yohan Avishaka Provided a very safe and comfortable journey..🥰🙏🫰🫡" },
    { name: "Mohd Liznam", text: "Highly recommended Safe Driving and on time as per my pickup time. Best price in srilanka" },
    { name: "MUNAJ SHAAZ", text: "I regularly used Easy Cab for my airport transfers, and I was quite satisfied with their service. The booking process was straightforward, and the driver arrived on time. The vehicle was clean and comfortable, making the journey pleasant. I would definitely recommend Easy Cab for reliable and efficient taxi service.👍" },
    { name: "Buddhika Vidarshana", text: "I’ve been using this taxi service regularly, and the drivers are always punctual, friendly, and professional. The vehicles are clean and well-maintained, making every ride comfortable. I appreciate the reliable service and competitive rates. Highly recommend for anyone in need of a dependable taxi option!" },
    { name: "Harintha krishan", text: "Friendly driving service super service.. mr.p. kajuwatta exllent service" },
    { name: "It's Afshan", text: "One of the most reliable taxi companies in Sri Lanka, very affordable travel experience, Special thanks to the driver “ pabasara kajuwatta “ 🙂" },
    { name: "Asith Lanaroll", text: "Good service and safety better price 👍" },
    { name: "Shakila Prabath", text: "Overall, a fantastic service from start to finish. I’ll definitely be using them again and would highly recommend them to anyone looking for a reliable cab service." },
    { name: "Dilip Kumara", text: "Really good experience, value of money 💰 wroth it , thank you Dear kajuwatta ..🙏" },
    { name: "Thilina Malshan", text: "Very friendly service. Had a great support and coordinated very well. Vehicle is clean and tidy. Arrived on time and had a safe journey." },
    { name: "Achala kanishka", text: "Highly recommend.🩷 Good and friendly service" },
    { name: "Viran Jose Peter", text: "Really good service. Special shout out to Kasun who is a really good driver, and very friendly. He drives super safe. Definitely using their service again." },
    { name: "t.c.b thennakoon", text: "Good vehicle/best driver and best respected to the customer" },
    { name: "Kavindu Shaveen", text: "Good service.. Highly recommend. Verry frendly drive.. Good job." },
    { name: "Preshantha Moodley", text: "Lal has really been amazing, he is so pleasant and is an excellent tour guide. I would definitely recommend your team's services. Thank you Lal for making our Sri Lanka experience memorable." },
    { name: "VANDE", text: "Highly recommend මම ආවෙත් මේ cab service එකේ ඒ වගේම අද යන්නෙත් මේ ගොල්ලොගෙම service එකේ driver ISURU වෙලාවට Pick කරා හොද service එකක්" },
    { name: "Sam Weerasinghe", text: "Excellent Service. Great & reliable vehicles and drivers. I have been using the service for few years and never failed. Highly recommend." },
    { name: "Naveen Saminathan", text: "Great Service, Always on time" },
    { name: "Whatsapp Status", text: "A superb service for a trustworthy journey. ❤️😊" },
    { name: "Janaka Wimalachandra", text: "Airport Taxi Tours have provided very good cars and excellent drivers for my trips out of Colombo. The cars are sent on time, the interior is very clean, and the driving is very good. The drivers are polite, pleasant men who do their job with great responsibility.. We wish you well" },
    { name: "Malith Hasanga", text: "The service of this company is very high and very convenient. I chose this company to come to Sri Lanka and to leave Sri Lanka. I can responsibly guarantee that their service is very high." },
    { name: "Gamini Amal Francis Amarasekera", text: "I wish to say that the service and the charges were affordable and the best we have experienced. Also the management was very flexible and they helped us on the tour. We recommend Easy Cab and Tours to all. Thank you" },
    { name: "muhammed mhd", text: "For sure this is one of the best service if you are looking for any trips from or to airport." },
    { name: "Chaminda Dinusha", text: "හොදම එයාර් පෝර්ට් ටැක්සී සේවයක් මන් දැනට 6 වතාවක් ගිහින් තියෙනවා මේ ගත වුන මාස තුනට එන්න කිව්ව වෙලාවටත් කලින්ම එයාර් පෝර්ට් එකට ඇවිත් ඒ වගේම වෙලාවටත් කලින්ම ගෙදරින් අපිව එක්කන් යනවා .හොද රියදුරන් හරිම සුහදශීලි රියදුරන්." },
    { name: "Achala Gallage", text: "Highly recommended to use the service. Easy to book, very friendly staff and very very reasonable prices. I’m impressed with the services" },
    { name: "Ibrahim Nawasdeen", text: "Very Very nice service and professional driver's with Airport Taxi Tours all ways my chosen well done keep it up" },
    { name: "Irantha Munasinghe", text: "Excellent service. Highly recommended. Mr. Chamara is a genuinely helpful person with open minded for any requirement to make our journey memorable." },
    { name: "nirmal raj", text: "Hi IAM nirmal. I was introduced to this cab services by my friend.owner chamara. IAM going to this cabs service for 5 years continuously. They provide the highest quantity service.all vehicle from him are very comfortable and clean" },
    { name: "Roshan Ghazalieh", text: "Very professional and Kind. I couldn't ask for a better driver. Thank you Mr. Prabasara." },
    { name: "Jeewanthi Gathbalage", text: "Highly recommended.good job!! Thank you" },
    { name: "SPG Guru", text: "I have been using this service for couple of years. They are doing good job and providing an excellent service. The drivers and the vehicles are very good." },
    { name: "Daphne Manamperi", text: "Prompt service, very helpful drivers and they come on time. Overall very good service. I can recommend them 100%👍" },
    { name: "Nishanka Sonali", text: "The best cab service ever we found.They are not only providing transportation..They are helping the passenger to feel at ease with them all along the journey.I wish you guys all the very best and long way to go.Keep the best service everyday and you will be shine like a star in one day.Cheers 🥂🥂🥂" },
    { name: "ravin ratnavira", text: "First experience with them. Excellent taxi service, vehicle was in very good condition, driver was very helpful and pleasant. Highly recommended." },
    { name: "madushanka priyadarshana", text: "✈️Would Recommend Taxi Service!!✈️ AirportTaxiTours.com Great Taxi Company! Used them for 5 trips my travel in katunayake airport.i have nothing negative to say. Good coordination💯, Quick resposes💯," },
    { name: "Avishka probodh", text: "We booding caab with mr. Kalibovila time 100% he pikup and safty 100% ots a better service if you meed travel with tham you will get good service with good price" },
    { name: "younus khan", text: "Im many years in Middle east first time i order air port cab communication so accurate and when i got down my taxi is ready, safe journey" },
    { name: "Hanne", text: "Driver was perfectly on time, drove carefully and even made time for a coffee-stop. We paid what was shown on the website. Hasslefree ride and service!" },
    { name: "lasitha rasanjana", text: "Very quick service service with very experienced & courteous drivers . I highly appreciate the service provided to me by your organization" },
    { name: "anura karunarathna", text: "Excellent customer service and a friendly corporate environment that meet all of our requirements without hesitation." },
    { name: "Mohammed Azman Azman", text: "Isuru Best Driver Best Service Reach On time Trustful Friendly Driver Very Reasonable Price Experience Driver" },
    { name: "Rumana Rusdhi", text: "Great service…Friendly communication, Always on time and reasonably priced… highly satisfied…" },
    { name: "madushanka Mannage Don", text: "I am very glad to say.Airport Taxi Tours is the best transportation as well as safely and highly recommended especially thanks Mr Tharindu." },
    { name: "Aritha Wickramasinghe", text: "Excellent and friendly service. Can get a taxi or cab anywhere in the country to go anywhere. Prompt response too. Best for long distance trips or tours." },
    { name: "Political View", text: "Recommended.Really guys your service Are very superb…Timing🔝 Driver really Awesome 💯 (" },
    { name: "Nipuni Peiris", text: "Best sservice .... best driver...Someone who believes so much is a good driver Thank you very much" },
    { name: "Ashitha Ashitha", text: "I really appreciate your taxi service and help...specially help me to deliver 55 inches TV to my home without any damage.They are the best in delivering any electronic household items islandwide.I highly recommend Airport Taxi Tours taxiservice." },
    { name: "Raveen Ajantha", text: "I am taking a taxi from them for the third time, and I’m happy to say that each time I have received satisfactory service, and everything has been well-coordinated." },
    { name: "Numesh Jayarathne", text: "One of great customer service happy with drivers attitude and driving skills also good clean vehicle," },
    { name: "Sajith Thennakoon", text: "Used this taxi service three times, and it’s been excellent every time. Punctual, professional, and reliable. Highly recommend!" },
    { name: "Niroshan Ekanayake", text: "සුපිරිම සර්විස් එකක්, හතේ සැකයක් නැතිව යන්න පුළුවන් , ඒ වගේම ඩයිවර්ස්ලා නිහතමානි, අවංක, මනුෂ්යත්වයපිරි අය, සාධාරණව,ලෙඩ නැති මග නතරනොවි කොට කොට යන්නේ නැ. අලුත්ම වාහනයකින් ඉක්මනින් ගෙදර යන්න කියාපු තැන." },
    { name: "Umesh Imalsha", text: "Its was a really comfortable ride with Mr.Chamara and he also very friendly im recommend for all this guy he is superb." },
    { name: "Dilip Prasanna", text: "Good service and timing ,caring I informed before 3 hours they gave me a good vehicle and a good service ❤❤❤❤❤" },
    { name: "Chathura Madusanka", text: "ඔයාලට airport එකේ ඉදලා ගෙදර යන්න Taxi එකක් book කර ගන්න ඔින නමි මං recommend කරනවා airporttaxitours.com taxi service එක විශ්වාසයෙන් යුතුව තෝර ගන්න කියලා මොකද ්එයාලගේ service එක super.ඒ වගේම එයාලගේ රියදුරැ මහත්තුරුත් හරි ම හොදයි.අනිත් විශේම දේ එයාලගේ charge එක හරිම සාධාරනයි.thanku Airport Taxi Tours...❤❤❤❤❤❤" },
    { name: "Jee Tee", text: "The service is reliable and punctual. I often use it for airport pickups and drops, also it offers great value for money." },
    { name: "Chandana wijayathilake", text: "Really Valuable service Very helpful team I am really happy their service Keep it up" },
    { name: "kasun sandamal", text: "Really nice driver, safe driving, calm atmosphere. Really nice trip from the airport to polonnaruwa!!! ❤️ Good Colombo airport taxi service .." },
    { name: "Buddhika kularathna", text: "We completed the first trip with Airport Taxi Tours. From Airport to Kottawa. They offered an excellent service. I recommend for others. 👏" },
    { name: "Sanduni De Silva", text: "The best cab service we found from srilanka, affordable price , friendly manner full staff , we recommend this cab service for everyone, very safe driving.10/10" },
    { name: "Olena G", text: "Amazing experience, affordable transfer, safe, on time, nice drivers. Went with them for a 3 hour drive trip and also stopped at Galle and driver waited for me. Recommended!" },
    { name: "kathriana m", text: "On-time airport transfer in Sri Lanka. Clean, comfortable car and smooth, stress-free ride. Easy to book. Reasonable price" },
    { name: "Maxi Zaumseil", text: "Highly recommend this taxi service, not just for a pick up from the airport. I did all my rides around the island - in total six - with them and it was perfect. Punctual, kind and safe drivers. And also for a very good price!" },
    { name: "Jürgen H", text: "I can only recommend this company! Always the best prices and communication perfect. The drivers all speak English, the vehicles always on time! 3x booked, 3x TOP!" },
    { name: "Ishara U", text: "Superb experience. And the best price for anyone. No any hidden fee. Excellent drivers and great vehicle. Highly recommended 🫡" },
    { name: "Lana I", text: "Used the service extensively throughout my 10 days in Sri Lanka. Numerous trips around the island, always on time and easy to book online. You have the option of paying online in advance via link or in cash to the driver. Excellent service, will be using next time for sure." },
    { name: "Jason B", text: "I've traveled with them multiple times to and from the airport and they have never disappointed. Absolute professionals, and punctual. I always recommend them to family and friends traveling from or to CMB, great service as always." },
    { name: "Manjula J", text: "In time and very reliable. Always use their service for my traveling. Excellent." },
    { name: "Neeta Godambe", text: "I think this company was a surprise find. The rates are best as they are based as the Km .The service is prompt ,with regular information and communication via wapp . I availed the service twice and I found it the most Hassel free . I was picked up from a bus station to airport." },
    { name: "RAUL P", text: "Best prices, good cars , prompt response , would recommend to anyone looking for taxi service in Sri Lanka." }
];

export async function GET() {
    try {
        await dbConnect();

        let count = 0;
        for (const review of reviews) {
            // Check if exists to avoid duplicates
            const exists = await Review.findOne({
                userName: review.name,
                comment: review.text.substring(0, 500)
            });

            if (!exists) {
                await Review.create({
                    userName: review.name,
                    userEmail: 'google@review.com', // placeholder
                    rating: 5,
                    comment: review.text.substring(0, 500),
                    source: 'google',
                    isApproved: true,
                    showOnHomepage: true,
                    isVerified: true
                });
                count++;
            }
        }

        return NextResponse.json({ success: true, message: `Seeded ${count} new reviews` });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
