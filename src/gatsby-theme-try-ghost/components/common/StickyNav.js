import React from 'react'

import StickyNav from 'gatsby-theme-try-ghost/src/components/common/StickyNav'

const NewStickyNav = ({className, overlay}) => {
    return (
        <div>
            <StickyNav className={className} overlay={overlay} />
            <div className="support-banner">
                This website supports Palestine. #FreePalestine
            </div>
        </div>
    )
}

export default NewStickyNav
