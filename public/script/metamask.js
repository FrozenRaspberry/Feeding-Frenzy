var provider;
var signer;
var walletStatus;
const WALLET_STATUS = {
    UNINSTALLED: 0,
    INSTALLED: 1,
    CONNECTED: 2
}

const M = 10 ** 18;
var chainId = -1;
var userAccount;

function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

window.ethereum.on('accountsChanged', function (accounts) {
    if (walletStatus == WALLET_STATUS.CONNECTED) {
        consolePrint('Account changed, auto connecting...')
        walletStatus = WALLET_STATUS.INSTALLED
        consoleEnter('/connect')        
    }
})

async function connect(auto) {
    console.log('connect')
    if (walletStatus == WALLET_STATUS.CONNECTED) {
        console.log('Connected already.');
        return {
            code: 0,
            msg: 'You have already connected.'
        }
    }
    if (typeof window.ethereum == 'undefined') {
        console.log('MetaMask not found!');
        walletStatus = WALLET_STATUS.UNINSTALLED;
        url = "https://metamask.io/"
        return {
            code: 1,
            msg: 'Please install MetaMask first, you can get it <a href='+url+' target="_blank">here</a>.'
        }
    } else {
        console.log('MetaMask OK.');
        walletStatus = WALLET_STATUS.INSTALLED;
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum)
            signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
        } catch (e) {
            console.log('init ethers failed', e)
            return {
                code: 1,
                msg: 'Init ethers failed, please refresh and try again.'
            }
        }
    }

    try {
        accounts = await ethereum.request({
            method: 'eth_requestAccounts'
        });
    } catch (e) {
        return {
            code: 1,
            msg: 'Fetch account failed, please refresh and try again.'
        }
    }

    msg = ''
    gameContractAddress = ''
    gameContractAbi = ''
    if (accounts[0]) {
        walletStatus = WALLET_STATUS.CONNECTED;
        userAccount = accounts[0];
        console.log('Connected. ', userAccount);
        if (ethereum.chainId == '0x1') {
            if (env == ENV.TEST) {
                msg += 'Test mode, please switch to <span style="color: yellow">Rinkeby Testnet</span> and try again.'
                walletStatus = WALLET_STATUS.INSTALLED; 
                return {code: 0, msg: msg }            
            } else {
                msg += userAccount.slice(0, 6) + '...' + userAccount.slice(-4)
                msg += ' connected. <br/>Loading game status...'                
                consolePrint(msg)
                gameContractAddress = '0x194a2810f241159bd4ed7c5d387e4c981b12c001'
                gameContractAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"amountForPublicSale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"cooldownOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"atkId","type":"uint256"},{"internalType":"uint256","name":"defId","type":"uint256"}],"name":"eat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getOwnershipData","outputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint64","name":"startTimestamp","type":"uint64"}],"internalType":"struct ERC721A.TokenOwnership","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPublicSaleStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"levelOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextOwnerToExplicitlySet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"numberMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"publicSaleMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"publicSalePerMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicSaleStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"reserveMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"setOwnersExplicit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"status","type":"bool"}],"name":"setPublicSaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"sizeOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"typeOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"upgrade","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"upgradeTimeOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawMoney","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
                gameContract = new ethers.Contract(gameContractAddress, gameContractAbi, signer)
            }
        } else if (ethereum.chainId == '0x4') {
            if (env == ENV.TEST) {
                msg += 'Rinkeby Testnet Network Detected.<br/>'
                msg += userAccount.slice(0, 6) + '...' + userAccount.slice(-4)
                msg += ' connected. <br/>Loading game status...' //Check your available options with command <span style="color: yellow">/help</span>
                consolePrint(msg)
                gameContractAddress = '0x194a2810f241159bd4ed7c5d387e4c981b12c001'
                gameContractAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"amountForPublicSale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"cooldownOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"atkId","type":"uint256"},{"internalType":"uint256","name":"defId","type":"uint256"}],"name":"eat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getOwnershipData","outputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint64","name":"startTimestamp","type":"uint64"}],"internalType":"struct ERC721A.TokenOwnership","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPublicSaleStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"levelOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextOwnerToExplicitlySet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"numberMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"publicSaleMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"publicSalePerMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicSaleStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"reserveMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"setOwnersExplicit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"status","type":"bool"}],"name":"setPublicSaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"sizeOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"typeOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"upgrade","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"upgradeTimeOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawMoney","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
                gameContract = new ethers.Contract(gameContractAddress, gameContractAbi, signer)
            } else {
                walletStatus = WALLET_STATUS.INSTALLED
                return {code: 1, msg: 'Wrong network, please connect to the mainnet.'}
            }
        } else {
            walletStatus = WALLET_STATUS.INSTALLED
            return {code: 1, msg: 'Wrong network, please connect to the mainnet.'}
        }
        console.log('chain id: ', ethereum.chainId)
        await updateGameStatus()
        return {code: 0, msg: '' }
    }
}

