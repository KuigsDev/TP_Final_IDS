const login = async(email,clave)=>{
    const res = await fetch('http://localhost:3000/api/login',{
        method: "POST", 
        headers: {
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify({
            email: email, 
            clave: clave
        })
    });
    console.log(res); 
    const data = await res.json();
    if(data.success){
        console.log("Usuario logueado");
        console.log(data); 
        localStorage.setItem("logged_user",JSON.stringify(data)); 
        return true;
    }else{
        console.log("Error de Login")
        return false; 
    }
}




const inputs = document.querySelectorAll("input");
const animacion = document.querySelector(".gif");
inputs.forEach((elt) => {
  elt.addEventListener("input", (e) => {
    let container_error = document.querySelector(".text_error"); 
    container_error.textContent = ""; 

    if (e.target.value.trim() !== "") {
      animacion.classList.remove("hidden");
      animacion.style.display = "block";
      animacion.play();
    } else {
      ocultarAnimacion();
    }
  });

  elt.addEventListener("blur", () => {
    ocultarAnimacion();
  });
});

function ocultarAnimacion() {
  animacion.classList.add("hidden");
  animacion.pause();
  setTimeout(() => {
    animacion.style.display = "none";
  }, 400);
}

const formulario = document.querySelector(".form");
formulario.addEventListener("submit", async (e)=>{
    e.preventDefault(); 
    ocultarAnimacion();
    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries())
    console.log('Los datos del formulario son: ',datos);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(regex.test(datos.email)){
        const resultado = await login(datos.email, datos.clave); 
        if(resultado){
            window.location.href = "mi_usuario.html" //redireccionar a miusuario.html 
        }else{
            let error = document.createElement("span"); 
            error.textContent = "Error usuario no logueado"
            error.style.color = "red"; 
            error.style.fontFamily = "Proxima Nova"; 
            error.style.fontWeight = "bold"; 
            error.style.fontSize = "1em"; 
            let container_error = document.querySelector(".text_error"); 
            container_error.append(error); 

        }
    }
})