class SvgLine {

  constructor(parent) {

    this.parentElement = parent
    this.displayElement = document.createElementNS("http://www.w3.org/2000/svg", 'line')
    this.parentElement.appendChild(this.displayElement)

    this.setId()
    this.setLineStart(0, 0)
    this.setLineEnd(100, 100) 
    this.setStrokeColor()
    this.setStrokeWidth()

  }

  setId(id = 'line') {

    this.displayElement.setAttribute('id',id);

  }

  setClass(cssClass = 'line') {

    this.displayElement.setAttribute('class', cssClass)

  }

  setLineStart(x, y) {

    this.displayElement.setAttribute('x1', String(x));
    this.displayElement.setAttribute('y1', String(y));

  }

  setLineEnd(x, y) {

    this.displayElement.setAttribute('x2', String(x));
    this.displayElement.setAttribute('y2', String(y));
    
  }

  setStrokeColor(color = 'rgb(255, 255, 255)') {

    this.displayElement.setAttribute("stroke", color)

  }

  setStrokeWidth(width = '1') {

    this.displayElement.setAttribute("stroke-width", width)

  }

}
