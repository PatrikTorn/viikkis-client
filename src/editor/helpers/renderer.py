from mistune import Renderer
import re


class ViikkisRenderer(Renderer):


    def reset_toc(self, refs_enabled=False):
        self.toc_count = 0
        self.header_counts = [0, 0, 0]
        self.refs = refs_enabled
        if not self.refs:
            self.toc_count = -1

    def header(self, text, level, raw=None):
        if self.refs:
            self.header_counts[level-1] += 1
            if level is 1:
                self.header_counts[1] = 0
                self.header_counts[2] = 0
                numbered_text = str(self.header_counts[0]) + "&ensp;" + text
            elif level is 2:
                self.header_counts[2] = 0
                numbered_text = str(self.header_counts[0]) + "." + str(self.header_counts[1]) + "&ensp;" + text
            elif level is 3:
                numbered_text = str(self.header_counts[0]) + "." + str(self.header_counts[1]) + "." + str(self.header_counts[2]) + "&ensp;" + text
            else:
                numbered_text = text
        else:
            numbered_text = text

        if level is 1:
            rv = '<mj-divider /><mj-text mj-class="heading%d">\n<h%d id="toc-%d" name="toc-%d">%s</h%d></mj-text>\n' % (
                level, level, self.toc_count, self.toc_count, numbered_text, level
            )
        else:
            rv = '<mj-text mj-class="heading%d">\n<h%d id="toc-%d" name="toc-%d">%s</h%d></mj-text>\n' % (
                level, level, self.toc_count, self.toc_count, numbered_text, level
            )

        if self.refs:
            self.toc_count += 1
 
        return rv

    def paragraph(self, text):
        """Rendering paragraph tags. Like ``<p>``."""
        # return '<mj-text mj-class="paragraph">%s</mj-text>\n' % text.strip(' ')
        return '<mj-text mj-class="paragraph"><p>%s</p></mj-text>\n' % text.strip(' ')


    def list(self, body, ordered=True):
        """Rendering list tags like ``<ul>`` and ``<ol>``.
        :param body: body contents of the list.
        :param ordered: whether this list is ordered or not.
        """
        tag = 'ul'
        if ordered:
            tag = 'ol'
        return '<mj-text><%s>\n%s</%s></mj-text>\n' % (tag, body, tag)
    
    def list_item(self, text):
        """Rendering list item snippet. Like ``<li>``."""
        return '<li>%s</li>\n' % text

    def image(self, src, title, text):
        """Rendering a image with title and text.
        :param src: source link of the image.
        :param title: title text of the image.
        :param text: alt text of the image.
        """
        src = self.escape_link(src)
        text = self.escape(text, quote=True)
        if title:
            title = self.escape(title, quote=True)
            html = '</mj-text><mj-image src="%s" alt="%s" title="%s"' % (src, text, title)
        else:
            html = '</mj-text><mj-image src="%s" alt="%s"' % (src, text)
        if self.options.get('use_xhtml'):
            return '%s />' % html
        return '%s /><mj-text>' % html

    def link(self, link, title, text):
        """Rendering a given link with content and title.
        :param link: href link for ``<a>`` tag.
        :param title: title content for `title` attribute.
        :param text: text content for description.
        """
        link = self.escape_link(link)
        if not title:
            return '<a href="%s">%s</a>' % (link, text)
        title = self.escape(title, quote=True)
        return '<a href="%s" title="%s">%s</a>' % (link, title, text)

    def table(self, header, body):
        """Rendering table element. Wrap header and body in it.

        :param header: header part of the table.
        :param body: body part of the table.
        """
        return (
            # '<table>\n<thead>%s</thead>\n'
            # '<tbody>\n%s</tbody>\n</table>\n'
            '<mj-table>\n%s'
            '%s</mj-table>\n'
        ) % (header, body)

    def table_row(self, content):
        """Rendering a table row. Like ``<tr>``.

        :param content: content of current table row.
        """
        return '<tr>\n%s</tr>\n' % content

    def table_cell(self, content, **flags):
        """Rendering a table cell. Like ``<th>`` ``<td>``.

        :param content: content of current table cell.
        :param header: whether this is header or not.
        :param align: align of current table cell.
        """
        if flags['header']:
            tag = 'th'
        else:
            tag = 'td'
        align = flags['align']
        if not align:
            return '<%s>%s</%s>\n' % (tag, content, tag)
        return '<%s style="text-align:%s">%s</%s>\n' % (
            tag, align, content, tag
        )

    def escape_link(self, url):
        _scheme_blacklist = ('javascript:', 'vbscript:')
        """Remove dangerous URL schemes like javascript: and escape afterwards."""
        lower_url = url.lower().strip('\x00\x1a \n\r\t')

        for scheme in _scheme_blacklist:
            if re.sub(r'[^A-Za-z0-9\/:]+', '', lower_url).startswith(scheme):
                return ''
        return self.escape(url, quote=True, smart_amp=False)

    def escape(self, text, quote=False, smart_amp=True):
        """Replace special characters "&", "<" and ">" to HTML-safe sequences.
        The original cgi.escape will always escape "&", but you can control
        this one for a smart escape amp.
        :param quote: if set to True, " and ' will be escaped.
        :param smart_amp: if set to False, & will always be escaped.
        """
        _escape_pattern = re.compile(r'&(?!#?\w+;)')
        if smart_amp:
            text = _escape_pattern.sub('&amp;', text)
        else:
            text = text.replace('&', '&amp;')
        text = text.replace('<', '&lt;')
        text = text.replace('>', '&gt;')
        if quote:
            text = text.replace('"', '&quot;')
            text = text.replace("'", '&#39;')
        return text


