//check of specific li o clicking

$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

$(".fa-plus").click(function(){
	$(input).fadeToggle();
});

//deleting li when clicked on span
$("ul").on("click", "span", function(event){
	$(this).parent().fadeOut(function(){
		$(this).remove();
	});
	event.stopPropagation();
});
$("input").css("box-sizing","border-box");
$("input[type='text'").keypress(function(event){
	if(event.which === 13){
		//grabbing Input
		var TodoText = $(this).val();
		$(this).val("");
		$("ul").append("<li><span><i class='fa fa-trash'></i></span> " + TodoText + " </li>");
		}
});