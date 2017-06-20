var rsvpForm = document.getElementById('rsvp-form');
var rsvpMessage = document.getElementById('rsvp-message');
var authForm = document.getElementById('auth-form');
rsvpForm.addEventListener('submit', sendRsvp);
authForm.addEventListener('submit', accessRsvp);

firebase.auth().signOut().then(function() {
  authForm.classList.remove('hidden');
}).catch(function(error) {
  rsvpMessage.classList.remove('hidden');
  rsvpMessage.innerText = "We seem to be experiencing some technical difficulty. Please try again later";
});

function accessRsvp(event) {
  event.preventDefault();
  var data = serializeArray(authForm);
  var password = data[0].value;
  var email = 'weddingguest@amandacody.us';
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    authForm.classList.add('hidden');
    rsvpForm.classList.remove('hidden');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    rsvpMessage.classList.remove('hidden');
    rsvpMessage.innerText = "You have entered an incorrect password. Please try again";
    setTimeout(function() {
      rsvpMessage.classList.add('hidden');
    }, 3000);
  });
}

function sendRsvp(event) {
  event.preventDefault();
  var data = serializeArray(rsvpForm);
  var name = data[0].value;

  var payload = {
    name: name,
    rsvp: data[1].value,
    partysize: data[2].value,
    food: data[3].value,
    comment: data[4].value
  }

  firebase.database().ref('invitee/' + name).set(payload).then(function() {
    rsvpForm.classList.add('hidden');
    rsvpMessage.innerText = "Thank you for RSVP'ing!";
    rsvpMessage.classList.remove('hidden');
  }).catch(function(error) {
    rsvpMessage.innerText = "Something went wrong here, please try again.";
    rsvpMessage.classList.remove('hidden');
  });
}

function serializeArray(form) {
    var field, l, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    l = form.elements[i].options.length;
                    for (j=0; j<l; j++) {
                        if(field.options[j].selected)
                            s[s.length] = { name: field.name, value: field.options[j].value };
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = { name: field.name, value: field.value };
                }
            }
        }
    }
    return s;
}
