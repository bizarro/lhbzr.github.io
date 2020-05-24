export function split ({ element, expression = ' ', append = true }) {
  let words = splitText(element.innerHTML.toString(), expression)
  let string = ''

  words.forEach((line) => {
    if (line.indexOf('<br>') > -1) {
      const lines = line.split('<br>')

      lines.forEach((line, index) => {
        string += (index > 0) ? '<br>' + parseLine(line) : parseLine(line)
      })
    } else {
      string += parseLine(line)
    }
  })

  element.innerHTML = string

  let spans = element.querySelectorAll('span')

  if (append) {
    spans.forEach(span => {
      if (span.textContent.length === 1 && span.innerHTML.trim() !== '') {
        span.innerHTML = `${span.textContent}&nbsp;`
      }
    })
  }

  return spans
}

export function calculate (spans) {
  let lines = []
  let words = []

  let position = spans[0].offsetTop

  spans.forEach((span, index) => {
    if (span.offsetTop === position) {
      words.push(span)
    }

    if (span.offsetTop !== position) {
      lines.push(words)

      words = []
      words.push(span)

      position = span.offsetTop
    }

    if (index + 1 === spans.length) {
      lines.push(words)
    }
  })

  return lines
}

function splitText (text, expression) {
  let splits = text.split('<br>')
  let array = []

  splits.forEach((item, index) => {
    if (index > 0) {
      array.push('<br>')
    }

    array = array.concat(item.split(expression))
  })

  return array
}

function parseLine (line) {
  if (line === '' || line === ' ') {
    return line
  } else {
    return (line === '<br>') ? '<br>' : `<span>${line}</span>` + ((line.length > 1) ? ' ' : '')
  }
}