async function getAccount() {
    if (walletStatus == WALLET_STATUS.CONNECTED) {
        walletStatus = WALLET_STATUS.CONNECTED;
        userAccount = accounts[0];
        if (ethereum.chainId == '0x1') {
            networkName = 'ETH Mainnet';
        } else {
            networkName = 'Wrong Network';
        }
        console.log(networkName)
        return {
            code: 0,
            msg: userAccount.slice(0, 6) + '...' + userAccount.slice(-4) + ' connected.'
        }
    }
    return {
        code: 1,
        msg: "You haven't connected yet."
    }
}

async function updateGameStatus() {
    if (gameContract) {
        r = await gameContract.getPublicSaleStatus()
        if (r) {
            r = await gameContract.totalSupply()
            if (r) {
                totalSupply = parseInt(r)
                console.log('Total supply: ', totalSupply)
            }
            console.log('Mint Phase')
            if (totalSupply >= 3333) {
                gamePhase = GamePhase.GAME
                consolePrint('<span style="color: #00F400">We are SOLD OUT</span>, use <span style="color: yellow">/help</span> for more info about game.')
            } else {
                gamePhase = GamePhase.MINT
                consolePrint('<span style="color: #00F400">Mint is LIVE</span>, type <span style="color: yellow">/mint</span> to mint your own fish or use <span style="color: yellow">/help</span> for more info.')
            }
        } else {
            console.log('Pre-Mint Phase')
            consolePrint('<span style="color: #00F400">Mint has not started yet</span>, be sure to follow our <a href="https://twitter.com/FeedingGame" target="_blank">twitter</a>.')
        }
        r = await gameContract.publicPrice()
        if (r) {
            console.log('Mint price: ', Web3.utils.fromWei(r.toString(), 'ether') , 'e')
            mintPrice = r
        }
    }
}

async function mint(s) {
    if (walletStatus != WALLET_STATUS.CONNECTED) {
        return { code: 1, msg: "You haven't connected yet." }
    }
    if (gamePhase != GamePhase.MINT) {
        console.log('Mint not available')
        msg = 'Nice try, but the mint is not live yet.' + '<br/>'
        return { code: 1, msg: msg }
    }

    var mintNum
    if (s.split(' ').length > 1) {
        mintNum = s.split(' ')[1]
    }
    msg = ''
    if (!isNumber(mintNum) || mintNum < 1 || mintNum > 10) {
        msg += 'Use command <span style="color: yellow">/mint &lt1-10&gt</span> to mint your fish.' + '<br/>'
        msg += 'You can mint as many as you want, but there is only 1 FREE for each address.'
        return { code: 0, msg: msg }
    } else {
        numberMinted = parseInt(await gameContract.numberMinted(userAccount))
        if (numberMinted > 0) {
            totalMintPrice = mintPrice * mintNum
        } else {
            totalMintPrice = mintPrice * (mintNum - 1)
        }
        console.log('totalMintPrice', totalMintPrice, 'mintPrice', mintPrice, 'mintPrice', mintPrice, 'numberMinted', numberMinted)
        if (!gameContract || !mintPrice) {
            console.log('Contract or Price Error: ', gameContract, mintPrice)
            return { code: 1, msg: 'Invalid chain data, please refresh the page.' }
        }
        if ((await provider.getBalance(accounts[0])) < totalMintPrice) {
            price = Web3.utils.fromWei(mintPrice.toString(),'ether')  * mintNum
            msg += "You don't have enough ETH, " + price + "E is required."
            return { code: 1, msg: msg }
        }
        console.log('Mint ', mintNum)
        consolePrint('Mint '+ mintNum + ' ...')            
        consoleScrollToBottom()
        try {
            tx = await gameContract.publicSaleMint(mintNum, { value: Web3.utils.toWei(totalMintPrice.toString(),'wei')} )
        } catch (e) {
            if (e.code == 4001) {
                return {'code': -1, 'msg': 'You rejected the transaction.' }
            } else {
                globalTest = e
                console.log('Mint error: ', e)
                msg += 'Sending transaction errer.' + '<br/>'
                msg += globalTest.error.message
                return {'code': -1, 'msg': msg}
            }
        }
        consolePrint('Transaction sent, waiting for confirmation...')
        url = 'https://etherscan.io/tx/' + tx['hash']
        consolePrint('If it takes too long, check your <a href='+url+' target="_blank">transaction</a> here.')
        r = await provider.waitForTransaction(tx['hash'])
        console.log('Mint result: ', r)
        return {
            'code': 0,
            'msg': 'Mint success! You can check your fish with <span style="color: yellow">/fish</span>.',
        }
    }
}

