a = {"Name": "10",};

var shiftWindow = function() {
   scrollBy(0, -50);
 };
if (location.hash) {
  shiftWindow();
}



$('button#search').click( function() {
  var word = $('input#searchbox').val().trim();
  search(word);
});

$('input#searchbox').keypress( function(event) {
  if (event.which == 13) {
    var word = $('input#searchbox').val().trim();
    search(word);
  }
});

$(function () {
  $('button#btn-pronunciation').click(function () {
    $('#pronunciation').trigger('pause');
    $('#pronunciation').prop('currentTime', 0);
    $('#pronunciation').trigger('play');
  });
  $("#pronunciation").bind("load",function(){
        $("#btn-pronunciation").removeAttr('disabled');
    });
  $('#pronunciation').on('error', handleMediaError);
  search('book');

});

function search(word) {
  OxfordSearch(word);
  $('#pronunciation').attr('src', 'http://ssl.gstatic.com/dictionary/static/sounds/de/0/' + word + '.mp3');
  $('#pronunciation').trigger('load');

  $('button[object]').click(bind);
}

$('Y[O]').click(bind);

function bind() {
  search($(this).attr('object'));
  $("body, html").animate({
      scrollTop: $('#' + $(this).attr('source') + '-' + $(this).attr('object') + '-' + $(this).attr('entry')).offset().top
    }, 600);
  $('button[object]').click(bind);
}

/*function OxfordSearch(word) {
  result = '';
  if (word in Oxford) {
    entries = Oxford[word];
    for (i = 0; i < entries.length; ++i) {
      result += '<div class="dictionary-entry nav-offset" id ="';
      result += 'oxford-' + word + '-' + (i + 1) + '">' +
        '<h3>' + word + '<sup>' + (i + 1) + '</sup></h3>';
      if (entries[i][0]) {
        result += '<p>' + entries[i][0] + '</p>';
      }
      meanings = entries[i][1][0];
      derivations = entries[i][1][1];
      if (meanings.length) {
        result += '<h4> <span class="label label-default"> Meanings </span> </h4>\n';
        result += '<ol>\n';
        for (j = 0; j < meanings.length; ++j) {
          result += '<li>' + meanings[j] + '</li>\n';
        }
        result += '</ol>\n';
      }
      if (derivations.length) {
        result += '<h4> <span class="label label-default"> Derivations </span> </h4>\n';
        result += '<ul>\n';
        for (j = 0; j < derivations.length; ++j) {
          result += '<li>' + derivations[j] + '</li>\n';
        }
        result += '</ul>\n';
      }

      result += '<hr/>\n';
      result += '</div>';
    }
  }
  else {
    result = '<h3> Sorry, no result for ' + word + '.</h3>';
  }
  return result;
}*/

function OxfordSearch(word) {
  var oxfordContent = $('#oxford-content').detach();
  oxfordContent.empty();
  if (word in Oxford) {
    entries = Oxford[word];
    for (i = 0; i < entries.length; ++i) {
      entry = $('<div/>', {
        'class': 'dictionary-entry nav-offset',
        id: 'oxford-' + word + '-' + (i + 1)
      });
      h3 = $('<h3>' + word + '</h3>');
      h3.append('<sup>' + (i + 1) + '</sup>');
      h3.appendTo(entry);
      if (entries[i][0]) {
        entry.append('<p>' + entries[i][0] + '</p>');
      }
      meanings = entries[i][1][0];
      derivations = entries[i][1][1];
      if (meanings.length) {
        span = $('<span class="label label-default">Meanings</span>');
        h4 = $('<h4> </h4>');
        h4.append(span);
        h4.appendTo(entry);
        ol = $('<ol></ol>');
        for (j = 0; j < meanings.length; ++j) {
          //str = meanings[j].replace(/<Y O="([ a-zA-Z]+)">[ a-zA-Z]+<\/Y>/, createButton);
          re = /<Y O="([ a-zA-Z\-]+)">[ a-zA-Z\-]+<\/Y>[ ]*(<l>(\d+)<\/l>)?/;
          str = meanings[j];
          while (re.exec(str)) {
            str = str.replace(re, createButton);
          }
          ol.append('<li>' + removeWierdChar(str.trim()) + '</li>');
        }
        ol.appendTo(entry);
      }
      if (derivations.length) {
        span = $('<span class="label label-default">Derivations</span>');
        h4 = $('<h4> </h4>');
        h4.append(span);
        h4.appendTo(entry);
        ul = $('<ul></ul>');
        for (j = 0; j < derivations.length; ++j) {
          re = /<Y O="([ a-zA-Z\-]+)">[ a-zA-Z\-]+<\/Y>[ ]*(<l>(\d+)<\/l>)?/;
          str = derivations[j];
          while (re.exec(str)) {
            str = str.replace(re, createButton);
          }
          ul.append('<li>' + removeWierdChar(str.trim()) + '</li>');
        }
        ul.appendTo(entry);
      }
      entry.appendTo(oxfordContent);
      oxfordContent.append('<hr/>');
    }
  } else {
    oxfordContent.append('<h3> Sorry, no result for ' + word + '.</h3>');
  }
  oxfordContent.appendTo("#oxford-result");

}

function test(match) {
  console.log('match:\t' + match);
}


function createButton(p1, p2, p3, p4) {
  result = '<button type="button" class="btn btn-info" source="oxford" object="' +
    p2.trim() + '" ';
  if (!p3)
    p4 = 1;
  result += 'entry="' + p4 + '">' + p2.trim() + '<sup>' + p4 + '</sup></button>';
  return result;
}

function removeWierdChar(str) {
  re = /\`|\#|&gt;|\*/;
  while (re.exec(str)) {
    str = str.replace(re, '');
  }
  return str;
}

function handleMediaError(e) {
  e.preventDefault();
  e.stopPropagation();
    /*switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
            alert('You aborted the media playback.'); break;
        case e.target.error.MEDIA_ERR_NETWORK:
            alert('A network error caused the media download to fail.'); break;
        case e.target.error.MEDIA_ERR_DECODE:
            alert('The media playback was aborted due to a corruption problem or because the media used features your browser did not support.'); break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            alert('The media could not be loaded, either because the server or network failed or because the format is not supported.'); break;
        default:
            alert('An unknown media error occurred.');
    }*/
  $('#btn-pronunciation').attr('disabled', 'disabled');

}
