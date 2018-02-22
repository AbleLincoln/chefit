import { height } from "jquery";

// dropdown
const dropdownButtons = document.querySelectorAll('.dropdown');
dropdownButtons.forEach(button => {
  button.addEventListener('click', dropdown);
})

function dropdown(e) {
  if(e.target !== this && e.target !== this.querySelector('.small') && e.target !== this.querySelector('.arrow')) return;
  
  var animateTime = 500;

  const menuItems = $(this).find('.menu-items');
  
  if(menuItems.height() === 0) {
    autoHeightAnimate(menuItems, animateTime);
    $(this).find('.arrow').html('&#9650;');
  } else {
    menuItems.animate({ height: '0' }, animateTime);
    $(this).find('.arrow').html('&#9660;');
  }
}

function autoHeightAnimate(element, time){
  var curHeight = element.height(), // Get Default Height
      autoHeight = element.css({height: 'auto'}).height(); // Get Auto Height
  element.height(curHeight); // Reset to Default Height
  element.animate({ height: autoHeight }, time); // Animate to Auto Height;
}