async function fish(cmd) {
    if (walletStatus != WALLET_STATUS.CONNECTED) {
        return { code: 1, msg: "You haven't connected yet." }
    }
    id = -1
    if (cmd.split(" ").length >= 2) {
        cmd = parseInt(cmd.split(" ")[1])
        if (cmd >= 0 && cmd <= 3332 ) {
            id = cmd
        }
    }
    console.log('id', id)
    msg = ''
    if (walletStatus != WALLET_STATUS.CONNECTED) {
        return {code: 1, msg: "You haven't connected yet."}
    } else if (id == -1){
        consolePrint('Loading game status...')
        r = await gameContract.balanceOf(accounts[0])
        url = 'https://opensea.io/account'
        msg = 'You have ' + r + '.<br/>'
        msg += 'You can check your fish on your <a href='+url+' target="_blank">opensea profile</a> page.<br/>'
        msg += 'Use <span style="color: yellow">/fish &lt;id&gt;</span> to check the status of a specific fish. E.g. /fish 123'
    } else {
        consolePrint('Loading fish #' + id + ' ...')
        try {
            size = gameContract.sizeOf(id)
            level = gameContract.levelOf(id)
            coolDown = gameContract.cooldownOf(id)
            blockNumber = provider.getBlockNumber()
            owner = gameContract.ownerOf(id)

            r = {
                level: await level,
                size: await size,
                coolDown: await coolDown,
                blockNumber: await blockNumber,
                owner: await owner
            }
        } catch (e) {
            errMsg = e.message
            errIdx = errMsg.indexOf("execution reverted:")
            if (errIdx == -1) {
                return {code: 1, msg: "Data error, please try again."}
            } else {
                errMsg = errMsg.substring(errIdx + 20)
                errMsg = errMsg.split('\"')[0]
                return {code: 1, msg: errMsg}
            }
        }
        console.log(r)
        msg = 'Fish #' + id + ' '
        if (r.owner.toLowerCase() == userAccount) {
            msg += '<span style="color: yellow">(You are the owner)'
        }
        msg += '<br/>'
        msg += 'Level ' + r.level +' (Size:'+ r.size +')'+ '<br/>'
        if (r.owner == '0x000000000000000000000000000000000000dEaD') {
            msg += '<span style="color: red">DEAD</span> &lt;X))))&gt;&lt;'+ '<br/>'
        } else if(r.coolDown <= r.blockNumber) {
            msg += '<span style="color: #00F400">Ready to EAT</span>'+ '<br/>'
        } else {
            blockDiff = (r.coolDown - r.blockNumber) * 13
            if (blockDiff < 60) {
                restMsg = 'less than 1 minute'
            } else {
                restMsg = 'about ' + parseInt(blockDiff/60) + ' min'
            }
            msg += 'Resting... will be ready in ' +  restMsg + '.'+ '<br/>'
        }
    }
    return {
        code: 0,
        msg: msg
    }
}

