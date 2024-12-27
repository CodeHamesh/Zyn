let forgotpasswordbtn = document.querySelector(".forgotpassword");
let forgotpass = document.querySelector(".forgotpass");
let forgotpassdivclose  = document.querySelector(".forgotpassdivclose i");

forgotpasswordbtn.addEventListener("click",(e)=>{
    if (forgotpass.style.display === ''|| forgotpass.style.display === 'none') {
        forgotpass.style.display  ='block'
    }
})
forgotpassdivclose.addEventListener("click",(e)=>{
    forgotpass.style.display = 'none'
})