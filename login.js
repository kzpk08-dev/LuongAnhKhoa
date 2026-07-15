function login(){

const email=document.getElementById("email").value;

const password=document.getElementById("password").value;

fetch("/api/login",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

})

.then(res=>res.json())

.then(data=>{

if(data.success){

localStorage.setItem("user",JSON.stringify(data.user));

if(data.user.MaVaiTro==="ADMIN"){

location.href="admin.html";

}else{

location.href="index.html";

}

}else{

alert(data.message);

}

});

}
