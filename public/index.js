let voted = false

const storeData = (key, data) => {
    localStorage.setItem(key, `${data}`)
}
const createCommentEl = (parent, msg) => {
    const commentCon = document.createElement("li")
    const commentSpan = document.createElement("span")
    const deleteX = document.createElement("div")
    deleteX.classList.add('x')

    deleteX.innerText = 'x'
    commentSpan.innerText = msg
    commentCon.appendChild(commentSpan)
    commentCon.appendChild(deleteX)
    parent.appendChild(commentCon)

}

const restoreData = () => {
    const img = document.getElementById("catImg")
    img.src = localStorage.getItem("img")

    const voteCounter = document.getElementById("count")
    const numberCount = document.getElementById("numberCount")

    voteCounter.dataset.count = localStorage.getItem("vote") ? localStorage.getItem("vote") : 0;
    numberCount.innerText = voteCounter.dataset.count

    if(localStorage.getItem('comments')){
        const comments = localStorage.getItem("comments").split('%2')
        comments.forEach(el =>{
        createCommentEl(document.getElementById("commentField"), el)
    })
    }
}
const resetInfo = () => {
    const voteCounter = document.getElementById("count")
    const numberCount = document.getElementById("numberCount")
    const upVote = document.getElementById("upVote")
    const downVote = document.getElementById("downVote")

    voteCounter.dataset.count = 0
    numberCount.innerText = voteCounter.dataset.count
    voted = false
    downVote.disabled = false
    upVote.disabled = false

    const commentField = document.getElementById("commentField")
    commentField.remove()

    const commentText = document.getElementById("commentText")
    commentText.value = ""

    const newCommentField = document.createElement("ul")
    newCommentField.id = "commentField"


    document.body.appendChild(newCommentField)
    localStorage.clear()
}

const getCatPics = async () => {
    resetInfo()
    // let isPending = true;

    let catsPromise = new Promise( (res, rej) => {
        res(fetch("https://api.thecatapi.com/v1/images/search", {
            headers: {
                    "x-api-key": "live_1dfrhQCPdRiKF5Uwezi43x2v4LJCyJ2Kp8agVnIUTzs5Tp8BcoG7urQpXDgCj2F3",
                    "mode": "no-cors"
                    }
        }))
    })
    // const loadingIcon = document.getElementById("svgCon")
    const catsJSON = await catsPromise
    const catsObj = await catsJSON.json()
    const imgCon = document.createElement("img")
    imgCon.id = "catImg"
    imgCon.src = catsObj[0].url
    storeData("img", catsObj[0].url)

    // isPending = false
    document.getElementById("imgCon").appendChild(imgCon)

}

const vote = ({ target }) => {

    const voteCounter = document.getElementById("count")
    const numberCount = document.getElementById("numberCount")
    const upVote = document.getElementById("upVote")
    const downVote = document.getElementById("downVote")

    let count = +voteCounter.dataset.count
    numberCount.remove()

    if(target.id === "upVote"){
        if(!voted){
            voted = true
            voteCounter.dataset.count = ++count
            downVote.disabled = true
        }else{
            voted = false
            voteCounter.dataset.count = --count
            downVote.disabled = false
        }

    }else if(target.id === "downVote"){
        if(!voted){
            voted = true
            voteCounter.dataset.count = --count
            upVote.disabled = true
        }else{
            voted = false
            voteCounter.dataset.count = ++count
            upVote.disabled = false
        }
    }
    const newCount = document.createElement("span")
    newCount.id = "numberCount"
    newCount.innerText = voteCounter.dataset.count
    storeData("vote", voteCounter.dataset.count)
    voteCounter.appendChild(newCount)
}
//may have bugs here
const changeCat = (e) => {
    e.preventDefault()
    document.getElementById("catImg").remove()
    getCatPics()
}

const addComment = (e) => {
    e.preventDefault()
    const commentText = document.getElementById("commentText")
    const commentField = document.getElementById("commentField")

    if(!localStorage.getItem("comments")){
        storeData("comments", commentText.value)
    } else {
        storeData("comments", localStorage.getItem("comments") + "%2" + commentText.value)
    }

    createCommentEl(commentField, commentText.value)
    // document.getElementsByTagName("li").addEventListener("hover", (e) => {
    //     console.log(e)
    // })

    commentText.value = ""

}

const remove =(e) => {
    e.preventDefault()
    let parent = e.target.parentNode
    if(e.target.className === 'x' ){
        const innerText = parent.children[0].innerText
        const commentsArr = localStorage.getItem("comments").split('%2')
        const filterComments = commentsArr.filter( el => {
            return el !== innerText
        })
        storeData("comments", filterComments.join('%2'))
        parent.remove()
    }
}

window.onload = () => {
    if(localStorage.getItem("img")){
        restoreData()
        }else{
        getCatPics()
        }
}



document.getElementById("button").addEventListener("click", changeCat)
document.getElementById("upVote").addEventListener("click", vote)
document.getElementById("downVote").addEventListener("click", vote)
document.getElementById("commentBtn").addEventListener("click", addComment)
document.getElementById("commentField").addEventListener("click", remove)
