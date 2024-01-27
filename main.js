//Importando libreria de SweetAlert2
import Swal from "sweetalert2";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

function inicializarApp() {
    // Array para almacenar los productos en el carrito
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para agregar un producto al carrito
    function agregarAlCarrito(id, nombre, precio, imagen) {
        const productoExistente = carrito.find((producto) => producto.id === id);
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({
                id,
                nombre,
                precio,
                cantidad: 1,
                imagen,
            });
        }
        // Actualizar el carrito en el localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        // Actualizar la cantidad en el carrito en la barra de navegación
        actualizarCantidadCarrito();
        // Actualizar la lista de productos en el carrito
        mostrarCarrito();
        // Verificar si el carrito está vacío y mostrar el mensaje
        verificarCarritoVacio();
    }

    // Función para verificar si el carrito está vacío
    function verificarCarritoVacio() {
        const carritoVacioDiv = document.getElementById('carrito-vacio');
        const listaCarrito = document.getElementById('lista-carrito');

        // Verificar la existencia de los elementos antes de manipularlos
        if (carritoVacioDiv && listaCarrito) {
            carritoVacioDiv.innerHTML = '';

            if (carrito.length === 0) {
                const mensajeCarritoVacio = document.createElement('p');
                mensajeCarritoVacio.textContent = 'No hay productos agregados.';
                mensajeCarritoVacio.classList.add('my-5', 'py-5', 'container', 'd-flex', 'justify-content-center', 'align-items-center', 'fs-2', 'fas');

                carritoVacioDiv.appendChild(mensajeCarritoVacio);
            }
        }
    }

    // Función para eliminar un producto del carrito y del localStorage
    function eliminarProducto(index) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCantidadCarrito();
        mostrarCarrito();
        verificarCarritoVacio();
    }

    // Función para actualizar la cantidad en la barra de navegación
    function actualizarCantidadCarrito() {
        const cantidadCarrito = document.getElementById('cart-count');
        cantidadCarrito.textContent = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    }

    // Función para mostrar la lista de productos en el carrito
    function mostrarCarrito() {
        const listaCarrito = document.getElementById('lista-carrito');
        const totalCarrito = document.getElementById('total-carrito');
        listaCarrito.innerHTML = '';
        // Valor del carrito inicial
        let total = 0;
        // Recorrer el carrito y agregar cada producto al div
        carrito.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('container', 'producto-carrito', 'border', 'border-dark', 'rounded', 'd-flex', 'justify-content-around', 'align-items-center', 'my-3');

            const imagenProducto = document.createElement('img');
            imagenProducto.src = producto.imagen;
            imagenProducto.alt = producto.nombre;
            imagenProducto.classList.add('m-1', 'border', 'rounded-2', 'border-3')

            const nombreProducto = document.createElement('span');
            nombreProducto.textContent = `${producto.cantidad} x ${producto.nombre}`;
            nombreProducto.classList.add('mx-2', 'fw-bold', 'fs-3')

            const precioProducto = document.createElement('span');
            precioProducto.textContent = `$${producto.precio * producto.cantidad}`;
            precioProducto.classList.add('fw-bold', 'fs-3')

            //Boton para eliminar productos del carrito
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Quitar';
            botonEliminar.classList.add('m-2', 'btn', 'btn-warning', 'p-3', 'fs-5')
            botonEliminar.onclick = () => {
                Swal.fire({
                    title: "Eliminar",
                    text: `¿Desea quitar ${producto.nombre} de la lista?`,
                    icon: "warning",
                    confirmButtonText: "Confirmar",
                    confirmButtonColor: "green",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    cancelButtonColor: "grey",
                }).then(respuesta => {
                    if (respuesta.isConfirmed) {
                        Swal.fire({
                            title: "Borrado con exito!",
                            timer: "1000",
                            timerProgressBar: "true",
                            icon: "success"
                        });
                        eliminarProducto(index);
                    }
                })
            }
            productoDiv.appendChild(imagenProducto);
            productoDiv.appendChild(nombreProducto);
            productoDiv.appendChild(precioProducto);
            productoDiv.appendChild(botonEliminar);
            listaCarrito.appendChild(productoDiv);
            total += producto.precio * producto.cantidad;
        });
        totalCarrito.textContent = `Total: $${total}`;
        verificarCarritoVacio();
    }

    // Función para vaciar el carrito
    function vaciarCarrito() {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCantidadCarrito();
        mostrarCarrito();
        verificarCarritoVacio();
    }

    // Evento de click botón agregar al carrito
    const botonesAgregarCarrito = document.querySelectorAll('.btn-agregar-carrito');
    botonesAgregarCarrito.forEach((boton) => {
        boton.onclick = () => {
            Toastify({
                text: "Se añadió con éxito.",
                destination: "./pages/carrito.html",
                duration: 3000,
                className: "fs-2 fw-bold border border-dark border-4 rounded-5",
                style: {
                    background: "linear-gradient(to right, #89a09a, #c1c0ae)",
                }
            }).showToast();
            const card = boton.closest('.card');
            const id = card.getAttribute('data-id');
            const nombre = card.querySelector('.card-title').textContent;
            const precioString = card.querySelector('#precio').textContent.replace('$', '').trim();
            const precio = parseFloat(precioString);
            const imagen = card.querySelector('.card-img-top').src;
            agregarAlCarrito(id, nombre, precio, imagen);
        }
    });

    actualizarCantidadCarrito();
    mostrarCarrito();
    verificarCarritoVacio();

    // Evento de clic para el botón vaciar el carrito
    const btnVaciarCarrito = document.getElementById('btn-vaciar');
    btnVaciarCarrito.onclick = () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: "Error",
                text: "Debe agregar productos antes de vaciar el carrito.",
                icon: "error",
            })
        } else {
            Swal.fire({
                title: "¿Vaciar el carrito?",
                text: "¡Se eliminaran todos los productos de la lista!",
                icon: "warning",
                confirmButtonText: "Confirmar",
                confirmButtonColor: "orange",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                cancelButtonColor: "grey",
            }).then(respuesta => {
                if (respuesta.isConfirmed) {
                    Swal.fire({
                        title: "Carrito vacío",
                        text: "Se han eliminado todos los productos de la lista.",
                        icon: "info",
                    })
                    vaciarCarrito();

                }
            })
        }
    }

    // Evento de clic para el botón finalizar compra
    const btnFinalizarCompra = document.getElementById('btn-comprar');
    btnFinalizarCompra.onclick = () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: "Error",
                text: "Debe agregar productos antes de finalizar tu compra.",
                icon: "error",
            })
        } else {
            Swal.fire({
                title: "Finalizar la compra",
                text: "¿Desea finalizar su compra?",
                icon: "question",
                confirmButtonText: "Confirmar",
                confirmButtonColor: "green",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                cancelButtonColor: "grey",
            }).then(respuesta => {
                if (respuesta.isConfirmed) {
                    Swal.fire({
                        title: "Compra realizada con exito.",
                        text: "Gracias por su compra!",
                        icon: "success",
                    })
                    vaciarCarrito();
                }
            })
        }
    }

    actualizarCantidadCarrito();
    mostrarCarrito();
    verificarCarritoVacio();

};

