let el = document.querySelector(".loginuserdiv");
let postdiv = document.querySelector(".loginusercreatepost");
let postDiv = document.querySelector(".postbtn button");
let uppernav = document.querySelector(".uppernav");
let postdivnone = document.querySelector(".postdivnone .clear");
let posdivnoneandblock = document.querySelector(".postdiv");
let onepostallimgss = document.querySelectorAll(".onepostallimgss img");
let onepostallimgs = document.querySelector(".onepostallimgs");
let postauthor = document.querySelector(".comment-author");
let postcomments = document.querySelector(".post-comments");
let post = document.querySelector(".allcomments .comment-add");
let comment = document.querySelectorAll(".comment");
let commentdivnone = document.querySelector(".closecomments");
let allcommentdiv = document.querySelector(".allcomments");
let loginuserdiv = document.querySelector(".loginuserdiv");
let home = document.querySelector(".homess");
let allpostsallusers = document.querySelector(".onepost");
let likes = document.querySelectorAll(".likes");
let commentinput = document.querySelector(".commentinput");
let deleteBtn = document.querySelectorAll(".postdeletebtn");
let allpostscon = document.querySelector(".onepost");
let postcommentss = document.querySelector(".post-comments");
let closecomments = document.querySelector(".closecomments");

closecomments.addEventListener("click", (e) => {
  allcommentdiv.style.display = "none";
  home.style.overflow = "scroll";
  allpostsallusers.style.opacity = "1";
});

