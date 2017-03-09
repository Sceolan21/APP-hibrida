/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint
$.libro={};
// Configuración del HOST y URL del servicio
$.libro.HOST = 'http://localhost:8080';
// $.libro.URL = '/biblioteca/webresources/com.iesvdc.acceso.entidades.libro';
$.libro.URL = '/biblioteca/webresources/com.iesvdc.acceso.entidades.libro';

$.libro.LibroReadREST = function(idLibro) {
    if ( idLibro === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#r_libro').empty();
                $('#r_libro').append('<h3>Listado de Libro</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>ID</th>', '<th>nombre</th>', '<th>autor</th>', '<th>ISBN</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    tbody.append($('<tr />').append('<td>' + json[clave].idLibro + '</td>',
                                '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].autor + '</td>', 
                                '<td>' + json[clave].isbn + '</td>'));
                }
                table.append(tbody);

                $('#r_libro').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $('#r_libro').empty();
                $('#r_libro').append('<h3>Error conectando al servidor</h3>');
                $('#r_libro').append('<p>Inténtelo más tarde</p>');
            }
        });
    } else {
        $.ajax({
            url: 'http://localhost:8080/biblioteca/webresources/com.iesvdc.acceso.entidades.libro',
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                
            },
            error: function (xhr, status) {
                this.error('Imposible leer libro','Compruebe su conexión e inténtelo de nuevo más tarde');
            }
        });
    }
};

$.libro.LibroCreateREST = function(){
    var datos = {
        'nombre' : $("#c_li_nombre").val(),
        'autor': $("#c_li_autor").val(),
        'isbn': $("#c_li_isbn").val()
    };
    
    // comprobamos que en el formulario haya datos...
    if ( datos.nombre.length>2 && datos.autor.length>2 ) {
        $.ajax({
            url: $.libro.HOST+$.libro.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.libro.LibroReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Crear Libro','No ha sido posible crear el libro. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_libro.
        $.afui.loadContent("#r_libro",false,false,"up");
    }
    
};

$.libro.LibroDeleteREST = function(idLibro){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( idLibro !== undefined ) {
        idLibro = $('#d_li_sel').val();
        $.ajax({
            url: $.libro.HOST+$.libro.URL+'/'+idLibro,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.libro.LibroReadREST();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_libro.
                $.afui.loadContent("#r_libro",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Borrar Libro','No ha sido posible borrar el libro. Compruebe su conexión.');
            }
        });    
    } else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_libro').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var select = $('<select id="d_li_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].idLibro+'">'+json[clave].nombre+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="btn btn-danger" onclick="$.libro.LibroDeleteREST(1)"> eliminar! </div>');
                $('#d_libro').append(formulario).append(select);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Borrar Libro','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
};

$.libro.LibroUpdateREST = function(idLibro, envio){
    if ( idLibro === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_libro').empty();
                $('#u_libro').append('<h3>Pulse sobre un libro</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>ID</th>', '<th>nombre</th>', '<th>autor</th>', 
                                                                      '<th>ISBN</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].idLibro+'" onclick="$.libro.LibroUpdateREST('+json[clave].idLibro+')"/>').append('<td>' + json[clave].idLibro + '</td>',
                    '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].autor + '</td>', '<td>' + json[clave].isbn + '</td>'));
                }
                table.append(tbody);

                $('#u_libro').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.libro.error('Error: Actualizar Libro','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        var seleccion = "#fila_"+idLibro+" td";
        var li_idLibro = ($(seleccion))[0];
        var li_nombre = ($(seleccion))[1];
        var li_autor = ($(seleccion))[2];
        var li_isbn = ($(seleccion))[3];
        
        $("#u_li_id").val(li_idLibro.childNodes[0].data);
        $("#u_li_nombre").val(li_nombre.childNodes[0].data);
        $("#u_li_autor").val(li_autor.childNodes[0].data);
        $("#u_li_isbn").val(li_isbn.childNodes[0].data);
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_libro.
        $.afui.loadContent("#uf_libro",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
                'idLibro' : $("#u_li_id").val(),
                'nombre' : $("#u_li_nombre").val(),
                'autor': $("#u_li_autor").val(),
                'isbn': $("#u_li_isbn").val()
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.nombre.length>2 && datos.autor.length>2 ) {
                $.ajax({
                    url: $.libro.HOST+$.libro.URL+'/'+$("#u_li_id").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.libro.LibroReadREST();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.libro.error('Error: Crear Libro','No ha sido posible crear el libro. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_libro.
                $.afui.loadContent("#r_libro",false,false,"up");
            }
    }
};

$.libro.error = function(title, msg){
    $('#err_libro').empty();
    $('#err_libro').append('<h3>'+title+'</h3>');
    $('#err_libro').append('<p>'+msg+'</p>');
    // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
    $.afui.clearHistory();
    // cargamos el panel con id r_libro.
    $.afui.loadContent("#err_libro",false,false,"up");
};
