import React, { useState, useRef, useEffect } from 'react'
import { useFlexSearch } from 'react-use-flexsearch'
import { useStaticQuery, graphql } from "gatsby"

const Search = () => {
    const queryData = useStaticQuery(graphql`
        query  {
            localSearchPages {
            index
            store
            }
        }
    `)

    const index = queryData.localSearchPages.index
    const store = queryData.localSearchPages.store
    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState(false)
    const results = useFlexSearch(query, index, store)
    const searchResultsRef = useRef(null)
    const searchBarRef = useRef(null)

    useEffect(() => {
        if (results && results.length && focused) {
            searchResultsRef.current.classList.add('show')
        } else {
            searchResultsRef.current.classList.remove('show')
        }
    }, [results, focused])

    useEffect(() => {

        function handleFocus () {
            setFocused(searchBarRef.current === document.activeElement ||
                searchBarRef.current === document.activeElement.closest('.search-bar') ||
                searchResultsRef.current === document.activeElement ||
                searchResultsRef.current === document.activeElement.closest('.search-results'));
        }

        document.body.addEventListener('click', handleFocus)

        return () => {
            document.body.removeEventListener('click', handleFocus)
        }
    }, [])

    return (
        <div class="inner search-wrapper">
        <input type="text" name="query" className="search-bar"
            placeholder="Search..." onChange={(event) => setQuery(event.target.value.toLowerCase())}
            autocomplete="off" ref={searchBarRef} />
        <div class="search-results" ref={searchResultsRef}>
            <ul>
                {results.map(result => (
                    <li key={result.id}>
                        <a href={result.path}>{result.title}</a>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    )
}

export default Search
