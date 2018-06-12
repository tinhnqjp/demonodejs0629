"use strict";

$(function () {
    // logger
    var log = { system: console };

    $("[id=go_home]").on("click", function () {
        window.location.href = "index.html";
    });
    $("[id=go_menu]").on("click", function () {
        window.location.href = "menu.html";
    });
});

/* HTMLエレメントを処理する */
var dom_util = {
  // HTMLのClassを追加か削除する
  toggleClass: function(elem, c) {
    if (elem.classList.contains(c)) {
    elem.classList.remove(c);
    } else {
    elem.classList.add(c);
    }
  },
  // HTMLのClassを追加する
  setClass: function(elem, c) {
    if (!elem.classList.contains(c)) {
      elem.classList.add(c);
    }
  },
  // HTMLのClassを削除する
  removeClass: function(elem, c) {
    if (elem.classList.contains(c)) {
      elem.classList.remove(c);
    }
  },
  // HTMLのClassがあるかどうかチェックする
  containsClass: function(elem, c) {
    return elem.classList.contains(c);
  },
  // パラメータのエレメントにあるパラメータのselectorのリストを作成
  // elementがNULLであれば全てdocumentを使う。
  make_list: function(selector, element) {
    var _element = element || document;
    return {
      each: function(f, _self) {
        var self = _self || this;
        var list = _element.querySelectorAll(selector);
        for (var i=0; i<list.length; i++) {
          var e = list[i];
          f(e);
        }
      }
    };
  },
  hide_show_element: function(elem, is_show) {
    if (elem) {
      if (is_show) {
        elem.style.visibility = 'visible';
      } else {
        elem.style.visibility = 'hidden';
      }
    }
  },
  // HTMLテキストをCssセレクトに設定する
  set_menu_text: function(selector, text) {
    var elem_list = this.make_list(selector);
    elem_list.each(function(elem) {
      elem.innerHTML = text;
    });
  }
};
/* ログイン画面 */
var verify_login = function(username, password) {
  for (var i = 0; i < users.length; i++) {
    if (username == users[i].user_name && password == users[i].password) {
      return users[i];
    }
  }
  return null;
};
var get_user_by_id = function(_users, user_id) {
  for (var i = 0; i < _users.length; i++) {
    if (user_id == _users[i].id) {
      return _users[i];
    }
  }
  return null;
};

/* 共通 */
var get_event_by_id = function(_events, id) {
    for (var i = 0; i < _events.length; i++) {
        if (_events[i].id == id) {
            return _events[i];
        } 
    }
    return null;
};

var get_ad_by_id = function(_ads, id) {
    for (var i = 0; i < _ads.length; i++) {
        if (_ads[i].id == id) {
            return _ads[i];
        } 
    }
    return null;
};

var get_ad_set_by_id = function(_ad_sets, id) {
    for (var i = 0; i < _ad_sets.length; i++) {
        if (_ad_sets[i].id == id) {
            return _ad_sets[i];
        } 
    }
    return null;
};

var get_rooms_by_event_id = function(_rooms, event_id) {
    var rs = [];
    for (var i = 0; i < _rooms.length; i++) {
        if (_rooms[i].event_id == event_id) {
            rs.push(_rooms[i]);
        } 
    }
    return rs;
};

var get_contents_by_id = function(_contents, id) {
    for (var i = 0; i < _contents.length; i++) {
        if (_contents[i].id == id) {
            return _contents[i];
        } 
    }
    return null;
};

var get_slide_set_by_id = function(_slide_sets, id) {
    for (var i = 0; i < _slide_sets.length; i++) {
        if (_slide_sets[i].id == id) {
            return _slide_sets[i];
        } 
    }
    return null;
};

var get_contents_in_rooms = function(_rooms) {
    var ct = [];
    var _contents = [];
    for (var i = 0; i < _rooms.length; i++) {
        var room = _rooms[i];
        if (ct.indexOf(_rooms[i].content_id) < 0) {
            ct.push(_rooms[i].content_id);
        }
    }
    for (var i = 0; i < ct.length; i++) {
        _contents.push(get_contents_by_id(contents, ct[i]));
    }
    return _contents;
};

var get_slide_sets_by_content_id = function(_slide_sets, content_id) {
  var sl = [];
    for (var i = 0; i < _slide_sets.length; i++) {
        if (_slide_sets[i].content_id == content_id) {
            sl.push(_slide_sets[i]);
        } 
    }
    return sl;
};

var get_logs_by_event_id = function(_logs, event_id) {
  var _l = [];
    for (var i = 0; i < _logs.length; i++) {
        if (_logs[i].event_id == event_id) {
            _l.push(_logs[i]);
        } 
    }
    return _l;
};

var get_ad_ids_by_ad_set_id = function(_tb_ads, ad_set_id) {
  var _ads = [];
  for (var i = 0; i < _tb_ads.length; i++) {
    if (_tb_ads[i].ad_set_id == ad_set_id) {
      _ads.push(_tb_ads[i].ad_id);
    }
  }
  return _ads;
};

var get_ads_by_ad_set_id = function(_tb_ads, ad_set_id) {
  var _ads = [];
  for (var i = 0; i < _tb_ads.length; i++) {
    if (_tb_ads[i].ad_set_id == ad_set_id) {
      var ad = get_ad_by_id(ads, _tb_ads[i].ad_id);
      _ads.push(ad);
    }
  }
  return _ads;
};

var select_ad_id_by_tb_ads = function (_tb_ads, ad_set_id, ad_id) {
  for (var i = 0; i < _tb_ads.length; i++) {
    if (_tb_ads[i].ad_set_id == ad_set_id && tb_ads[i].ad_id == ad_id) {
      return true;
    }
  }
  return false;
};

var get_gps_area_by_id = function(_gps_areas, id) {
  for (var i = 0; i < _gps_areas.length; i++) {
    if (id == _gps_areas[i].id) {
      return _gps_areas[i];
    }
  }
  return null;
};

var get_system_info = function () {
    return system_info;
};

var get_setting = function () {
    return system_setting;
};

var logout = function () {
  location.href = "/src/";
}

var current_index = 1;
var page_next = function() {
    $("#content" + current_index).hide();
    current_index = current_index + 1;
    $("#content" + current_index).show();
}

var page_back = function() {
    $("#content" + current_index).hide();
    current_index = current_index - 1;
    $("#content" + current_index).show();
}

var page_jump = function(jump_index) {
    $("#content" + current_index).hide();
    $("#content" + jump_index).show();
    current_index = jump_index;
}


$(document).ready(function(){
    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() >= 50) {
            $('#moveTop').fadeIn();
        } else {
            $('#moveTop').fadeOut();
        }
    });

    $('#moveTop').click(function(){
        $('html, body').animate({scrollTop : 0},200);
        return false;
    });
});