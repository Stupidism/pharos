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
    this.statheadtime=0;
    this.area=0;
    this.stat=t_stat.loc;
    curFrame=null;
	newFrame=null;
	
    this.colorMap=[];//size w*h
    console.info(line);
    console.info(row);
    this.lattice={
        frame:null,
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
        getLights:function(){
            var tem_blue_stat = 0;
            for (var i=this.led[this.switch].top;i<=this.led[this.switch].bottom;++i){
                for (var j=this.led[this.switch].left;j<=this.led[this.switch].right;++j){
                    if (this.frame.data[((i*this.frame.width+j)<<2)+color.b] >= 200){
                        tem_blue_stat = 1;   
                    }
                }
            }
                console.info(tem_blue_stat);
            var lights=[];
            if (tem_blue_stat != this.led[this.switch].light){
               // console.info(this.statheadtime);
                this.led[this.switch].light = tem_blue_stat;
                for (var k = 1;k < 16; ++k){
                    var tem_sum = 0;
                    for (var i=this.led[k].top;i<=this.led[k].bottom;++i){
                        for (var j=this.led[k].left;j<=this.led[k].right;++j){
            //                if (this.frame.data[((i*this.frame.width+j)<<2)+color.r] > 140){
            //                    tem_sum += 1;   
            //                }
                            if (this.frame.data[((i*this.frame.width+j)<<2)+color.r] > 170){
                                tem_sum += 1;   
                            }
                            if (this.frame.data[((i*this.frame.width+j)<<2)+color.r] > 200){
                                tem_sum += 1;   
                            }
                            if (this.frame.data[((i*this.frame.width+j)<<2)+color.r] > 230){
                                tem_sum += 1;   
                            }
                        }
                    }
                    lights.push(tem_sum);
                }
            }
            return lights;
        }
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
    //this.stat = t_stat.loc;
    
	switch(this.stat){
    case t_stat.nothing:{
        var newFrame=this.newFrame;
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
    }
    case t_stat.loc:{
        var newFrame=this.newFrame;
        var idx=0;
        var sz=newFrame.width*newFrame.height;
        var tem_widthlen = newFrame.width << 2;
       //     console.info(newFrame.width);
       //     console.info(newFrame.height);
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
            var tem_wid_gap = Math.floor(Math.abs(tem_y[tem_keyled_id[(tem_blue_id+1)%4]] -
                               tem_y[tem_keyled_id[tem_blue_id]])/6);
            var tem_height_gap = Math.floor(Math.abs(tem_x[tem_keyled_id[(tem_blue_id+3)%4]] -
                                  tem_x[tem_keyled_id[tem_blue_id]])/6);
            this.area = tem_wid_gap * tem_height_gap * 4;
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
            this.statheadtime = 0;
        }
            
        //console.info(tem_led_num);
//        console.info(tem_led);
        break;
    }
    case t_stat.head:{
        this.lattice.frame=this.newFrame;
        var lights=this.lattice.getLights();
        if(lights.length!=0){
            for (var k = 1;k < 16; ++k){
                var tem_sum = lights[k-1];
                for (var i=(tem_sum + this.lattice.led[k].light)>>1;i<=3*this.area;++i){
                    this.lattice.led[k].light2digit[i] = this.statheadtime;
                }
                this.lattice.led[k].light = tem_sum;
            }
            this.statheadtime += 1;
            if (this.statheadtime >= 8){
                this.stat = t_stat.trans;

                console.info("start trans" + this.area);
            }
        }
        break;
    }
    case t_stat.trans:{
        var data=[];
        var tem_blue_stat = 0;
        for (var i=this.lattice.led[0].top;i<=this.lattice.led[0].bottom;++i){
            for (var j=this.lattice.led[0].left;j<=this.lattice.led[0].right;++j){
                if (newFrame.data[((i*newFrame.width+j)<<2)+color.b] >= 200){
                    tem_blue_stat = 1;   
                }
            }
        }
            //console.info(tem_blue_stat);
        if (tem_blue_stat != this.lattice.switch){
            this.lattice.switch = tem_blue_stat;
            for (var k = 1;k < 16; ++k){
            var tem_sum = 0;
            for (var i=this.lattice.led[k].top;i<=this.lattice.led[k].bottom;++i){
            for (var j=this.lattice.led[k].left;j<=this.lattice.led[k].right;++j){
//                if (newFrame.data[((i*newFrame.width+j)<<2)+color.r] > 140){
//                    tem_sum += 1;   
//                }
                if (newFrame.data[((i*newFrame.width+j)<<2)+color.r] > 170){
                    tem_sum += 1;   
                }
                if (newFrame.data[((i*newFrame.width+j)<<2)+color.r] > 200){
                    tem_sum += 1;   
                }
                if (newFrame.data[((i*newFrame.width+j)<<2)+color.r] > 230){
                    tem_sum += 1;   
                }
            }
        }
            
                console.info(tem_sum);
                data[k-1] = this.lattice.led[k].light2digit[tem_sum];
                //console.info(data[k]);
        }
        
            console.info('run pushback');
           console.info(data); this.decoder.pushback(data,3);
        }
        break;
    }
    }
}
