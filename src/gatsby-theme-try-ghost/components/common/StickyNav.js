import React from 'react'

import StickyNav from 'gatsby-theme-try-ghost/src/components/common/StickyNav'

const NewStickyNav = ({className, overlay}) => {
    return (
        <div>
            <StickyNav className={className} overlay={overlay} />
        </div>
    )
}

export default NewStickyNav
