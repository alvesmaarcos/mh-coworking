document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("container-salas");

    try {
        const response = await fetch("/api/get-salas");
        if (!response.ok) {
            throw new Error("Falha ao carregar a lista de salas");
        }

        const salas = await response.json();
        container.innerHTML = "";

        salas.forEach((sala) => {
            const cardSala = document.createElement("div");
            cardSala.className = "card-sala";

            const img = document.createElement("img");
            img.src = sala.img;
            img.alt = sala.titulo.toLowerCase();

            const infoSala = document.createElement("div");
            infoSala.className = "info-sala";

            const h1 = document.createElement("h1");
            h1.textContent = sala.titulo;

            const pInfo = document.createElement("p");
            pInfo.textContent = sala.info;

            const cardBeneficios = document.createElement("div");
            cardBeneficios.className = "card-sala-beneficios";

            sala.beneficios.forEach((beneficio) => {
                const pBeneficio = document.createElement("p");
                pBeneficio.textContent = beneficio.toUpperCase();
                cardBeneficios.appendChild(pBeneficio);
            });

            infoSala.appendChild(h1);
            infoSala.appendChild(pInfo);
            infoSala.appendChild(cardBeneficios);

            cardSala.appendChild(img);
            cardSala.appendChild(infoSala);

            container.appendChild(cardSala);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Ocorreu um erro ao carregar as salas de reuniões.</p>";
    }
});