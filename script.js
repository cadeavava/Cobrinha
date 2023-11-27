const canvas = document.querySelector("canvas") /*Pega o elemento canvas*/
const ctx = canvas.getContext("2d") /*definir contexto p 2d*/

const score = document.querySelector(".valor")
const final = document.querySelector(".final > span")
const menu = document.querySelector(".menu")
const botao = document.querySelector(".replay")

const size = 30 /*tamanho dos quadradinhos*/

let cobra = [
    { x: 270, y: 270 }
  /*array da cobra, o x e y são as coordenadas das posições dos quadradinhos*/ 
]

const incrementarScore = () =>{
    score.innerText = parseInt(score.innerText) + 10
}

const numAleatorio = (min, max) =>{
    return Math.round(Math.random() * (max - min) + min)
}

const posiAleatoria = () =>{
    const numero = numAleatorio(0, canvas.width - size)
    return Math.round(numero / 30) * 30
}

const corAleatoria = () =>{
    const red = numAleatorio(0, 255)
    const green = numAleatorio(0, 255)
    const blue = numAleatorio(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const comida = {
    x: posiAleatoria(),
    y: posiAleatoria(),
    color: corAleatoria()
}

let direction, LoopId

const desenharComida = () =>{
    const {x, y, color} = comida

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(comida.x, comida.y, size, size)
    ctx.shadowBlur = 0
}

const desenharCobra = () => {
    ctx.fillStyle = "white"

    cobra.forEach((position, index) => {
        if (index == cobra.length - 1) {
            ctx.fillStyle = "blue"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moverCobra = () => {
    if (!direction) return
    const head = cobra[cobra.length - 1] /*define cabeça da cobra*/

    cobra.shift() /*tira cabeça da cobra*/

    if (direction == "right")
    {
        cobra.push({ x: head.x + size, y: head.y })  /*adiciona novo elemento de cabeça na direção escolhida - direita*/
    }

    if (direction == "left")
    {
        cobra.push({ x: head.x - size, y: head.y })  /*adiciona novo elemento de cabeça na direção escolhida - esquerda*/
    }

    if (direction == "down")
    {
        cobra.push({ x: head.x, y: head.y + size })  /*adiciona novo elemento de cabeça na direção escolhida - baixo*/
    }

    if (direction == "up")
    {
        cobra.push({ x: head.x, y: head.y - size })  /*adiciona novo elemento de cabeça na direção escolhida - cima*/
    }
}

const desenharGrid = () =>{
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30)
    {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const check = () =>{
    const head = cobra[cobra.length - 1]

    if (head.x == comida.x && head.y == comida.y)
    {
        incrementarScore()
        cobra.push(head)

        let x = posiAleatoria()
        let y = posiAleatoria()

        while (cobra.find((position) => position.x == x && position.y == y)) {
            x = posiAleatoria()
            y = posiAleatoria()
        }

        comida.x = x
        comida.y = y
        comida.color = corAleatoria()
    }
}

const perdeu = () =>{
    const head = cobra[cobra.length - 1]
    const limite = canvas.width - size
    const pescoco = cobra.length - 2

    const coliParede = head.x < 0 || head.y < 0 || head.x > limite || head.y > limite
    const coliSelf = cobra.find((position, index)=>{
        return index < pescoco && position.x == head.x && position.y == head.y
    }) 
    if (coliParede || coliSelf)
    {
        gameover()
    }
}

const gameover = () => {
    direction = undefined

    menu.style.display = "flex"
    final.style.display = "flex"
    final.innerText = score.innerText

    canvas.style.filter = "blur(0.2vh)"

}

const gameLoop = () => { /*criar o loop do jogo*/
    clearInterval(LoopId)
    ctx.clearRect (0, 0, 600, 600) /*limpar tela*/
    desenharGrid()
    desenharComida()

    moverCobra()
    desenharCobra()
    check()
    perdeu()

    LoopId = setTimeout(() => {
        gameLoop()
    }, 200);
}

gameLoop()

document.addEventListener("keydown", ({key}) => {
    
    if (key == "ArrowRight" && direction != "left")
    {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right")
    {
        direction = "left"
    }

    if (key == "ArrowUp" && direction != "down")
    {
        direction = "up"
    }

    if (key == "ArrowDown" && direction != "up")
    {
        direction = "down"
    }
})

botao.addEventListener("click", () =>{
    score.innerText ="00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    cobra = [{ x: 270, y: 270 }]
})