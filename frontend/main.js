function createCards(data){
    //console.log("Este es el valor de data",data); 
    //title, image, description, category, state, date, user owner, 
    const card = document.createElement("div");
    const like = document.createElement("lottie-player"); 
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
    like.classList.add("like"); 
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



    // Convertir 
    let fecha = new Date(data?.fecha_publicacion); 
    let fecha_publicacion = fecha.toLocaleDateString(); 

    // Setear Atributos
    like.setAttribute("src","src/animaciones/like.json");
    like.setAttribute("background","transparent");
    like.setAttribute("speed","1"); 

    let dataLikes = {};
    let liked = false; 

    try {
        dataLikes = JSON.parse(localStorage.getItem('likes')) || {};
        like.addEventListener('ready',()=>{
            setTimeout(() => {
            if (dataLikes[data.id]) {
                liked = true;
                like.play();
                setTimeout(() => {
                    like.pause();
                }, 550);
            }
            },500);
        });

    } catch (e) {
        dataLikes = {};
    }



    like.addEventListener("click", () => {
        if (!liked) {
            liked = true;    
            like.play();      
            setTimeout(()=>{
                like.pause(); 
                let likes = JSON.parse(localStorage.getItem('likes'))|| {};
                if(!likes[data.id]){
                    likes[data.id] = {
                        img: `src/img/objetos/${data?.id}.jpg`, 
                        nombre : data?.nombre,
                        descripcion : data?.descripcion, 
                        categoria : data?.categoria, 
                        estado : data?.estado, 
                        fecha: fecha_publicacion,
                        usuario_nombre : data?.usuario_nombre, 
                    };
                    localStorage.setItem('likes',JSON.stringify(likes)); 
                }
            },550)

        } else {
            liked = false;
            let likes = JSON.parse(localStorage.getItem('likes')); 
            if(likes[data.id]){
                delete likes[data.id];  
                localStorage.setItem('likes',JSON.stringify(likes)); 
            }
            like.stop();
        }
    });
    
    console.log(data?.id)
    img.setAttribute("src",`src/img/objetos/${data?.id}.jpg`);
    img.style.pointerEvents = 'none';
    button_info.setAttribute("href",`usuario.html?id=${data?.usuario_id}`);

    // Setear Contenido
    title.textContent = data?.nombre || `Nombre del Trueque`; 
    p_description.textContent = data?.descripcion || `Descripcion del producto`;
    p_item_1.textContent = data?.categoria || "Categoria";
    p_item_2.textContent = data?.estado || "Estado"; 

    p_date.innerHTML = `<i class='bi bi-caret-right-fill'></i> ${fecha_publicacion}` || `<i class='bi bi-caret-right-fill'></i> Fecha`;
    p_owner.innerHTML = `<i class='bi bi-person-fill'></i> ${data?.usuario_nombre}`|| `<i class='bi bi-person-fill'></i> Usuario`; 
    button_info.innerHTML = "<span class='button__text--default'>Ver más</span>"; 


    // Appendear Elementos 
    img_container.appendChild(img);
    p_container_category.appendChild(p_item_1); 
    p_container_category.appendChild(p_item_2);
    p_container_data.appendChild(p_date); 
    p_container_data.appendChild(p_owner);

    img_container.addEventListener("click",()=>{
        if (!liked) {
            liked = true;    
            like.play();      
            setTimeout(()=>{
                like.pause(); 
                let likes = JSON.parse(localStorage.getItem('likes')) || {};
                if(!likes[data.id]){
                    likes[data.id] = {
                        img: `src/img/objetos/${data?.id}.jpg`, 
                        nombre : data?.nombre,
                        descripcion : data?.descripcion, 
                        categoria : data?.categoria, 
                        estado : data?.estado, 
                        fecha: fecha_publicacion,
                        usuario_nombre : data?.usuario_nombre, 
                    };
                    localStorage.setItem('likes',JSON.stringify(likes)); 
                }
            },550)
            

        } else {
            liked = false;
            let likes = JSON.parse(localStorage.getItem('likes')); 
            if(likes[data.id]){
                delete likes[data.id];  
                localStorage.setItem('likes',JSON.stringify(likes)); 
            }
            like.stop();
        }
})


card.appendChild(like);   
card.appendChild(img_container);
card.appendChild(title);
card.appendChild(p_description);
card.appendChild(p_container_category); 
card.appendChild(p_container_data);  
card.appendChild(button_info);



return card; 

}

