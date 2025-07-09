// Fecha mínima o por defecto (como la de hoy)
document.addEventListener("DOMContentLoaded", async function () {
        const inputFecha = document.getElementById("fecha");
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        const fechaHoy = `${yyyy}-${mm}-${dd}`;

        inputFecha.min = fechaHoy;
        inputFecha.value = fechaHoy;

        const solicitanteId=getSolicitanteId();
        if (!solicitanteId) {
        alert("Falta el ID de usuario en la URL");
        return;
        }

        try {
        const res = await fetch(`http://localhost:3000/api/usuarios/objetos/${solicitanteId}`);
        if (!res.ok) throw new Error("No se pudieron obtener los objetos");
        const objetos = await res.json();

        const selectOfrecido = document.getElementById("objeto_ofrecido");
        objetos.forEach(obj => {
            const option = document.createElement("option");
            option.value = obj.id;
            option.textContent = obj.nombre;
            selectOfrecido.appendChild(option);
        });
        } catch (err) {
            console.error("Error al cargar objetos del usuario:", err);
        }

        try {
        const res = await fetch(`http://localhost:3000/api/objetos/otros/${solicitanteId}`);
        if (!res.ok) throw new Error("No se pudieron obtener objetos deseados");
        const objetosDeseados = await res.json();

        const selectDeseado = document.getElementById("objeto_deseado");
        objetosDeseados.forEach(obj => {
            const option = document.createElement("option");
            option.value = obj.id;
            option.textContent = `${obj.nombre} (Dueño: ${obj.propietario})`;
            selectDeseado.appendChild(option);
        });
        } catch (err) {
        console.error("Error al cargar objetos deseados:", err);
        }


        //Envio Formulario
        const form = document.getElementById("form-crear-trueque");
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const objeto_ofrecido_id = parseInt(document.getElementById("objeto_ofrecido").value);
            const objeto_deseado_id = parseInt(document.getElementById("objeto_deseado").value);
            const fecha = document.getElementById("fecha").value;

            const data = {
                objeto_ofrecido_id,
                objeto_deseado_id,
                fecha,
                usuario_solicitante_id: parseInt(solicitanteId)
            };

            try {
                const res = await fetch("http://localhost:3000/api/trueques", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.error || "Error al crear trueque");
                }

                alert("Trueque creado exitosamente");

                // Redirigir al usuario solicitante
                window.location.href = `/usuario.html?id=${solicitanteId}`;

            } catch (err) {
                console.error("Error al crear el trueque:", err);
                alert("Error al crear el trueque. Intenta nuevamente.");
            }
        });
        const btnCancelar = document.getElementById("btn-cancelar");
        btnCancelar.addEventListener("click", function (e) {
            e.preventDefault();
            const id = getSolicitanteId();
            if (id) {
                window.location.href = `/usuario.html?id=${id}`;
            } else {
                window.history.back();
            }
        });
    });


    function getSolicitanteId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}