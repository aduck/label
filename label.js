window.label=(function(){

	function _offset(obj,dir){
		if(obj.offsetParent==document.body){
			return parseInt(obj['offset'+dir]);
		}else{
			return parseInt(obj['offset'+dir])+parseInt(_offset(obj.offsetParent,dir));
		}
	}

	function _position(o,target,dir,offset){
		var o_w=parseInt(o.offsetWidth),
			o_h=parseInt(o.offsetHeight),
			t_w=parseInt(target.offsetWidth),
			t_h=parseInt(target.offsetHeight),
			t_ol=_offset(target,"Left"),
			t_ot=_offset(target,"Top");
		o.style.position='absolute';
		switch(dir){
			case "top":
				o.style.left=t_ol+(t_w-o_w)/2+"px";
				o.style.top=t_ot-o_h-offset+"px";
				break;
			case "bottom":
				o.style.left=t_ol+(t_w-o_w)/2+"px";
				o.style.top=t_ot+t_h+offset+"px";
				break;
			case "left":
				o.style.left=t_ol-o_w-offset+"px";
				o.style.top=t_ot+(t_h-o_h)/2+"px";
				break;
			case "right":
				o.style.left=t_ol+t_w+offset+"px";
				o.style.top=t_ot+(t_h-o_h)/2+"px";
				break;
		}
	}

	var _layers=[];

	return{
		init:function(opts){
			var opts=opts || {},
				labelHook=opts.labelHook || "data-label-detail",
				layerClass=opts.layerClass || 'm-label-layer',
				self=this;
			$("["+labelHook+"]").each(function(i){
				var content=$(this).data('label-detail') || '',
					dir=$(this).data('label-dir') || 'bottom',
					fire=$(this).data('label-fire') || 'hover',
					offset=$(this).data('label-offset') ? parseInt($(this).data('label-offset')) : 0,
					effect=$(this).data('label-effect') ? $(this).data('label-effect') : 'fade',
					_this=this;
				$(this).addClass('default');
				// 创建弹层
				var $layer=self.create(content,layerClass);
				_layers.push($layer);

				$layer.css({
					"display":"block",
					"opacity":"0"
				});
				// 定位
				_position($layer.get(0),_this,dir,offset);

				$layer.css("display","none");
				// 状态管理
				_this.state=0;

				// 事件绑定
				if(fire=='hover'){
					$(this).hover(function(){
						$(_this).addClass('active');
						self.open(i,effect);
						_this.state=1;
					},function(){
						$(_this).removeClass('active');
						self.close(i,effect);
						_this.state=0;
					});
				}else if(fire=='click'){
					$(this).click(function(){
						if(_this.state==0){
							$(_this).addClass('active');
							self.open(i,effect);
							_this.state=1;
						}else{
							$(_this).removeClass('active');
							self.close(i,effect);
							_this.state=0;
						}
					});
				}	
			});
		},
		create:function(content,layerClass){
			return $layer=$("<div class='"+layerClass+"'>"+content+"</div>").appendTo($('body'));
		},
		unset:function(index){
			_layers[index].remove();
		},
		open:function(index,effect){
			_layers[index].addClass('ani-'+effect).show().css("opacity","1");
		},
		close:function(index,effect){
			_layers[index].removeClass('ani-'+effect).hide().css("opacity","0");
		}
	}
})();