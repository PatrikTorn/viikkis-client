import marked from 'marked'
import Hljs from './highlight'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight(code) {
    return Hljs.highlightAuto(code).value
  }
})


const massReplace = (text, replacementArray) => {
    let results = text;
    for (let [regex, replacement] of replacementArray) {
      results = results.replace(regex, replacement);
    }
    return results;
}


const renderer = new marked.Renderer()


const paragraphParse = text => `<p>${text}</p>`

const linkParse = (href, title, text) => {
  return `<a href=${href}
      title=${title || href}
      target='_blank'
      }>${text}</a>`
}

const headingParse = (text, level) => {
    return `<h${level}>${text}</h${level}>`;
}

const buttonParse = (text, href) => {
    return `<button class="customButton" href="${href}">${text}</button>`
}


renderer.paragraph = paragraphParse
renderer.link = linkParse

export default content => {
  if (typeof content != 'string') return ''
    const replacedContent = massReplace(content,
        [[/^###(.*)/gm, headingParse('$1', 3)],
        [/^##(.*)/gm, headingParse('$1', 2)],
        [/^#(.*)/gm, headingParse('$1', 1)],
        [/\?\[(.+?)\]\((.*\))/g, buttonParse('$1', '$2')]]
    )
  return marked(replacedContent, { renderer })
}

