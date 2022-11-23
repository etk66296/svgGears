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

    this.rotationDirection = 1
    this.rotOffset = 0.0
    this.centerPosition = { x: 0, y: 0 }

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
    
    this.x = 0.0 // Profilverschiebungsfaktor
    this.dk = this.m * (this.z + 2 * this.x + 2) // Kopfkreisdurchmesser
    this.d0 = this.m * this.z // Teilkreisdurchmesser
    this.db = this.d0 * Math.cos(this.a0) // Grundkreis
    this.df = this.m * (this.z + 2 * this.x - 2 ) - 2 * this.c // Fusskreis
    
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

  setZMA0(z, m, a0) {

    this.z = z
    this.m = m
    this.shift = (2 * Math.PI) / this.z
    this.c = 0.162 * this.m// Zahnkopfspiel
    this.hk = this.m // Zahnkopfhöhe
    this.hf = this.m + this.c // Zahnfusshöhe
    this.h = this.hk + this.hf // Zahnhöhe
    
    this.a0 = (Math.PI / 180) * a0 // alpha0 = 20°
    this.p0 = this.m * Math.PI / this.z // Umfangsteilung
    this.pb = Math.PI * this.m * Math.cos(this.a0)
    
    this.x = 0.0 // Profilverschiebungsfaktor
    this.dk = this.m * (this.z + 2 * this.x + 2) // Kopfkreisdurchmesser
    this.d0 = this.m * this.z // Teilkreisdurchmesser
    this.db = this.d0 * Math.cos(this.a0) // Grundkreis
    this.df = this.m * (this.z + 2 * this.x - 2 ) - 2 * this.c // Fusskreis
    
    this.s0 = this.m * (Math.PI * 0.5 + 2 * this.x * Math.tan(this.a0)) // Zahndicke

  }


  calculate() {

    let d = this.db
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

      s = this.toothWidthOf(this.dk, a) / (this.dk * 0.5)
     
      x = this.dk * Math.cos(this.invUp(a) + s + this.shift * i)
      y = this.dk * Math.sin(this.invUp(a) + s + this.shift * i)

      this.points.push({ x: x, y: y })

      while(d > this.db) {

        a = Math.acos((this.d0 / d) * Math.cos(this.a0))
  
        x = d * Math.cos(this.invDown(a) + sb + this.shift * i)
        y = d * Math.sin(this.invDown(a) + sb + this.shift * i)
  
        this.points.
        push({ x: x, y: y })
  
        d -= this.resolution
  
      }

      x = this.df * Math.cos(this.invUp(a) + sb + this.shift * i)
      y = this.df * Math.sin(this.invUp(a) + sb + this.shift * i)

      this.points.push({ x: x, y: y })

      x = this.df * Math.cos(this.invUp(a) + this.shift * i + this.shift)
      y = this.df * Math.sin(this.invUp(a) + this.shift * i + this.shift)

      this.points.push({ x: x, y: y })

    }

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

  }

  translateRotate(angle, pos) {

    this.displayElement.setAttribute('transform',  `translate(${String(pos.x)}, ${String(pos.y)}) rotate(${String(angle * this.rotationDirection + this.rotOffset)})`)

  }

  setPos() {
    this.displayElement.setAttribute('transform',  `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)})`)
  }


}