async function eat(cmd) {
    if (walletStatus != WALLET_STATUS.CONNECTED) {
        return { code: 1, msg: "You haven't connected yet." }
    }

    atkId = -1
    defId = -1
    if (cmd.split(" ").length >= 3) {
        atkId = parseInt(cmd.split(" ")[1])
        defId = parseInt(cmd.split(" ")[2])
        console.log(atkId, ' eats ', defId)
        if (atkId >= 0 && defId <= 3332 && defId >= 0 && defId <= 3332) {
            ""
        } else {
            return { code: 1, msg: "Please check your command." }
        }
    } else {
        return { code: 1, msg: 'Use <span style="color: yellow">/eat &lt;ID of FishA&gt; &lt;ID of FishB&gt;</span> to make FishA eat FishB.<br/>'+
        'E.g. <span style="color: yellow">/fish 123 456</span> makes Fish #123 eat Fish #456.<br/>' +
        'You have to be the owner of FishA.' }
    }
    console.log('atkId', atkId, 'defId', defId)
    consolePrint('Loading fish info ...')
    try {
        pblockNumber = provider.getBlockNumber()
        patkSize = gameContract.sizeOf(atkId)
        patkCooldown = gameContract.cooldownOf(atkId)
        patkLevel = gameContract.levelOf(atkId)
        patkOwner = gameContract.ownerOf(atkId)
        pdefSize = gameContract.sizeOf(defId)
        pdefCooldown = gameContract.cooldownOf(defId)
        pdefLevel = gameContract.levelOf(defId)
        pdefOwner = gameContract.ownerOf(defId)
        p = [pblockNumber, patkSize, patkCooldown, patkLevel, patkOwner, pdefSize, pdefCooldown, pdefLevel, pdefOwner]
        await Promise.all(p)
        r = {
            blockNumber: await pblockNumber,
            atkSize: await patkSize,
            atkCooldown: await patkCooldown,
            atkLevel: await patkLevel,
            atkOwner: await patkOwner,
            defSize: await pdefSize,
            defCooldown: await pdefCooldown,
            defLevel: await pdefLevel,
            defOwner: await pdefOwner,
        }
    } catch (e) {
        errMsg = e.message
        errIdx = errMsg.indexOf("execution reverted:")
        if (errIdx == -1) {
            console.log(e)
            return {code: 1, msg: "Data error, please try again."}
        } else {
            errMsg = errMsg.substring(errIdx + 20)
            errMsg = errMsg.split('\"')[0]
            return {code: 1, msg: errMsg}
        }
    }

    console.log('r', r)
    globalTest = r
    msg = ''
    msg += 'Attacker: Fish #' + atkId + '<br/>'
    msg += 'Level ' + r.atkLevel +' (Size:'+ r.atkSize +')'+ '<br/>'
    if (r.owner == '0x000000000000000000000000000000000000dEaD') {
        msg += '<span style="color: red">DEAD</span> &lt;X))))&gt;&lt;'+ '<br/>'
    } else if(r.atkCooldown <= r.blockNumber) {
        msg += '<span style="color: #00F400">Ready to EAT</span>'+ '<br/>'
    } else {
        msg += 'Resting...' + '<br/>'
    }
    msg += '<br/>'
    msg += 'Defender: Fish #' + defId + '<br/>'
    msg += 'Level ' + r.defLevel +' (Size:'+ r.defSize +')'+ '<br/>'
    if (r.owner == '0x000000000000000000000000000000000000dEaD') {
        msg += '<span style="color: red">DEAD</span> &lt;X))))&gt;&lt;'+ '<br/>'
    } else if(r.atkCooldown <= r.blockNumber) {
        msg += '<span style="color: #00F400">Ready to EAT</span>'+ '<br/>'
    } else {
        msg += 'Resting...'+ '<br/>'
    }
    msg += '<br/>'
    consolePrint(msg)

    if (r.atkOwner == '0x000000000000000000000000000000000000dEaD') {
        return {code: 1, msg: "Fish #" + atkId + ' is dead.'}
    }
    if (r.defOwner == '0x000000000000000000000000000000000000dEaD') {
        return {code: 1, msg: "Fish #" + defId + ' is dead.'}
    }
    if (r.atkOwner.toLowerCase() != userAccount) {
        return {code: 1, msg: "You are not owner of Fish #" + atkId + '.'}
    }
    if (r.atkCooldown > r.blockNumber) {
        return {code: 1, msg: "Fish #" + atkId + ' is too tired.'}
    }

    msg = ''
    globalAtkId = atkId
    globalDefId = defId

    if (r.atkLevel > r.defLevel) {
        msg += "Fish #" + atkId + ' will eat Fish #' + defId + '.<br/>'
        msg += "Fish #" + atkId + ' will gain some weight.<br/>'
    } else if (r.atkLevel < r.defLevel) {
        msg += "Fish #" + atkId + ' will be eaten by Fish #' + defId + '.<br/>'
        msg += "Fish #" + defId + ' will lose some weight.<br/>'
    } else {
        msg += "Fish #" + atkId + ' and Fish #' + defId + ' will battle and lose some weight.<br/>'
    }

    msg += '<br/> Enter <span style="color: yellow">/battle</span> to initiate the transaction.'
    return {code: 0, msg: msg }
}


