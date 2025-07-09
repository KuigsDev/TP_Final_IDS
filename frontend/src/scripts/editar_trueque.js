document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const truequeId = params.get("id");
    const usuarioId = params.get("usuario");

    if (!truequeId || !usuarioId) {
        alert("Faltan datos en la URL.");
        return;
    }

    const fechaInput = document.getElementById("fecha");
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    fechaInput.min = fechaHoy;

    try {
        // 1. Obtener objetos ofrecidos del usuario
        const resOfrecidos = await fetch(`http://localhost:3000/api/usuarios/objetos/${usuarioId}`);
        const objetosOfrecidos = await resOfrecidos.json();

        const selectOfrecido = document.getElementById("objeto_ofrecido");
        objetosOfrecidos.forEach(obj => {
            const opt = document.createElement("option");
            opt.value = obj.id;
            opt.textContent = obj.nombre;
            selectOfrecido.appendChild(opt);
        });

        // 2. Obtener objetos deseados (de otros usuarios)
        const resDeseados = await fetch(`http://localhost:3000/api/objetos/otros/${usuarioId}`);
        const objetosDeseados = await resDeseados.json();

        const selectDeseado = document.getElementById("objeto_deseado");
        objetosDeseados.forEach(obj => {
            const opt = document.createElement("option");
            opt.value = obj.id;
            opt.textContent = `${obj.nombre} (Dueño: ${obj.propietario})`;
            selectDeseado.appendChild(opt);
        });

        // 3. Obtener datos actuales del trueque
        const resTrueque = await fetch(`http://localhost:3000/api/trueques/${truequeId}`);
        const trueque = await resTrueque.json();

        if (!trueque || trueque.usuario_solicitante_id != usuarioId) {
            alert("No tienes permiso para editar este trueque.");
            return;
        }

        if (trueque.estado !== "Pendiente") {
            alert("Solo se pueden editar trueques en estado Pendiente.");
            return;
        }

        // 4. Prellenar formulario
        selectOfrecido.value = trueque.objeto_ofrecido_id;
        selectDeseado.value = trueque.objeto_deseado_id;
        fechaInput.value = trueque.fecha.slice(0, 10); // YYYY-MM-DD

    } catch (err) {
        console.error("Error al cargar datos para edición:", err);
        alert("Error al cargar datos del trueque.");
    }

    // 5. Envío del formulario
    const form = document.getElementById("form-editar-trueque");
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            objeto_ofrecido_id: parseInt(document.getElementById("objeto_ofrecido").value),
            objeto_deseado_id: parseInt(document.getElementById("objeto_deseado").value),
            fecha: document.getElementById("fecha").value,
            usuario_solicitante_id: parseInt(usuarioId)
        };

        try {
            const res = await fetch(`http://localhost:3000/api/trueques/editar/${truequeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Error");

            alert("Trueque actualizado con éxito.");
            window.location.href = `/usuario.html?id=${usuarioId}`;

        } catch (err) {
            console.error("Error al actualizar trueque:", err);
            alert("No se pudo actualizar el trueque.");
        }
    });

    // 6. Botón cancelar
    const cancelarBtn = document.getElementById("btn-cancelar");
    cancelarBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = `/usuario.html?id=${usuarioId}`;
    });
});
