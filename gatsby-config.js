module.exports = {
  siteMetadata: {
    title: `A Simple Blog`,
    description: `A simple blog built using Gatsby.`,
    author: `@gatsbyjs`,
    repo: `https://github.com/yb00/simple-blog`,
  },
  plugins: [
    `gatsby-plugin-root-import`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/coffee.png`,
      },
    },
  ],
}
