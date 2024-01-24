//Importando libreria de SweetAlert2
import Swal from "sweetalert2";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

// Para esperar a que cargue el html
document.addEventListener('DOMContentLoaded', () => {

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

        carritoVacioDiv.innerHTML = '';

        if (carrito.length === 0) {
            const mensajeCarritoVacio = document.createElement('p');
            mensajeCarritoVacio.textContent = 'El carrito esta vacío.';
            mensajeCarritoVacio.classList.add('my-5', 'py-5', 'container', 'd-flex', 'justify-content-center', 'align-items-center', 'fs-2', 'fas')

            carritoVacioDiv.appendChild(mensajeCarritoVacio);
        }
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
            productoDiv.classList.add('producto-carrito');

            const imagenProducto = document.createElement('img');
            imagenProducto.src = producto.imagen;
            imagenProducto.alt = producto.nombre;
            imagenProducto.classList.add('m-1', 'border', 'rounded-2', 'border-3')

            const nombreProducto = document.createElement('span');
            nombreProducto.textContent = `${producto.cantidad} x ${producto.nombre}`;
            nombreProducto.classList.add('mx-2', 'fw-bold', 'fs-5')

            const precioProducto = document.createElement('span');
            precioProducto.textContent = `$${producto.precio * producto.cantidad}`;
            precioProducto.classList.add('fw-bold', 'fs-4')

            //Boton para eliminar productos del carrito
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.classList.add('m-2', 'btn', 'btn-danger')
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

    // Botón agregar al carrito
    const botonesAgregarCarrito = document.querySelectorAll('.btn-agregar-carrito');
    botonesAgregarCarrito.forEach((boton) => {
        boton.onclick = () => {
            Toastify({
                text: "Se añadió con éxito."
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

    // Función para vaciar el carrito
    function vaciarCarrito() {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCantidadCarrito();
        mostrarCarrito();
        verificarCarritoVacio();
    }

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


});


