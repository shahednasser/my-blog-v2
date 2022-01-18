import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { resolveUrl } from 'gatsby-theme-try-ghost/src/utils/routing'
import useOptions from 'gatsby-theme-try-ghost/src/utils/use-options'
import { useLang, get } from 'gatsby-theme-try-ghost/src/utils/use-lang'

import { HoverOnAvatar } from 'gatsby-theme-try-ghost/src/components/common/effects'
import Img from 'gatsby-image'

import AvatarIcon from 'gatsby-theme-try-ghost/src/components/common/icons/avatar-icon'
import { ImgSharpInline } from 'gatsby-theme-try-ghost/src/components/common'

const AuthorList = ({ authors, isPost }) => {
    const { basePath } = useOptions()
    const text = get(useLang())

    return (
        <ul className="author-list">
            {authors.map((author, i) => {
                const url = resolveUrl(basePath, `/`, author.slug, author.url)
                const profileImg = author.profileImageSharp && author.profileImageSharp.publicURL || author.profile_image
                const fluidProfileImg = author.profileImageSharp && author.profileImageSharp.childImageSharp && author.profileImageSharp.childImageSharp.fluid

                console.log(author)

                return (
                    <HoverOnAvatar key={i} activeClass="hovered" render={ hover => (
                        <li key={i} ref={hover.anchorRef} className="author-list-item">
                            { !isPost &&
                                <div className="author-name-tooltip">
                                    {author.name}
                                </div>
                            }
                            { isPost &&
                                <div className={`author-card ${hover.state.currentClass}`}>
                                    { profileImg ? (
                                        <figure>
                                            <Img
                                                style={{ position: `relative` }}
                                                className="author-profile-image"
                                                fluid={fluidProfileImg}
                                                alt={author.name}
                                                loading="eager"
                                                durationFadeIn={0}
                                            />
                                        </figure>
                                    ) : (
                                        <div className="author-profile-image"><AvatarIcon /></div>
                                    )}
                                    <div className="author-info">
                                        { author.bio ? (
                                            <div className="bio">
                                                <h2>{author.name}</h2>
                                                <p>{author.bio}</p>
                                                <p><Link to={url}>{text(`MORE_POSTS`)}</Link> {text(`BY`)} {author.name}.</p>
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                <h2>{author.name}</h2>
                                                <p>{text(`READ`)} <Link to={url}>{text(`MORE_POSTS_SM`)}</Link> {text(`BY_THIS_AUTHOR`)}.</p>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            }
                            { profileImg ? (
                                <Link to={url} className={`${isPost && `author` || `static`}-avatar`}>
                                    <ImgSharpInline
                                        className="author-profile-image"
                                        fluidImg={fluidProfileImg}
                                        alt={author.name}
                                    />
                                </Link>
                            ) : (
                                <Link to={url} className={`${isPost && `author` || `static`}-avatar author-profile-image`}><AvatarIcon /></Link>
                            )}
                        </li>
                    )}/>
                )
            })}
        </ul>
    )
}

AuthorList.propTypes = {
    authors: PropTypes.arrayOf(
        PropTypes.object,
    ).isRequired,
    isPost: PropTypes.bool,
}

export default AuthorList
