import React from 'react'
import PropTypes from 'prop-types'

import TwitterIcon from 'gatsby-theme-try-ghost/src/components/common/icons/twitter-icon'
import FacebookIcon from 'gatsby-theme-try-ghost/src/components/common/icons/facebook-icon'
import InstagramIcon from './icons/InstagramIcon'
import GitHubIcon from './icons/GitHubIcon'
import MailIcon from './icons/MailIcon'

import { SocialRss } from 'gatsby-theme-try-ghost/src/components/common'
import CoffeeIcon from './icons/CoffeeIcon'

const SocialLinks = ({ site, siteUrl }) => {
    const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
    const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

    return (
        <React.Fragment>
            { site.facebook && <a href={ facebookUrl } className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook"><FacebookIcon /></a>}
            { site.twitter && <a href={ twitterUrl } className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter"><TwitterIcon /></a>}
            <a className="social-link social-link-in" href="https://instagram.com/shahednasser95" target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
            <a className="social-link social-link-gi" href="https://github.com/shahednasser" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>
            <a className="social-link social-link-gi" href="https://www.buymeacoffee.com/shahednasser" target="_blank" rel="noopener noreferrer" title="Buy me A Coffee"><CoffeeIcon /></a>
            <a className="social-link social-link-ma" href="mailto:shahednasser@gmail.com" target="_blank" rel="noopener noreferrer"><MailIcon /></a>
            <SocialRss url={siteUrl} />
        </React.Fragment>
    )
}

SocialLinks.propTypes = {
    site: PropTypes.object.isRequired,
    siteUrl: PropTypes.string.isRequired,
}

export default SocialLinks