async function battle() {
    if (walletStatus != WALLET_STATUS.CONNECTED) {
        return { code: 1, msg: "You haven't connected yet." }
    } else if (globalAtkId == -1 || globalDefId == -1) {
        return { code: 1, msg: 'Please use <span style="color: yellow">/eat</span> first.' }
    }

    consolePrint('Fish #'+ globalAtkId + ' eats Fish #' + globalDefId + ' ...')
    try {
        tx = await gameContract.eat(globalAtkId, globalDefId)
    } catch (e) {
        if (e.code == 4001) {
            return {'code': -1, 'msg': 'You rejected the transaction.' }
        } else {
            globalTest = e
            console.log('Eat error: ', e)
            msg += 'Sending transaction errer.' + '<br/>'
            msg += globalTest.error.message
            return {'code': -1, 'msg': msg}
        }
    }
    atkId = globalAtkId
    defId = globalDefId
    globalAtkId = -1
    globalDefId = -1
    consolePrint('Transaction sent, waiting for confirmation...')
    url = 'https://etherscan.io/tx/' + tx['hash']
    consolePrint('If it takes too long, check your <a href='+url+' target="_blank">transaction</a> here.')
    r = await provider.waitForTransaction(tx['hash'])
    console.log('Eat result: ', r)
    consolePrint('Transaction confirmed, updating game status...')

    try {
        pblockNumber = provider.getBlockNumber()
        patkSize = gameContract.sizeOf(atkId)
        patkCooldown = gameContract.cooldownOf(atkId)
        patkLevel = gameContract.levelOf(atkId)
        patkOwner = gameContract.ownerOf(atkId)
        pdefSize = gameContract.sizeOf(defId)
        pdefCooldown = gameContract.cooldownOf(defId)
        pdefLevel = gameContract.levelOf(defId)
        pdefOwner = gameContract.ownerOf(defId)
        p = [pblockNumber, patkSize, patkCooldown, patkLevel, patkOwner, pdefSize, pdefCooldown, pdefLevel, pdefOwner]
        await Promise.all(p)
        r = {
            blockNumber: await pblockNumber,
            atkSize: await patkSize,
            atkCooldown: await patkCooldown,
            atkLevel: await patkLevel,
            atkOwner: await patkOwner,
            defSize: await pdefSize,
            defCooldown: await pdefCooldown,
            defLevel: await pdefLevel,
            defOwner: await pdefOwner,
        }
    } catch (e) {
        errMsg = e.message
        errIdx = errMsg.indexOf("execution reverted:")
        if (errIdx == -1) {
            console.log(e)
            return {code: 1, msg: "Data error, please try again."}
        } else {
            errMsg = errMsg.substring(errIdx + 20)
            errMsg = errMsg.split('\"')[0]
            return {code: 1, msg: errMsg}
        }
    }

    if (r.atkOwner == '0x000000000000000000000000000000000000dEaD') {
        consolePrint('Fish #' + atkId +  ' is DEAD.')
    } else {
        consolePrint('Fish #' + atkId +  ' is Level ' + r.atkLevel + ' now.')
    }
    if (r.defOwner == '0x000000000000000000000000000000000000dEaD') {
        consolePrint('Fish #' + defId +  ' is DEAD.')
    } else {
        consolePrint('Fish #' + defId +  ' is Level ' + r.defLevel + ' now.')
    }
    return {code: 0, msg: '<br/>'}
}

