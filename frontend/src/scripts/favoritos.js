let container_fav = document.querySelector(".div__container__trueques__fav");

function createCards(data){
    //title, image, description, category, state, date, user owner, 
    const card = document.createElement("div");
    const title = document.createElement("p");
    const img_container = document.createElement("div"); 
    const img = document.createElement("img");
    const p_description = document.createElement("p");
    const p_container_category = document.createElement("div");
    const p_container_data = document.createElement("div"); 
    const p_item_1 = document.createElement("p"); 
    const p_item_2 = document.createElement("p"); 
    const p_date = document.createElement("p");
    const p_owner = document.createElement("p") 
    const button_info = document.createElement("a"); 

    // Agregar clases 
    card.classList.add("dinamic__card");
    title.classList.add("offers__title");
    img_container.classList.add("img__container"); 
    p_description.classList.add("div__offers__p"); 
    p_description.classList.add("description"); 
    p_container_category.classList.add("div__offers__category");
    p_container_data.classList.add("div__offers__data"); 
    p_item_1.classList.add("item__category"); 
    p_item_2.classList.add("item__category"); 
    p_date.classList.add("div__offers__p"); 
    p_date.classList.add("date"); 
    p_owner.classList.add("div__offers__p"); 
    p_owner.classList.add("date"); 
    button_info.classList.add("button__container--default");
    img.setAttribute("src",`${data.img}`);
    img.style.pointerEvents = 'none';
    button_info.setAttribute("href","#");

    // Setear Contenido
    title.textContent = data?.nombre || `Nombre del Trueque`; 
    p_description.textContent = data?.descripcion || `Descripcion del producto`;
    p_item_1.textContent = data?.categoria || "Categoria";
    p_item_2.textContent = data?.estado || "Estado"; 
    p_date.innerHTML = `<i class='bi bi-caret-right-fill'></i> ${data?.fecha}` || `<i class='bi bi-caret-right-fill'></i> Fecha`;
    p_owner.innerHTML = `<i class='bi bi-person-fill'></i> ${data?.usuario_nombre}`|| `<i class='bi bi-person-fill'></i> Usuario`; 
    button_info.innerHTML = "<span class='button__text--default'>Ver más</span>"; 

    
    // Appendear Elementos 
    img_container.appendChild(img);
    p_container_category.appendChild(p_item_1); 
    p_container_category.appendChild(p_item_2);
    p_container_data.appendChild(p_date); 
    p_container_data.appendChild(p_owner);


    card.appendChild(img_container);
    card.appendChild(title);
    card.appendChild(p_description);
    card.appendChild(p_container_category); 
    card.appendChild(p_container_data);  
    card.appendChild(button_info);
    
    

    return card; 
}


    let favoritos = JSON.parse(localStorage.getItem('likes')) || {}; 
    if(Object.keys(favoritos).length === 0){
        let texto = document.createElement("h2");
        texto.textContent = "Nada por aquí ..."; 
        texto.style.fontFamily = 'Proxima Nova';
        texto.style.fontWeight = 'bold';
        container_fav.style.gridTemplateColumns = "100%"
        container_fav.style.textAlign = "center";
        container_fav.appendChild(texto)
    }else{
        for(let clave in favoritos){
            console.log(favoritos[clave]);
            let card = createCards(favoritos[clave]) 
            container_fav.appendChild(card);
            console.log("se apendeo")
        }
    }