// Para esperar a que cargue el html
document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
})

// Retrasar ligeramente la ejecución de los eventos del formulario
setTimeout(() => {
    // Evento de clic para el botón reiniciar formulario
    const btnReiniciarForm = document.getElementById('btnReiniciarForm');
    btnReiniciarForm.onclick = () => {
        Swal.fire({
            title: "Formulario",
            text: "Se limpió correctamente.",
            icon: "info",
            timer: 1000,
            timerProgressBar: "true"
        });
    }

    // Evento de clic para el botón enviar formulario
    const btnEnviarMensajeForm = document.getElementById('btnEnviarMensajeForm');
    btnEnviarMensajeForm.onclick = (e) => {
        const nombreForm = document.getElementById('nombreForm').value;
        const emailForm = document.getElementById('emailForm').value;
        const mensajeForm = document.getElementById('mensajeForm').value;
        if (nombreForm.trim() != '' && emailForm.trim() != '' && mensajeForm.trim() != '') {
            Swal.fire({
                title: "Mensaje enviado!",
                text: "¡Gracias por ponerte en contacto!",
                icon: "success",
            })
            e.preventDefault();
            document.getElementById('nombreForm').value = '';
            document.getElementById('emailForm').value = '';
            document.getElementById('mensajeForm').value = '';
        };
    };
}, 100);

// Tomar comentarios de la API externa
const mensajesContacto = document.querySelector('#mensajesContacto');
fetch('https://jsonplaceholder.typicode.com/comments')
    .then(response => response.json())
    .then(comments => {
        const primerosComentarios = comments.slice(0, 10);

        primerosComentarios.forEach(comment => {
            const comentarioP = document.createElement('p');
            comentarioP.textContent = comment.body;
            comentarioP.classList.add('h2', 'font-weight-bold', 'p-3', 'border', 'border-dark', 'rounded');
            mensajesContacto.appendChild(comentarioP);
        });
    })
    .catch(error => {
        console.error('Error al obtener los comentarios:', error);
    });
