var book=[".", ",", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var color={
    r:0,g:1,b:2,a:3,length:4
};
var status={
    nothing:0,loc:1,head:2,trans:3
};

var Pharos = function(w,h,line,row){
	this.width=w;
	this.height=h;
    this.threshold=255;
    this.stat=status.nothing;
    curFrame=null;
	newFrame=null;
	
    this.colorMap=[];//size w*h
    console.info(line);
    console.info(row);
    this.lattice={
        line:line,
        row:row,
        switch:0,
        locateN:3,
        locate:[3,12,15],
        ledN:line*row,
        led:[{
            left:0,
            right:w,
            top:0,
            bottom:h,
            light:0,//size line*row
            light2digit:[]//size [width*height]
        }],
    };
    this.decoder={
        charBitN:6,
        code:[],
        digitIdx:0,
        length:0,
        message:[],
        pushback:function(data,digitBitN){
            var digitMask=~(-1<<digitBitN);
            for(var i=0;i<data.length;i++){
                this.code.push(data[i]&digitMask);
            }
            this.length+=data.length*digitBitN;
            while(this.length>=this.charBitN){
                var digit=(this.code[this.digitIdx]<<digitBitN)+this.code[this.digitIdx+1];
                this.message.push(book[digit]);
                this.digitIdx+=2;    
                this.length-=this.charBitN;
            }
        }
    };
};

    
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
        }
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
        this.decoder.pushback(data,3);
        break;
    }
    }
}
