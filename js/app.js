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

    if (cliente.mesa !== '' || cliente.hora !== '') {
    
        /// limpiar el objeto cliente
        cliente = { 
            mesa: '',
            hora: '',
            pedido: []
        };
        //limpiar el HTML
        limpiarHTML();
        

    }

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

     if(cliente.pedido.length ) {
            actualizarResumen();
    } else{
        listaVacia();
    }

 

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

         // Boton para eliminar (alineado a la derecha)
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'rounded-pill', 'border-2', 'float-end', 'ms-3');
        btnEliminar.style.fontFamily = "'Courier New', Courier, monospace";
        btnEliminar.style.backgroundColor = '#f8d7da'; // rojo claro
        btnEliminar.style.color = '#721c24'; // texto rojo oscuro
        btnEliminar.style.borderColor = '#f5c6cb'; // borde rojo claro
        btnEliminar.textContent = '✖ Eliminar';

        btnEliminar.onclick = function() {
            BtndeletePlatillo(id);

        }

        //agregar valores contendores
        subtotalEL.appendChild(subtotalValor);


        lista.appendChild(nombreEL);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEL);
        lista.appendChild(subtotalEL);
        lista.appendChild(btnEliminar);

        //agregar elementos al LI
        grupo.appendChild(lista);


        
    });

    
    //limpiar el contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);
    
    contenido.appendChild(resumen);
     
    //*formulario de propinas
    mostrarPropinas();

}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function BtndeletePlatillo(id) {
    //eliminar del objeto cliente
    const {pedido} = cliente;
    const resultado = pedido.filter(platillo => platillo.id !== id);
    cliente.pedido = [...resultado];

    //limpiar el HTML
    limpiarHTML();

    //actualizar el resumen

    
  if(cliente.pedido.length ) {
            actualizarResumen();
    } else{
        listaVacia();
    }

    //reiniciar el input de cantidad
    document.querySelector(`#cantidad-${id}`).value = 0;
  

}

function listaVacia() {
    const contenido = document.querySelector('#resumen .contenido');
    
    const mensaje = document.createElement('p');
    mensaje.classList.add('text-center', 'fs-4', 'text-secondary', 'mt-5');
    mensaje.textContent = 'Añade los elementos del pedido';
    contenido.appendChild(mensaje);
}
function mostrarPropinas() {
    const contenido = document.querySelector('#resumen .contenido');



    // Crear el contenedor del formulario con estilo oscuro vintage
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario', 'py-5', 'px-4', 'shadow', 'bg-light', 'border', 'rounded');
    formulario.style.maxWidth = '420px';
    formulario.style.margin = '0 auto';
    formulario.style.fontFamily = "'Special Elite', 'Courier New', Courier, monospace";
    formulario.style.border = '3px solid #bfc1c2';
    formulario.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(220,220,220,0.85) 100%)';
    formulario.style.boxShadow = '0 8px 24px rgba(180, 180, 180, 0.3)';
    formulario.style.color = '#333';
    formulario.style.letterSpacing = '0.5px';

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-5', 'px-3', 'shadow', 'bg-white', 'rounded');
    divFormulario.style.background = 'rgba(255,255,255,0.85)';
    divFormulario.style.border = '2px solid #bfc1c2';

    const heading = document.createElement('h3');
    heading.textContent = 'Propinas';
    heading.classList.add('my-4', 'text-center');
    heading.style.fontFamily = "'Special Elite', 'Courier New', Courier, monospace";
    heading.style.color = '#333';
    heading.style.textShadow = '1px 1px 0rgb(11, 153, 224), 2px 2px 0 #fff';


   const radiobuttonContenido = radiobutton();



    //add  div principa;
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radiobuttonContenido);
   
    
    //add contenido  al form
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);


    



}


