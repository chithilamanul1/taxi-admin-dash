'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

const TripAdvisorWidget = () => {
    return (
        <div className="bg-white dark:bg-slate-900 py-12 border-t border-emerald-900/5 dark:border-white/5">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-white mb-8">
                    Review us on <span className="text-emerald-600">TripAdvisor</span>
                </h3>

                <div className="flex justify-center">
                    <div id="TA_cdswritereviewlgvi787" className="TA_cdswritereviewlgvi bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 inline-block pointer-events-auto">
                        <ul id="TgCeoS2Sy" className="TA_links i6RNgRTom1">
                            <li id="gaBhIl" className="N1yatnsRG72">
                                <a target="_blank" href="https://www.tripadvisor.com/">
                                    <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="TripAdvisor" className="h-8 mx-auto" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <Script
                    src="https://www.jscache.com/wejs?wtype=cdswritereviewlgvi&amp;uniq=787&amp;locationId=33986804&amp;lang=en_US&amp;lang=en_US&amp;display_version=2"
                    strategy="lazyOnload"
                    onLoad={() => {
                        console.log('TripAdvisor Widget Loaded');
                    }}
                />
            </div>
        </div>
    );
};

export default TripAdvisorWidget;
