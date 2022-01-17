import { useEffect } from 'react'

function useCarbon(selector = `body`, type = `append`) {
    useEffect(() => {
        const d = document,
            s = d.createElement(`script`),
            previousAds = d.querySelectorAll(`[id^=carbonads]`),
            previousScript = d.getElementById(`_carbonads_js`),
            element = d.querySelector(selector)

        if (previousAds && previousAds.length) {
            previousAds.forEach((previous) => {
                previous.remove()
            })
        }

        if (previousScript) {
            previousScript.remove()
        }

        s.src = `https://cdn.carbonads.com/carbon.js?serve=CEBIL27J&placement=blogshahednassercom`
        s.id = `_carbonads_js`
        s.setAttribute(`async`, `async`)

        if (type === `append`) {
            element.appendChild(s)
        } else {
            element.parentNode.insertBefore(s, element.nextSibling)
        }

        return () => {
            if (d.getElementById(`_carbonads_js`)) {
                d.getElementById(`_carbonads_js`).remove()
            }
            if (d.getElementById(`carbonads`)) {
                d.getElementById(`carbonads`).remove()
            }
        }
    }, [type, selector])
}

export default useCarbon
