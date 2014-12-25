var book=[".", ",", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var color={
    r:0,g:1,b:2,a:3,length:4
};

var t_stat={
    nothing:0,loc:1,head:2,trans:3
};

var Pharos = function(w,h,line,row){
	this.width=w;
	this.height=h;
    this.threshold=255;
    this.stat=t_stat.loc;
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
        led:[
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
            {left:0,right:w,top:0,bottom:h,light:0,light2digit:[]},
        ],
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
    //this.stat = t_stat.loc;
    
	switch(this.stat){
    case t_stat.nothing:
        var idx=0;
        var sz=newFrame.width*newFrame.height;
        for(var i=0;i<sz;i++){
            if(newFrame.data[idx+color.b]>=this.threshold){
                newFrame.data[idx+color.r]=0;
                newFrame.data[idx+color.g]=255;
                newFrame.data[idx+color.b]=0;
            }
            idx+=color.length;
        }
        break;
    
    case t_stat.loc:
        var idx=0;
        var sz=newFrame.width*newFrame.height;
        var tem_widthlen = newFrame.width << 2;
            console.info(newFrame.width);
            console.info(newFrame.height);
        var tem_led=[];
        var tem_led_num=1;
        for(var i=0;i<sz;i++){
            if(newFrame.data[idx+color.b]>=this.threshold){
                if(newFrame.data[idx-4+color.b]>=this.threshold &&
                   newFrame.data[idx-tem_widthlen+color.b]>=this.threshold &&
                   newFrame.data[idx-tem_widthlen-4+color.b]>=this.threshold){
                     var tem_flag = true;
                    for (var j=0;j<tem_led_num;++j){
                        var tem_diff = i - tem_led[j];
                        if (tem_diff % newFrame.width < 8 && 
                            Math.abs(tem_diff / newFrame.width) < 8){
                            tem_flag = false;
                        }
                    }
                    if (tem_flag == true){
                        tem_led[0] = i;
                    }
                }
            }
            if(newFrame.data[idx+color.r]>=this.threshold){
                if(newFrame.data[idx-4+color.r]>=this.threshold &&
                   newFrame.data[idx-tem_widthlen+color.r]>=this.threshold &&
                   newFrame.data[idx-tem_widthlen-4+color.r]>=this.threshold){
                    var tem_flag = true;
                    for (var j=0;j<tem_led_num;++j){
                        var tem_diff = i - tem_led[j];
                        var tem_diff_x = tem_diff % newFrame.width;
                        var tem_diff_y = tem_diff / newFrame.width;
                        if (tem_diff_y < 0) { tem_diff_y = -tem_diff_y;}
                        if (tem_diff_x > newFrame.width>>1) 
                            {tem_diff_x = newFrame.width - tem_diff_x;}
                        if ( (tem_diff_x < 8) && (tem_diff_y < 8)){
                            tem_flag = false;
                        }
                    }
                    if (tem_flag == true){
                        tem_led[tem_led_num] = i;
                        tem_led_num++;
                    }    
                }
            }
            idx+=color.length;
        }
            
        if (tem_led_num == 4){
            var tem_x=[];
            var tem_y=[];
            var tem_sumx = 0;
            var tem_sumy = 0;
            var tem_keyled_id = [];
            for (var i=0; i<4; ++i){
                tem_x[i] = Math.floor(tem_led[i] / newFrame.width) ;
                tem_y[i] = tem_led[i] % newFrame.width;
                tem_sumx += tem_x[i];
                tem_sumy += tem_y[i];
            }
            tem_sumx = tem_sumx >> 2;
            tem_sumy = tem_sumy >> 2;
            tem_blue_id = 0;
            for (var i=0; i<4; ++i){
                var tem_tem_x = tem_x[i] - tem_sumx;
                var tem_tem_y = tem_y[i] - tem_sumy;
                if (tem_tem_x < 0 && tem_tem_y < 0) {
                    tem_keyled_id[0] = i;
                    if (i==0) {tem_blue_id = 0;}
                }
                if (tem_tem_x < 0 && tem_tem_y > 0) {
                    tem_keyled_id[1] = i;
                    if (i==0) {tem_blue_id = 1;}
                }
                if (tem_tem_x > 0 && tem_tem_y > 0) { 
                    tem_keyled_id[2] = i;
                    if (i==0) {tem_blue_id = 2;}
                }
                if (tem_tem_x > 0 && tem_tem_y < 0) {
                    tem_keyled_id[3] = i;
                    if (i==0) {tem_blue_id = 3;}
                }
            }            
            var tem_wid_gap = (tem_y[tem_keyled_id[(tem_blue_id+1)%4]] -
                               tem_y[tem_keyled_id[tem_blue_id]])>>3;
            var tem_height_gap = (tem_x[tem_keyled_id[(tem_blue_id+3)%4]] -
                                  tem_x[tem_keyled_id[tem_blue_id]])>>3;
  
            var tem_keyled_x = [];
            var tem_keyled_y = [];
            for (var i=0;i<4;++i)
            {
                tem_keyled_x[i] = Math.floor((tem_x[tem_keyled_id[tem_blue_id]] * (3-i) + 
                                  tem_x[tem_keyled_id[(tem_blue_id+3)%4]] * i)/3); 
                tem_keyled_y[i] = Math.floor((tem_y[tem_keyled_id[tem_blue_id]] * (3-i) + 
                                  tem_y[tem_keyled_id[(tem_blue_id+1)%4]] * i)/3);  
            }
            var tem_nowled = 0;
            for (var i=0;i<4;++i)
            {
                for (var j=0;j<4;++j)
                {
                    this.lattice.led[tem_nowled].top = tem_keyled_x[i] - tem_height_gap;
                    this.lattice.led[tem_nowled].bottom = tem_keyled_x[i] + tem_height_gap;
                    this.lattice.led[tem_nowled].left = tem_keyled_y[j] - tem_wid_gap;
                    this.lattice.led[tem_nowled].right = tem_keyled_y[j] + tem_wid_gap;
                    tem_nowled++;
                }
            }
            this.lattice.switch = 1;
            this.stat = t_stat.head;
            
        }
            
        console.info(tem_led_num);
//        console.info(tem_led);
        break;
    
    case t_stat.head:{
        break;
    }
    case t_stat.trans:{
        var data=[];
        this.decoder.pushback(data,3);
        break;
    }
    }
}
