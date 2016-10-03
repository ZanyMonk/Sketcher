var Sketcher = (function($){
    var root;
    var layer_mouse;
    var posX, posY;
    var suivi = false;


    function sortLayers() {
      var $to_sort = root.children('canvas');
      $to_sort.sort(function(a,b) {
          let an = a.getAttribute('data-z-index'), bn = b.getAttribute('data-z-index');
          return an-bn;
      });
      $to_sort.detach().appendTo(root);
    }


    function createLayer(name, width, height, zindex) {
      var new_canvas = $('<canvas id="'+ name +'" width="'+ width +'" height="'+ height +'"></canvas>');
      new_canvas.css({"background-color" : "transparent", "position" : "absolute" , "left" : "0px", "top" : "0px", "z-index" : zindex});

      return new_canvas;
    }





  function onMouseDown(e){
    if (e.button == 0 && !suivi){
         console.log("APPUI");
         suivi = true;
         posX = e.clientX;
         posY = e.clientY;

        $(this).mousemove(function(event){
            onMouseMove(event);
        });
    }
  }

  function onMouseMove(e){
    console.log("Sourisbouge");
    var ctx = $('#event').get(0).getContext('2d');
    ctx.clearRect(0,0, layer_mouse.width() , layer_mouse.height());

    ctx.beginPath();
    ctx.moveTo(posX,posY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.closePath();
    ctx.stroke();
  }

  function onMouseUp(e){
  $(this).unbind('mousemove');
  console.log("ARRET");
  suivi = false;


  $(this).get(0).getContext('2d').clearRect(0,0, layer_mouse.width() , layer_mouse.height());

  var def_ctx = $('#draw').get(0).getContext('2d');
  def_ctx.beginPath();
  def_ctx.moveTo(posX, posY);
  def_ctx.lineTo(e.clientX, e.clientY);
  def_ctx.closePath();
  def_ctx.stroke();




  }

    //Chargement page
    $(function(){
        console.log("test");
        //On créer les canvas
        root = $('#sketcher');
        root.width(400);
        root.height(400);
        root.append(createLayer("draw", root.width() , root.height(), 0));
        root.append(createLayer("event", root.width(), root.height(), 999));
        //sortLayers();



        layer_mouse = $("#event");
        if (layer_mouse)  {
        layer_mouse.mousedown(onMouseDown);
        layer_mouse.mouseup(onMouseUp);
      }
      console.log(layer_mouse.width());
      console.log(layer_mouse.height());



    });

    return {

    };
})(jQuery);