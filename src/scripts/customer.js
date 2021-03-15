(() => {
    console.log('hello!');

    var menuopen = false;

    window.onload = function() {

      var menuButton = document.getElementById("menu");
      menuButton.onclick = toggleMenu; 

      var menuButton = document.getElementById("greyed");
      menuButton.onclick = closeMenu; 

      window.addEventListener('resize', function () { 
        //"use strict";
        //window.location.reload(); 
        //console.log('resize');
        closeMenu();
      });
    }
  
    function toggleMenu() {
      //console.log('click toggleMenu');
      if (!menuopen) {
        document.getElementById("greyed").style.visibility = 'visible';
        document.getElementById("submenu").style.visibility = 'visible';
      }
      else {
        document.getElementById("greyed").style.visibility = 'hidden';
        document.getElementById("submenu").style.visibility = 'hidden';
      }
      menuopen = !menuopen;
    }
    function closeMenu() {
      //console.log('closeMenu');
      document.getElementById("greyed").style.visibility = 'hidden';
      document.getElementById("submenu").style.visibility = 'hidden';
      menuopen = false;
    }

})()