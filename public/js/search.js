let input = document.querySelector(".searchbar input");
let finduser = document.querySelector(".finduser");
input.addEventListener("input",async()=>{
    try {
        let value = input.value.trim()
     let response = await fetch(`/search/finduser/?queryvalue=${value}`,{
        method:"post"
     })
     let allUser = await response.json()
        finduser.innerHTML = ''
     if (value.length>0 && allUser) {
        allUser.forEach((user)=>{
                finduser.innerHTML += `<a href="/api/auth/friend-profile/${user._id}">
                <div class="finduserandsendreq">
                        <div class="imgandusernameandname">
                            <div class="imgdiv">
                                <img src=${user.profilePicture} alt="" srcset="">
                            </div>
                            <div class="nameandusername">
                                <h3>${user.username}</h3>
                                <p>${user.name}</p>
                            </div>
                        </div>
                        <div class="formsendconnectionreqbtn">
                            <form action="/search/connection/req/pending/${user._id}" method="post">
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                </a>`
         });
     }else{
        finduser.innerHTML = ''
     }
    } catch (err) {
        console.log(err);  
    }
})