$(document).ready(function(){
			$("a.add").attr("href",function(){this.href+="?inline"})
							  .colorbox({width:"50%", onComplete:function(){
				
				$("input[list=instance]").focus().click(function(){
					this.value="";
				});
			}});
			
		});
