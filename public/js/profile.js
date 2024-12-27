let editBtn = document.querySelector(".userprofileedit button");
let closeEditPage = document.querySelector(".editprofilepagedeletebtn i");
let editprofilepage = document.querySelector(".editprofilepage");
let showAllFriendsBtn = document.querySelector(".friends button");
let allfriends = document.querySelector(".allfriends");
let allfriendsdivclosebtn = document.querySelector(".allfriendsdivclosebtn i");
let  uppernav = document.querySelector(".uppernav")
let profile = document.querySelector(".profile")
let allcommentdiv = document.querySelector('.allcomments');
let comment = document.querySelectorAll(".comment")
let mainmiddiv = document.querySelector('.mainmiddiv');
let commentdivnone = document.querySelector(".postdivnone span")
let postauthor = document.querySelector('.comment-author');
let postcomments = document.querySelector('.post-comments');
let allpostDiv = document.querySelector('.allpostss');


let post = document.querySelector('.comment-add')
let commentinput = document.querySelector('.commentinput')
let deleteBtn = document.querySelectorAll('.postdeletebtn')

deleteBtn.forEach((btn)=>{
  btn.addEventListener('click',async function(e){
    let finpostId = e.target.closest('.postcontentallpostsname').getAttribute('data-post-id')
    try {
      let res = await fetch(`/api/auth/post/delete/${finpostId}`,{
        method:"post",
      })
      let data = await res.json()
      if (data.success) {
        e.target.closest('.postcontentallpostsname').remove();
      } else {
        console.error("Failed to delete the post");
      }
    } catch (err) {
      console.log(err);
      
    }
    
    
  })
})


post.addEventListener('click',async function(e){
  let postid =  document.querySelector('.comment-author-img').getAttribute('postid') ;
  let inputValue = commentinput.value.trim()
  try {
  let res = await fetch(`/home/post/comment/${postid}`,{
    method:"post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment:inputValue
    })
  })
  let data = await res.json(); 
  postcomments.innerHTML = ''
  data.forEach((comment)=>{
    postcomments.innerHTML += `<div class="postcomment">
                    <div class="comment-author-img">
                        <img src="${comment.commentUserid.profilePicture}" alt="">
                    </div>
                    <div class="comment-author-username">
                        <h2 class="ff">${comment.commentUserid.username}</h2>
                    </div>
                </div>
                <div class="commentcontent">
                    <p>${comment.comment}</p>
                    <i class="ri-delete-bin-line commentdelete" id="commentdeletebtn"></i>
                </div>`
                
  })
  commentinput.value = ''

  } catch (err) {
  console.log(err);
  }
})


commentdivnone.addEventListener("click",(e)=>{
  profile.style.overflow = 'scroll'
  profile.style.opacity = '1'
  allcommentdiv.style.display = 'none'
  postcomments.innerHTML = ''
})

comment.forEach(function(btn) {
  btn.addEventListener("click",async function(e){
      let postAttribute =  this.getAttribute("PostId")
        let res = await fetch(`/home/post/comment/${postAttribute}`,{
          method:"get"
        })
        let data = await res.json()
  
        let loginid = document.querySelector('.allpostss').getAttribute('logdinuserid')
        postauthor.innerHTML = `<div class="comment-author-img" postid=${data.postid}>
                        <img src="${data.findPost.postuserid.profilePicture}" alt="">
                    </div>
                    <div class="comment-author-username">
                        <h2>${data.findPost.postuserid.username}</h2>
                    </div>`

        data.allCommentsThidPost.forEach((comment)=>{
          let deletebtn = comment.commentUserid._id === loginid 
          ? `<i class="ri-delete-bin-line commentdelete"></i>` 
          : '';
          postcomments.innerHTML += `<div class="postcomment">
                    <div class="comment-author-img">
                        <img src="${comment.commentUserid.profilePicture}" alt="">
                    </div>
                    <div class="comment-author-username">
                        <h2 class="ff">${comment.commentUserid.username}</h2>
                    </div>
                </div>
                <div class="commentcontent">
                    <p>${comment.comment} ${deletebtn} </p>
                </div>`
        })
         allcommentdiv.style.display = 'block'
         profile.style.overflow = 'hidden'
         profile.style.opacity = '0.3'
     }
  )
})


document.addEventListener("DOMContentLoaded", () => {
  let postbtnslike = document.querySelectorAll(".postbtnslike .likes");
  postbtnslike.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      let postContainer = e.target.closest(".postcontentallpostsname");
      let postid = e.target.closest(".postcontentallpostsname").getAttribute("data-post-id");
      let res = await fetch(`/home/post/like/${postid}`, {
        method: "post",
      });
      let data = await res.json();
      if (data) {
        let mflike = postContainer.querySelector(".mflike");
        mflike.textContent = data.data.likes;
        if (data.liked === true) {
          btn.style.color = "#FF0034";
        }
        if (data.liked === false) {
          btn.style.color = "#000";
        }
      }
    });
  });
});

allfriendsdivclosebtn.addEventListener("click", () => {
  uppernav.style.visibility = 'visible'
  allfriends.style.display = "none";
});
showAllFriendsBtn.addEventListener("click", () => {
  uppernav.style.visibility= 'hidden';
  allfriends.style.display = "block";
});

if (editBtn || closeEditPage) {
  editBtn.addEventListener("click", (e) => {
    editprofilepage.style.display = "block";
  });
  closeEditPage.addEventListener("click", (e) => {
    editprofilepage.style.display = "none";
  });
}


postcomments.addEventListener("click", (e) => {
  if (e.target.classList.contains("commentdelete")) {
      
  }
});