var app = {
  run: () => {

    let htmlMainContainer = document.getElementById('mainContainer')

    let menuBar = document.createElementNS("http://www.w3.org/1999/xhtml", 'div')
    menuBar.style.width = String(window.innerWidth) + 'px'
    htmlMainContainer.append(menuBar)
    
    let svgContainer =  document.createElementNS("http://www.w3.org/2000/svg", 'svg')
    svgContainer.setAttribute('width', String(window.innerWidth) + 'px')
    svgContainer.setAttribute('height', String(window.innerHeight) + 'px')
    svgContainer.setAttribute('id', 'svgMainContainer')
    htmlMainContainer.append(svgContainer)
    
    
    let newTransmissionButton = document.createElementNS("http://www.w3.org/1999/xhtml", 'button')
    newTransmissionButton.innerText = 'new transmission'
    let transmission = new Transmission(svgContainer)
    newTransmissionButton.onclick = () => {

      transmission.showForm()

    }
    menuBar.append(newTransmissionButton)

    window.setInterval(() => {

      transmission.update()

    }, 100)

    

    

    // let svgContainer = document.getElementById('svgMainContainer')
    // let involuteGearA = new InvoluteGear(svgContainer)
    // let involuteGearB = new InvoluteGear(svgContainer)
    // let innerInvoluteGearA = new InnerInvoluteGear(svgContainer)
    // involuteGearB.rotationDirection = -1
    // involuteGearB.rotOffset = -1.65
    // involuteGearA.calculate()
    // involuteGearA.draw()
    // involuteGearB.calculate()
    // involuteGearB.draw()

    // let angle = Math.PI * 0.5
    // let gearDistance = (involuteGearA.z + involuteGearB.z) * involuteGearA.m * 1.038
    // let rotationCenterA = { x: 500.0, y: 400.0 }
    // let rotationCenterB = { x: 500.0 + gearDistance, y: 400.0 }
    // involuteGearA.translateRotate(angle, rotationCenterA)
    // involuteGearB.translateRotate(angle, rotationCenterB)

    // innerInvoluteGearA.calculate()
    // innerInvoluteGearA.draw()
    // innerInvoluteGearA.translateRotate(0, { x: 200, y: 400 })

    

    // window.setInterval(() => {
    //   involuteGearA.translateRotate(angle, rotationCenterA)
    //   involuteGearB.translateRotate(angle, rotationCenterB)
    //   angle += 1

    // }, 100)

  }
}