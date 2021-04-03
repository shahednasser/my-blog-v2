import React, { useEffect } from 'react'
import Layout from 'gatsby-theme-try-ghost/src/components/common/Layout'

function NewLayout (props) {
    useEffect(() => {
        const d = document,
              s = d.createElement('script'),
              previous = d.getElementById('carbonads');

        if (previous) {
            d.body.removeChild(previous)
        }

        s.src = 'https://cdn.carbonads.com/carbon.js?serve=CEBIL27J&placement=blogshahednassercom';
        s.id = '_carbonads_js';
        s.setAttribute('async', 'async');
        d.body.appendChild(s);

        return () => {
            d.body.removeChild(s);
        }
    }, []);
    
    return <Layout props={props} />
}

export default NewLayout