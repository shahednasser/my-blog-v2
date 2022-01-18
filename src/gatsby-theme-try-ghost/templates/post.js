import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { readingTime as readingTimeHelper } from '@tryghost/helpers'
import { resolveUrl } from 'gatsby-theme-try-ghost/src/utils/routing'
import useOptions from 'gatsby-theme-try-ghost/src/utils/use-options'
import { useLang, get } from 'gatsby-theme-try-ghost/src/utils/use-lang'

import { Layout, HeaderPost, AuthorList, PreviewPosts, RenderContent } from 'gatsby-theme-try-ghost/src/components/common'
import { Comments, TableOfContents, Subscribe } from 'gatsby-theme-try-ghost/src/components/common'

import { StickyNavContainer, OverlayContainer } from 'gatsby-theme-try-ghost/src/components/common/effects'
import { MetaData } from 'gatsby-theme-try-ghost/src/components/common/meta'

import Img from 'gatsby-image'

import { PostClass } from 'gatsby-theme-try-ghost/src/components/common/helpers'
import useCarbon from '../utils/useCarbon'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location, pageContext }) => {
    const { basePath } = useOptions()
    const text = get(useLang())
    const post = data.customPost
    const prevPost = data.prev
    const nextPost = data.next
    const previewPosts = data.allGhostPost.edges
    const readingTime = readingTimeHelper(post).replace(`min read`,text(`MIN_READ`))
    const featImg = post.featureImageSharp && post.featureImageSharp.publicURL || post.featureImageSharp
    const fluidFeatureImg = post.featureImageSharp && post.featureImageSharp.childImageSharp && post.featureImageSharp.childImageSharp.fluid
    const postClass = PostClass({ tags: post.tags, isFeatured: featImg, isImage: featImg && true })
    const primaryTagCount = pageContext.primaryTagCount

    const toc = post.childHtmlRehype && post.childHtmlRehype.tableOfContents || []
    const htmlAst = post.childHtmlRehype && post.childHtmlRehype.htmlAst
    const transformedHtml = post.childHtmlRehype && post.childHtmlRehype.html

    useCarbon(`figure.post-full-image`, `after`)

    // Collection paths must be retrieved from pageContext
    previewPosts.forEach(({ node }) => node.collectionPath = pageContext.collectionPaths[node.id])
    if (prevPost) {
        prevPost.collectionPath = pageContext.collectionPaths[prevPost.id]
    }
    if (nextPost) {
        nextPost.collectionPath = pageContext.collectionPaths[nextPost.id]
    }

    return (
        <React.Fragment>
            <MetaData data={data} location={location} type="article"/>
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>
            <StickyNavContainer throttle={300} isPost={true} activeClass="nav-post-title-active" render={ sticky => (
                <OverlayContainer render={ overlay => (
                    <Layout isPost={true} sticky={sticky} overlay={overlay}
                        header={<HeaderPost sticky={sticky} title={post.title} overlay={overlay}/>}
                        previewPosts={<PreviewPosts primaryTag={post.primary_tag} primaryTagCount={primaryTagCount} posts={previewPosts} prev={prevPost} next={nextPost}/>}>
                        <div className="inner">
                            <article className={`post-full ${postClass}`}>
                                <header className="post-full-header">
                                    { post.primary_tag &&
                                            <section className="post-full-tags">
                                                <Link to={resolveUrl(basePath, `/`, post.primary_tag.slug, post.primary_tag.url)}>{post.primary_tag.name}</Link>
                                            </section>
                                    }

                                    <h1 ref={sticky && sticky.anchorRef} className="post-full-title">{post.title}</h1>

                                    { post.custom_excerpt &&
                                        <p className="post-full-custom-excerpt">{post.custom_excerpt}</p>
                                    }

                                    <div className="post-full-byline">
                                        <section className="post-full-byline-content">
                                            <AuthorList authors={post.authors} isPost={true}/>

                                            <section className="post-full-byline-meta">
                                                <h4 className="author-name">
                                                    {post.authors.map((author, i) => (
                                                        <>
                                                            {i > 0 ? `, ` : ``}
                                                            <Link key={i} to={resolveUrl(basePath, `/`, author.slug, author.url)}>{author.name}</Link>
                                                        </>
                                                    ))}
                                                </h4>
                                                <div className="byline-meta-content">
                                                    <time className="byline-meta-date" dateTime={post.published_at}>
                                                        {post.published_at_pretty}&nbsp;
                                                    </time>
                                                    <span className="byline-reading-time"><span className="bull">&bull;</span> {readingTime}</span>
                                                </div>
                                            </section>
                                        </section>
                                    </div>
                                </header>

                                { featImg &&
                                    <figure className="post-full-image">
                                        <Img
                                            style={{ position: `relative` }}
                                            className="kg-card kg-code-card"
                                            fluid={fluidFeatureImg}
                                            alt={post.title}
                                            loading="eager"
                                            durationFadeIn={0}
                                        />
                                    </figure>
                                }

                                <section className="post-full-content">
                                    <TableOfContents toc={toc} url={resolveUrl(basePath, pageContext.collectionPaths[post.id], post.slug, post.url)}/>
                                    <RenderContent htmlAst={htmlAst} html={transformedHtml || post.html} />
                                </section>

                                <p className="connect-text">
                                    <i>
                                        If you like my content and want to support me, please share this article on your social media or <a href="https://www.buymeacoffee.com/shahednasser" target="_blank" rel="noopener noreferrer">Buy me a coffee</a>!
                                    </i>
                                </p>

                                <Subscribe />

                                <div id="mlb2-3059009" className="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-3059009">
                                    <div className="ml-form-align-center">
                                        <div className="ml-form-embedWrapper embedForm">
                                            <div className="ml-form-embedBody ml-form-embedBodyHorizontal row-form">
                                                <div className="ml-form-embedContent">
                                                    <h4>Subscribe to Newsletter</h4>
                                                    <p>Subscribe to the newsletter to be notified of new tutorials and articles!</p>
                                                </div>
                                                <form className="ml-block-form" action="https://static.mailerlite.com/webforms/submit/t8p8l2" data-code="t8p8l2" method="post" target="_blank">
                                                    <div className="ml-form-formContent horozintalForm">
                                                        <div className="ml-form-horizontalRow">
                                                            <div className="ml-input-horizontal">
                                                                <div style={{ width: `100%` }} className="horizontal-fields">
                                                                    <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                                                                        <input type="email" className="form-control" data-inputmask="" name="fields[email]" placeholder="Email" autoComplete="email" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-button-horizontal primary">
                                                                <button type="submit" className="primary">Subscribe</button>
                                                                <button disabled="disabled" style={{ display: `none` }} type="button" className="loading"> <div className="ml-form-embedSubmitLoad"><div></div><div></div><div></div><div></div></div> </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-form-embedPermissions">
                                                        <div className="ml-form-embedPermissionsContent horizontal privacy-policy">
                                                            <p>You can unsubscribe anytime.</p>
                                                        </div>
                                                    </div>
                                                    <input type="hidden" name="ml-submit" value="1" />
                                                    <div className="ml-mobileButton-horizontal">
                                                        <button type="submit" className="primary">Subscribe</button>
                                                        <button disabled="disabled" style={{ display: `none` }} type="button" className="loading"> <div className="ml-form-embedSubmitLoad"><div></div><div></div><div></div><div></div></div> </button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="ml-form-successBody row-success" style={{ display: `none` }}>
                                                <div className="ml-form-successContent">
                                                    <h4>Thank you!</h4>
                                                    <p>You have successfully joined our subscriber list.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sharethis-inline-share-buttons mt-4"></div>

                                <Comments id={post.id}/>

                            </article>
                        </div>
                    </Layout>
                )}/>
            )}/>
        </React.Fragment>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        customPost: PropTypes.object.isRequired,
        ghostPost: PropTypes.object.isRequired,
        prev: PropTypes.object,
        next: PropTypes.object,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object,
}

export default Post

export const postQuery = graphql`
    query($slug: String!, $prev: String!, $next: String!, $tag: String!, $limit: Int!, $skip: Int!) {
        customPost: ghostPost(slug: {eq: $slug}) {
            ...GhostPostFields
            featureImageSharp {
                base
                publicURL
                imageMeta {
                    width
                    height
                }
                childImageSharp {
                    fluid(maxWidth: 1040, quality: 90) {
                        ...GatsbyImageSharpFluid_noBase64
                    }
                }
            }
            author {
                ...GhostAuthorFields
                profileImageSharp {
                    base
                    publicURL
                    imageMeta {
                        width
                        height
                    }
                    childImageSharp {
                        fluid(maxWidth: 110, quality: 100) {
                            ...GatsbyImageSharpFluid_noBase64
                        }
                    }
                }
            }
        }
        ghostPost: ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
            author {
                ...GhostAuthorFields
                profileImageSharp {
                    base
                    publicURL
                    imageMeta {
                        width
                        height
                    }
                    childImageSharp {
                        fluid(maxWidth: 110, quality: 100) {
                            ...GatsbyImageSharpFluid_noBase64
                        }
                    }
                }
            }
        }
        prev: ghostPost(slug: { eq: $prev }) {
            ...GhostPostFieldsForIndex
        }
        next: ghostPost(slug: { eq: $next }) {
            ...GhostPostFieldsForIndex
        }
        allGhostPost(
            filter: {slug: { ne: $slug },tags: {elemMatch: {slug: {eq: $tag}}}},
            limit: $limit,
            skip: $skip,
            sort: { fields: [featured, published_at], order: [DESC, DESC] }
        ) {
            edges {
                node {
                ...GhostPostFieldsForIndex
                }
            }
        }
    }
`
