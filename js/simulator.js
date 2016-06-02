
/*------------------- OBJECT DEFINITIONS & GLOBAL VARIABLES -------------------------*/

function point(x, y, pointType){
    this.x = x;
    this.y = y;
    this.branch = [];
    this.type = pointType;
}

var path = [];

var mapVisibility = 1;
var lastParsedPath = "";

var toAnimate = false;

/*------------------------------------------------------------------------- */

/*------------------- EVENT LISTENERS  --------------------------------------*/

$(document).ready(function () {

    //snap control panel left
    $('#cp-left').click(function () {
        $('#sidebar').css({ 'left': '0px', 'right': 'auto' });
    });
    //snap control panel right
    $('#cp-right').click(function () {
        $('#sidebar').css({ 'left': 'auto', 'right': '0px' });
    });

    $('#load-map').click(function () {
        loadMap($('#map-filename-input').val());
    });

    $('#show-hide-map').click(function () {
        if (mapVisibility == 0) {
            showMap();
            mapVisibility = 1;
        }
        else {
            hideMap();
            mapVisibility = 0;
        }
    });
    $('#sim-start').click(function () {
        toAnimate = true;
        generateEntryPoint();
        
    });

    $('#sim-stop').click(function () {
        toAnimate = false;
    });

    $('#input-data').click(function () {
        DataBox(1);
    });

    $('#close-databox-button').click(function () {
        DataBox(0);
    });

    $('#parse-data').click(function () {
        parseData();
    });

});

/*------------------------------------------------------------------------- */

/*------------------- METHODS/FUNCTIONS  --------------------------------------*/

function loadMap(filename){
    currentMapImage = 'resources/maps/' + filename;
    $('#map-area').css('background-image', 'url(' + currentMapImage + ')');
    printToConsole('<br /> You loaded "' + filename + '" as your map.');
    mapVisibility = 1;
}

function showMap(){
    $('#map-area').css('background-image', 'url(' + currentMapImage + ')');
}

function hideMap(){
    $('#map-area').css('background-image', "url('')");
}

function printToConsole(msg){
    $('#console').html(msg);
}

function appendToConsole(msg){
    $('#console').html($('#console').html() + msg);
}

function DataBox(dataBoxStatus){
    if(dataBoxStatus == 0){
        $('#get-data-box').attr('class', 'hidden');
        printToConsole('<br/>Data box closed.')
    }
    else{
        $('#get-data-box').attr('class', '');
        printToConsole('<br />### Input Path and Automata Data ###. <br /><br /> Copy and Paste data to the textboxes provided.');
    }
}

function parseData(){
    var pathJSON = $('#pathdata-tbox').val();
    var atmJSON = $('#atmdata-tbox').val();
    printToConsole('');
    if(pathJSON == ""){
        appendToConsole("<br />No path data provided.");
    }
    else{
        appendToConsole("<br />Path data provided.");
        if(!isvalidJSON(pathJSON)){
            appendToConsole("<br /><br />#### Path data provided is NOT a valid JSON data! ####<br/>");
            return;
        }
        if(lastParsedPath != pathJSON){
            lastParsedPath = pathJSON;
            //parse path data JSON string
            path = JSON.parse(pathJSON);
            //recreate points from path data
            recreatePath();
        }  
    }
    if(atmJSON == ""){
        appendToConsole("<br />No Automata data provided.");
    }
    else{
        appendToConsole("<br />Automata data provided.");
        if(!isvalidJSON(atmJSON)){
            appendToConsole("<br /><br />#### Automata data provided is NOT a valid JSON data! ####<br/>");
            return;
        }

        //will add here parser for automata data as soon as data structure is made
    }
    $('#get-data-box').attr('class', 'hidden');
}

function recreatePath(){
    for(var i = 0; i < path.length; i++){
        putMarker(path[i].x, path[i].y, path[i].type);
    }
}

function putMarker(x, y, pointType){
    // if(pointType == 0){
    //     $('#map-area').append('<div class="pin-pointer go-pt" id="point_' + x + '_' + y + '"></div>');
    // }
    // else{
    //     $('#map-area').append('<div class="pin-pointer dead-pt" id="point_' + x + '_' + y + '"></div>');
    // } 
    // $('#point_' + x + '_' + y).css({top: y - 6, left: x - 6});
}

function isvalidJSON(string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}
/*------------------------------------------------------------------------- */
