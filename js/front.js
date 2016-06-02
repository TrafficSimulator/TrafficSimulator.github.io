
/*------------------- OBJECT DEFINITIONS & GLOBAL VARIABLES -------------------------*/

function point(x, y, pointType){
    this.x = x;
    this.y = y;
    this.branch = [];
    this.type = pointType;
}

var path = [];

var rootPointIndex = -1;
var branchPoints = [];

var pointType = 0;
var currentMapImage = '';
var mapVisibility = 1;
var linkHistory = [];

var systemMode = 0; // 0 - Make Path, 1 - Link Mode


/*-------------------------------------------------------------------- */

/*----------------- EVENT LISTENERS ------------------------------------- */

$(document).ready(function () {
    $('#map-click').click(function (e) {
        if (systemMode == 0) {
            var x = Math.round(e.pageX - $(this).offset().left);
            var y = Math.round(e.pageY - $(this).offset().top);
            var pt = new point(x, y, pointType);
            addPointToPath(pt);
            positionMarker(x, y);
            putMarker(x, y, pointType);
        }
    });

    $('#undo').click(function () {
         undoAddPoint();
    });

    $('#link-mode').click(function () {
        if (systemMode == 1) {
            exitLinkMode();
            systemMode = 0;
            clearRootPointIndex();
        }
        else {
            linkMode();
            systemMode = 1;
            clearRootPointIndex();
        }
    });

    $(document).on('click', '.pin-pointer', function (e) {
        if (systemMode == 1) {
            if (rootPointIndex == -1) {
                initRootPoint(e.target.id);
            }
            else {
                addBranchPoint(e.target.id);
            }
        }
    });

    $('#link-done-button').click(function () {
        saveBranchPoints();
        hideLinkDoneButton();
    });

    $('#print-data').click(function () {
        printData();
        openDataBox();
    });

    $('.pt-sel-button').click(function (e) {
        if ($('#' + e.target.id).data('pt') == 'go') {
            changePointType(0);
        }
        else {
            changePointType(1);
        }
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

    $('#cp-left').click(function () {
        $('#sidebar').css({ 'left': '0px', 'right': 'auto' });
    });
    $('#cp-right').click(function () {
        $('#sidebar').css({ 'left': 'auto', 'right': '0px' });
    });

    $('#close-databox-button').click(function () {
        hideDataBox();
    });

    $('#undo-link').click(function () {
        undoLink();
    });
});

/*--------------------------------------------------------------------- */

/* ----------------- METHOD DEFINITIONS ------------------------------ */

function positionMarker(x, y){
    $("#map-pointer").css({top: y - 6, left: x - 6});
}

function putMarker(x, y, pointType){
    var newID = 'point_' + x + '_' + y;
    $('#map-pointer').clone().attr('id', newID).appendTo('#map-area');
    if(pointType == 0){
        //put a green "go" point
        $('#' + newID).attr('class', 'pin-pointer go-pt');
    }
    else{
        //put a gray "dead" point
        $('#' + newID).attr('class', 'pin-pointer dead-pt');
    }

    $('#' + newID).attr('data-index', path.length - 1);
    $('#' + newID).attr('title', newID);
    $('#' + newID).css({ top: y - 6, left: x - 6});
    $('#map-pointer').css({ top: 0, left: 0});
}

function addPointToPath(point){
    path.push(point);
    $('#console').html('');
    displayCoordinates();
}

function displayCoordinates(){
    for(var i = 0; i < path.length; i++){
        $('#console').html($('#console').html() + 'x: ' + path[i].x + ' y: ' + path[i].y + '<br/>');
    }
}

function undoAddPoint(){
    $('#console').html('');
    var elementToRemove = '#point_' + path[path.length - 1].x + '_' + path[path.length - 1].y;
    $(elementToRemove).remove();
    path.splice(path.length - 1, 1);
    displayCoordinates();
}

function linkMode(){
    //disable all other function buttons
    $('#undo').attr('disabled', '');
    $('#trace-path').attr('disabled', '');
    $('#undo-link').removeAttr('disabled');
    blurAllPoints();
    printToConsole('### Link Mode On ### <br/><br/> Select a point as root then select point/points where it can branch.');
}

function exitLinkMode(){
    $('#undo').removeAttr('disabled');
    $('#trace-path').removeAttr('disabled');
    $('#undo-link').attr('disabled', '');
    unblurAllPoints();
    printToConsole('### Link Mode Off ###');
}

function unblurPoint(id){
    $('#' + id).css('opacity', '1.0');
}

function blurAllPoints(){
    $('.pin-pointer').css('opacity', '0.4');
}

function unblurAllPoints(){
    $('.pin-pointer').css('opacity', '1.0');
}

function printToConsole(message){
    $('#console').html(message);
}

function printData(){
    printToConsole('### Showing Path Data ### <br/><br/> Copy the data from the TextBox and save it to a text file.');
    $('#get-data-tbox').html(JSON.stringify(path));
}

function clearRootPointIndex(){
    rootPointIndex = -1;
}

function showLinkDoneButton(){
    $('#link-done-button').attr('class', '');
}

function hideLinkDoneButton(){
    $('#link-done-button').attr('class', 'hidden');
}

function initRootPoint(pointID){
    unblurPoint(pointID);
    rootPointIndex = $('#' + pointID).data('index');
    printToConsole('Root ID: <br/>' + pointID + '<br/> Root Index: ' + rootPointIndex);
}

function addBranchPoint(pointID){
    showLinkDoneButton();
    $('#' + pointID).attr('class', $('#' + pointID).attr('class') + ' branch-pt');
    var rootID = 'point_' + path[rootPointIndex].x + '_' + path[rootPointIndex].y;
    $('#' + rootID).attr('class', $('#' + rootID).attr('class') + ' root-pt');
    branchPoints.push($('#' + pointID).data('index'));
}

function saveBranchPoints(){

    path[rootPointIndex].branch = branchPoints;

    //saves the root point where last linking was specified for undo purposes
    linkHistory.push(rootPointIndex);

    printToConsole('### Branch Points Added to point_' + path[rootPointIndex].x + '_' + path[rootPointIndex].y);
    branchPoints = [];
    clearRootPointIndex();
    blurAllPoints();
}

function changePointType(type){
    $('.pt-sel-button').attr('class', 'pt-sel-button');
    if(type == 0){
        $('#go-pt-sel-button').attr('class', 'pt-sel-button selected');
        pointType = 0;
    }
    else{
        $('#dead-pt-sel-button').attr('class', 'pt-sel-button selected');
        pointType = 1;
    }
}

function loadMap(filename){
    currentMapImage = 'resources/maps/' + filename;
    $('#map-click').css('background-image', 'url(' + currentMapImage + ')');
    mapVisibility = 1;
}

function showMap(){
    $('#map-click').css('background-image', 'url(' + currentMapImage + ')');
}

function hideMap(){
    $('#map-click').css('background-image', "url('')");
}

function openDataBox(){
    $('#get-data-box').attr('class', '');
}

function hideDataBox(){
    $('#get-data-box').attr('class', 'hidden');
}

function undoLink(){
    if(linkHistory.length > 0){
        var undoRoot = linkHistory[linkHistory.length - 1];
        linkHistory.splice(linkHistory.length - 1, 1);
        var undoBranch = path[undoRoot].branch;
        for(var i = 0; i < undoBranch.length; i++){
            var branchIndex = undoBranch[i];
            var pointID = 'point_' + path[branchIndex].x + '_' + path[branchIndex].y;
            $('#' + pointID).attr('class', 'pin-pointer go-pt');
        }
        path[undoRoot].branch = [];
        var rootPointID = 'point_' + path[undoRoot].x + '_' + path[undoRoot].y;
        $('#' + rootPointID).attr('class', 'pin-pointer go-pt');
        printToConsole('<br />Deleted all links from root point : <br/><br/>' + rootPointID);
    }
    else{
        printToConsole('<br />Cannot undo. You have not made any links bruh!');
    }
}
/*---------------------------------------------------------------------*/