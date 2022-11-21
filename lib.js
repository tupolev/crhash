$(document).ready(function () {
  let salt = undefined
  let hashid = undefined
  let textBox = $("#idToHashDehash")
  let hashButton = $("#hashButton")
  let dehashButton = $("#dehashButton")
  let errorMessage = $("#errorMessage")
  let optionsLink = $('#optionsLink')

  chrome.storage.sync.get({salt: "salt"}, function(items) {
    salt = items.salt;
    hashid = new Hashids(salt, minLength = 10)
  });

  cleanErrors()
  textBox.focus()

  function hash(inputString) {
    if (hashid == undefined) {
      hashid = new Hashids(salt, minLength = 10)
    }

    return hashid.encode(inputString)
  }

  function dehash(inputString) {
    if (hashid == undefined) {
      hashid = new Hashids(salt, minLength = 10)
    }

    return hashid.decode(inputString)
  }

  function isHashable(inputString) {
    return !isNaN(inputString)
  }

  function isDehashable(inputString) {
    if (!isNaN(inputString)) {
      return false
    }
    try {
      return (dehash(inputString) != "")
    } catch (err) {
      return false
    }
  }

  function cleanErrors() {
    errorMessage.hide()
    errorMessage.html("")
  }

  function showError(message) {
    errorMessage.html(message)
    errorMessage.show()
  }

  hashButton.click(function () {
    cleanErrors()
    let input = textBox.val().trim()

    if (!input.length) {
      return
    }

    if (input.indexOf(" ") > -1) {
      showError("Value contains spaces")
      return
    }

    if (isNaN(input)) {
      showError("Value is not a number")
      return
    }

    try {
      textBox.val(hash(input))
    } catch (err) {
      showError("Value is invalid")
    }
  })

  dehashButton.click(function () {
    cleanErrors()
    let input = textBox.val().trim()

    if (!input.length) {
      return
    }

    if (input.indexOf(" ") > -1) {
      showError("Value contains spaces")
      return
    }

    if (!isNaN(input)) {
      showError("Value is not hashed")
      return
    }

    try {
      textBox.val(dehash(input))
    } catch (err) {
      showError("Value is not hashed")
    }
  })

  textBox.keypress(function (e) {
    if (e.which == 13) {
      if (!textBox.val().trim().length) {
        return
      }
      if (isHashable(textBox.val())) {
        hashButton.click()
        return
      }
      if (isDehashable(textBox.val())) {
        dehashButton.click()
        return
      }
      //else
      showError("Value is neither a number nor a hash")
    }
  })

  optionsLink.click(function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
})
