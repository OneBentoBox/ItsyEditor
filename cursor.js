console.log("Cursor.js loaded");
$('#cursorframe').hide();
cursor = (function($){

    var location = {x:0, y:0},
        showCursor = false,
        cursorDiv = false,
        editorDiv = false,
        blinkSwitch = false,
        blinkProcessId = false,
        position = {
            divwidth:0,
            divheight:0,
            leftoffset:0,
            topoffset:0,
            divpadding:10
        }
        
    function cursorBlink(callback){
        console.log("inside cursorBlink function");
        callback.call();
    };
    //
    //function findPosX(obj) {
    //    var curleft = 0;
    //    if (obj.offsetParent) {
    //        while (1) {
    //            curleft+=obj.offsetLeft;
    //            if (!obj.offsetParent) {
    //                break;
    //            }
    //            obj=obj.offsetParent;
    //        }
    //    } else if (obj.x) {
    //        curleft+=obj.x;
    //    }
    //    return curleft;
    //}
    //
    //function findPosY(obj) {
    //    var curtop = 0;
    //    if (obj.offsetParent) {
    //        while (1) {
    //            curtop+=obj.offsetTop;
    //            if (!obj.offsetParent) {
    //                break;
    //            }
    //            obj=obj.offsetParent;
    //        }
    //    } else if (obj.y) {
    //        curtop+=obj.y;
    //    }
    //    return curtop;
    //}

    return {
            
    findPosX:function(obj) {
        var curleft = 0;
        if (obj.offsetParent) {
            while (1) {
                curleft+=obj.offsetLeft;
                if (!obj.offsetParent) {
                    break;
                }
                obj=obj.offsetParent;
            }
        } else if (obj.x) {
            curleft+=obj.x;
        }
        return curleft;
    },
    
     findPosY:function(obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            while (1) {
                curtop+=obj.offsetTop;
                if (!obj.offsetParent) {
                    break;
                }
                obj=obj.offsetParent;
            }
        } else if (obj.y) {
            curtop+=obj.y;
        }
        return curtop;
    },
        
        setCursorDiv:function(thisDiv){
            if(parent.$(thisDiv)){
                cursorDiv = thisDiv;
            } else {
                return {response: false, message:"div not found"};
            }
            

            position.divwidth = cursorDiv.width();
            position.divheight = cursorDiv.height();
            position.leftoffset = cursorDiv.offset().left;  // Remember the inputdiv always have 10px padding on all sides.
            position.topoffset = cursorDiv.offset().top;
            console.log("divwidth = " + position.divwidth);
            console.log("divheight = " + position.divheight);
            console.log("topoffset = " + position.topoffset);
            console.log("leftoffset = " + position.leftoffset);
            
            this.setCursorBlinking(true);
        },

        moveCursorHere:function(newlocation, callback){
           console.log("Moving Cursor!  Old Location: [" + location.x + "," + location.y + "]  New Location: [" + newlocation.x + "," + newlocation.y + "]" );
           //console.log("New location: " + newlocation.x + " " + newlocation.y);
           
           // Need to add another check to see if the target location is out of editorDiv's boundaries.
           if((!newlocation.x)&&(!newlocation.y)){
               console.log("No cursor or Invalid location!");
               return {response: false, message:"No cursor found"};
           } else {
                //if((newlocation.x < position.leftoffset+position.divpadding)) { console.log("case1");}
                //if((newlocation.x > position.leftoffset+position.divwidth+position.divpadding)) { console.log("case2");}
                //if((newlocation.y < position.topoffset+position.divpadding)) { console.log("case3");}     
                //if((newlocation.y > position.topoffset+position.divwidth+position.divpadding)) { console.log("case4");}
                
            
                //parent.$('#cursorframe').hide(0,
                //    function(){
                //        parent.$('#cursorframe').animate({left:newlocation.x+"px",top:newlocation.y+"px"},
                //                                function(){
                //                                    parent.$('#cursorframe').show();
                //                                }
                //                         );
                //        console.log("Updating old location: " + location.x + " " + location.y);
                //        location = newlocation;
                //        console.log("To new location: " + location.x + " " + location.y);
                //        if(callback){
                //            callback.apply();
                //        }
                //   });

                //parent.$('#cursorframe').animate({left:newlocation.x+"px",top:newlocation.y+"px"},
                //                        function(){
                //                            console.log("Updating old location: " + location.x + " " + location.y);
                //                            location = newlocation;
                //                            console.log("To new location: " + location.x + " " + location.y);
                //                            if(callback){
                //                                callback.apply();
                //                            }
                //                        }
                //                 );
                
                document.getElementById('cursorframe').style.left = newlocation.x + "px";
                document.getElementById('cursorframe').style.top = newlocation.y + "px";
                console.log("Using Native API to update old location: " + location.x + " " + location.y);
                location = newlocation;
                console.log("To new location: " + location.x + " " + location.y);
                if(callback){
                    callback.apply();
                }

           }
        },
       
        setCursorBlinking:function(control){
            //console.log('Called setCursorBlinking');
            
            if((control != true)&&(control != false)){
                //console.log("Only takes 'true' or 'false' as parameter");
                return;
            }

            if(control != blinkSwitch){
                blinkSwitch = control;
            } else {
                return;
            }
            
            if(blinkSwitch == true){
                var count = 1;
                $('#cursor').show();
                blinkProcessId = setInterval(function(){
                        if(count%2){
                            //console.log("hiding cursor");
                            $('#cursor').hide();
                        }else{
                            //console.log("showing cursor");
                            $('#cursor').show();
                        }
                        count++;
                        //console.log('Blink:'+ count++);
                    },500);
            } else {
                if(!blinkProcessId){
                    //console.log("Already not blinking");
                    return;
                }
                //console.log("Stop blinking");
                clearInterval(blinkProcessId);
                setTimeout(blinkProcessId = false, 500);
            }

        },
       
       hideCursor:function(){
            $('#cursorframe').hide();
       },
       
       showCursor:function(){
            $('#cursorframe').show();
       },
       
       returnLocation:function(){
           return location;
       }
    };
})($);

console.log("Cursor.js finished loading");    

//
//cursor = (function(){
//
//        var location = {x:0, y:0},
//            showCursor = false,
//            cursorDiv = "";
//            
//        return function(){
//            
//            function setCursorDiv(thisDiv){
//                if($(thisDiv)){
//                    cursorDiv = thisDiv;
//                    return {response: true, message:""};
//                } else {
//                    return {response: false, message:"div not found"};
//                }
//            };
//    
//            function moveCursorHere(location){
//                $(cursor).animate({top:location.x,left:location.y});
//            };
//            
//            function blinkCursor(frequency){
//            
//            };
//            
//            function hideCursor(){
//            
//            };
//            
//            function showCursor(){
//            
//            };
//            
//            function returnCursorLocation(){
//                return location;
//            };
//        }
//    })();
//console.log("Cursor.js finished loading");    