function radiobutton() {

    const divFormulario = document.createElement('div');

    // radio button 0%
    const radio0 = document.createElement('input');
    radio0.type = 'radio';
    radio0.name = 'propina';
    radio0.value = '0';
    radio0.classList.add('form-check-input', 'propina-radio');
    radio0.onclick=caldularPropina;

    const label0 = document.createElement('label');
    label0.textContent = '0%';
    label0.classList.add('form-check-label', 'fw-bold', 'propina-label');
    label0.style.fontFamily = "'Courier New', Courier, monospace";
    label0.style.color = '#000';

    const div0 = document.createElement('div');
    div0.classList.add('form-check', 'mb-3');
    div0.appendChild(radio0);
    div0.appendChild(label0);

    // radio button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input', 'propina-radio');
     radio10.onclick=caldularPropina;

    const label10 = document.createElement('label');
    label10.textContent = '10%';
    label10.classList.add('form-check-label', 'fw-bold', 'propina-label');
    label10.style.fontFamily = "'Courier New', Courier, monospace";
    label10.style.color = '#000';

    const div10 = document.createElement('div');
    div10.classList.add('form-check', 'mb-3');
    div10.appendChild(radio10);
    div10.appendChild(label10);

    // radio button 15%
    const radio15 = document.createElement('input');
    radio15.type = 'radio';
    radio15.name = 'propina';
    radio15.value = '15';
    radio15.classList.add('form-check-input', 'propina-radio');
     radio15.onclick=caldularPropina;

    const label15 = document.createElement('label');
    label15.textContent = '15%';
    label15.classList.add('form-check-label', 'fw-bold', 'propina-label');
    label15.style.fontFamily = "'Courier New', Courier, monospace";
    label15.style.color = '#000';

    const div15 = document.createElement('div');
    div15.classList.add('form-check', 'mb-3');
    div15.appendChild(radio15);
    div15.appendChild(label15);

    // radio button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input', 'propina-radio');
     radio25.onclick=caldularPropina;

    const label25 = document.createElement('label');
    label25.textContent = '25%';
    label25.classList.add('form-check-label', 'fw-bold', 'propina-label');
    label25.style.fontFamily = "'Courier New', Courier, monospace";
    label25.style.color = '#000';

    const div25 = document.createElement('div');
    div25.classList.add('form-check', 'mb-3');

    // --- Agregar estilos dinámicos para hover y selección ---
    // Solo se agrega una vez
    if (!document.getElementById('propina-radio-style')) {
        const style = document.createElement('style');
        style.id = 'propina-radio-style';
        style.textContent = `
            .propina-label {
                transition: background 0.2s, color 0.2s;
                border-radius: 6px;
                padding: 2px 10px;
                cursor: pointer;
            }
            .propina-radio:checked + .propina-label {
                background: #d4edda;
                color: #155724 !important;
                border: 2px solid #28a745;
            }
            .propina-label:hover {
                background: #e2f7e2;
                color: #218838 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Relacionar input y label para el selector CSS
    radio0.id = 'propina-0';
    label0.htmlFor = 'propina-0';
    radio10.id = 'propina-10';
    label10.htmlFor = 'propina-10';
    radio15.id = 'propina-15';
    label15.htmlFor = 'propina-15';
    radio25.id = 'propina-25';
    label25.htmlFor = 'propina-25';


    //add
    div25.appendChild(radio25);
    div25.appendChild(label25);

    //agregar todos los divs al divFormulario
    divFormulario.appendChild(div0);
    divFormulario.appendChild(div10);
    divFormulario.appendChild(div15);
    divFormulario.appendChild(div25);

    return divFormulario;

}

function caldularPropina(e) {
    let propina = parseInt(e.target.value);
    const {pedido} = cliente;
    let total = 0;
    
    
    pedido.forEach(platillo => { 
        total += platillo.precio * platillo.cantidad;
    
    
    });

    let calcpropina = (total * propina) / 100;

    let totalFinal = total + calcpropina;

    console.log('Calculando propina...' + propina + ' Total: $' + total + ' Propina: $' + calcpropina + ' Total Final: $' + totalFinal);
    
    agregarTotalHTML( total, calcpropina, totalFinal);

}

function agregarTotalHTML(total, calcpropina, totalFinal) {
    const formulario = document.querySelector('.formulario > div');

    // Elimina cualquier resumen previo de totales
    const totalPrevio = formulario.querySelector('.resumen-totales');
    if (totalPrevio) {
        totalPrevio.remove();
    }

    // Contenedor principal de los totales
    const resumenTotales = document.createElement('div');
    resumenTotales.classList.add('resumen-totales', 'mt-4', 'p-4', 'rounded', 'shadow-sm');
    resumenTotales.style.background = 'rgba(245,245,245,0.95)';
    resumenTotales.style.border = '2px solid #bfc1c2';
    resumenTotales.style.fontFamily = "'Special Elite', 'Courier New', Courier, monospace";
    resumenTotales.style.maxWidth = '350px';
    resumenTotales.style.margin = '0 auto';

    // Total productos
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('d-flex', 'justify-content-between', 'mb-2', 'align-items-center');
    totalDiv.innerHTML = `<span class="fw-bold">Total productos:</span> <span class="fw-normal">$${total.toFixed(2)}</span>`;

    // Propina
    const propinaDiv = document.createElement('div');
    propinaDiv.classList.add('d-flex', 'justify-content-between', 'mb-2', 'align-items-center');
    propinaDiv.innerHTML = `<span class="fw-bold">Propina:</span> <span class="fw-normal">$${calcpropina.toFixed(2)}</span>`;

    // Barra separadora
    const separador = document.createElement('hr');
    separador.style.borderTop = '3px double #bfc1c2';
    separador.style.margin = '18px 0';

    // Total final
    const totalFinalDiv = document.createElement('div');
    totalFinalDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center');
    totalFinalDiv.innerHTML = `<span class="fw-bold" style="font-size:1.2em;color:#218838;">Total a pagar:</span> <span class="fw-bold" style="font-size:1.2em;color:#218838;">$${totalFinal.toFixed(2)}</span>`;

    // Agregar al contenedor
    resumenTotales.appendChild(totalDiv);
    resumenTotales.appendChild(propinaDiv);
    resumenTotales.appendChild(separador);
    resumenTotales.appendChild(totalFinalDiv);

    // Insertar en el formulario
    formulario.appendChild(resumenTotales);

    


}