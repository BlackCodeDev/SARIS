var getInfo = new OpenLayers.Control.WMSGetFeatureInfo({ drillDown:true , queryVisible: true , maxFeatures:100 });
  //then i declare a variable that help me to handle more than 1 request.....
 getInfo.responses  = [];

 getInfo.handleResponse=function(xy, request) {        
    var doc = request.responseXML;
    if(!doc || !doc.documentElement) {   doc = request.responseText; }
    var features = this.format.read(doc);
    if (this.drillDown === false) {
        this.triggerGetFeatureInfo(request, xy, features);
    } else {
        this._requestCount++;
        this._features = (this._features || []).concat(features);
        if( this._numRequests > 1){
                          //if the num of RQ, (I mean more than 1 resource ), i put the Request in array, this is for maybe in a future i could be need other properties or methods from RQ, i dont know.
            this.responses.push(request);}
        else{
            this.responses = request;}
        if (this._requestCount === this._numRequests) {
            //here i change the code....
            //this.triggerGetFeatureInfo(request, xy, this._features.concat());
            this.triggerGetFeatureInfo(this.responses, xy, this._features.concat());
            delete this._features;
            delete this._requestCount;
            delete this._numRequests;
            // I Adding this when the all info is done 4 reboot
            this.responses=[];
        }
    }
}

 getInfo.triggerGetFeatureInfo= function( request , xy , features) {
//finally i added this code for get all request.responseText's
if(request instanceof Array ){
    text_rq = '';
    for(i in request ){
        text_rq += request[i].responseText;

        }
    }
else{
    text_rq = request.responseText;

    }

    this.events.triggerEvent("getfeatureinfo", {
       //text: request.responseText,
        text : text_rq,
        features: features,
        request: request,
        xy: xy
    });
     
    //console.log(text_rq);
      this.addPopup(map, text_rq, xy);
    // Reset the cursor.
    OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
    
 }
 
 getInfo.addPopup = function(map, text, xy) {
    if(map.popups.length > 0) {
        map.removePopup(map.popups[0]);
    }
    var popup = new OpenLayers.Popup.FramedCloud(
        "anything",
        map.getLonLatFromPixel(xy),
        null,
        text,
        null,
        true
    );
    map.addPopup(popup);
}