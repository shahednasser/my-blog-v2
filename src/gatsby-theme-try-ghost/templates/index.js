import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import queryString from "query-string"

import { PostView, HeaderIndex } from 'gatsby-theme-try-ghost/src/components/common'
import Layout from '../components/common/Layout'
import { StickyNavContainer, OverlayContainer } from 'gatsby-theme-try-ghost/src/components/common/effects'
import { MetaData } from 'gatsby-theme-try-ghost/src/components/common/meta'
import Search from '../components/common/Search'

import { GlobalStateContext } from "gatsby-theme-try-ghost/src/context/GlobalState"

/**
* Main index page (home page)
*
* Loads all posts from Ghost
*
*/
const Index = ({ data, location, pageContext }) => {
    const posts = data.allGhostPost.edges
    const parsedQuery = location.search && location.search.length > 0 && queryString.parse(location.search)
    return (
        <GlobalStateContext.Consumer>{ g => (
            <React.Fragment>
                <MetaData location={location} image={data.file} />
                <StickyNavContainer throttle={300} activeClass="fixed-nav-active" render={ sticky => (
                    <OverlayContainer render={ overlay => (
                        <Layout parsedQuery={parsedQuery !== '' ? parsedQuery : undefined } isHome={true} header={<HeaderIndex overlay={overlay}/>} sticky={sticky} overlay={overlay} >
                            <Search />
                            <PostView globalState={g} pageContext={pageContext} posts={posts} isHome={true} />
                        </Layout>
                    )}/>
                )}/>
            </React.Fragment>
        )}
        </GlobalStateContext.Consumer>
    )
}

Index.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
        file: PropTypes.object,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
}

export default Index

export const pageQuery = graphql`
  query GhostPostQueryNew($postIds: [String!]!, $limit: Int!, $skip: Int!) {
    allGhostPost(
        filter: {id: { in: $postIds }},
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
    file(relativePath: {eq: "site-meta.png"}) {
        publicURL
        imageMeta {
            width
            height
        }
    }
  }
`
