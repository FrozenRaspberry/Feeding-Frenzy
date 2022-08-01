const ENV = {
	TEST: 'TEST',
	PROD: 'PROD'
}

const GamePhase = {
	PREMINT: 'PREMINT',
	MINT: 'MINT',
	GAME: 'GAME',
	FINISH: 'FINISH'
}

// const env = ENV.TEST
const env = ENV.TEST

var openseaCollectionName = 'oscollection'

var gamePhase = GamePhase.PREMINT
var contextCommandName = ''
var gameContract = null
var mintPrice = null
var totalSupply = null
var globalTest = null

// eat command
var globalAtkId = null
var globalDefId = null

if (env == ENV.TEST) {
	console.log('=== TEST ENV ===')
}

function consolePrint(msg) {
    list = msg.split("<br/>")
    if (list.length >= 1) {
        index = 0;
        list.forEach(function(el, index) {
            var interval = 170; // how much time should the delay between two iterations be (in milliseconds)? (default)
            setTimeout(function() {
                if (el != "" && index == 0) {
                    $('div.consolebody > p:last-child').after("<p class='code newline'>" + el + "</p>");
                } else if (el != "") {
                    $('div.consolebody > p:last-child').after("<p class='code'>" + el + "</p>");
                }

                // scroll to bottom
                $('.consolebody').scrollTop($('.consolebody')[0].scrollHeight);

            }, index * interval);
        });
    }
}

function consoleClear() {
    $('.code, .owncode').remove();
    return {
        code: 0,
        msg: ''
    }
}

function consoleScrollToBottom() {
    $('.consolebody').scrollTop($('.consolebody')[0].scrollHeight);
}

async function consoleEnter($s) {
    if ($s.length == 0) {
        return
    }
    if ($s.split(' ').length > 1) {
        param = $s.slice($s.indexOf(' ')+1)
    } else {
        param = ''
    }

    console.log('event', $s.split(' ')[0], 'param', param)
    gtag('event', $s.split(' ')[0], {
      param: param
    })

    // append entered text from input
    $('div.consolebody > p:last-child').after("<p class='owncode'>" + $s + "</p>");

    if ($s.substr(0,1) == '/') {
        $s = $s.substr(1)
    }
    handleCommand($s)

    return
}

async function handleCommand($s){
    ////////////////////
    // HANDLE COMMAND //
    ////////////////////
    if ($s in localMessages) {
        contextCommandName = ''
        consolePrint(localMessages[$s])
    } else if ($s.toLowerCase().split(' ')[0] in localCommands) {
        contextCommandName = ''
        r = await localCommands[$s.toLowerCase().split(' ')[0]]($s)
        consolePrint(r.msg)
    } else if ($s in optionCommands && contextCommandName != '') {
		r = await localCommands[contextCommandName]($s)
		consolePrint(r.msg)
    } else {
        consolePrint('command not found')
    }

    consoleScrollToBottom()
}

(function($) {
    $(function() {

        // This script is /important
        // ONLOAD input focus
        $('input').focus();

        // focus to input
        $('body').on('mousedown', function(evt) {
            $('body').on('mouseup mousemove', function handler(evt) {
                if (evt.type === 'mouseup') {
                    $('input').focus();
                }
                $('body').off('mouseup mousemove', handler);
            });
        });


        // writing mirror effect & send
        $('input').keyup(function(e) {
            if (e.keyCode == 13) {
                // press ENTER
                consoleEnter($('input').val());
                $('input').val("");
            }
            if (parseInt(e.key) >= 1 && parseInt(e.key) <= 9 && parseInt($('input').val()) == parseInt(e.key)) {
                console.log('press only', e.key)
            }
        });

    });
})(jQuery);