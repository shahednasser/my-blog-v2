const React = require("react")
const { Helmet } = require("react-helmet")

exports.onRenderBody = (
  { setHeadComponents, setHtmlAttributes, setBodyAttributes },
  pluginOptions
) => {
  const helmet = Helmet.renderStatic()
  setHtmlAttributes(helmet.htmlAttributes.toComponent())
  setBodyAttributes(helmet.bodyAttributes.toComponent())
  setHeadComponents([
    helmet.title.toComponent(),
    helmet.link.toComponent(),
    helmet.meta.toComponent(),
    helmet.noscript.toComponent(),
    helmet.script.toComponent(),
    helmet.style.toComponent(),
  ])
}

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
    let hc = getHeadComponents();
    hc.sort((x, y) => {
        if (x.props && x.props["data-react-helmet"]) {
            return -1
        } else if (y.props && y.props["data-react-helmet"]) {
            return 1
        }
        return 0
    })
    if (process.env.NODE_ENV === 'production') {
        hc.forEach(el => {
            if (el.type === 'style') {
                el.type = 'link';
                el.props['href'] = el.props['data-href'];
                el.props['rel'] = 'stylesheet';
                el.props['type'] = 'text/css';

                delete el.props['data-href'];
                delete el.props['dangerouslySetInnerHTML'];
            }
        })
    }

    replaceHeadComponents(hc)
}

