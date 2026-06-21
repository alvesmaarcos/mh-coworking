document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("container-salas");
    const modalOverlay = document.getElementById("modal-sala");
    const modalClose = document.getElementById("modal-close");
    const modalImg = document.getElementById("modal-img");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalDesc = document.getElementById("modal-desc");
    const modalBeneficios = document.getElementById("modal-beneficios");
    const modalThumbnails = document.getElementById("modal-thumbnails");

    const fecharModal = () => {
        modalOverlay.classList.remove("active");
    };

    modalClose.addEventListener("click", fecharModal);

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });

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

            cardSala.addEventListener("click", () => {
                modalImg.src = sala.img;
                modalImg.alt = sala.titulo;
                modalTitulo.textContent = sala.titulo;
                modalDesc.textContent = sala.info;
                
                modalBeneficios.innerHTML = "";
                sala.beneficios.forEach((beneficio) => {
                    const pModBen = document.createElement("p");
                    pModBen.textContent = beneficio.toUpperCase();
                    modalBeneficios.appendChild(pModBen);
                });

                modalThumbnails.innerHTML = "";
                if (sala.galeria && sala.galeria.length > 0) {
                    sala.galeria.forEach((imgUrl, index) => {
                        const thumb = document.createElement("img");
                        thumb.src = imgUrl;

                        if (imgUrl === sala.img || index === 0) {
                            thumb.classList.add("active");
                            modalImg.src = imgUrl;
                        }

                        thumb.addEventListener("click", () => {
                            modalImg.src = imgUrl;
                            document.querySelectorAll(".modal-thumbnails img").forEach(t => t.classList.remove("active"));
                            thumb.classList.add("active");
                        });

                        modalThumbnails.appendChild(thumb);
                    });
                }

                modalOverlay.classList.add("active");
            });

            container.appendChild(cardSala);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Ocorreu um erro ao carregar as salas de reuniões.</p>";
    }
});