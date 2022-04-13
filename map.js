(function(){
    const form = document.querySelector('.card-interact__form')
    const coorX = form.point_x
    const coorY = form.point_y
    const inpName = form.name
    const buttonAdd = document.querySelector('.add-interactive')
    const buttonModify = document.querySelector('.modify-interactive')
    const cardInteract = document.querySelector('.card-interact')
    const imgInteract = document.querySelector('.card-interact img')
    const pointsInit = localStorage.getItem('interestPoints')

    let POINTS = (pointsInit)?JSON.parse(pointsInit):[]
    let SIZE = {}

    const clearcache = () => {
        localStorage.removeItem('interestPoints')
        document.location.reload()
    }

    const pointInterestClick = evt => {
        const point = evt.target
        if (btnModifyDisabled) {
            elemSelected = evt.target
            elemSelected.classList.add('point-moving')
            initMouseDetect()
        }
    }

    const addPointClick = (elem) => {
        if(!elem) {
            return console.error('error',elem)
        }
        elem.addEventListener('click', pointInterestClick)
    }

    const _resize = () => {
        SIZE = imgInteract.getBoundingClientRect()

        cardInteract.style.setProperty('--width', SIZE.width)
        cardInteract.style.setProperty('--height',SIZE.height)
    }

    let tmOutResize = null

    const resizing = () => {
        if (tmOutResize) clearTimeout(tmOutResize)
        cardInteract.classList.add('hide-point')
        tmOutResize = setTimeout(stopResize, 1000)
    }

    const stopResize = () => {
        cardInteract.classList.remove('hide-point')
        _resize()
    }
    
    const _init = () => {
        _resize()
        POINTS.forEach(pointSelected => {
            cardInteract.insertAdjacentHTML('beforeend', `<div id="pi_${pointSelected.id}" class="card-interact__point" style="--top:${pointSelected.point.y};--left:${pointSelected.point.x};" data-title="${pointSelected.name}"></div>`)
        });
        
        document.querySelector('.erase').addEventListener('click', clearcache)

        form.addEventListener('submit', submitForm)
        buttonAdd.addEventListener('click', toggleImageSelector)
        buttonModify.addEventListener('click', toggleImageModifySelector)
        setTimeout(_addMoreActionEventsAfter,500)

        window.addEventListener('resize', resizing)
    }

    const _addMoreActionEventsAfter = () => {
        Array.from(document.querySelectorAll('.card-interact__point')).forEach(elem=>addPointClick(elem))
    }

    const submitForm = (evt) => {
        evt.preventDefault()
        const {width, height} = imgInteract.getBoundingClientRect()

        const pointInterest = {
            id: Date.now(),
            point:{
                x:coorX.value,
                y:coorY.value
            },
            name:inpName.value
        }

        POINTS.push(pointInterest)
        cardInteract.insertAdjacentHTML('beforeend', `<div id="pi_${pointInterest.id}" class="card-interact__point" style="--top:${pointInterest.point.y};--left:${pointInterest.point.x};" data-title="${inpName.value}"></div>`)
        form.reset()
        localStorage.setItem('interestPoints', JSON.stringify(POINTS))
    }

    const changePointInterest = (pointChange) => {
        POINTS = POINTS.map(point=>{
            if (`pi_${point.id}`=== pointChange.id) {
                return pointChange
            }
            return point
        })
        localStorage.setItem('interestPoints', JSON.stringify(POINTS))
    }

    let elemSelected = null

    const cardMouseMove = (evt) => {
        if (btnModifyDisabled) {
            elemSelected.style.setProperty('--top', evt.offsetY / SIZE.height)
            elemSelected.style.setProperty('--left', evt.offsetX / SIZE.width)
        } else {
            coorX.value = evt.offsetX / SIZE.width
            coorY.value = evt.offsetY / SIZE.height
        }
    }

    const cardMouseDown = (evt) => {
        if (btnModifyDisabled) {
            elemSelected.style.setProperty('--top', evt.offsetY / SIZE.height)
            elemSelected.style.setProperty('--left', evt.offsetX / SIZE.width)
            changePointInterest({
                id: elemSelected.id,
                point:{
                    x: elemSelected.style.getPropertyValue('--left'),
                    y: elemSelected.style.getPropertyValue('--top'),
                },
                name: elemSelected.dataset.title,
            })
            elemSelected.classList.remove('point-moving')
            elemSelected = null
            destroyMouseDetect()
            toggleImageModifySelector()
        } else {
            coorX.value = evt.offsetX / SIZE.width
            coorY.value = evt.offsetY / SIZE.height
            toggleImageSelector()
            setTimeout(()=>inpName.focus(),300)
        }
    }

    const initMouseDetect = () => {
        imgInteract.addEventListener('mousemove', cardMouseMove)
        imgInteract.addEventListener('mousedown', cardMouseDown)
        SIZE = imgInteract.getBoundingClientRect()
    }

    const destroyMouseDetect = () => {
        imgInteract.removeEventListener('mousemove', cardMouseMove)
        imgInteract.removeEventListener('mousedown', cardMouseDown)
    }

    let btndisabled = false

    const toggleImageSelector = () => {
        if(btnModifyDisabled) toggleImageModifySelector()
        if(btndisabled) {
            // Disable detector
            buttonAdd.classList.remove('button')
            buttonAdd.classList.add('button-secondary')
            destroyMouseDetect()
        } else {
            // Enable detector
            buttonAdd.classList.remove('button-secondary')
            buttonAdd.classList.add('button')
            initMouseDetect()
        }
        btndisabled = !btndisabled
    }

    let btnModifyDisabled = false

    const toggleImageModifySelector = () => {
        if(btndisabled) toggleImageSelector()
        if (btnModifyDisabled) {
            buttonModify.classList.remove('button')
            buttonModify.classList.add('button-secondary')
        } else {
            buttonModify.classList.remove('button-secondary')
            buttonModify.classList.add('button')
        }
        btnModifyDisabled = !btnModifyDisabled
    }

    _init()
})()