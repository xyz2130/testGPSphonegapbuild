// function init(){
var form,name,pass,email,form2;


$(document).ready(function(){
	console.log('init');
document.addEventListener("deviceready",deviceReady,false);
// $("#signupForm").submit(signup);
$("#submitSignup",form).removeAttr("disabled");
$("#submitSignin",form).removeAttr("disabled");
resetFields();

});

function resetFields(){
	$("#name").val('');
$("#password").val("");
$("#password-2").val("");
$("#email").val("");

}
// $(document).on('submit','#signupForm',function);
// delete init;
// }
// $("#submit_pass").click(function(){
$(document).bind('pageinit',function(){
alert('init');
$.ajaxSetup ({
    cache: false
  });
$("#aaa").bind("click",function(event,ui){
   alert('click');
	$.ajax({
	url: "http://calm-woodland-1491.herokuapp.com/signup",
	type: 'GET',

	}).success(function(res,status){
	  alert(JSON.stringify(res));
	  alert(JSON.stringify(status));

	}).fail(function(jqXHR,textStatus,errorThrown){
	  alert(jqXHR.responseText);
	  // $("#result").html("<p><b>"+jqXHR.responseText+"</b></p>")
     });
});  

$("#submitSignup").bind("click",function (event,ui){
	event.preventDefault();
	alert('submit signup');
	
	signup();
});

$("#submitSignin").bind("click",function(event,ui){
	event.preventDefault();
	alert('logging in');
	signin();
});

$("#signout").bind("click",function(event,ui){
	event.preventDefault();
	alert('logging out');
	signout();
});
});
   
var appUrl = "http://calm-woodland-1491.herokuapp.com";
function signup(){
	console.log('click');
	//disable button
	console.log('f n p e '+form+' '+name+' '+pass+' '+email);
	$("submitSignup",form).attr("disabled","disabled");
	
	 form = $("#signupForm");
	name = $("#name").val();
	 pass = $("#password").val();
	email = $("#email").val();
	if($("#email").val() == ""){
		alert("Please input E-mail");
		$("#email").focus();
		$("submitSignup",form).removeAttr("disabled");
		// return false;
	}
	else if($("#password").val() == ""){
		alert("Please input password");
		$("#password").focus();
		$("submitSignup",form).removeAttr("disabled");
		// return false;
	}else if($("#password-2").val() == ""){
		alert("Please input confirm password");
		$("#password-2").focus();
		$("submitSignup",form).removeAttr("disabled");
		// return false;
	}else if($("#password").val() != $("#password-2").val() ){
		alert("Password not match");
		$("#password-2").focus();
		$("#password-2").val("");
		$("submitSignup",form).removeAttr("disabled");
		// return false;
	}else{
		var dat = $('#signupForm').serializeArray();
		alert('should be posting');
		// alert('form data '+$('#signupForm').serializeArray());
		// alert('form data '+JSON.stringify(dat));
		
		$.ajax({
			url: appUrl + "/signup",
			type: 'POST',
			data: $('#signupForm').serializeArray(),
			
			beforeSend: function(){
				// show ajax spinner
				// $.mobile.showPageLoadingMsg(true);
				$.mobile.loading("show");
			},
			complete: function(){
				// hide ajax spinner
				// $.mobile.hidePageLoadingMsg();
				$.mobile.loading("hide");
			},
			success: function(msg){
				alert(JSON.stringify(msg));
				var resp = JSON.stringify(msg);
				if(resp == 'redirectSignup'){
					resetFields();
					$.mobile.changePage('signup2.html');
				}
				else{
					resp = JSON.parse(resp);
					if(resp.hasOwnProperty('name')){
						alert(resp['name']);
						
						window.localStorage.setItem("username",resp['name']);
					}
					resetFields();
					$.mobile.changePage('profile.html');
				}
				
			},
			error: function(){
				alert('error at sign up');
				resetFields();
			}
		});
	
	}
             	 
}

function signin(){
	console.log('click');
	//disable button
	console.log('f n p e '+form+' '+name+' '+pass+' '+email);
	$("#submitSignin",form).attr("disabled","disabled");
	
	 form2 = $("#signinForm");
	name = $("#name").val();
	 pass = $("#password").val();
	email = $("#email").val();
	if($("#email").val() == ""){
		alert("Please input E-mail");
		$("#email").focus();
		$("#submitSignin",form).removeAttr("disabled");
		// return false;
	}
	else if($("#password").val() == ""){
		alert("Please input password");
		$("#password").focus();
		$("#submitSignin",form).removeAttr("disabled");
		// return false;
	
		// return false;
	}else{
		var dat = $('#signinForm').serializeArray();
		alert('should be posting');
		// alert('form data '+$('#signinForm').serializeArray());
		// alert('form data '+JSON.stringify(dat));
		
		$.ajax({
			url: appUrl + "/login",
			type: 'POST',
			data: $('#signinForm').serializeArray(),
			
			beforeSend: function(){
				// show ajax spinner
				// $.mobile.showPageLoadingMsg(true);
				$.mobile.loading("show");
			},
			complete: function(){
				// hide ajax spinner
				// $.mobile.hidePageLoadingMsg();
				$.mobile.loading("hide");
				resetFields();
				$("#submitSignin",form).removeAttr("disabled");
			},
			success: function(msg){
				alert(JSON.stringify(msg));
				var resp = JSON.stringify(msg);
				if(resp == 'redirectSignin'){
					
					$.mobile.changePage('home.html');
				}
				else{
					resp = JSON.parse(resp);
					if(resp.hasOwnProperty('name')){
						alert(resp['name']);
					
						window.localStorage.setItem("username",resp['name']);
					}
					$.mobile.changePage('profile.html');
				}
				
			},
			error: function(){
				alert('error at sign in');
			}
		});
	
	}
             	 
}

function signout(){
   alert('click');
	$.ajax({
	url: appUrl + "/logout",
	type: 'GET',

	}).success(function(res,status){
	 window.localStorage.setItem("username",null);
	 resetFields();
	 $.mobile.changePage('home.html');

	}).fail(function(jqXHR,textStatus,errorThrown){
	  alert('error logging out');
	  // $("#result").html("<p><b>"+jqXHR.responseText+"</b></p>")
     });
}

function deviceReady(){
	
	console.log('deviceready');
}