class InvoluteGear {

  constructor(parent) {

    this.radius = 100.0
    this.psi = Math.PI / 4

    this.points = []

    this.svg = []

    this.displayElement = document.createElementNS("http://www.w3.org/2000/svg", 'g')
    this.parent = parent
    this.parent.appendChild(this.displayElement)

    this.resolution = 0.25

    this.z = 36
    this.m = 3
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
    this.db = this.d0 * Math.cos(this.a0) // Grundkreis
    
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

  dOfSNull() {

  }

  invUp(alpha) {

    return Math.tan(alpha) - alpha

  }

  invDown(alpha) {

    return -1 * (Math.tan(alpha) - alpha)

  }

  involuteRadiusOf(alpha) {

    return this.df * 0.5 / Math.cos(alpha)

  }

  toothWidthOf(d, alpha) {

    return d * ((this.s0 / this.d0) + this.invUp(this.a0) - this.invUp(alpha))

  }

  pOf(radius) {

    return Math.PI * 2 * radius / Math.PI

  }

  calculate() {

    let d = this.db
    let shift = (2 * Math.PI) / this.z
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
  
        x = d * Math.cos(this.invUp(a) + shift * i)
        y = d * Math.sin(this.invUp(a) + shift * i)
  
        this.points.push({ x: x, y: y })
  
        d += this.resolution
  
      }

      s = this.toothWidthOf(this.dk, a) / (this.dk * 0.5)
     
      x = this.dk * Math.cos(this.invUp(a) + s + shift * i)
      y = this.dk * Math.sin(this.invUp(a) + s + shift * i)

      this.points.push({ x: x, y: y })

      while(d > this.db) {

        a = Math.acos((this.d0 / d) * Math.cos(this.a0))
  
        x = d * Math.cos(this.invDown(a) + sb + shift * i)
        y = d * Math.sin(this.invDown(a) + sb + shift * i)
  
        this.points.push({ x: x, y: y })
  
        d -= this.resolution
  
      }

      x = this.df * Math.cos(this.invUp(a) + sb + shift * i)
      y = this.df * Math.sin(this.invUp(a) + sb + shift * i)

      this.points.push({ x: x, y: y })

      x = this.df * Math.cos(this.invUp(a) + shift * i + shift)
      y = this.df * Math.sin(this.invUp(a) + shift * i + shift)

      this.points.push({ x: x, y: y })

    }

  }

  draw() {

    for(let i = 0; i < this.points.length; i++) {

      if(this.points[i + 1] != undefined) {

        let line  = new SvgLine(this.displayElement)
        line.setLineStart(this.points[i].x, this.points[i].y)
        line.setLineEnd(this.points[i + 1].x, this.points[i + 1].y)
        line.setStrokeWidth(1)

      }

    } 

  }

  translateRotate(angle, pos) {

    this.displayElement.setAttribute('transform',  `translate(${String(pos.x)}, ${String(pos.y)}) rotate(${String(angle)})`)

  }


}