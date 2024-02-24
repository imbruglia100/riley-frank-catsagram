let voted = false

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
}

const getCatPics = async () => {
    resetInfo()
    const catsJSON = await fetch("https://api.thecatapi.com/v1/images/search", {
        headers: {
                "x-api-key": "live_1dfrhQCPdRiKF5Uwezi43x2v4LJCyJ2Kp8agVnIUTzs5Tp8BcoG7urQpXDgCj2F3",
                "mode": "no-cors"
                }
    })
    const catsObj = await catsJSON.json()
    const imgCon = document.createElement("img")
    imgCon.src = catsObj[0].url

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
    voteCounter.appendChild(newCount)
}

const changeCat = (e) => {
    e.preventDefault()
    document.querySelector("img").remove()
    getCatPics()
}

const addComment = (e) => {
    e.preventDefault()
    const commentText = document.getElementById("commentText")
    const commentField = document.getElementById("commentField")
    const commentCon = document.createElement("li")
    const commentSpan = document.createElement("span")

    commentSpan.innerText = commentText.value
    commentCon.appendChild(commentSpan)
    commentField.appendChild(commentCon)

    commentText.value = ""
}

// getCatPics()

document.getElementById("button").addEventListener("click", changeCat)
document.getElementById("upVote").addEventListener("click", vote)
document.getElementById("downVote").addEventListener("click", vote)
document.getElementById("commentBtn").addEventListener("click", addComment)