let input = document.querySelector(".commentinput");
post.addEventListener("click", async (e) => {
  let inputValue = input.value.trim();
  let postid = document
    .querySelector(".comment-author-img")
    .getAttribute("postid");

  let res = await fetch(`/home/post/comment/${postid}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment: inputValue,
    }),
  });
  let data = await res.json();
  let userId = document.querySelector(".onepost").getAttribute("userId");
  postcommentss.innerHTML = "";
  data.forEach((comment) => {

    let hh = comment.commentUserid._id;
      let btn =
        hh === userId
          ? `<i class="ri-delete-bin-line postdeletebtn commentdebtn" postid='${comment.postid}' commentid='${comment._id}'></i>`
          : "";
    postcommentss.innerHTML += `<div class="postcomment">
                       <div class="imgsss">
                                        <div class="comment-author-img" postid='${comment.postid}'>
                                            <img src="${comment.commentUserid.profilePicture}" alt="">
                                        </div>
                                         <div class="comment-author-username">
                                             <h2 class="ff">${comment.commentUserid.username}</h2>
                                     </div>
                            
                      </div>
                      <div class="commentcontent">
                      <p>${comment.comment}  ${btn}</p>
                  </div>
                  </div>

                  `;
  });

  let postdeletebtn = document.querySelectorAll(".postdeletebtn");
  
  postdeletebtn.forEach((postdeletebtn)=>{
    postdeletebtn.addEventListener("click", async (e) => {
      let postcomment = e.target.closest('.postcomment')
      let postid = e.target.closest(".commentdebtn").getAttribute("postid");
      let commentid = e.target.closest(".commentdebtn").getAttribute("commentid");
      let res =  await fetch(`/home/post/comment/delete/${postid}/${commentid}`,{
      method:"post"
      })
      let data = await res.json()
      postcomment.remove()
    });
   
  })
  input.value = "";
});

async function allPostsRender() {
  let res = await fetch("/home/post/all", {
    method: "get",
  });
  let data = await res.json();
  let userId = document.querySelector(".onepost").getAttribute("userId");
  data.forEach((post) => {
    let liked = JSON.stringify(post.likedby).includes(userId) ? "liked" : "";
    allpostscon.innerHTML += ` <div class="onepostall" Post-Id="${post._id}">
                    <div class="onepostallusername">
                      <div class="onepostallimg">
                        <img src="${post.postuserid.profilePicture}" alt="" srcset="">
                      </div>
                      <div class="onepostallusername">
                        <p>
                          ${post.postuserid.username}
                        </p>
                      </div>
                    </div>
                    <div class="onepostallimgs">
                      <div class="onepostallimgss">
                        <img src="${post.postimg}" alt="" srcset="">
                      </div>
                    </div>
                    <div class="onepostalltext">
                      <p> ${post.postcontent} </p>
                    </div>
                    <div class="onepotsallbtns">
                      <span><i class="ri-heart-line likes ${liked}"></i></span><span class="mf mflike">
                        ${post.likes} 
                      </span><i class="ri-chat-1-line comment" ></i>
                    </div>
                  </div>`;
  });
}
allPostsRender();

allpostsallusers.addEventListener("click", async function (e) {
  if (e.target.classList.contains("likes")) {
    try {
      let conterner = e.target.closest(".onepostall");
      let btn = e.target.closest(".likes");
      let postId = e.target.closest(".onepostall").getAttribute("Post-Id");
      let res = await fetch(`/home/post/like/${postId}`, {
        method: "post",
      });
      let data = await res.json();
      if (data) {
        let mflike = conterner.querySelector(".mflike");
        mflike.textContent = data.data.likes;
        if (data.liked === true) {
          btn.style.color = "#FF0034";
        }
        if (data.liked === false) {
          btn.style.color = "#000";
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (e.target.classList.contains("comment")) {
    let postAttribute = e.target.closest(".onepostall").getAttribute("post-id");
    let postauthor = document.querySelector(".comment-author");
    let postcomments = document.querySelector(".post-comments");
    let userId = document.querySelector(".onepost").getAttribute("userId");
    let userid = userId.toString();

    let res = await fetch(`/home/post/comment/${postAttribute}`, {
      method: "get",
    });
    let data = await res.json();
    postauthor.innerHTML = `<div class="comment-author-img" postid='${data.postid} '>
                        <img src="${data.findPost.postuserid.profilePicture}" alt="">
                    </div>
                    <div class="comment-author-username">
                        <h2>${data.findPost.postuserid.username}</h2>
                    </div>`;
                    postcomments.innerHTML = ''
    data.allCommentsThidPost.forEach((comment) => {
      let hh = comment.commentUserid._id;
      let btn =
        hh === userId
          ? `<i class="ri-delete-bin-line postdeletebtn commentdebtn" postid='${comment.postid}' commentid='${comment._id}'></i>`
          : "";
      postcomments.innerHTML += `<div class="postcomment">
                                        <div class="imgsss">
                                        <div class="comment-author-img" postid='${comment.postid}'>
                                            <img src="${comment.commentUserid.profilePicture}" alt="">
                                        </div>
                                        <div class="comment-author-username">
                                            <h2 class="ff">${comment.commentUserid.username}</h2>
                                        </div>
                                        </div>
                                     
                                    <div class="commentcontent">
                                        <p class='deco' >${comment.comment} ${btn}</p>
                                    </div>
                                    </div>
                                    `;
    });

    let postdeletebtn = document.querySelectorAll(".postdeletebtn");
    postdeletebtn.forEach((postdeletebtn)=>{
      postdeletebtn.addEventListener("click", async (e) => {
        let postcomment = e.target.closest('.postcomment')
        let postid = e.target.closest(".commentdebtn").getAttribute("postid");
        let commentid = e.target.closest(".commentdebtn").getAttribute("commentid");
        let res =  await fetch(`/home/post/comment/delete/${postid}/${commentid}`,{
        method:"post"
        })
        let data = await res.json()
        postcomment.remove()
      });
    })

    allcommentdiv.style.display = "block";
    home.style.overflow = "hidden";
    allpostsallusers.style.opacity = "0.3";
  }
});

onepostallimgss.forEach((img) => {
  if (img.getAttribute("src") === "") {
    img.parentElement.style.display = "none";
  }
});

el.addEventListener("click", (e) => {
  if (e.target.closest(".loginusercreatepost")) {
    posdivnoneandblock.style.display = "block";
    uppernav.style.visibility = "hidden";
  } else if (e.target.closest(".postbtn .bbtn")) {
    posdivnoneandblock.style.display = "block";
    uppernav.style.visibility = "hidden";
  }
});

postdivnone.addEventListener("click", (e) => {
  posdivnoneandblock.style.display = "none";
  uppernav.style.visibility = "visible";
});