class ViikkisRendererToc(Renderer):

    def reset_toc(self):
        self.toc_tree = []
        self.header_counts = [0, 0, 0]
        self.toc_count = 0

    def header(self, text, level, raw=None):

        self.header_counts[level-1] += 1
        if level is 1:
            self.header_counts[1] = 0
            self.header_counts[2] = 0
            numbered_text = str(self.header_counts[0]) + "&ensp;" + text
        elif level is 2:
            self.header_counts[2] = 0
            numbered_text = str(self.header_counts[0]) + "." + str(self.header_counts[1]) + "&ensp;" + text
        elif level is 3:
            numbered_text = str(self.header_counts[0]) + "." + str(self.header_counts[1]) + "." + str(self.header_counts[2]) + "&ensp;" + text
        else:
            numbered_text = text

        rv = '<h%d id="toc-%d">%s</h%d>\n' % (
            level, self.toc_count, numbered_text, level
        )
        self.toc_tree.append((self.toc_count, numbered_text, level, raw))
        self.toc_count += 1
        return rv

    def render_toc(self, level=3):
        """Render TOC to HTML.
        :param level: render toc to the given level
        """
        return ''.join(self._iter_toc(level))

    def _iter_toc(self, level):
        first_level = 0
        last_level = 0

        yield '<mj-text>\n<ul id="table-of-content">\n'

        for toc in self.toc_tree:
            index, text, l, raw = toc

            if l > level:
                # ignore this level
                continue

            if first_level == 0 :
                # based on first level
                first_level = l
                last_level = l
                yield '<li><a href="#toc-%d" font-size="20px">%s</a>' % (index, text)
            elif last_level == l:
                yield '</li>\n<li><a href="#toc-%d">%s</a>' % (index, text)
            elif last_level == l - 1:
                last_level = l
                yield '<ul>\n<li><a href="#toc-%d">%s</a>' % (index, text)
            elif last_level > l:
                # close indention
                yield '</li>'
                while last_level > l:
                    yield '</ul>\n</li>\n'
                    last_level -= 1
                yield '<li><a href="#toc-%d">%s</a>' % (index, text)

        # close tags
        yield '</li>\n'
        while last_level > first_level:
            yield '</ul>\n</li>\n'
            last_level -= 1

        yield '</ul>\n</mj-text>\n'
