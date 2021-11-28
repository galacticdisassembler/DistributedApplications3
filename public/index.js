
var appState = {
  types: ['register', 'login', 'allposts', 'myposts'],
  current: 'login',
  authState: {
    isAuth: false,
    token: '',
    onLogin: function(e){
      e.preventDefault()
      var email = $('#loginformemail').val()
      var password = $('#loginformpassword').val()

      var response = $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url : '/api/auth/login',
          dataType : "json",
          data : JSON.stringify({email: email, password: password}),
          async: false
      }).responseText;

      var data = JSON.parse(response)

      if(data.id && data.token){
        this.token=data.token
        this.isAuth = true
        alert('Login with success')
      }else{
        alert('Error on performing login action')

      }

    }
  },
  start: function(){
    this.rerender()
  },
  rerender: function(){
    for(type of this.types){
      document.getElementById(type).classList.add("d-none")
    }
    
    document.getElementById(this.current).classList.remove("d-none")
  }


}


$(document).ready(function(){
  appState.start()

  $(document).ajaxComplete(function myErrorHandler(event, xhr, ajaxOptions, thrownError) {
    if(xhr.status === 401){
      window.location.href = '/'
    }
  });

  $('#loginform').submit(appState.authState.onLogin)
})