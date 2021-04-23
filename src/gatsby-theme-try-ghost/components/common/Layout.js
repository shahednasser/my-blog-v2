import React, { useEffect } from 'react'
import Layout from 'gatsby-theme-try-ghost/src/components/common/Layout'

function NewLayout (props) {
    useEffect(() => {
        const d = document

        function showAds () {
            const s = d.createElement('script'),
              previous = d.getElementById('carbonads');

            if (previous) {
                d.body.removeChild(previous)
            }

            s.src = 'https://cdn.carbonads.com/carbon.js?serve=CEBIL27J&placement=blogshahednassercom';
            s.id = '_carbonads_js';
            s.setAttribute('async', 'async');
            d.body.appendChild(s);
        }
        
        function monetizationStart (event) {
            if (!document.monetization.state === "started") {
                showAds();
            }
        }

        if (document.monetization) {
            document.monetization.addEventListener("monetizationstart", monetizationStart);
        } else {
            showAds();
        }

        return () => {
            if (d.getElementById('_carbonads_js')) {
                d.body.removeChild('_carbonads_js')
            }
            if (d.getElementById('carbonads')) {
                d.body.removeChild('carbonads')
            }
            document.monetization.removeEventListener("monetizationstart", monetizationStart);
        }
    }, []);
    
    return Layout(props)
}

export default NewLayout