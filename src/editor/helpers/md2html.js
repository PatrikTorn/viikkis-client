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

const replace = (content) => {
  const rules = [
      [/\?\[(.+?)\]\((.*\))/g, buttonParse('$1', '$2')]
  ];
  return massReplace(content, rules);
}

let _1 = 0;
let _2 = 0;
let _3 = 0;


const renderer = new marked.Renderer()


const paragraphParse = text => `<p>${text}</p>`

const linkParse = (href, title, text) => {
  return `<a href=${href}
      title=${title || href}
      }>${text}</a>`
}


const headingParse = (text, level, raw) => {
  if(level == 1) {
      _3 = 0;
      _2 = 0;
      _1 = _1 + 1;
      return `<h${level} id="toc_${_1}">${_1}. ${text}</h${level}>`;
  } else if (level == 2) {
      _3 = 0;
      _2 = _2 + 1;
      return `<h${level} id="toc_${_1}_${_2}">${_1}.${_2}. ${text}</h${level}>`;
  } else {
      _3 = _3 + 1;
      return `<h${level} id="toc_${_1}_${_2}_${_3}">${_1}.${_2}.${_3}. ${text}</h${level}>`;
  }
}

const buttonParse = (text, href) => {
    return `<button class="customButton" href="${href}">${text}</button>`
}


renderer.paragraph = paragraphParse
renderer.link = linkParse
renderer.heading = headingParse

export default content => {
  if (typeof content != 'string') return ''
  _1 = 0;
  _2 = 0;
  _3 = 0;
  return  marked(replace(content), { renderer });
}