async function upgrade(cmd) {
    if (walletStatus != WALLET_STATUS.CONNECTED) {
        return { code: 1, msg: "You haven't connected yet." }
    }

    if (cmd.split(" ").length >= 2) {
        fishToUpgrade = parseInt(cmd.split(" ")[1])
        console.log('upgrade ', fishToUpgrade)
        if (fishToUpgrade >= 0 && fishToUpgrade <= 3332) {
            ""
        } else {
            return { code: 1, msg: "Please check your command." }
        }
    } else {
        return { code: 1, msg: 'Use <span style="color: yellow">/upgrade &lt;ID of Fish&gt;</span> to upgrade fish.<br/>'+
        'A fish can only be upgraded <span style="color: yellow">3 times</span>.<br/>Fishes with higher level cost more during upgrading.<br/>' }
    }

    owner = await gameContract.ownerOf(fishToUpgrade)
    if (owner == '0x000000000000000000000000000000000000dEaD') {
        return {'code': -1, 'msg': 'This fish is DEAD.' }
    }

    consolePrint('Upgrading fish #' + fishToUpgrade + ' ...')
    try {
        level = await gameContract.levelOf(fishToUpgrade)
        level = parseInt(level)
        console.log('level', level)
        globalTest = level
        upgradePrice = (level**2 + level) * 0.0015
        console.log('upgradePrice', upgradePrice, 'ether')
        tx = await gameContract.upgrade(fishToUpgrade, { value: mintPriceInEther = Web3.utils.toWei(upgradePrice.toString(),'ether')})
    } catch (e) {
        if (e.code == 4001) {
            return {'code': -1, 'msg': 'You rejected the transaction.' }
        } else {
            globalTest = e
            console.log('Eat error: ', e)
            msg += 'Sending transaction errer.' + '<br/>'
            msg += globalTest.error.message
            return {'code': -1, 'msg': msg}
        }
    }
    consolePrint('Transaction sent, waiting for confirmation...')
    url = 'https://etherscan.io/tx/' + tx['hash']
    consolePrint('If it takes too long, check your <a href='+url+' target="_blank">transaction</a> here.')
    r = await provider.waitForTransaction(tx['hash'])
    console.log('Upgrade Result: ', r)
    consolePrint('Transaction confirmed, updating game status...')
    try {
        pblockNumber = provider.getBlockNumber()
        pSize = gameContract.sizeOf(fishToUpgrade)
        pCooldown = gameContract.cooldownOf(fishToUpgrade)
        pLevel = gameContract.levelOf(fishToUpgrade)
        pOwner = gameContract.ownerOf(fishToUpgrade)
        p = [pblockNumber, pSize, pCooldown, pLevel, pOwner]
        await Promise.all(p)
        r = {
            blockNumber: await pblockNumber,
            size: await pSize,
            cooldown: await pCooldown,
            level: await pLevel,
            owner: await pOwner,
        }
    } catch (e) {
        errMsg = e.message
        errIdx = errMsg.indexOf("execution reverted:")
        if (errIdx == -1) {
            console.log(e)
            return {code: 1, msg: "Data error, please try again."}
        } else {
            errMsg = errMsg.substring(errIdx + 20)
            errMsg = errMsg.split('\"')[0]
            return {code: 1, msg: errMsg}
        }
    }

    msg = 'Fish #' + fishToUpgrade + '<br/>'
    msg += 'Level ' + r.level +' (Size:'+ r.size +')'+ '<br/>'
    if(r.cooldown <= r.blockNumber) {
        msg += '<span style="color: #00F400">Ready to EAT</span>'+ '<br/>'
    } else {
        console.log(r.cooldown, r.blockNumber)
        blockDiff = (r.cooldown - r.blockNumber) * 13
        console.log(blockDiff)
        if (blockDiff < 60) {
            restMsg = 'less than 1 minute'
        } else {
            restMsg = 'about ' + parseInt(blockDiff/60) + ' min'
        }
        msg += 'Resting... will be ready in ' +  restMsg + '.'+ '<br/>'
    }
    return {
        code: 0,
        msg: msg
    }
}