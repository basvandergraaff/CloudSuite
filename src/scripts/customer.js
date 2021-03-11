(() => {
    console.log('hello!');

    var menuopen = false;

    window.onload = function() {

      var menuButton = document.getElementById("menu");
      menuButton.onclick = menuOpen; 
     }
    

    function menuOpen() {
      console.log('aap');

      if (!menuopen) {
        document.getElementById("muted").style.visibility = 'visible';
        document.getElementById("sub-menu").style.visibility = 'visible';
      }
      else {
        document.getElementById("muted").style.visibility = 'hidden';
        document.getElementById("sub-menu").style.visibility = 'hidden';
      }
      menuopen = !menuopen;
    }

})()