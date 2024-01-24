
document.addEventListener('DOMContentLoaded', function() {
  var hideErrorButtons = document.querySelectorAll('.hide-button');
  var rsvpStatus = document.querySelectorAll('.yes-span');
  const lis = document.querySelectorAll('.user-stories li');

  hideErrorButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var message = button.parentNode; 
      message.classList.add('hide');
    });
  });


  rsvpStatus.forEach(function(status) {
    if (status.textContent.trim() === 'Yes') {
      status.classList.add('yes-Status-Color');
    }else if(status.textContent.trim() === 'No'){
      status.classList.add('no-Status-Color');
    }else {
      status.classList.add('maybe-Status-Color');
    }
  });

  lis.forEach(li => {
    if (li.offsetHeight > 1) {
      li.classList.add('multiline-content');
    }
  });

});

 

