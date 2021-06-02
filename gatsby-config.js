const path = require(`path`)

let siteConfig
let ghostConfig
let mediaConfig
let routesConfig

try {
    siteConfig = require(`./siteConfig`)
} catch (e) {
    siteConfig = null
}

try {
    mediaConfig = require(`./mediaConfig`)
} catch (e) {
    mediaConfig = null
}

try {
    routesConfig = require(`./routesConfig`)
} catch (e) {
    routesConfig = null
}

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        development: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        ghostConfig = null //allow default config to take over
    }
}

module.exports = {
    plugins: [
        `gatsby-plugin-preact`,
        `gatsby-plugin-netlify`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        {
            resolve: `gatsby-theme-try-ghost`,
            options: {
                ghostConfig: ghostConfig,
                siteConfig: siteConfig,
                mediaConfig: mediaConfig,
                routes: routesConfig,
            },
        },
        {
            resolve: `gatsby-theme-ghost-dark-mode`,
            options: {
                // Set to true if you want your theme to default to dark mode (default: false)
                // Note that this setting has an effect only, if
                //    1. The user has not changed the dark mode
                //    2. Dark mode is not reported from OS
                defaultModeDark: false,
                // If you want the defaultModeDark setting to take precedence
                // over the mode reported from OS, set this to true (default: false)
                overrideOS: false,
            },
        },
        {
            resolve: `gatsby-transformer-rehype`,
            options: {
                filter: node => (
                    node.internal.type === `GhostPost` ||
                    node.internal.type === `GhostPage`
                ),
                plugins: [
                    {
                        resolve: `gatsby-rehype-ghost-links`,
                    },
                    {
                        resolve: `gatsby-rehype-prismjs`,
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-gatsby-cloud`,
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                // The property ID; the tracking code won't be generated without it
                trackingId: "UA-149400351-5",
                // Defines where to place the tracking script - `true` in the head and `false` in the body
                head: true,
                // Setting this parameter is optional
                anonymize: true,
                // Delays sending pageview hits on route update (in milliseconds)
                pageTransitionDelay: 0,
                // Defers execution of google analytics script after page load
                defer: true
            },
        },
        {
            resolve: `gatsby-theme-ghost-toc`,
            options: {
                // Number of shown headline levels (optional, default: 2)
                maxDepth: 2,
            },
        },
        {
            resolve: 'gatsby-plugin-local-search',
            options: {
                // A unique name for the search index. This should be descriptive of
                // what the index contains. This is required.
                name: 'pages',

                // Set the search engine to create the index. This is required.
                // The following engines are supported: flexsearch, lunr
                engine: 'flexsearch',

                // Provide options to the engine. This is optional and only recommended
                // for advanced users.
                //
                // Note: Only the flexsearch engine supports options.
                engineOptions: 'speed',

                // GraphQL query used to fetch all data for the search index. This is
                // required.
                query: `
                {
                    allGhostPost {
                        edges {
                            node {
                                id
                                slug
                                title
                                plaintext
                            }
                        }
                    }
                }
                `,

                // Field used as the reference value for each document.
                // Default: 'id'.
                ref: 'id',

                // List of keys to index. The values of the keys are taken from the
                // normalizer function below.
                // Default: all fields
                index: ['title', 'body'],

                // List of keys to store and make available in your UI. The values of
                // the keys are taken from the normalizer function below.
                // Default: all fields
                store: ['id', 'path', 'title'],

                // Function used to map the result from the GraphQL query. This should
                // return an array of items to index in the form of flat objects
                // containing properties to index. The objects must contain the `ref`
                // field above (default: 'id'). This is required.
                normalizer: ({ data }) =>
                data.allGhostPost.edges.map((edge) => ({
                    id: edge.node.id,
                    path: edge.node.slug,
                    title: edge.node.title,
                    body: edge.node.plaintext,
                })),
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // This plugin is currently causing issues: https://github.com/gatsbyjs/gatsby/issues/25360
        //`gatsby-plugin-offline`,
        `gatsby-plugin-netlify-cache`
    ],
}