// Carga dinamica de paginas 
function loadView(route){
    console.log(route);
    const loader = document.getElementById('loader');
    const app = document.getElementById('root-app');
    if(!(route=='index')){
        let page = sessionStorage.getItem("page") ? sessionStorage.getItem("page") : ''; 
        if(page != route){
            loader.style.display = 'block'; 
            app.style.display = 'none'; 
            fetch(`${route}.html`)
            .then(res=>res.text())
            .then(html =>{
                sessionStorage.setItem("page",route); 
                document.getElementById('root-app').innerHTML = html; 
                let script = document.createElement("script"); 
                script.setAttribute("src",`src/scripts/${route}.js`); 
                document.body.appendChild(script); 
            })
            .catch(err => console.error("Error al cargar vista: ",err))
            .finally(()=>{
                setTimeout(()=>{
                    loader.style.display = 'none'; 
                    app.style.display = 'block'; 
                },1000)

            })   
        }
    }else{
        loader.style.display = 'block'; 
        app.style.display = 'none'; 
        if(sessionStorage.getItem("page")){
            sessionStorage.removeItem("page");
        }
        setTimeout(()=>{
            window.location.href = 'index.html' 
            loader.style.display = 'block'; 
            app.style.display = 'none'; 
           
        },2000)
    }
   
}



//crear cartas con objetos recientes

function createRecentsCards() {
    if(sessionStorage.getItem('recents_objects')){
        let cards = sessionStorage.getItem('recents_objects'); 
        cards = JSON.parse(cards); 
        let container = document.querySelector(".div__container__trueques")
        cards.objetos.forEach((e)=>{
            let card = createCards(e); 
            container.appendChild(card); 
        })
    }
}

const recentsCards = async() =>{
    fetch('http://localhost:3000/api/objetos_recientes')
    .then(res => res.json())
    .then((res)=>{
        if(res.success){
            console.log('Objetos recientes obtenidos'); 
            console.log(res);
            sessionStorage.setItem("recents_objects",JSON.stringify(res)); 
            createRecentsCards(); 
            return true; 
        }else{
            console.log("No se pudieron cargar los objetos recientes"); 
            return false; 
        }
    }).catch(err => console.log('Error: ',err)); 
}

const observer = new IntersectionObserver(
    entries => {
    entries.forEach(entry =>
        entry.target.classList.toggle("show", entry.isIntersecting)
    );
    },
    { threshold: 0.1 }
);

const lastCardObserver = new IntersectionObserver(
    entries => {
    const lastCard = entries[0];
    if (!lastCard.isIntersecting) return;
    loadNewCards();
    lastCardObserver.unobserve(lastCard.target);
    lastCardObserver.observe(document.querySelector(".dinamic__card:last-child"));
    },
    { rootMargin: "100px" }
);

const cardContainer = document.querySelector(".div__dinamic__container");
const endMessage = document.getElementById("end-message");

let currentContainer = null;
let totalCards = 0;
let containerCount = 0; 
const maxContainers = 5; 


function createNewContainer() {
    if (containerCount >= maxContainers) return false; 
    currentContainer = document.createElement("div");
    currentContainer.classList.add("dinamic__container");
    cardContainer.append(currentContainer);
    observer.observe(currentContainer);
    containerCount++;
    return true;
}

function loadNewCards() {
    if(sessionStorage.getItem('objects')){
        let cards = sessionStorage.getItem('objects'); 
        cards = JSON.parse(cards); 
        cards.objetos.forEach((e)=>{
            let card = createCards(e);             
            if (!currentContainer || totalCards % 4 === 0) {
                    const created = createNewContainer(); 
                    if (!created) {
                    showEndMessage();
                    return;
                    }
            } 

            currentContainer.append(card);
                totalCards++;
            

            const lastCard = document.querySelector(".dinamic__card:last-child");
            if (lastCard) {
                    lastCardObserver.observe(lastCard);
            }
        })
    }
    //for (let i = 0; i < 10; i++) {
   
 //}
}

