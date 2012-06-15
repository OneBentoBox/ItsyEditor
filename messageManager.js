$(window).load(function() {    

    var theWindow        = $(window),
        $bg              = $("#bg"),
       aspectRatio      = $bg.width() / $bg.height();

    function resizeBg() {

        if ( (theWindow.width() / theWindow.height()) < aspectRatio ) {
            $bg
                .removeClass()
                .addClass('bgheight');
        } else {
            $bg
                .removeClass()
                .addClass('bgwidth');
        }

    }
    
    document.onmousedown=getXYPosition;


    theWindow.resize(function() {
        resizeBg();
    }).trigger("resize");
    

    var headID = document.getElementsByTagName("head")[0];         
    var cursorScript = document.createElement('script');
    var editorScript = document.createElement('script');
    cursorScript.type = 'text/javascript';
    cursorScript.src = 'cursor.js';
    headID.appendChild(cursorScript);
    editorScript.src = 'editor.js';
    editorScript.type = 'text/javascript';
    headID.appendChild(editorScript);

    

//$("body").click(function(){ alert("you clicked!")});


// Cursor coordinate functions
    var myX, myY, xyOn, myMouseX, myMouseY;
    xyOn = true;
    function getXYPosition(e){
    myMouseX=(e||event).clientX;
    myMouseY=(e||event).clientY;
    if (document.documentElement.scrollTop > 0) {
    myMouseY = myMouseY + document.documentElement.scrollTop;
    }
    if (xyOn) {
    console.log("X is " + myMouseX + "\nY is " + myMouseY);
    }
    }
    function toggleXY() {
    xyOn = !xyOn;
    document.getElementById('xyLink').blur();
    return false;
    }



});

