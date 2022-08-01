async function help() {
	msg = 'These are common commands used in various situations:' + '<br/>'
	if (gamePhase != GamePhase.PREMINT) {
		msg += 'GENERAL COMMAND' + '<br/>'
	}
	msg += '/account'+htmlSpace(7)+'Check your wallet info' + '<br/>'
	msg += '/game'+htmlSpace(10)+'Learn more about the game' + '<br/>'
	msg += '/twitter'+htmlSpace(7)+'Contact us' + '<br/>'
	if (gamePhase != GamePhase.PREMINT) {
		msg += '/opensea'+htmlSpace(7)+'Official OpenSea address' + '<br/>'
		if (gamePhase == GamePhase.MINT) {
			msg += '/mint'+htmlSpace(10)+'Mint your fish' + '<br/>'
		}
		msg += '/contract'+htmlSpace(6)+'Official contract address' + '<br/>'
		msg += 'GAME COMMAND' + '<br/>'
		msg += '/rule'+htmlSpace(10)+'Learn the basic rule of the game' + '<br/>'
		msg += '/fish'+htmlSpace(10)+'Check your fish' + '<br/>'
		msg += '/eat'+htmlSpace(11)+'Eat other fish, yummy' + '<br/>'
		msg += '/upgrade'+htmlSpace(7)+'Upgrade your fish, power!' + '<br/>'
	}
    return {code: 0,msg: msg}
}

async function twitter() {
	msg = 'Follow our <a href="https://twitter.com/FeedingGame" target="_blank">twitter</a> to get the lastest info. '
    return {code: 0,msg: msg}
}

async function contract() {
	msg = 'The NFT contract address is '+gameContractAddress+', <br/>verify it <a href="https://etherscan.io/address/'+gameContractAddress+'" target="_blank">here</a>'
    return {code: 0,msg: msg}
}

async function opensea() {
	msg = 'The OpenSea collection name is <a href="https://opensea.io/collection/'+openseaCollectionName+'" target="_blank">'+openseaCollectionName+'</a>'
    return {code: 0,msg: msg}
}

function htmlSpace(count) {
	msg = ''
	while(count > 0){
		msg += '&nbsp;'
		count -= 1
	}
	return msg
}

async function game(op) {
	msg = ''
	msg += 'Feeding Frenzy is a game on Ethereum involving ' + '<br/>'
	msg += 'the marine food chain. You will mint your own ' + '<br/>'
	msg += 'marine predators and munch your way to the top.' + '<br/>'
    return {code: 0,msg: msg}
}

async function rule(number) {
	if (contextCommandName == '') {
		msg = ''
		msg += 'About the game:' + '<br/>'
		msg += '1. Fish' + '<br/>'
		msg += '2. Eat' + '<br/>'
		msg += '3. Upgrade' + '<br/>'
		contextCommandName = 'rule'
	    return {code: 0,msg: msg}
	} else {
		console.log(number)
		contextCommandName = ''
	}

}

var localMessages = {
	'gm' : 'gm',
	'hi' : 'gm',
	'gn' : 'gn',
	'hello' : 'Hello.',
	'fuck you' : 'Fuck you.',
}

var localCommands = {
	'connect' : connect,
	'account' : getAccount,
	'help' : help,
	'clear': consoleClear,
	'fish': fish,
	'eat': eat,
	'battle': battle,
	'upgrade': upgrade,
	'opensea': opensea,
	'contract': contract,
	'game': game,
	'mint': mint,
	'twitter': twitter,
	'rule': rule,
}

var optionCommands = {
	'1': 1,
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
}

consoleEnter('/connect')