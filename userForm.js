class FormContainer {

  constructor(parentHtmlElement, svgContainer) {

    this.parentHtmlElement = parentHtmlElement
    this.svgContainer = svgContainer

    this.menuBar = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.menuBar.style.width = String(window.innerWidth) + 'px'
    this.menuBar.style.margin = '5px'
    this.parentHtmlElement.append(this.menuBar)
    
    this.newTransmissionButton = document.createElementNS("http://www.w3.org/1999/xhtml", 'button')
    this.newTransmissionButton.innerText = 'new transmission'
    this.menuBar.append(this.newTransmissionButton)

    this.buttonCreateGCode = document.createElementNS("http://www.w3.org/1999/xhtml", 'button')
    this.buttonCreateGCode.innerText = 'create G - Code'
    this.menuBar.append(this.buttonCreateGCode)

    this.labelCutDepth = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.labelCutDepth.style.display = 'inline-block'
    this.labelCutDepth.style.marginLeft = '20px'
    this.labelCutDepth.innerText = 'cut depth (1/mm): '
    this.menuBar.append(this.labelCutDepth)
    this.inputCutDepth = document.createElementNS("http://www.w3.org/1999/xhtml", 'input')
    this.inputCutDepth.type = 'text'
    this.inputCutDepth.value = '6.5'
    this.menuBar.append(this.inputCutDepth)

    this.labelStepDepth = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.labelStepDepth.style.display = 'inline-block'
    this.labelStepDepth.style.marginLeft = '20px'
    this.labelStepDepth.innerText = 'step depth (1/mm): '
    this.menuBar.append(this.labelStepDepth)
    this.inputCutSteps = document.createElementNS("http://www.w3.org/1999/xhtml", 'input')
    this.inputCutSteps.type = 'text'
    this.inputCutSteps.value = '0.8'
    this.menuBar.append(this.inputCutSteps)

    this.parentHtmlElement.append(this.svgContainer)

    this.gCode = ''
    
    this.transmission = new Transmission(svgContainer)
    this.newTransmissionButton.onclick = () => {

      this.transmission.showForm()

    }

    this.buttonCreateGCode.onclick = () => {

      let selectedGear = null
      this.transmission.gears.forEach(gear => {

        if(gear.isSelected) {

          selectedGear = gear

        }

      })

      

      this.generateGCodeString(selectedGear)
      this.showGCode()

    }

    window.setInterval(() => {

      this.transmission.update()

    }, 100)

    this.callbackOnCloseFormButton = () => {

      this.formContainer.removeChild(this.closeFormButton)
      this.htmlMainContainer.removeChild(this.formContainer)
      this.htmlMainContainer.removeChild(this.overlayElememnt)

    }

  }

  toPx(value) {

    return String(value) + 'px'

  }

  generateGCodeString(selectedGear) {

    this.gCode = ''
    let cutDepth = parseFloat(this.inputCutDepth.value)
    let stepDepth = parseFloat(this.inputCutSteps.value)

    for(let i = 0; i < cutDepth; i += stepDepth) {

      this.gCode += 'z -' + String(stepDepth)
      
      selectedGear.points.forEach(point => {

        this.gCode += 'x: ' + String(point.x) + ', y: ' + String(point.y) + '\n'

      })

      this.gCode += 'z -' + String(cutDepth)
      
      selectedGear.points.forEach(point => {

        this.gCode += 'x: ' + String(point.x) + ', y: ' + String(point.y) + '\n'

      })

      this.gCode += '\n'
    }
  }

  showGCode() {

    this.htmlMainContainer = document.getElementById('mainContainer')

    this.overlayElememnt = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.overlayElememnt.style.position = 'absolute'
    this.overlayElememnt.style.width = this.toPx(window.innerWidth)
    this.overlayElememnt.style.height = this.toPx(window.innerHeight)
    this.overlayElememnt.style.top = '0px'
    this.overlayElememnt.style.left = '0px'
    this.overlayElememnt.style.zIndex = '1'
    this.overlayElememnt.style.backgroundColor = '#000000'
    this.overlayElememnt.style.opacity = '0.8'
    this.htmlMainContainer.append(this.overlayElememnt)

    this.formContainer = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.formContainer.style.position = 'absolute'
    this.formContainer.style.width = this.toPx(window.innerWidth * 0.9)
    this.formContainer.style.height = this.toPx(window.innerHeight * 0.9)
    this.formContainer.style.zIndex = '2'
    this.formContainer.style.backgroundColor = '#000000'
    this.htmlMainContainer.append(this.formContainer)
    this.formContainer.style.left = this.toPx(window.innerWidth * 0.5 - this.formContainer.clientWidth * 0.5)
    this.formContainer.style.top = this.toPx(window.innerHeight * 0.5 - this.formContainer.clientHeight * 0.5)

    this.closeFormButton = document.createElementNS("http://www.w3.org/1999/xhtml", 'button')
    this.closeFormButton.style.position = 'absolute'
    this.closeFormButton.style.width = this.toPx(32)
    this.closeFormButton.style.height = this.toPx(32)
    this.closeFormButton.style.top = this.toPx(2)
    this.closeFormButton.style.right = this.toPx(2)
    this.closeFormButton.innerText = 'X'
    this.closeFormButton.onclick = this.callbackOnCloseFormButton
    this.formContainer.append(this.closeFormButton)

    this.modulContainerHtmlElem = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.modulContainerHtmlElem.style.height = '90%'
    this.modulContainerHtmlElem.style.margin = '10px'
    this.modulContainerHtmlElem.style.marginTop = '3%'
    this.gCodeTextarea = document.createElementNS("http://www.w3.org/1999/xhtml", 'textarea')
    this.gCodeTextarea.value = this.gCode
    this.gCodeTextarea.style.width = '100%'
    this.gCodeTextarea.style.height = '100%'
    this.gCodeTextarea.style.resize = 'none'
    this.gCodeTextarea.style.boxSizing = 'border-box'
    this.modulContainerHtmlElem.append(this.gCodeTextarea)
    this.formContainer.append(this.modulContainerHtmlElem)
    this.gCodeTextarea.select()

  }

}
