class InvoluteGear {

  constructor(parent, id, numberOfAdmissions = 4, centerRadius = 3, admissionsRadius = 6, admissionDistanceToGearCenter = 12) {

    this.id = id
    this.lineClass = 'line' + String(this.id)

    this.radius = 100.0
    this.psi = Math.PI / 4

    this.points = []
    this.edgePoints = []

    this.numberOfAdmissions = numberOfAdmissions
    this.admissionsRadius = admissionsRadius
    this.centerRadius = centerRadius
    this.admissionsDistanceToGearCenter = admissionDistanceToGearCenter
    this.admissionsResolution = 100
    this.admissionsPoints = []
    this.centerPoints = []
    this.admissionsCenter = []

    this.svg = []

    this.predecessorGears = []

    this.displayElement = document.createElementNS("http://www.w3.org/2000/svg", 'g')
    this.parent = parent
    this.parent.appendChild(this.displayElement)

    this.resolution = 0.25

    this.predecessorGear = null
    this.rotationDirection = 1
    this.rotOffset = 0.0
    this.centerPosition = { x: 0, y: 0 }
    this.hasBeenRotated = false

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
    for(let i = 0; i <= this.z; i += 1) {

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

      if(this.df * 0.5 < r) {

        x = 0.5 * this.df * Math.cos(this.invDown(a) + this.sb + this.shift * i)
        y = 0.5 * this.df * Math.sin(this.invDown(a) + this.sb + this.shift * i)
        
        this.points.push({ x: x, y: y })

      }

      if(i == 0) {
        this.toothEnd.x = x
        this.toothEnd.y = y
      }

      if(this.df * 0.5 < r) {

        x = 0.5 * this.df * Math.cos(this.invUp(a) + this.shift * i + this.shift)
        y = 0.5 * this.df * Math.sin(this.invUp(a) + this.shift * i + this.shift)

      } else {

        x = r * Math.cos(this.invUp(a) + this.shift * i + this.shift)
        y = r * Math.sin(this.invUp(a) + this.shift * i + this.shift)

      }

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

    this.calculateAdmission()

  }

  calculateAdmission() {

    for(let step = 0; step < (2 * Math.PI); step += ((2 * Math.PI / this.admissionsResolution))) {

      let x = Math.cos(step)
      let y = Math.sin(step)


      this.admissionsPoints.push({ x: this.admissionsRadius * x, y: this.admissionsRadius * y })
      this.centerPoints.push({ x: this.centerRadius * x, y: this.centerRadius * y })

    }

    for(let admissionsCenterAngle = 0; admissionsCenterAngle < (2 * Math.PI); admissionsCenterAngle += (2 * Math.PI / this.numberOfAdmissions)) {

      let x = this.admissionsDistanceToGearCenter * Math.cos(admissionsCenterAngle)
      let y = this.admissionsDistanceToGearCenter * Math.sin(admissionsCenterAngle)

      this.admissionsCenter.push({ x: x, y: y })

    }

  }

  draw() {

    for(let i = 0; i < this.points.length; i++) {

      if(this.points[i + 1] != undefined) {

        let line  = new SvgLine(this.displayElement)
        line.setClass(this.lineClass)
        line.setLineStart(this.points[i].x, this.points[i].y)
        line.setLineEnd(this.points[i + 1].x, this.points[i + 1].y)
        line.setStrokeColor('#000000')
        line.setStrokeWidth(1)

      }

    }

    this.admissionsCenter.forEach((center) => {

      for(let i = 0; i < this.admissionsPoints.length; i++) {

        if(this.admissionsPoints[i + 1] != undefined) {

          let line  = new SvgLine(this.displayElement)
          line.setClass(this.lineClass)
          line.setLineStart(this.admissionsPoints[i].x, this.admissionsPoints[i].y)
          line.setLineEnd(this.admissionsPoints[i + 1].x, this.admissionsPoints[i + 1].y)
          line.setStrokeColor('#000000')
          line.setStrokeWidth(1)

          line.displayElement.setAttribute('transform', `translate(${String(center.x)}, ${String(center.y)})`)

        }

      }

    })
    
    for(let i = 0; i < this.centerPoints.length; i++) {
      if(this.centerPoints[i + 1] != undefined) {

        let line  = new SvgLine(this.displayElement)
        line.setClass(this.lineClass)
        line.setLineStart(this.centerPoints[i].x, this.centerPoints[i].y)
        line.setLineEnd(this.centerPoints[i + 1].x, this.centerPoints[i + 1].y)
        line.setStrokeColor('#000000')
        line.setStrokeWidth(1)

      }
    }


  }

  update() {

    if(this.predecessorGear != null) {
      
      this.rotDir = -1 * this.predecessorGear.rotDir
      this.rotationAngle += (this.rotationSpeed * this.rotDir)

    } else {

      this.rotationAngle += (this.rotationSpeed * this.rotDir)

    }

  }

  reset() {

    this.rotationAngle = 0.0

    this.setPos()

   
  }

  rotateS0() {

    this.displayElement.setAttribute('transform', `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)}) rotate(${this.gapCenterAngle})`)

  }

  getPredecessorList(gear = this) {

    this.predecessorGears.push(gear.z % 2)

    if(gear.predecessorGear != null) {

      this.getPredecessorList(gear.predecessorGear)

    } else {

      console.log(gear.predecessorGear)

    }

  }

  setPos() {
   
    if(this.predecessorGear != null) {

      let doRotate = false

      if(!this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 0 && this.z % 2 == 0) {

        doRotate = true

      } else if (!this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 0 && this.z % 2 == 1) {

        doRotate = false

      } else if (!this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 1 && this.z % 2 == 0) {

        doRotate = true
        
      } else if (!this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 1 && this.z % 2 == 1) {

        doRotate = false

      } else if (this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 0 && this.z % 2 == 0) {
        
        doRotate = false
        
      } else if (this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 0 && this.z % 2 == 1) {

        doRotate = true
        
      } else if (this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 1 && this.z % 2 == 0) {

        doRotate = false
        
      } else if (this.predecessorGear.hasBeenRotated && this.predecessorGear.z % 2 == 1 && this.z % 2 == 1) {

        doRotate = true
        
      }
      
      if(doRotate) {

        this.displayElement.setAttribute('transform', `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)}) rotate(${(-1) * this.toothCenterAngle + this.rotationAngle})`)
        this.hasBeenRotated = true
        
      } else {
        
        this.displayElement.setAttribute('transform', `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)}) rotate(${this.gapCenterAngle + (this.rotationAngle)})`)
        this.hasBeenRotated = false

      }

    } else {

      this.displayElement.setAttribute('transform', `translate(${String(this.centerPosition.x)}, ${String(this.centerPosition.y)}) rotate(${this.gapCenterAngle + this.rotationAngle})`)
      this.hasBeenRotated = false

    }

  }

}