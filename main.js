const observer = new IntersectionObserver(
    entries => {
    entries.forEach(entry =>
        entry.target.classList.toggle("show", entry.isIntersecting)
    );
    },
    { threshold: 0.2 }
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
    for (let i = 0; i < 10; i++) {
    if (!currentContainer || totalCards % 4 === 0) {
        const created = createNewContainer(); 
        if (!created) {
        showEndMessage();
        return;
        }
    }

    const card = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("p");
    const p_change = document.createElement("p");
    const p_container_category = document.createElement("div");
    const p_item_1 = document.createElement("p"); 
    const p_item_2 = document.createElement("p"); 
    const p_location = document.createElement("p"); 
    const button_info = document.createElement("a"); 

    // Agregar clases 
    card.classList.add("dinamic__card");
    title.classList.add("offers__title");
    p_change.classList.add("div__offers__p"); 
    p_change.classList.add("change"); 
    p_container_category.classList.add("div__offers__category");
    p_item_1.classList.add("item__category"); 
    p_item_2.classList.add("item__category"); 
    p_location.classList.add("div__offers__p"); 
    p_location.classList.add("location"); 
    button_info.classList.add("button__container--default");

    // Setear Atributos
    img.setAttribute("src", "imagenes/carrusel_img_1.jpg");
    button_info.setAttribute("href","#");

    // Setear Contenido
    title.textContent = `Nombre del Trueque ${totalCards + 1}`; 
    p_change.textContent = `Por que cosas cambia`;
    p_item_1.textContent = "Categoria1";
    p_item_2.textContent = "Categoria2"; 
    p_location.innerHTML = `<i class='bi bi-caret-right-fill'></i> Ubicacion ${totalCards + 1}`;
    button_info.innerHTML = "<span class='button__text--default'>Ver más</span>"




    // Appendear Elementos 
    p_container_category.appendChild(p_item_1); 
    p_container_category.appendChild(p_item_2); 


    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(p_change);
    card.appendChild(p_container_category); 
    card.appendChild(p_location); 
    card.appendChild(button_info);

    currentContainer.append(card);
    totalCards++;
    }

    const lastCard = document.querySelector(".dinamic__card:last-child");
    if (lastCard) {
    lastCardObserver.observe(lastCard);
    }
}

function showEndMessage() {
    endMessage.classList.add("show");
}

// Inicial
loadNewCards();