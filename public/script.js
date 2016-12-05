$(function(){

    if(!('getContext' in document.createElement('canvas'))){
        alert('Sorry, it looks like your browserdoes not support canvas!');
        return false;
    }
    
    var doc = $(document),
        win = $(window),
        canvas = $('#board'),
        ctx = canvas[0].getContext('2d');

    
    var url="http://yanjiuns-air:3000";

    // Unique id to identify user
    var id = Math.round($.now()*Math.random());

    var drawing = false;

    var clients = {};
    var cursors = {};

    var socket = io.connect(url);

    socket.on('moving', function(data){
        console.log('moving');
        console.log(data);
        
        if(! (data.id in clients)){
            cursors[data.id] = $('<div class="cursor">').append('#cursors');
        }

        cursors[data.id].css({
            'left' : data.x,
            'top'  : data.y
        });
       
        // Is the user drawing?
        if(data.drawing && clients[data.id]){

            // Draw a line on the canvas. clients[data.id] holds
            // the previous position of this user's mouse pointer

            drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
        }
 
        clients[data.id] = data;
        clients[data.id].updated = $.now();
        
    });
   
    var prev = {};

    canvas.on('mousedown', function(e){
        e.preventDefault();
        drawing = true;
        prev.x = e.pageX;
        prev.y = e.pageY;

    });

    doc.bind('mouseup mouseleave',function(){
        drawing = false;
    });

    var lastEmit = $.now();

    doc.bind('mousemove', function(e){
        console.log('mousemove');
        if($.now() - lastEmit > 30){
            socket.emit('mousemove',{
                'x': e.pageX,
                'y': e.pageY,
                'drawing': drawing,
                'id': id
        });
        lastEmit = $.now();
        }

        if(drawing){
            drawLine(prev.x, prev.y, e.pageX, e.pageY);

            prev.x = e.pageX;
            prev.y = e.pageY;
        }
    });

    function drawLine(fromx, fromy, tox, toy){
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.stroke();
    }
 
});
