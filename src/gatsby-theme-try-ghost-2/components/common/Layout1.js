import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import { DocumentHead, Footer, StickyNav, SubscribeOverlay, SubscribeSuccess } from 'gatsby-theme-try-ghost/src/components/common'
import { BodyClass } from 'gatsby-theme-try-ghost/src/components/common/helpers'

import { useLang, get } from 'gatsby-theme-try-ghost/src/utils/use-lang'

// Styles
import 'gatsby-theme-try-ghost/src/styles/screen.css'
import 'gatsby-theme-try-ghost/src/styles/fluid.css'
import 'gatsby-theme-try-ghost/src/styles/dark-mode.css'
import 'gatsby-theme-try-ghost/src/styles/pagination.css'
import 'gatsby-theme-try-ghost/src/styles/prism.css'
import 'gatsby-theme-try-ghost/src/styles/toc.css'

/**
* Main layout component
*
* The Layout component wraps around each page and template.
* It also provides the header, footer as well as the main
* styles, and meta data for each page.
*
*/
const DefaultLayout = ({ data, header, children, isHome, isPost, sticky, previewPosts, author, tags, page, errorClass, parsedQuery, overlay }) => {
    const text = get(useLang())
    const site = data.allGhostSettings.edges[0].node
    const title = text(`SITE_TITLE`, site.title)
    const bodyClass = BodyClass({ isHome: isHome, isPost: isPost, author: author, tags: tags, page: page })

    errorClass = errorClass || ``

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

    return (
        <React.Fragment>
            {/* Dark Mode shadows DocumentHead */}
            <DocumentHead site={site} className={bodyClass} parsedQuery={parsedQuery} />

            <div className="site-wrapper">
                {/* The main header section on top of the screen */}
                {header}

                {/* The main content area */}
                <main ref={isHome && sticky && sticky.anchorRef} id="site-main" className={`site-main outer ${errorClass}`}>
                    {/* All the main content gets inserted here, index.js, post.js */}
                    {children}
                </main>

                {/* For sticky nav bar */}
                { isHome && <StickyNav className={`site-nav ${sticky && sticky.state.currentClass}`} overlay={overlay}/>}

                {/* Links to Previous/Next posts */}
                {previewPosts}
 
                <Footer data={data} />
            </div>

            <SubscribeSuccess parsedQuery={parsedQuery} title={title} />

            {/* The big email subscribe modal content */}
            <SubscribeOverlay overlay={overlay} />

        </React.Fragment>
    )
}

DefaultLayout.propTypes = {
    header: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    previewPosts: PropTypes.node,
    isHome: PropTypes.bool,
    isPost: PropTypes.bool,
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
        site: PropTypes.object.isRequired,
    }).isRequired,
    sticky: PropTypes.shape({
        anchorRef: PropTypes.object.isRequired,
        state: PropTypes.shape({
            currentClass: PropTypes.string,
        }),
    }),
    author: PropTypes.object,
    tags: PropTypes.arrayOf(
        PropTypes.object.isRequired,
    ),
    page: PropTypes.object,
    errorClass: PropTypes.string,
    parsedQuery: PropTypes.object,
    overlay: PropTypes.object,
}

const DefaultLayoutSettingsQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettings {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
                site {
                    siteMetadata {
                        ...SiteMetadataFields
                    }
                }
            }
        `}
        render={data => <DefaultLayout data={data} {...props} />}
    />
)

export default DefaultLayoutSettingsQuery
