import React, { useEffect } from 'react'
import Layout from 'gatsby-theme-try-ghost/src/components/common/Layout'
import { useMonetizationState } from 'react-web-monetization'

function NewLayout (props) {
    const monetization = useMonetizationState()

    function showAds () {
        const d = document,
            s = d.createElement('script'),
            previousAds = d.querySelectorAll('[id^=carbonads]'),
            previousScript = d.getElementById('_carbonads_js')

            if (previousAds && previousAds.length) {
                previousAds.forEach((previous) => {
                    console.log(previous)
                    d.body.removeChild(previous)
                })
            }

            if (previousScript) {
                d.body.removeChild(previousScript)
            }

            s.src = 'https://cdn.carbonads.com/carbon.js?serve=CEBIL27J&placement=blogshahednassercom';
            s.id = '_carbonads_js';
            s.setAttribute('async', 'async');
            d.body.appendChild(s);
    }

    function hideAds () {
        const d = document

        if (d.getElementById('_carbonads_js')) {
            d.body.removeChild(d.getElementById('_carbonads_js'))
        }
        if (d.getElementById('carbonads')) {
            d.body.removeChild(d.getElementById('carbonads'))
        }
    }

    useEffect(() => {
        showAds ();

        return () => {
            hideAds();
        }
    }, []);

    useEffect(() => {
        if (monetization.state === 'started' || monetization.state === 'pending') {
            hideAds();
        } else {
            showAds();
        }
    }, [monetization.state])

    return Layout(props)
}

export default NewLayout
