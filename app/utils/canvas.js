if (CanvasRenderingContext2D && !CanvasRenderingContext2D.renderText) {
  CanvasRenderingContext2D.prototype.renderText = function (text, x, y, letterSpacing) {
    if (!text || typeof text !== 'string' || text.length === 0) {
      return
    }

    if (typeof letterSpacing === 'undefined') {
      letterSpacing = 0
    }

    let characters = String.prototype.split.call(text, '')
    let index = 0
    let current
    let currentPosition = x
    let align = 1

    if (this.textAlign === 'right') {
      align = -1
      characters = characters.reverse()
    } else if (this.textAlign === 'center') {
      let totalWidth = 0

      for (var i = 0; i < characters.length; i++) {
        totalWidth += (this.measureText(characters[i]).width + letterSpacing)
      }

      currentPosition = x - (totalWidth / 2)
    }

    while (index < text.length) {
      current = characters[index++]

      this.fillText(current, currentPosition, y)

      currentPosition += (align * (this.measureText(current).width + letterSpacing))
    }
  }
}
