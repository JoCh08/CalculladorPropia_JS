let cliente= {
    mesa: '',
    hora:'' ,
    pedido: []
}
const categoriasobj= {
    1: 'Comidas',
    2: 'Bebidas',
    3: 'Postres'

}
const btnGuardarCliente =document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);


function guardarCliente(e) {

    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;
    const camposVacios = [mesa, hora].some(campo=> campo === '');
    
    if (camposVacios) {
        if (!document.querySelector('.alert-verification')) {
            const alerta = document.createElement('div');
            alerta.classList.add('alert-verification','invalid-feedback','d-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';

            const formulario = document.querySelector('.modal-body');
            formulario.appendChild(alerta);

            setTimeout(() => {
            alerta.remove();
            }, 3000);
            
        }
        return;
        
    }
    

    //sobrescribir cliente , y remplazar los valores de mesa y hora
    cliente = {...cliente, mesa, hora};

    const modalFormulario = document.querySelector('#formulario');
    const modalbtp=  bootstrap.Modal.getInstance(modalFormulario);
    const formulariomodal = document.querySelector('#formulario-modal');

    formulariomodal.reset();
    modalbtp.hide();
    mostrarSecciones();
    obtenerPlatillos();
}

function mostrarSecciones() {

    const seccionesOcultas = document.querySelectorAll('.d-none');
   
    seccionesOcultas.forEach(seccion => {
        seccion.classList.remove('d-none');
    });


}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarplatillos (resultado)) 
        .catch(error => console.log(error));
}

function mostrarplatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');
    platillos.forEach(platillo => {
        const {id, nombre, precio, categoria} = platillo;
       // console.log (`ID: ${id}, Nombre: ${nombre}, Precio: ${precio}, Categoria: ${categoria}`);

        const row = document.createElement('div');
        row.classList.add('row', 'py-2', 'px-3', 'platillo', 'border-top');

        const nombrediv = document.createElement('div');
        nombrediv.classList.add('col-md-4', 'mb-3');
        nombrediv.textContent = nombre;
        
        const precioDiv = document.createElement('div');
        precioDiv.classList.add('col-md-3', 'mb-3', 'fw-bold');    
        precioDiv.textContent = `$${precio}`;

        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('col-md-3', 'mb-3');
        categoriaDiv.textContent = categoriasobj[categoria]
        //console.log ();
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = 0;
        inputCantidad.min = 0;
        inputCantidad.id = `cantidad-${id}`;
        inputCantidad.classList.add('form-control');

        // Agregar evento al input para capturar la cantidad
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            
                agregarPlatillo({...platillo , cantidad});
            
        }
         const divinput = document.createElement('div');
        divinput.classList.add('col-md-2', 'mb-3');
        divinput.appendChild(inputCantidad);
   

        row.appendChild(nombrediv);
        row.appendChild(precioDiv);
        row.appendChild(categoriaDiv);
        row.appendChild(divinput);

      

        //agraga al html
        contenido.appendChild(row);
        


    })



}

function agregarPlatillo(Orden) {
   


   // console.log(`Cantidad: ${Orden.cantidad} tipo ${typeof Orden.cantidad}`);
    if (Orden.cantidad > 0) {
        //agregar al pedido
        const {pedido} = cliente;
        //revisar si el elemento ya existe
        if (pedido.some(platillo => platillo.id === Orden.id)) {
            //actualizar cantidad
            const pedidoActualizado = pedido.map(platillo => {
                if (platillo.id === Orden.id) {
                    platillo.cantidad = Orden.cantidad;
                }    
             return platillo;
                  
            });
           //se asigna el pedido actualizado al cliente
            cliente.pedido = [...pedidoActualizado];
        } else {
            //agregar al pedido
            cliente.pedido = [...pedido, Orden];
        }
  

    }

    else{
        
        const resultado =cliente.pedido.filter(platillo => platillo.id !== Orden.id);
        cliente.pedido = [...resultado];
      
    }
    //limpiar el contenido previo
    limpiarHTML();

    actualizarResumen();
 

}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');
    
    const  resumen =document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

//informacion de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = `Mesa: `;
    mesa.classList.add('fw-bold');


    const mesaSpam = document.createElement('span');
    mesaSpam.textContent = cliente.mesa;
    mesaSpam.classList.add('fw-normal');

// informacion   de la hora
    const hora = document.createElement('p');
    hora.textContent = `Hora: `;
    hora.classList.add('fw-bold');


    const horaSpam = document.createElement('span');
    horaSpam.textContent = cliente.hora;
    horaSpam.classList.add('fw-normal');
    
    //agragara los elementos padres
    mesa.appendChild(mesaSpam);
    hora.appendChild(horaSpam);

    //*titulo de la seccion
    const heading =document.createElement('h3');
    heading.textContent = 'Resumen del Pedido';
    heading.classList.add('my-4', 'text-center');

    //ordenes
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    
    const {pedido}= cliente;
    pedido.forEach(platillo => {
        const {nombre, cantidad, precio, id} = platillo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item', 'justify-content-between', 'align-items-center');

        const nombreEL= document.createElement('h4');
        nombreEL.classList.add('my-4');
        nombreEL.textContent = nombre;

        //catidad 
        const cantidadEL = document.createElement('p');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = `Cantidad: `;
        

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //agragr valores contendores
        cantidadEL.appendChild(cantidadValor);

         //catidad 
        const precioEL = document.createElement('p');
        precioEL.classList.add('fw-bold');
        precioEL.textContent = `Precio: `;
        

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        //agragr valores contendores
        precioEL.appendChild(precioValor);

           //subtota;
        const subtotalEL = document.createElement('p');
        subtotalEL.classList.add('fw-bold');
        subtotalEL.textContent = `Subtotal aqui : `;
        

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal', 'px-2', 'py-1', 'rounded');
        subtotalValor.style.backgroundColor = '#d4edda'; // verde claro
        subtotalValor.style.color = '#155724'; // texto verde oscuro
        subtotalValor.style.display = 'inline-block';
        subtotalValor.textContent = `$${precio * cantidad}`;

        //agragr valores contendores
        subtotalEL.appendChild(subtotalValor);


        lista.appendChild(nombreEL);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEL);
        lista.appendChild(subtotalEL);

        //agregar elementos al LI
        grupo.appendChild(lista);


        
    });

    
    //limpiar el contenido
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);
    contenido.appendChild(resumen);
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}