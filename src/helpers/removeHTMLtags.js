/**
 * take html string and get rid of all html tags and special symbols, leaving only simple text
 * @param html
 */

export function removeHTMLtags (html) {
  return html
    .replace(/<[^>]+>/gm, '')
    .replace(/(\\n|\n|&nbsp;)/gm, ' ')
}
