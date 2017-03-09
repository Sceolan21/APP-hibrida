/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint
$.usuario={};
// Configuración del HOST y URL del servicio
$.usuario.HOST = 'http://localhost:8080';
// $.usuario.URL = '/biblioteca/webresources/com.iesvdc.acceso.entidades.usuario';
$.usuario.URL = '/biblioteca/webresources/com.iesvdc.acceso.entidades.usuario';

$.usuario.UsuarioReadREST = function(idUsuario) {
    if ( idUsuario === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#r_usuario').empty();
                $('#r_usuario').append('<h3>Listado de Usuarios</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>ID</th>', '<th>nombre</th>', 
                '<th>apellidos</th>', '<th>Correo Electronico</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    tbody.append($('<tr />').append('<td>' + json[clave].idUsuario + '</td>',
                                '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellido + '</td>', 
                                '<td>' + json[clave].email + '</td>'));
                }
                table.append(tbody);

                $('#r_usuario').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $('#r_usuario').empty();
                $('#r_usuario').append('<h3>Error conectando al servidor</h3>');
                $('#r_usuario').append('<p>Inténtelo más tarde</p>');
            }
        });
    } else {
        $.ajax({
            url: 'http://localhost:8080/biblioteca/webresources/com.iesvdc.acceso.entidades.usuario',
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                
            },
            error: function (xhr, status) {
                this.error('Imposible leer usuario','Compruebe su conexión e inténtelo de nuevo más tarde');
            }
        });
    }
};

$.usuario.UsuarioCreateREST = function(){
    var datos = {
        'nombre' : $("#c_us_nombre").val(),
        'apellido': $("#c_us_apellidos").val(),
        'email': $("#c_us_email").val()
    };
    
    // comprobamos que en el formulario haya datos...
    if ( datos.nombre.length>2 && datos.apellido.length>2 ) {
        $.ajax({
            url: $.usuario.HOST+$.usuario.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.usuario.UsuarioReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.usuario.error('Error: Usuario Create','No ha sido posible crear el usuario. Compruebe su conexión.');
            }
        });
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_usuario.
        $.afui.loadContent("#r_usuario",false,false,"up");
    }
    
};

$.usuario.UsuarioDeleteREST = function(idUsuario){
    // si pasamos el ID directamente llamamos al servicio DELETE
    // si no, pintamos el formulario de selección para borrar.
    if ( idUsuario !== undefined ) {
        idUsuario = $('#d_us_sel').val();
        $.ajax({
            url: $.usuario.HOST+$.usuario.URL+'/'+idUsuario,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json",
            // data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
               // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.usuario.UsuarioReadREST();
                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_usuario.
                $.afui.loadContent("#r_usuario",false,false,"up");
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.usuario.error('Error: Usuario Delete','No ha sido posible borrar el usuario. Compruebe su conexión.');
            }
        });    
    } else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_usuario').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var select = $('<select id="d_us_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].idUsuario+'">'+json[clave].nombre+' ' + json[clave].apellido+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="btn btn-danger" onclick="$.usuario.UsuarioDeleteREST(1)"> eliminar! </div>');
                $('#d_usuario').append(formulario).append(select);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.usuario.error('Error: Usuario Delete','No ha sido posible conectar al servidor. Compruebe su conexión.');
            }
        });
    }
    
};

$.usuario.UsuarioUpdateREST = function(idUsuario, envio){
    if ( idUsuario === undefined ) {
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_usuario').empty();
                $('#u_usuario').append('<h3>Pulse sobre un usuario</h3>');
                var table = $('<table />').addClass('table table-stripped');

                table.append($('<thead />').append($('<tr />').append('<th>ID</th>', '<th>nombre</th>', '<th>apellidos</th>', 
                                                                      '<th>Correo Electronico</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].idUsuario+'" onclick="$.usuario.UsuarioUpdateREST('+json[clave].idUsuario+')"/>').append('<td>' + json[clave].idUsuario + '</td>',
                    '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellido + '</td>', '<td>' + json[clave].email + '</td>'));
                }
                table.append(tbody);

                $('#u_usuario').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
            },
            error: function (xhr, status) {
                $.usuario.error('Error: Usuario Update','Ha sido imposible conectar al servidor.');
            }
        });
    } else if (envio === undefined ){
        var seleccion = "#fila_"+idUsuario+" td";
        var us_idUsuario = ($(seleccion))[0];
        var us_nombre = ($(seleccion))[1];
        var us_apellidos = ($(seleccion))[2];
        var us_email = ($(seleccion))[3];
        
        $("#u_us_idUsuario").val(us_idUsuario.childNodes[0].data);
        $("#u_us_nombre").val(us_nombre.childNodes[0].data);
        $("#u_us_apellidos").val(us_apellidos.childNodes[0].data);
        $("#u_us_email").val(us_email.childNodes[0].data);
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_usuario.
        $.afui.loadContent("#uf_usuario",false,false,"up");
    } else {
        //HACEMOS LA LLAMADA REST
            var datos = {
                'idUsuario' : $("#u_us_idUsuario").val(),
                'nombre' : $("#u_us_nombre").val(),
                'apellido': $("#u_us_apellidos").val(),
                'email': $("#u_us_email").val()
            };

            // comprobamos que en el formulario haya datos...
            if ( datos.nombre.length>2 && datos.apellido.length>2 ) {
                $.ajax({
                    url: $.usuario.HOST+$.usuario.URL+'/'+$("#u_us_idUsuario").val(),
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(datos),
                    success: function(result,status,jqXHR ) {
                       // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                        $.usuario.UsuarioReadREST();
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        $.usuario.error('Error: Usuario Create','No ha sido posible crear el usuario. Compruebe su conexión.');
                    }
                });

                // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
                $.afui.clearHistory();
                // cargamos el panel con id r_usuario.
                $.afui.loadContent("#r_usuario",false,false,"up");
            }
    }
};

$.usuario.error = function(title, msg){
    $('#err_usuario').empty();
    $('#err_usuario').append('<h3>'+title+'</h3>');
    $('#err_usuario').append('<p>'+msg+'</p>');
    // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
    $.afui.clearHistory();
    // cargamos el panel con id r_usuario.
    $.afui.loadContent("#err_usuario",false,false,"up");
};
