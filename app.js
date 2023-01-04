var app = {
  run: () => {

    let htmlMainContainer = document.getElementById('mainContainer')

    svgContainer =  document.createElementNS("http://www.w3.org/2000/svg", 'svg')
    svgContainer.setAttribute('width', String(window.innerWidth) + 'px')
    svgContainer.setAttribute('height', String(window.innerHeight) + 'px')
    svgContainer.setAttribute('id', 'svgMainContainer')
    
    let transmissionForm = new FormContainer(htmlMainContainer, svgContainer)

  }
}