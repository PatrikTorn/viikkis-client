import marked from 'marked'
import Hljs from './highlight'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight(code) {
    return Hljs.highlightAuto(code).value
  }
})

const renderer = new marked.Renderer()

let _1 = 0;
let _2 = 0;
let _3 = 0;


const massReplace = (text, replacementArray) => {
    let results = text;
    for (let [regex, replacement] of replacementArray) {
      results = results.replace(regex, replacement);
    }
    return results;
}


const escape = (text) => {
    return text;
    return text
        .replace("&", '&amp;')
        .replace("<", '&lt;')
        .replace(">", '&gt;')
        .replace('"', '&#34;')
        .replace("'", '&#39;')
        .replace("!", '&#33;')
        .replace("?", '&#63;')
        .replace("#", '&#35;')
        // .replace(\\/g, '&#92;')
        .replace("w", '&#119;')
}

const paragraphParse = text => {
    // mj-class="paragraph"
    return `<mj-text><p>${escape(text)}</p></mj-text>\n`;
}

const linkParse = (href, title, text) => {
    if(title) {
        return `<a href="${escape(href)}" title="${escape(title)}">${escape(text)}</a>`;
    }else {
        return `<a href="${escape(href)}">${escape(text)}</a>`;
    }
}

const headingParse = (text, level, raw) => {
    if(level == 1) {
        _3 = 0;
        _2 = 0;
        _1 = _1 + 1;
        return `<mj-divider /><mj-text mj-class="heading${level}">\n<h${level} id="toc_${_1}">${_1}. ${escape(text)}</h${level}></mj-text>\n`;
    } else if (level == 2) {
        _3 = 0;
        _2 = _2 + 1;
        return `<mj-text mj-class="heading${level}">\n<h${level} id="toc_${_1}_${_2}">${_1}.${_2}. ${escape(text)}</h${level}></mj-text>\n`;
    } else {
        _3 = _3 + 1;
        return `<mj-text mj-class="heading${level}">\n<h${level} id="toc_${_1}_${_2}_${_3}">${_1}.${_2}.${_3}. ${escape(text)}</h${level}></mj-text>\n`;
    }
}

const imageParse = (href, title, text) => {
    if (title)
        return `</mj-text><mj-image src="${href}" alt="${escape(text)}" title="${escape(title)}" /> <mj-text>` 
    else
        return `</mj-text><mj-image src="${href}" alt="${escape(text)}" /> <mj-text>`
}

const tableParse = (header, body) => {
    return  `<mj-table>\n${header}${body}</mj-table>\n`
}

const tableRowParse = (content) => {
    return `<tr>\n${content}</tr>\n`;
}

const tableCellParse = (content, flags) => {
    let tag = flags['header'] ? 'th' : 'td';
    let align = flags['align'];
    if(!align) 
        return `<${tag}>${content}</${tag}>\n`
    else
        return `<${tag} style="text-align:${align}">${escape(content)}</${tag}>\n`
}

const listParse = (body, ordered, start) => {
    let tag = ordered ? 'ol' : 'ul';
    return `<mj-text><${tag}>\n${body}</${tag}></mj-text>\n`;
}

const listItemParse = (text) => {
    return `<li>${escape(text)}</li>\n`;
}

const buttonParse = (text, href) => {
    return `</mj-text><mj-button href=${href}>${text}</mj-button><mj-text>`
}

const replace = (content) => {
    const rules = [
        [/\?\[(.+?)\]\((.*\))/g, buttonParse('$1', '$2')]
    ];
    return massReplace(content, rules);
}


renderer.paragraph = paragraphParse
renderer.link = linkParse
renderer.heading = headingParse
renderer.image = imageParse
renderer.table = tableParse
renderer.tablerow = tableRowParse
renderer.tablecell = tableCellParse
renderer.list = listParse
renderer.listitem = listItemParse

export default content => {
  if (typeof content != 'string') return ''
  _1 = 0;
  _2 = 0;
  _3 = 0;
  return marked(replace(content), { renderer })
}