var rsvpForm = document.getElementById('rsvp-form');
var rsvpMessage = document.getElementById('rsvp-message');
var authForm = document.getElementById('auth-form');
var rsvpRadios = document.getElementsByClassName('rsvp-question');
var yesQuestions = document.getElementsByClassName('rsvp-yes-form')[0];
var errorMsg = document.getElementById('rsvp-error-message');
var authMsg = document.getElementById('auth-form-errors');

rsvpForm.addEventListener('submit', sendRsvp);
authForm.addEventListener('submit', accessRsvp);

var rsvpPrevi = null;
for (var i = 0; i < rsvpRadios.length; i++) {
  rsvpRadios[i].addEventListener('click', function() {
    if (this !== rsvpPrevi) {
      rsvpPrevi = this;
      if (this.value === 'yes') {
        yesQuestions.style.display = 'block';
      } else if (this.value === 'no') {
        yesQuestions.style.display = 'none';
      }
    }
  });
}


firebase.auth().signOut().then(function() {
  authForm.classList.remove('hidden');
}).catch(function(error) {
  rsvpMessage.classList.remove('hidden');
  rsvpMessage.innerText = "We seem to be experiencing some technical difficulty. Please try again later";
});

function accessRsvp(event) {
  event.preventDefault();
  var password = authForm.password.value;
  var email = 'weddingguest@amandacody.us';
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    authForm.classList.add('hidden');
    rsvpForm.classList.remove('hidden');
  }).catch(function(error) {
    rsvpMessage.classList.remove('hidden');
    showError(authMsg, "You have entered an incorrect password. Please try again")
    setTimeout(function() {
      removeErrors(authMsg);
    }, 3000);
  });
}

function showError(wrapper, msg) {
  wrapper.classList.remove('hidden');
  wrapper.innerText = msg;
}

function removeErrors(wrapper) {
  wrapper.classList.add('hidden');
}

function sendRsvp(event) {
  event.preventDefault();
  removeErrors(errorMsg);

  var name = rsvpForm.name.value;
  var rsvp = rsvpForm.rsvp.value;

  if (name === "") {
    showError(errorMsg, "Please enter your name");
    return;
  }

  if (rsvp === "") {
    showError(errorMsg, "Please enter your RSVP response");
    return;
  }

  var comment = rsvpForm.comment.value;
  var payload = {
    name: name,
    rsvp: rsvp,
    comment: comment
  };

  if (rsvp === 'yes') {
    var shuttleValue = rsvpForm.shuttle.value;
    if (shuttleValue === "") {
      showError(errorMsg, "Please answer shuttle question");
      return;
    }
    payload.shuttle = shuttleValue;
    payload.partysize = rsvpForm.partysize.value;
    payload.food = rsvpForm.food.value;
  }

  firebase.database().ref('invitee/' + name).set(payload).then(function() {
    rsvpForm.classList.add('hidden');
    showError(rsvpMessage, "Thank you for RSVP'ing!");
  }).catch(function(error) {
    showError(authMsg, "Something went wrong here, please try again.");
  });
}
