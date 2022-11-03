class TextInput {

  constructor(parent, label) {

    this.parentElement = parent
    this.labelInputContainer = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.label = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    this.label.style.color = 'rgb(255, 255, 255)'
    this.label.style.marginRight = '5px'
    this.label.style.textAlign = 'right'
    this.label.style.width = '100px'
    this.label.innerText = label
    this.label.style.display = 'inline-block'
    this.input = document.createElementNS("http://www.w3.org/1999/xhtml", 'input')
    this.input.style.display = 'inline-block'

    this.labelInputContainer.appendChild(this.label)
    this.labelInputContainer.appendChild(this.input)
    this.parentElement.appendChild(this.labelInputContainer)
    

  }

}