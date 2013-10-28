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
            console.log('username: ', user)
            var name = data[user].name || user
            $('#users').append('<p>' + name + '</p>')
        }
    })

	$('#message-input').on('keyup', function(event){
        console.log(event.which)
        if (event.which === 13){
            socket.emit('message', myName + ': ' + $('#message-input').val())
            $('#message-input').val('')
        }
    })

    var myName = ''

    socket.on('clientname', function(data){
        myName = data
    })
    $('.name').on('keyup', function(event){
        if (event.which === 13 && $('.name').val()){
            socket.emit('setname', $('.name').val())
            myName = $('.name').val()
        }
    })
	// attach events
});
