$(function(){
	// connect the socket.io server
    var socket = io.connect('http://localhost')
	//define socket events
    socket.on('connect',function(data){
        console.log('Connected!')
        socket.emit('connectmessage','A client has connected!')
    })
    socket.on('message',function(data){
        console.log(data)
        $('#room').append('<p>' + data + '</p>')
    })

    socket.on('userlist', function(data){
        $('#users').html('')
        console.log(data)
        for (user in data){
            $('#users').append('<p>' + user + '</p>')
        }
    })

	$('#message-input').on('keyup',function(event){
        console.log(event.which)
        if (event.which ===13){
            socket.emit('message', $('#message-input').val())
            $('#message-input').val('')
        }
    })
	// attach events
});
