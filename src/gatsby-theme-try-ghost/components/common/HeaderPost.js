import React from 'react'
import PropTypes from 'prop-types'

import SiteNav from 'gatsby-theme-try-ghost/src/components/common/SiteNav'

const HeaderPost = ({ title, sticky, overlay }) => (
    <header className="site-header">
        <div className={`outer site-nav-main ${sticky && sticky.state.currentClass}`}>
            <div className="inner">
                <SiteNav className="site-nav" postTitle={title} overlay={overlay}/>
            </div>
        </div>
        <div className="support-banner">
            This website supports Palestine. #FreePalestine
        </div>
    </header>
)

HeaderPost.propTypes = {
    title: PropTypes.string.isRequired,
    sticky: PropTypes.shape({
        state: PropTypes.shape({
            currentClass: PropTypes.string,
        }).isRequired,
    }).isRequired,
    overlay: PropTypes.object.isRequired,
}

export default HeaderPost
