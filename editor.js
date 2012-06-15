    
    //$("#target").submit(function(e) {
    //    e.preventDefault();
    //    alert('Handler for .submit() called.');
    //    return false;
    //});

    $('body').mousedown(function(e){
        
        console.log("Clicked -> " + e.srcElement.id);
        
        var targetLine = {
                    element: e.srcElement,
                    beforeCursor:"",
                    afterCursor:""
                };
//            cursor = document.getElementById('#cursorframe').contentWindow.cursor;
        
        if((e.srcElement.id == "inputArea")||
           (e.srcElement.id == "linecontainer"))
        {
            $('#inputarea').css("border","black solid 1px"); 
            
            console.log("A click was hit in workspace");
            
            alignCursorToText(e);
            cursor.showCursor();
            cursor.setCursorBlinking(true);
            
            var keypressEvents = $('body').data('events').keypress;
            if(// Annoymous function to determine if an editor event handler exists or not
               (function(){
                if((!keypressEvents)||(keypressEvents.length == 0)){
                    console.log("Log: keypress.editor - Event handler will be created");
                    return true;
                }
                if(keypressEvents.length < 0) {
                    console.log("Error: keypressEvents.length should not be < 0");
                    return false;
                }
                
                for(var i in keypressEvents){
                    if(keypressEvents[i].namespace == "editor"){
                        console.log("Warning: keypress.editor - Event handler already exists");
                        $('body').unbind('keypress.editor');
                        return true;   // There is already an event handler existing.
                    }
                }
                console.log("Log: No keypress.editor created yet - Creatin one now.");
                return true;

            })()){
                $('body').bind('keypress.editor',function(e){
                    var charCode = (typeof e.which == "number") ? e.which : e.keyCode,
                        oneChar = String.fromCharCode(charCode),
                        testChar = $('#testChar'),
                        testLine = $('#testLine'),
                        tempCharWidth = 0,
                        tempLineWidth = 0,
                        cursorLoc = cursor.returnLocation(),
                        keysEntered = 0; 
                
                    console.log("A key was pressed down: " + charCode + " " + String.fromCharCode(charCode) + e.keyCode);
                    
                    if (charCode == 32) {
                        e.preventDefault(); // Prevent the default action
                    }
                    // V1
                    // $('#linecontainer')[0].innerHTML += String.fromCharCode(charCode);
                    // V2
                    // $(targetLine.element)[0].innerHTML += String.fromCharCode(charCode);
                    
                    keysEntered += 1;
                    cursor.hideCursor();
                    testChar[0].innerHTML = oneChar;
                    testLine[0].innerHTML = targetLine.beforeCursor;
                    if(oneChar == " "){
                        tempCharWidth = 4;
                    } else {
                        tempCharWidth = testChar.width();
                    }
                    tempLineWidth = testLine.width() + tempCharWidth;   
            
                    targetLine.beforeCursor += oneChar;
/*                    cursor.moveCursorHere({x:tempLineWidth+8, y:cursorLoc.y}, function(){
                            keysEntered -= 1;
                            if(keysEntered == 0){
                                cursor.showCursor()
                            };
                        })*/;
                    cursor.moveCursorHere({x:tempLineWidth+8, y:cursorLoc.y});
                    cursor.showCursor();
                    $(targetLine.element)[0].innerHTML = targetLine.beforeCursor + targetLine.afterCursor;
                    
                    console.log("Typing:  beforeCursor = ["+targetLine.beforeCursor+"]");
                    console.log("Typing:  afterCursor = ["+targetLine.afterCursor+"]");
                });
            }
            
            // ++++++ Functions to capture the highlighted text//            
            function getSelectedText() {
                var text = "";
                if (typeof window.getSelection != "undefined") {
                    text = window.getSelection().toString();
                } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
                    text = document.selection.createRange().text;
                }
                return text;
            }
            
            function doSomethingWithSelectedText() {
                var selectedText = getSelectedText();
                if (selectedText) {
                    console.log("Got selected text [" + selectedText + "]");
                }
            }
            
            document.onmouseup = doSomethingWithSelectedText;
            document.onkeyup = doSomethingWithSelectedText;
            // ------ Functions to capture the highlighted text//
                        
            function alignCursorToText(e){
                var targetLineObject = $(e.srcElement)[0],      // Line jQuery Obj
                    srcElementInnerHtml = e.srcElement.innerHTML,         // innerHTML of the Line
                    testLine = $('#testLine'),                // Text Align Calculation Temp Var
                    testChar = $('#testChar'),                // Text Align Calculation Temp Var
                    tempChar = "", i = 0, j = 0,
                    tempLine = "",
                    oldLine = "",
                    oldLineWidth = 0,
                    tempLineWidth = 0,
                    tempCharWidth = 0,
                    mouseclickX = e.clientX,
                    mouseclickY = e.clientY;
                    
                console.log("Actual mouse click : " + mouseclickX + " " + mouseclickY);
                for(i in srcElementInnerHtml){
                    //console.log(i + " >"+srcElementInnerHtml[i]+"<");
                    oldLine = tempLine,
                    oldLineWidth = tempLineWidth;   //

                    tempChar = srcElementInnerHtml[i];
                    tempLine += tempChar;
                    
                    testChar[0].innerHTML = tempChar;
                    testLine[0].innerHTML = tempLine;
                    
                    if(tempChar == " "){
                        tempCharWidth = 4;
                        tempLineWidth = oldLineWidth + 4;
                    } else {
                        tempCharWidth = testChar.width();  
                        tempLineWidth = testLine.width();   
                    }
                    //tempLineWidth += tempCharWidth;
                    
                    if(tempLineWidth >= mouseclickX - 9){
                        console.log("tempChar:["+tempChar+"] tempCharWidth:["+tempCharWidth+"] tempLine:["+tempLine+"] tempLineWidth:["+tempLineWidth+"]");

                        if((tempLineWidth - (tempCharWidth * 0.75)) >=  (mouseclickX - 9)){
                            // Mouse click lands left of the targeted character.
//                            document.getElementById('cursorframe').contentWindow.cursor.moveCursorHere(
                            console.log("Mouse landed on the LEFT of the character: [" + tempChar + "]");

                            cursor.moveCursorHere(
                                {
                                    x:tempLineWidth - tempCharWidth + 9 - 1,
                                    y:$(targetLineObject).offset().top
                                });
                            cursor.showCursor();
                            targetLine.beforeCursor = oldLine;
                            console.log("beforeCursor = [" + targetLine.beforeCursor + "]");
                            targetLine.afterCursor = srcElementInnerHtml.slice(i);
                            console.log("afterCursor = [" + targetLine.afterCursor + "]");
                            return 0;
                        }else{
                            // Mouse click lands right of the targeted character.                            
//                            document.getElementById('cursorframe').contentWindow.cursor.moveCursorHere(
                            console.log("Mouse landed on the RIGHT of the character: [" + tempChar + "]");
                            cursor.moveCursorHere(
                                {
                                    x:tempLineWidth + 9 - 1,
                                    y:$(targetLineObject).offset().top
                                });
                            targetLine.beforeCursor = tempLine;
                            console.log("beforeCursor = [" + targetLine.beforeCursor + "]");
                            j = parseInt(i) + 1
                            targetLine.afterCursor = srcElementInnerHtml.slice(j);
                            console.log("afterCursor = [" + targetLine.afterCursor + "]");
                            return 0;
                        }
                        //break;
                        //console.log("Breaking out here");
                    }
                    
                }
                // If the for-loop is exhausted without finding the cursor place in the text.
                // It means the mouse click falls on the right side of the line outside of the content text.
                // So we move the cursor to end of line.
                cursor.moveCursorHere(
                    {
                        x:tempLineWidth + 9 - 1,
                        y:$(targetLineObject).offset().top
                    });
                targetLine.beforeCursor = tempLine;
                console.log("beforeCursor = [" + targetLine.beforeCursor + "]");
                targetLine.afterCursor = "";
                console.log("afterCursor = [" + targetLine.afterCursor + "]");
                //console.log("Returning from Cursor Text Alignment");
                //console.log(tempLine);
                //console.log(tempChar);
                
            }
        } else {
            $('#inputarea').css("border","white solid 1px");
            cursor.setCursorBlinking(false);
            cursor.hideCursor();
            //document.getElementById('cursorframe').contentWindow.cursor.setCursorBlinking(false);
            //document.getElementById('cursorframe').contentWindow.cursor.hideCursor();
            //
            $('body').unbind('keypress.editor');
        }
    });
    

  
    $('#workspace').bind("paste", function(e){
        console.log("A paste was made");
        
        // After paste action, there should be a function to analyze the pasted object.
        // If it's a text, we will insert it at the cursor.
        // If it's an img, we will insert it as well after processing (extracting the binary).
        // If others, just ignore.
    });
    