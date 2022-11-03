class Gear {

  constructor(parent) {

    this.radius = 100.0
    this.psi = Math.PI / 4

    this.pointSeries = []

    this.svg = []

    this.displayElement = document.createElementNS("http://www.w3.org/2000/svg", 'g')
    this.parent = parent
    this.parent.appendChild(this.displayElement)
    
  }

  evolventeOpen(start_angle, resolution) {

    let points = []
    let t_step = this.psi / resolution
    let t = 0

    while(t < this.psi) {

      let next_point = { x: 0.0, y: 0.0 }

      next_point.x = this.radius * (Math.cos(t) + (t - start_angle) * Math.sin(t))
      next_point.y = this.radius * (Math.sin(t) - (t - start_angle) * Math.cos(t))

      points.push(next_point)

      t += t_step

    }

    this.pointSeries.push(points)

  }

  evolventeClose(start_angle, resolution) {

    let points = []
    let t_step = this.psi / resolution
    let t = 0

    while(t < this.psi) {

      let next_point = { x: 0.0, y: 0.0 }

      next_point.x = this.radius * (Math.cos(t) + (t - start_angle) * Math.sin(t))
      next_point.y = (-1) * this.radius * (Math.sin(t) - (t - start_angle) * Math.cos(t))

      points.push(next_point)

      t += t_step

    }

    this.pointSeries.push(points)

  }

  toSvg(strokeWidth) {

    this.pointSeries.forEach(points => {

      for(let i = 0; i < (points.length - 2); i += 1) {
      
        let line  = new SvgLine(this.displayElement)
        line.setLineStart(points[i].x, points[i].y)
        line.setLineEnd(points[i + 1].x, points[i + 1].y)
        line.setStrokeWidth(strokeWidth)
        
        this.svg.push(line)
  
      }  

    })

  }

  translate(x, y) {

    this.displayElement.setAttribute('transform', `translate(${String(x)}, ${String(y)})`)

  }

  rotate(angle, axis = { x: 0.0, y: 0.0 }) {

    this.translate(0.0, 0.0)

    this.displayElement.setAttribute('transform', `rotate(${String(angle)}, ${String(0.0)}, ${String(0.0)})`)
    
    this.translate(axis.x, axis.y)

  }

  translateRotate(angle, pos) {

    this.displayElement.setAttribute('transform',  `translate(${String(pos.x)}, ${String(pos.y)}) rotate(${String(angle)})`)

  }

}