class InnerInvoluteGear {

  constructor(parent) {

    this.radius = 100.0
    this.psi = Math.PI / 4

    this.points = []
    this.outlinePoints = []

    this.svg = []

    this.displayElement = document.createElementNS("http://www.w3.org/2000/svg", 'g')
    this.parent = parent
    this.parent.appendChild(this.displayElement)

    this.resolution = 0.75

    this.rotationDirection = 1
    this.rotOffset = 0.0

    this.z = 36
    this.m = 3
    this.shift = (2 * Math.PI) / this.z
    this.c = 0.162 * this.m // Zahnkopfspiel
    this.hk = this.m // Zahnkopfhöhe
    this.hf = this.m + this.c // Zahnfusshöhe
    this.h = this.hk + this.hf // Zahnhöhe
    
    this.a0 = (Math.PI / 180) * 20 // alpha0 = 20°
    this.p0 = this.m * Math.PI / this.z // Umfangsteilung
    this.pb = Math.PI * this.m * Math.cos(this.a0)
    
    this.dk = this.m * (this.z + 2) // Kopfkreisdurchmesser
    this.d0 = this.m * this.z // Teilkreisdurchmesser
    this.df = this.m * (this.z - 2 ) - 2 * this.c // Fusskreis
    this.db = this.d0 * Math.cos(this.a0) + this.z * 0.1 // Grundkreis

    this.dOutline = this.dk + 8 * this.m
    
    this.x = 0.0 // Profilverschiebungsfaktor
    this.s0 = this.m * (Math.PI * 0.5 + 2 * this.x * Math.tan(this.a0)) // Zahndicke

    /*
        _______________ ___ _____________ Kopfkreis dk
        hk             /   \
        _____________ /_p0__\ ___________ Teilkreis d0
        hf           /       \
                    /         \      /
                   / ____pb___ \    / ___ Grundkreis db
        __________ |           |____| ___ Fusskreis df
    */
    
  }

  invUp(alpha) {

    return Math.tan(alpha) - alpha

  }

  invDown(alpha) {

    return -1 * (Math.tan(alpha) - alpha)

  }

  toothWidthOf(d, alpha) {

    return d * ((this.s0 / this.d0) + this.invUp(this.a0) - this.invUp(alpha))

  }

  calculate() {

    let d = 0.0
    let x = 0.0
    let y = 0.0
    let a = 0.0
    let s = 0.0
    let sb = this.toothWidthOf(this.db, a) / (this.db * 0.5)

    // for(let i = 0; i <= 0; i += 1) {
    for(let i = 0; i <= this.z; i += 1) {

      d = this.db
      a = 0.0
      s = 0.0

      while(d < this.dk) {

        a = Math.acos((this.d0 / d) * Math.cos(this.a0))
  
        x = d * Math.cos(this.invUp(a) + this.shift * i)
        y = d * Math.sin(this.invUp(a) + this.shift * i)
  
        this.points.push({ x: x, y: y })
  
        d += this.resolution
  
      }

      d = this.dk

      x = d * Math.cos(this.invUp(a) + s + this.shift * i)
      y = d * Math.sin(this.invUp(a) + s + this.shift * i)

      this.points.push({ x: x, y: y })

      s = this.toothWidthOf(d, a) / (d * 0.5)

      x = d * Math.cos(this.invUp(a) + s + this.shift * i)
      y = d * Math.sin(this.invUp(a) + s + this.shift * i)

      this.points.push({ x: x, y: y })

      while(d > this.db) {

        a = Math.acos((this.d0 / d) * Math.cos(this.a0))
  
        x = d * Math.cos(this.invDown(a) + sb + this.shift * i)
        y = d * Math.sin(this.invDown(a) + sb + this.shift * i)
  
        this.points.push({ x: x, y: y })
  
        d -= this.resolution
  
      }

      d = this.db

      a = Math.acos((this.d0 / d) * Math.cos(this.a0))

      x = d * Math.cos(this.invUp(a) + sb + this.shift * i)
      y = d * Math.sin(this.invUp(a) + sb + this.shift * i)

      this.points.push({ x: x, y: y })

      x = d * Math.cos(this.invUp(a) + this.shift * i + this.shift)
      y = d * Math.sin(this.invUp(a) + this.shift * i + this.shift)

      this.points.push({ x: x, y: y })

    }

    for(let i = 0; i <= (2 * Math.PI); i += (this.resolution * 0.1)) {

      x = this.dOutline * Math.cos(i)
      y = this.dOutline * Math.sin(i)

      this.outlinePoints.push({ x: x, y: y })

    }

    x = this.dOutline * Math.cos(0)
    y = this.dOutline * Math.sin(0)
    this.outlinePoints.push({ x: x, y: y })

  }

  draw() {

    for(let i = 0; i < this.points.length; i++) {

      if(this.points[i + 1] != undefined) {

        let line  = new SvgLine(this.displayElement)
        line.setLineStart(this.points[i].x, this.points[i].y)
        line.setLineEnd(this.points[i + 1].x, this.points[i + 1].y)
        line.setStrokeColor('#000000')
        line.setStrokeWidth(1)

      }

    } 

    for(let i = 0; i < this.outlinePoints.length; i++) {

      if(this.outlinePoints[i + 1] != undefined) {

        let line  = new SvgLine(this.displayElement)
        line.setLineStart(this.outlinePoints[i].x, this.outlinePoints[i].y)
        line.setLineEnd(this.outlinePoints[i + 1].x, this.outlinePoints[i + 1].y)
        line.setStrokeColor('#000000')
        line.setStrokeWidth(1)

      }

    } 

  }

  translateRotate(angle, pos) {

    this.displayElement.setAttribute('transform',  `translate(${String(pos.x)}, ${String(pos.y)}) rotate(${String(angle * this.rotationDirection + this.rotOffset)})`)

  }


}