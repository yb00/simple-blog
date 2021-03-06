import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"

import Layout from "src/components/Layout"
import PageRow from "src/components/PageRow"

import "./styles/search.css"

const Result = ({ title, path }) => {
  return (
    <div className="search-result">
      <h4 className="search-result__title">{title}</h4>
      <Link to={path} className="search-result__link">
        Read More
      </Link>
    </div>
  )
}

const Search = ({ location, data }) => {
  const [results, setResults] = useState([])
  const [searchPage, setSearchPage] = useState(1)
  const maxResultsPerPage = 3

  // Runs everytime the query updates.
  useEffect(() => {
    // Get all posts.
    const { edges } = data.allSitePage
    // Get query passed through search from header. If empty, query is "".
    const query = location.state
      ? new RegExp(location.state.query, "i")
      : new RegExp("", "i")

    // Create pages on first render.
    const getSearchResults = () => {
      // Filter through posts by title. Returns an array.
      var searchResults = edges.filter(post =>
        query.test(post.node.context.title)
      )
      // Set results in page state.
      setResults(searchResults)
    }
    console.log("Search page.")
    getSearchResults()
  }, [location, data.allSitePage])

  return (
    <Layout>
      <div className="search-container border">
        <h3>Search Results</h3>
        <div>
          {results
            .filter((item, i) => {
              return (
                i >= maxResultsPerPage * (searchPage - 1) &&
                i < searchPage * maxResultsPerPage
              )
            })
            .map(post => {
              const { title, date, author } = post.node.context
              const { path } = post.node
              return (
                <Result
                  title={title}
                  date={date}
                  author={author}
                  key={`${date}__${title}`}
                  path={path}
                />
              )
            })}
          {}
          <PageRow
            maxResultsPerPage={maxResultsPerPage}
            itemsNum={results.length}
            setPage={setSearchPage}
          />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query SearchQuery {
    allSitePage(filter: { path: { regex: "/posts/" } }) {
      edges {
        node {
          id
          path
          context {
            slug
            title
            date
            author
          }
        }
      }
    }
  }
`

export default Search
