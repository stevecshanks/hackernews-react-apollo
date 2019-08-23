import React, { useState } from 'react'
import gql from 'graphql-tag'
import Link from './Link'
import { useLazyQuery } from '@apollo/react-hooks';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

function Search() {
  const [filter, setFilter] = useState('')
  const [queryFilter, setQueryFilter] = useState('')

  const updateSearchResults = () => {
    setQueryFilter(filter)
    executeSearch()
  }

  const [executeSearch, { data, loading }] = useLazyQuery(FEED_SEARCH_QUERY, { variables: { filter: queryFilter } })

  const links = data && !loading ? data.feed.links : []

  return (
    <div>
      <div>
        Search
        <input
          type='text'
          onChange={e => setFilter(e.target.value)}
        />
        <button onClick={() => updateSearchResults()}>OK</button>
      </div>
      {links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  )
}

export default Search