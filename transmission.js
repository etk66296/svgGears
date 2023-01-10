class Transmission {

  constructor(parentSvgElement) {

    this.parentSvgElement = parentSvgElement

    this.htmlMainContainer = null
    this.formContainer = null
    this.overlayElememnt = null
    this.closeFormButton = null
    this.addGearButton = null

    this.modulContainerHtmlElem = null
    this.labelModulHtmlElem = null
    this.inputModulHtmlElem = null
    this.zContainerHtmlElem = null
    this.labelZHtmlElem = null
    this.inputZHtmlElem = null
    this.a0ContainerHtmlElem = null
    this.labelA0HtmlElem = null
    this.inputA0HtmlElem = null

    this.numberOfAdmissionsContainerElem = null
    this.labelNumberOfAdmissions = null
    this.inputNumberOfAdmissions = null

    this.centerRadiusContainerElem = null
    this.labelCenterRadius = null
    this.inputCenterRadius = null

    this.admissionsRadiusContainer = null
    this.labelAdmissionsRadius = null
    this.inputAdmissionsRadius = null

    this.admissionDistanceToGearCenterContainer = null
    this.labelAdmissionDistanceToGearCenter = null
    this.inputAdmissionDistanceToGearCenter = null

    this.gearCounter = 0

    this.marginLeft = 20

    this.labelMaeginRight = '300px'
    this.callbackOnCloseFormButton = () => {

      this.formContainer.removeChild(this.closeFormButton)
      this.htmlMainContainer.removeChild(this.formContainer)
      this.htmlMainContainer.removeChild(this.overlayElememnt)

    }

    this.centerY = 0.0

    this.svgDisplayElement = document.createElementNS("http://www.w3.org/2000/svg", 'g')
    this.parentSvgElement.append(this.svgDisplayElement)
    this.gears = []
    this.activeGear = null

    this.callbackOnAddGearButton = () => {

      let newGear = new InvoluteGear(
        this.svgDisplayElement,
        this.gearCounter,
        this.inputNumberOfAdmissions.value,
        this.inputCenterRadius.value,
        this.inputAdmissionsRadius.value,
        this.inputAdmissionDistanceToGearCenter.value
      )
      newGear.setInitialValues(Number(this.inputZHtmlElem.value),
        Number(this.inputModulHtmlElem.value),
        Number(this.inputA0HtmlElem.value)
      )


      newGear.calculate()
      
      this.gears.push(newGear)

      newGear.transmissionPointer = this.gears
     

      if(this.gears.length > 1) {

        this.gears[this.gears.length -1].predecessorGear = this.gears[this.gears.length -2]

      }
      newGear.getPredecessorList()

      this.callbackOnCloseFormButton()
      newGear.draw()

      this.distance()

      this.gearCounter += 1

    }

   
    this.newHtmlElem = (elementName = 'div') => {
      return document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        elementName
      )
    }

    this.toPx = (num) => { return String(num) + 'px' }

    this.a0 = (Math.PI / 180) * 20 // alpha0 = 20°
    this.ab = 0.0

    
  }

  inv(a) {
    return Math.tan(a) - a

  }

  inverseInv(a) {

    return Math.pow(a, 1 / 3) / (0.693357 + 0.192484 * Math.pow(a, 2 / 3))

  }

  alphaB(gear1, gear2) {

    return this.inverseInv(2 * ((gear1.x + gear2.x) / (gear1.z + gear2.z)) * Math.tan(this.a0) + this.inv(this.a0))

  }
  
  distance() {

    this.gears.forEach(gear => {

      gear.reset()

    })

    if(this.gears.length == 1) {

      let newGear = this.gears[this.gears.length - 1]
      newGear.centerPosition.x = newGear.dk * 0.5 + this.marginLeft
      newGear.centerPosition.y = this.parentSvgElement.clientHeight * 0.5 - (newGear.dk * 0.5)
      this.centerY = newGear.centerPosition.y


    } else {

      let newGear = this.gears[this.gears.length - 1]
      let lastGear = this.gears[this.gears.length - 2]

      let alphaB = this.alphaB(newGear, lastGear)

      let gap = newGear.m * (newGear.z + lastGear.z) * Math.cos(newGear.a0) / (2 * Math.cos(alphaB))

      newGear.centerPosition.x = lastGear.centerPosition.x + gap
      newGear.centerPosition.y = lastGear.centerPosition.y

      
    }
    
    this.gears[this.gears.length - 1].setPos()

  }

  showForm() {

    this.htmlMainContainer = document.getElementById('mainContainer')

    this.overlayElememnt = this.newHtmlElem()
    this.overlayElememnt.style.position = 'absolute'
    this.overlayElememnt.style.width = this.toPx(window.innerWidth)
    this.overlayElememnt.style.height = this.toPx(window.innerHeight)
    this.overlayElememnt.style.top = '0px'
    this.overlayElememnt.style.left = '0px'
    this.overlayElememnt.style.zIndex = '1'
    this.overlayElememnt.style.backgroundColor = '#000000'
    this.overlayElememnt.style.opacity = '0.8'
    this.htmlMainContainer.append(this.overlayElememnt)

    this.formContainer = this.newHtmlElem()
    this.formContainer.style.position = 'absolute'
    this.formContainer.style.width = this.toPx(window.innerWidth * 0.5)
    this.formContainer.style.height = this.toPx(window.innerHeight * 0.5)
    this.formContainer.style.zIndex = '2'
    this.formContainer.style.backgroundColor = '#000000'
    this.htmlMainContainer.append(this.formContainer)
    this.formContainer.style.left = this.toPx(window.innerWidth * 0.5 - this.formContainer.clientWidth * 0.5)
    this.formContainer.style.top = this.toPx(window.innerHeight * 0.5 - this.formContainer.clientHeight * 0.5)

    this.closeFormButton = this.newHtmlElem('button')
    this.closeFormButton.style.position = 'absolute'
    this.closeFormButton.style.width = this.toPx(32)
    this.closeFormButton.style.height = this.toPx(32)
    this.closeFormButton.style.top = this.toPx(2)
    this.closeFormButton.style.right = this.toPx(2)
    this.closeFormButton.innerText = 'X'
    this.closeFormButton.onclick = this.callbackOnCloseFormButton
    this.formContainer.append(this.closeFormButton)

    this.modulContainerHtmlElem = this.newHtmlElem()
    this.modulContainerHtmlElem.style.margin = '10px'
    this.labelModulHtmlElem = this.newHtmlElem()
    this.labelModulHtmlElem.style.color = '#ffffff'
    this.labelModulHtmlElem.style.display = 'inline-block'
    this.labelModulHtmlElem.style.marginRight = '10px'
    this.labelModulHtmlElem.style.width = this.labelMaeginRight
    this.labelModulHtmlElem.innerText = 'modul: '
    this.modulContainerHtmlElem.append(this.labelModulHtmlElem)

    this.inputModulHtmlElem = this.newHtmlElem('input')
    this.inputModulHtmlElem.style.display = 'inline-block'
    this.inputModulHtmlElem.value = '10'
    this.inputModulHtmlElem.innerText = 'modul'
    this.modulContainerHtmlElem.append(this.inputModulHtmlElem)
    this.formContainer.append(this.modulContainerHtmlElem)

    this.zContainerHtmlElem = this.newHtmlElem()
    this.zContainerHtmlElem.style.margin = '10px'
    this.labelZHtmlElem = this.newHtmlElem()
    this.labelZHtmlElem.style.color = '#ffffff'
    this.labelZHtmlElem.style.display = 'inline-block'
    this.labelZHtmlElem.style.marginRight = '10px'
    this.labelZHtmlElem.style.width = this.labelMaeginRight
    this.labelZHtmlElem.innerText = 'z: '
    this.zContainerHtmlElem.append(this.labelZHtmlElem)

    this.inputZHtmlElem = this.newHtmlElem('input')
    this.inputZHtmlElem.style.display = 'inline-block'
    this.inputZHtmlElem.innerText = 'modul'
    this.inputZHtmlElem.value = '36'
    this.zContainerHtmlElem.append(this.inputZHtmlElem)
    this.formContainer.append(this.zContainerHtmlElem)

    this.a0ContainerHtmlElem = this.newHtmlElem()
    this.a0ContainerHtmlElem.style.margin = '10px'
    this.labelA0HtmlElem = this.newHtmlElem()
    this.labelA0HtmlElem.style.color = '#ffffff'
    this.labelA0HtmlElem.style.display = 'inline-block'
    this.labelA0HtmlElem.style.marginRight = '10px'
    this.labelA0HtmlElem.style.width = this.labelMaeginRight
    this.labelA0HtmlElem.innerText = 'a0: '
    this.a0ContainerHtmlElem.append(this.labelA0HtmlElem)

    this.inputA0HtmlElem = this.newHtmlElem('input')
    this.inputA0HtmlElem.style.display = 'inline-block'
    this.inputA0HtmlElem.innerText = 'modul'
    this.inputA0HtmlElem.value = '20'
    this.a0ContainerHtmlElem.append(this.inputA0HtmlElem)
    this.formContainer.append(this.a0ContainerHtmlElem)

    // numberOfAdmissions
    this.numberOfAdmissionsContainerElem = this.newHtmlElem()
    this.numberOfAdmissionsContainerElem.style.margin = '10px'
    this.labelNumberOfAdmissions = this.newHtmlElem()
    this.labelNumberOfAdmissions.style.color = '#ffffff'
    this.labelNumberOfAdmissions.style.display = 'inline-block'
    this.labelNumberOfAdmissions.style.marginRight = '10px'
    this.labelNumberOfAdmissions.style.width = this.labelMaeginRight
    this.labelNumberOfAdmissions.innerText = 'number of admission: '
    this.numberOfAdmissionsContainerElem.append(this.labelNumberOfAdmissions)

    this.inputNumberOfAdmissions = this.newHtmlElem('input')
    this.inputNumberOfAdmissions.style.display = 'inline-block'
    this.inputNumberOfAdmissions.innerText = 'modul'
    this.inputNumberOfAdmissions.value = '4'
    this.numberOfAdmissionsContainerElem.append(this.inputNumberOfAdmissions)
    this.formContainer.append(this.numberOfAdmissionsContainerElem)

    // centerRadius
    this.centerRadiusContainerElem = this.newHtmlElem()
    this.centerRadiusContainerElem.style.margin = '10px'
    this.labelNumberOfAdmissions = this.newHtmlElem()
    this.labelNumberOfAdmissions.style.color = '#ffffff'
    this.labelNumberOfAdmissions.style.display = 'inline-block'
    this.labelNumberOfAdmissions.style.marginRight = '10px'
    this.labelNumberOfAdmissions.style.width = this.labelMaeginRight
    this.labelNumberOfAdmissions.innerText = 'center radius: '
    this.centerRadiusContainerElem.append(this.labelNumberOfAdmissions)

    this.inputCenterRadius = this.newHtmlElem('input')
    this.inputCenterRadius.style.display = 'inline-block'
    this.inputCenterRadius.innerText = 'modul'
    this.inputCenterRadius.value = '3'
    this.centerRadiusContainerElem.append(this.inputCenterRadius)
    this.formContainer.append(this.centerRadiusContainerElem)

    // admissionsRadius
    this.admissionsRadiusContainer = this.newHtmlElem()
    this.admissionsRadiusContainer.style.margin = '10px'
    this.labelAdmissionsRadius = this.newHtmlElem()
    this.labelAdmissionsRadius.style.color = '#ffffff'
    this.labelAdmissionsRadius.style.display = 'inline-block'
    this.labelAdmissionsRadius.style.marginRight = '10px'
    this.labelAdmissionsRadius.style.width = this.labelMaeginRight
    this.labelAdmissionsRadius.innerText = 'admission radius: '
    this.admissionsRadiusContainer.append(this.labelAdmissionsRadius)

    this.inputAdmissionsRadius = this.newHtmlElem('input')
    this.inputAdmissionsRadius.style.display = 'inline-block'
    this.inputAdmissionsRadius.innerText = 'modul'
    this.inputAdmissionsRadius.value = '3'
    this.admissionsRadiusContainer.append(this.inputAdmissionsRadius)
    this.formContainer.append(this.admissionsRadiusContainer)

    // admissionDistanceToGearCenter
    this.admissionDistanceToGearCenterContainer = this.newHtmlElem()
    this.admissionDistanceToGearCenterContainer.style.margin = '10px'
    this.labelAdmissionDistanceToGearCenter = this.newHtmlElem()
    this.labelAdmissionDistanceToGearCenter.style.color = '#ffffff'
    this.labelAdmissionDistanceToGearCenter.style.display = 'inline-block'
    this.labelAdmissionDistanceToGearCenter.style.marginRight = '10px'
    this.labelAdmissionDistanceToGearCenter.style.width = this.labelMaeginRight
    this.labelAdmissionDistanceToGearCenter.innerText = 'admission distance to gear center: '
    this.admissionDistanceToGearCenterContainer.append(this.labelAdmissionDistanceToGearCenter)

    this.inputAdmissionDistanceToGearCenter = this.newHtmlElem('input')
    this.inputAdmissionDistanceToGearCenter.style.display = 'inline-block'
    this.inputAdmissionDistanceToGearCenter.innerText = 'modul'
    this.inputAdmissionDistanceToGearCenter.value = '12'
    this.admissionDistanceToGearCenterContainer.append(this.inputAdmissionDistanceToGearCenter)
    this.formContainer.append(this.admissionDistanceToGearCenterContainer)

    this.addGearButton = this.newHtmlElem('button')
    this.addGearButton.innerText = 'add'
    this.addGearButton.style.marginLeft = '10px'
    this.addGearButton.onclick = this.callbackOnAddGearButton
    this.formContainer.append(this.addGearButton)

    


  }

  update() {


    for(let i = 0; i < this.gears.length; i++) {
       
      this.gears[i].setPos()
        
      if(i > 0) {
          
        this.gears[i].rotationSpeed = (this.gears[i - 1].rotationSpeed * this.gears[i -1].z) / this.gears[i].z
          
      }
        
      this.gears[i].update()
    }


  }

}