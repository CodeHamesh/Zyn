let menubtn = document.querySelector("nav .leftnav i")
let settinglinks = document.querySelector(".settinglinks");
let dropmenu = document.querySelector(".dropmenu ");
let dropmenuBtn = document.querySelector(".uppernavlinks .menuu");


// document.addEventListener("contextmenu",(e)=>{
//     e.preventDefault()
// })
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.shiftKey && event.code === "KeyI") {
      event.preventDefault();
    }
    if (event.code === "F12") {
      event.preventDefault();
    }
  });
dropmenuBtn.addEventListener("click",(e)=>{
  e.preventDefault()
    if (dropmenu.style.display === 'none' || dropmenu.style.display === '') {
        dropmenu.style.display = 'block'
    }else{
        dropmenu.style.display = 'none'
    } 
})

document.addEventListener("click", (e) => {
  if (!dropmenu.contains(e.target) && e.target !== dropmenuBtn) {
    dropmenu.style.display = 'none';
  }
  if (!settinglinks.contains(e.target) && e.target !== menubtn) {
    settinglinks.style.display = "none"; 
}
});

menubtn.addEventListener("click",(e)=>{
    e.preventDefault()
     if (settinglinks.style.display === "none" || settinglinks.style.display === "") {
        settinglinks.style.display = "block"; 
    } else {
        settinglinks.style.display = "none"; 
    }
})
