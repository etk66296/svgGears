class InvoluteGear {

  constructor(parent) {

    this.radius = 100.0
    this.psi = Math.PI / 4

    this.points = []
    this.edgePoints = []

    this.svg = []

    this.displayElement = document.createElementNS("http://www.w3.org/2000/svg", 'g')
    this.parent = parent
    this.parent.appendChild(this.displayElement)

    this.resolution = 0.25

    this.rotationDirection = 1
    this.rotOffset = 0.0
    this.centerPosition = { x: 0, y: 0 }

    this.z = 36
    this.m = 10
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
    this.sb = this.toothWidthOf(this.db, 0.0) / (this.db * 0.5)

    this.toothStart  = { x: 0.0, y: 0.0 }
    this.toothCenter  = { x: 0.0, y: 0.0 }
    this.toothEnd  = { x: 0.0, y: 0.0 }
    this.gapCenter = { x: 0.0, y: 0.0 }
    this.gapEnd = { x: 0.0, y: 0.0 }
    this.toothCenterAngle = 0.0
    this.gapCenterAngle = 0.0

    this.rotDir = 1
    this.rotationSpeed = 1
    this.rotationAngle = 0
    this.isOdd = false

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

  setInitialValues(z, m, a0) {

    this.z = z
    this.m = m
    this.shift = (2 * Math.PI) / this.z
    this.c = 0.162 * this.m // Zahnkopfspiel
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
    this.sb = this.toothWidthOf(this.db, 0.0) / (this.db * 0.5)

  }

  norm(point) {

    return Math.sqrt(point.x * point.x + point.y * point.y)
    
  }

  dotProduct(pointA, pointB) {

    return pointA.x * pointB.x + pointA.y * pointB.y

  }

  degreesBetweenTwoPoints(pointA, pointB) {

    let angleInRad = Math.acos(this.dotProduct(pointA, pointB) / (this.norm(pointA) * this.norm(pointB)))

    return 360 * angleInRad / (Math.PI * 2)

  }


  calculate() {

    let r = this.db * 0.5
    let x = 0.0
    let y = 0.0
    let a = 0.0
    let s = 0.0

    // for(let i = 0; i <= 0; i += 1) {
    for(let i = 0; i < this.z; i += 1) {

      r = this.db * 0.5
      a = 0.0
      s = 0.0

      

      if(i == 0) {

        x = r * Math.cos(this.invUp(a) + this.shift * i)
        y = r * Math.sin(this.invUp(a) + this.shift * i)
  
        this.points.push({ x: x, y: y })
        this.toothStart.x = x
        this.toothStart.y = y

      }

      while(r < (this.dk * 0.5)) {

        a = Math.acos((this.d0 / (2 * r)) * Math.cos(this.a0))
  
        x = r * Math.cos(this.invUp(a) + this.shift * i)
        y = r * Math.sin(this.invUp(a) + this.shift * i)
  
        this.points.push({ x: x, y: y })
  
        r += this.resolution
  
      }

      s = this.toothWidthOf(this.dk, a) / (this.dk * 0.5)
     
      x = 0.5 * this.dk * Math.cos(this.invUp(a) + s * 0.5 + this.shift * i)
      y = 0.5 * this.dk * Math.sin(this.invUp(a) + s * 0.5 + this.shift * i)

      this.points.push({ x: x, y: y })

      if(i == 0) {
        this.toothCenter.x = x
        this.toothCenter.y = y
      }

      x = 0.5 * this.dk * Math.cos(this.invUp(a) + s + this.shift * i)
      y = 0.5 * this.dk * Math.sin(this.invUp(a) + s + this.shift * i)

      this.points.push({ x: x, y: y })

      while(r > (this.db * 0.5)) {

        a = Math.acos((this.d0 / (2 * r)) * Math.cos(this.a0))
  
        x = r * Math.cos(this.invDown(a) + this.sb + this.shift * i)
        y = r * Math.sin(this.invDown(a) + this.sb + this.shift * i)
  
        this.points.
        push({ x: x, y: y })
  
        r -= this.resolution
  
      }

      x = 0.5 * this.df * Math.cos(this.invDown(a) + this.sb + this.shift * i)
      y = 0.5 * this.df * Math.sin(this.invDown(a) + this.sb + this.shift * i)

      this.points.push({ x: x, y: y })

      if(i == 0) {
        this.toothEnd.x = x
        this.toothEnd.y = y
      }

      x = 0.5 * this.df * Math.cos(this.invUp(a) + this.shift * i + this.shift)
      y = 0.5 * this.df * Math.sin(this.invUp(a) + this.shift * i + this.shift)

      this.points.push({ x: x, y: y })

      if(i == 0) {

        this.gapEnd.x = x
        this.gapEnd.y = y

        let xa = this.points[this.points.length - 2].x
        let ya = this.points[this.points.length - 2].y

        let xb = this.points[this.points.length - 1].x
        let yb = this.points[this.points.length - 1].y

        this.gapCenter.x = (xa + xb) * 0.5
        this.gapCenter.y = (ya + yb) * 0.5

        this.toothCenterAngle = this.degreesBetweenTwoPoints(this.toothStart, this.toothCenter)

        this.gapCenterAngle =this.degreesBetweenTwoPoints(this.gapCenter, this.gapEnd)

      }

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

  update() {

    this.rotationAngle += (this.rotDir * this.rotationSpeed)

  }

  reset() {
    this.rotationAngle = 0.0

    if(this.isOdd) {

      this.setPosOdd()

    } else {
      this.setPosEven()
    }
  }

  translateRotate(angle, pos) {

    // this.displayElement.setAttribute('transform', `translate(${String(pos.x)}, ${String(pos.y)}) rotate(${String(angle * this.rotationDirection + this.rotOffset)})`)

  }

  rotateS0() {

    this.displayElement.setAttribute('transform', `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)}) rotate(${this.gapCenterAngle})`)

  }

  setPosOdd() {

    this.displayElement.setAttribute('transform', `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)}) rotate(${this.gapCenterAngle + this.rotationAngle})`)

  }

  setPosEven() {

    this.displayElement.setAttribute('transform', `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)}) rotate(${(-1) * this.toothCenterAngle + this.rotationAngle})`)

  }


}