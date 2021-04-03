import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { readingTime as readingTimeHelper } from '@tryghost/helpers'
import { resolveUrl } from 'gatsby-theme-try-ghost/src/utils/routing'
import useOptions from 'gatsby-theme-try-ghost/src/utils/use-options'
import { useLang, get } from 'gatsby-theme-try-ghost/src/utils/use-lang'

import { Layout, HeaderPost, AuthorList, PreviewPosts, ImgSharp, RenderContent } from 'gatsby-theme-try-ghost/src/components/common'
import { Comments, TableOfContents, Subscribe } from 'gatsby-theme-try-ghost/src/components/common'

import { StickyNavContainer, OverlayContainer } from 'gatsby-theme-try-ghost/src/components/common/effects'
import { MetaData } from 'gatsby-theme-try-ghost/src/components/common/meta'

import { PostClass } from 'gatsby-theme-try-ghost/src/components/common/helpers'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location, pageContext }) => {
    const { basePath } = useOptions()
    const text = get(useLang())
    const post = data.ghostPost
    const prevPost = data.prev
    const nextPost = data.next
    const previewPosts = data.allGhostPost.edges
    const readingTime = readingTimeHelper(post).replace(`min read`,text(`MIN_READ`))
    const featImg = post.featureImageSharp && post.featureImageSharp.publicURL || post.feature_image
    const fluidFeatureImg = post.featureImageSharp && post.featureImageSharp.childImageSharp && post.featureImageSharp.childImageSharp.fluid
    const postClass = PostClass({ tags: post.tags, isFeatured: featImg, isImage: featImg && true })
    const primaryTagCount = pageContext.primaryTagCount

    const toc = post.childHtmlRehype && post.childHtmlRehype.tableOfContents || []
    const htmlAst = post.childHtmlRehype && post.childHtmlRehype.htmlAst
    const transformedHtml = post.childHtmlRehype && post.childHtmlRehype.html

    // Collection paths must be retrieved from pageContext
    previewPosts.forEach(({ node }) => node.collectionPath = pageContext.collectionPaths[node.id])
    if (prevPost) {
        prevPost.collectionPath = pageContext.collectionPaths[prevPost.id]
    }
    if (nextPost) {
        nextPost.collectionPath = pageContext.collectionPaths[nextPost.id]
    }

    useEffect(() => {
        const d = document,
              ts = d.createElement('script');

        ts.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=5fa59a268fbbd6001256e36a&product=inline-share-buttons';
        ts.setAttribute('async', 'async');
        (d.head || d.body).appendChild(ts);

        return () => {
          if (d.body.contains(ts)) {
            d.body.removeChild(ts);
          }

          const stickyShare = d.getElementsByClassName("st-sticky-share-buttons");
          if (stickyShare.length) {
            for (let i = 0; i < stickyShare.length; i++) {
              d.body.removeChild(stickyShare[i]);
            }
          }
        }
    }, []);

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
                                        <ImgSharp fluidClass="kg-card kg-code-card" fluidImg={fluidFeatureImg} srcImg={featImg} title={post.title}/>
                                    </figure>
                                }

                                <section className="post-full-content">
                                    <TableOfContents toc={toc} url={resolveUrl(basePath, pageContext.collectionPaths[post.id], post.slug, post.url)}/>
                                    <RenderContent htmlAst={htmlAst} html={transformedHtml || post.html} />
                                </section>

                                <Subscribe />

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
        ghostPost: ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
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