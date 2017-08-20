
function createDesigner(buttonBar) {
    var Designer = {};
    Designer.button = function (txt) {
      var btn = document.createElement('button');
      btn.className = 'NamaEditor NEMenuButton';
      btn.setAttribute('type', 'button');
      btn.innerHTML = txt;
  
      buttonBar.appendChild(btn);
      var r = {
        click: function (func) {
          btn.addEventListener('click', func);
          return r;
        },
        hoverMessage: function (msg) {
          btn.setAttribute('title', msg);
          return r;
        },
        right: function () {
          btn.className += ' NEright';
          return r;
        },
        active: function () {
          btn.setAttribute('active', 'yes');
          return r;
        },
        deactive: function () {
          btn.removeAttribute('active')
          return r;
        },
        remove: function () {
          btn.parentNode.removeChild(btn);
          return r;
        },
        use: function () {
          buttonBar.appendChild(btn);
          return r;
        }
      };
      return r;
    };
    Designer.dropdown = function (txt) {
      var dropdownButton = document.createElement("div");
      var dropdown = document.createElement("div");
      var dropdownList = document.createElement("ul");
      dropdownButton.innerHTML = '<div class="NEDropdownButtonLabel NamaEditor">' + txt + '</div>';
      dropdownButton.className = 'NamaEditor NEMenuButton';
      dropdown.className = 'NamaEditor NEDropDown';
      dropdown.appendChild(dropdownList);
      dropdownButton.appendChild(dropdown);
      buttonBar.appendChild(dropdownButton);
  
      var dbHover = false,
        dbBHover = false;
      dropdown.style.display = 'none';
      dropdownButton.addEventListener('click', function () {
        var dropdowns = buttonBar.querySelectorAll(".NamaEditor.NEMenuButton > .NamaEditor.NEDropDown");
        for (var i = 0; i < dropdowns.length; i++) {
          if (dropdowns[i] != dropdown) {
            dropdowns[i].style.display = 'none';
            dropdowns[i].parentNode.removeAttribute("hover");
          } else if (dropdown.style.display.trim() == 'none') {
            dropdown.style.display = '';
            dropdownButton.setAttribute("hover", "yes");
          } else {
            dropdown.style.display = 'none';
            dropdownButton.removeAttribute("hover");
          }
        }
      });
  
      var hr = {
        button: function (iconTxt, txt) {
          var liTag = document.createElement('li');
          liTag.innerHTML = '<span class="NEHeadIcon">' + iconTxt + '</span><span class="NEDescText">' + txt + '</span>'
          liTag.addEventListener('click', function () {
            dropdown.style.display = '';
          })
          dropdownList.appendChild(liTag);
          var r = {
            icon: function (iconTxt) {
              liTag.querySelector('.NEHeadIcon').innerHTML = iconTxt;
              return r;
            },
            text: function (txt) {
              liTag.querySElector('.NEDescText').innerHTML = txt;
              return r;
            },
            hoverMessage: function (msg) {
              liTag.setAttribute('title', msg);
              return r;
            },
            click: function (handler) {
              liTag.addEventListener('click', handler);
              return r;
            },
            right: function () {
              liTag.className += 'NEright';
              return r;
            },
            remove: function () {
              dropdownList.removeChild(liTag);
              return r;
            },
            insert: function () {
              dropdownList.appendChild(liTag);
              return r;
            },
            backwalk: function () {
              dropdownList.removeChild(ilTag);
              dropdownList.appendChild(ilTag);
              return r;
            }
          };
          return r;
        },
        right: function () {
          liTag.className += 'NEright';
          return hr;
        },
        hoverMessage: function (txt) {
          dropdownButton.setAttribute('title', txt);
          return hr;
        },
        clear: function () {
          dropdownList.innerHTML = '';
          return hr;
        }
      };
      return hr;
    };
    return Designer;
  }

  module.exports = createDesigner;