function showEndMessage() {
    endMessage.classList.add("show");
}




const allCards = async()=>{
    fetch('http://localhost:3000/api/objetos_todos')
    .then(res=> res.json())
    .then((res)=>{
        if(res.success){
            console.log('Todos los objetos obtenidos'); 
            console.log(res); 
            sessionStorage.setItem("objects",JSON.stringify(res));
            search(); // -> function search del buscador accede a sessionStorage.getItem('objects')
            loadNewCards(); 
            return true; 
        }else{
            console.log("No se pudieron cargar los objetos"); 
            return false;
        }
    }).catch(err => console.log('Error: ',err)); 
}


// bolts carga progresiva 

const maxBolts = 10;

const bar = document.getElementById('like-bar');
const count = document.getElementById('like-count');
const container = document.querySelector('.div__offers__primary');
const bolt = document.getElementById('bolt-icon');

let bolts = parseInt(sessionStorage.getItem('potenciadores')) || 0;
updateUI();

container.addEventListener('click', () => {
  if (bolts < maxBolts) {
    bolts++;
    sessionStorage.setItem('potenciadores', bolts);
    updateUI();

    if (bolts === maxBolts) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ffa200ff', '#ff6666', '#ffcccc']
      });
    }
  }
});

function updateUI() {
  const porcentaje = (bolts / maxBolts) * 100;
  bar.style.width = porcentaje + '%';
  count.textContent = `${bolts} Potenciador${bolts !== 1 ? 'es' : ''}`;
  bolt.style.fill = bolts > 0 ? '#ff6666' : 'gray';
}


function search(){
    let objetos = JSON.parse(sessionStorage.getItem('objects')) || {};

    if (Object.keys(objetos).length != 0) {
        const input = document.getElementById('search-input');
        const suggestionsList = document.getElementById('suggestions');
        objetos = objetos.objetos;

        const items = [];
        for (let key in objetos) {
            items.push(objetos[key].nombre);
        }

        const list = document.querySelector('.suggestions-list');

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase();
            suggestionsList.innerHTML = '';
            suggestionsList.style.border = 'none';
            suggestionsList.style.height = 'auto';
            list.style.display = 'block';

            if (query.length === 0) return;

            const matches = items.filter(item => item.toLowerCase().includes(query));
            if(matches.length == 0){
                suggestionsList.style.border = '2px solid orange'
                suggestionsList.innerHTML = '<h3 class="text__notfound"> No hay elemento que coincida ... </h3>';
            }
            matches.forEach(match => {
                suggestionsList.style.border = '2px solid orange';
                suggestionsList.style.height = '80vh';
                // Busco el objeto completo que corresponde al nombre
                const objeto = Object.values(objetos).find(obj => obj.nombre === match);

                const li = document.createElement('li');
                li.classList.add('suggestion-item');

                const img = document.createElement('img');
                img.src = `src/img/objetos/${objeto.id}.jpg`; 
                img.alt = objeto.nombre;
                const title = document.createElement('h2');
                title.textContent = objeto.nombre;

                const description = document.createElement('p');
                description.classList.add("suggestion-item_description");
                description.textContent = objeto.descripcion;
                
                const category = document.createElement('p');
                category.classList.add("suggestion-item_category")
                category.textContent = objeto.categoria;  
                const condition = document.createElement('p');
                condition.classList.add("suggestion-item_condition")
                condition.textContent = objeto.estado; 
                
                li.appendChild(img);
                li.appendChild(title);
                li.appendChild(description);
                li.appendChild(category);
                li.appendChild(condition);

                li.addEventListener('click', () => {
                    input.value = match;
                    suggestionsList.innerHTML = '';
                    list.style.display = 'none';
                    alert(`Elegiste: ${match}`);
                });

                suggestionsList.appendChild(li);
            });
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.innerHTML = ''
                list.style.display = 'none';
            }
        });
    }

    
}


document.addEventListener("DOMContentLoaded",()=>{
    if(sessionStorage.getItem("page")){
        sessionStorage.removeItem("page");
    }
    if(document.querySelector(".div__container__trueques")){
        setTimeout(()=>{
            recentsCards();
            allCards(); 
        },1500) 
    }
})





    