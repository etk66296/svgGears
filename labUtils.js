class LabUtils {
  constructor() {

  }

  createElementNS(elementName) {

    return document.createElementNS("http://www.w3.org/1999/xhtml", elementName)

  }

  createElementSVG(elementName) {

    return document.createElementNS("http://www.w3.org/2000/svg", elementName)

  }



}