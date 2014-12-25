var color={
    r:0,g:1,b:2,a:3,length:4
}
var status={
    nothing:0,loc:1,head:2,trans:3
}
var Pharos = function(w,h,line,row){
	this.width=w;
	this.height=h;
    this.threshold=255;
    this.stat=status.nothing;
    curFrame=null;
	newFrame=null;
	
    this.colorMap=[];//size w*h
    
    this.lattice={
        line:line,
        row:row,
        switch:0,
        locateN:3,
        locate:[3,12,15],
        led=[{
            left:0,
            right:w,
            top:0,
            bottom:h,
            light:0,//size line*row
            light2digit:[]//size [width*height]
        }],
    }
    this.decoder={
        digitBitN:3,
        mesBitN:6,
        code:[],
        idx:0,
        book:[],
        message:null,
    }
}


Pharos.prototype.update=function(){
    var newFrame=this.newFrame;
	switch(this.stat){
    case status.nothing:{
        var idx=0;
        var sz=newFrame.width*newFrame.height;
        for(var i=0;i<sz;i++){
            if(newFrame.data[idx+color.r]>=this.threshold){
                newFrame.data[idx+color.r]=0;
                newFrame.data[idx+color.g]=255;
                newFrame.data[idx+color.b]=0;
            }
            idx+=color.length;
        };
        break;
    }
    case status.loc:{
        break;
    }
    case status.head:{
        break;
    }
    case status.trans:{
        var data=[];
        this.pushback(data);
        break;
    }
};

Pharos.prototype.pushback=function(data){
    this.decoder.push(data);
    console.info()
}