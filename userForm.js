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

    this.createGCode = document.createElementNS("http://www.w3.org/1999/xhtml", 'button')
    this.createGCode.innerText = 'create G - Code'
    this.menuBar.append(this.createGCode)

    this.cutDepth = document.createElementNS("http://www.w3.org/1999/xhtml", 'input')
    this.cutDepth.type = 'text'
    this.menuBar.append(this.cutDepth)

    this.cutLayers = document.createElementNS("http://www.w3.org/1999/xhtml", 'input')
    this.cutLayers.type = 'text'
    this.menuBar.append(this.cutLayers)

    this.parentHtmlElement.append(this.svgContainer)
    
    this.transmission = new Transmission(svgContainer)
    this.newTransmissionButton.onclick = () => {

      this.transmission.showForm()

    }

    window.setInterval(() => {

      this.transmission.update()

    }, 100)

  }

}

class TextInput {

  constructor(parent, label) {

    this.parentElement = parent
    this.labelInputContainer = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.label = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.label.style.color = 'rgb(255, 255, 255)'
    this.label.style.marginRight = '5px'
    this.label.style.textAlign = 'right'
    this.label.style.width = '250px'
    this.label.innerText = label
    this.label.style.display = 'inline-block'
    this.input = document.createElementNS("http://www.w3.org/1999/xhtml", 'input')
    this.input.style.display = 'inline-block'

    this.labelInputContainer.appendChild(this.label)
    this.labelInputContainer.appendChild(this.input)
    this.parentElement.appendChild(this.labelInputContainer)
    
  }

  setValue(value) {
    this.input.value = value
  }

  getValue() {
    return Number(this.input.value)
  }

}