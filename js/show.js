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
  OxfordLawSearch(word);
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
      if (i != entries.length - 1)
        oxfordContent.append('<hr/>');
    }
  } else {
    oxfordContent.append('<h3> Sorry, no result for <em>' + word + '</em>.</h3>');
  }
  oxfordContent.appendTo("#oxford-result");

}

function OxfordLawSearch(word) {
  var oxfordLawContent = $('#oxford-law-content').detach();
  oxfordLawContent.empty();
  if (word in OxfordLaw) {
    words = OxfordLaw[word];

    mainWord = words[0];
    mainEntries = mainWord[1];
    for (i = 0; i < mainEntries.length; ++i) {
      entry = $('<div/>', {
        'class': 'dictionary-entry nav-offset',
        id: 'oxford-law-' + word + '-' + (i + 1)
      });
      h3string = word + '<sup>' + (i + 1) + '</sup>';
      if (i === 0 && mainWord[0] !== '') {
        h3string += '&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-transfer"' +
        ' aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;' + mainWord[0];
      }
      h3 = $('<h3>' + h3string + '</h3>');
      h3.appendTo(entry);
      meanings = mainEntries[i];
      if (meanings.length) {
        found = meanings[0].match(/^(n\. |vb\. |adj\. |pl\. n\. )/);
        if (found) {
          entry.append('<p>' + found[0] + '<\p>');
          meanings[0] = meanings[0].substring(found[0].length);
        }
      }
      ol = $('<ol></ol>');
      for (j = 0; j < meanings.length; ++j) {
        found = meanings[j].match(/^\d+\. /);
        if (found) {
          meanings[j] = meanings[j].substring(found[0].length);
        }
        ol.append('<li>' + meanings[j] + '</li>');
      }
      ol.appendTo(entry);
      entry.appendTo(oxfordLawContent);
      if (i != mainEntries.length - 1)
        oxfordLawContent.append('<hr/>');
    }

    if (words.length > 1) {
      referWord = words[1];
      referEntries = referWord[1];
      lastEntry = mainEntries[mainEntries.length - 1];
      lastMeaning = lastEntry[lastEntry.length -1];
      found = lastMeaning.match(/[Ss]ee ([a-zA-Z \-]+)\./);
      if (found) {
        word = found[1];
      }
      panel = $('<div/>', {
        'class': 'panel panel-info'
      });
      panelHeading = $('<div/>', {
        'class': 'panel-heading'
      });
      panelHeading.append('<h3>' + word + '</h3>');
      panel.append(panelHeading);
      panelBody = $('<div/>', {
        'class': 'panel-body'
      });

      for (i = 0; i < referEntries.length; ++i) {
        entry = $('<div/>', {
          'class': 'dictionary-entry nav-offset'
        });
        h4string = word + '<sup>' + (i + 1) + '</sup>';
        if (i === 0 && referWord[0] !== '') {
          h4string += '&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-transfer"' +
          ' aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;' + referWord[0];
        }
        h4 = $('<h4>' + h4string + '</h4>');
        h4.appendTo(entry);
        meanings = referEntries[i];
        if (meanings.length) {
          found = meanings[0].match(/^(n\. |vb\. |adj\. |pl\. n\. )/);
          if (found) {
            entry.append('<p>' + found[0] + '<\p>');
            meanings[0] = meanings[0].substring(found[0].length);
          }
        }
        ol = $('<ol></ol>');
        for (j = 0; j < meanings.length; ++j) {
          found = meanings[j].match(/^\d+\. /);
          if (found) {
            meanings[j] = meanings[j].substring(found[0].length);
          }
          ol.append('<li>' + meanings[j] + '</li>');
        }
        ol.appendTo(entry);
        entry.appendTo(panelBody);
        if (i != referEntries.length - 1)
          panelBody.append('<hr/>');
      }
      panel.append(panelBody);
      panel.appendTo(oxfordLawContent);
    }

  } else {
    oxfordLawContent.append('<h3> Sorry, no result for <em>' + word + '</em>.</h3>');
  }
  oxfordLawContent.appendTo("#oxford-law-result");

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
