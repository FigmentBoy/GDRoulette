const api = 'https://www.gdbrowser.com/api/search/'
const listapi = 'https://pointercrate.com/api/v1/demons/?limit=100'
const challengeapi = 'https://gdchallengelist.com/api/v1/demons/?limit=100'
const status = 'https://gdbrowser.com/api/search/*'

const TIMEOUT = 2000;

let apiquery = ''
let list = []
let listnum = 0
let nextpercent = 1
let diffstr = ""
let custom = false
let creator = false
let API = false;
let pages = {}
let apilist = []

let urlQuery = ''

const urlParams = new URLSearchParams(window.location.search);
const radios = document.getElementsByName('difficulty');
let checked = false;

function copylink() {
    copy(window.location.href)
    document.getElementById('copytext').innerText = 'Copied!';
    document.getElementById('copytext').classList.add('has-text-success');
    document.getElementById('link').classList.add('is-success')

    setTimeout(() => {
        document.getElementById('copytext').innerText = 'Copyable Link (Click to copy)'
        document.getElementById('copytext').classList.remove('has-text-success');
        document.getElementById('link').classList.remove('is-success')
    }, 1000)
}

for (var i = 0, length = radios.length; i < length; i++) {
    radios[i].addEventListener('change', e => {
        let target = e.target || e.srcElement;
        urlQuery = target.id;
        updateURL()

        document.getElementById('start').removeAttribute('disabled')
        document.getElementById('start').setAttribute('onclick', 'startroulette()')
    })
    

    if (urlParams.get(radios[i].id) !== null) {
        radios[i].checked = true;
        checked = true;
        urlQuery = radios[i].id;
        document.getElementById('start').removeAttribute('disabled')
        document.getElementById('start').setAttribute('onclick', 'startroulette()')
    }
}

if (urlParams.get('seed') !== null) {
    if (parseInt(urlParams.get('seed'))) {
        document.querySelector('#seed').value = parseInt(urlParams.get('seed'));
        document.querySelector('#addSeed').checked = true;
        Math.seed = document.querySelector('#seed').value;
    }
} else {
    Math.seed = Math.floor(Math.random()*10000000000);
    document.querySelector('#seed').value = Math.seed
}

if (checked && urlParams.get('start') !== null) {
    document.getElementById('linkStart').checked = true;
    document.getElementById('settings').classList.add('is-hidden')
    startroulette()
} else if (urlParams.get('start') !== null) {
    document.getElementById('linkStart').checked = true;
}
updateURL()

if (!checked) {
    document.getElementById('start').setAttribute('disabled', true)
    document.getElementById('start').setAttribute('onclick', '')
}



document.querySelector('#seed').addEventListener('change', () => {
    Math.seed = document.querySelector('#seed').value
    updateURL()
})

document.getElementById('linkStart').addEventListener('change', () => {
    updateURL();
})

document.getElementById('addSeed').addEventListener('change', () => {
    updateURL();
})

async function checkStatus() {
    req = await axios.get(status)
    console.log(req)
    if (req.data == '-1') {
        document.getElementById('down').innerText = 'Hey! You (or GDBrowser) have been ratelimited. Please wait a bit before restarting'
    } 
}
setTimeout(checkStatus)

function updateURL() {
    urlAdds = []
    if (urlQuery != "") urlAdds.push(urlQuery)
    if (document.getElementById('addSeed').checked == true) urlAdds.push('seed='+Math.seed)
    if (document.getElementById('linkStart').checked == true) urlAdds.push('start')

    string = ''
    if (urlAdds.length != 0) {
        urlAdds[0] = '?' + urlAdds[0]
        string +=  urlAdds.join('&')
    }
    document.getElementById('link').value = window.location.href.split('?')[0] + string
    window.history.pushState("object or string", "GDRoulette", window.location.href.split('?')[0] + urlAdds.join('&'));

}


items = ["Hyperdash will come before 2.2", "2.2 when?", "Now with pointercrate!", "Now with Challenges!", "Automatically copying IDs since 2020", "Also try Geometry Dash", "Hi Matcool", "F in chat", "Hi YT", "🅱️", "This text is random", "GG EZ"]
document.getElementById('splash').innerText = items[Math.floor(Math.random() * items.length)];


async function startroulette() {
    let query = '*';

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            query+=radios[i].value;
            diffstr = radios[i].parentNode.innerText

            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if (query == '*') {
        alert('Please select a difficulty!')
        return
    }

    if (query == '*custom') {
        custom = true;
        document.getElementById('settings').classList.add('animate__fadeOut')
        setTimeout(() => {
            document.getElementById('settings').classList.add('is-hidden')
            document.getElementById('settings').classList.remove('is-loading')

            document.getElementById('levels').insertAdjacentHTML('beforeend', 
            `<div class='box is-centered columns animate__animated animate__fadeInUpBig mt-1' id='custombox'>
                <div class="column box-content">
                    <textarea id='customs' class='textarea' placeholder='Enter your custom levels here, seperated by line'></textarea>
                    <br>
                    <div id="startcustom" class="button is-success" onclick="startcustom()">Start</div>
                </div>
                
            </div>`)
        }, 250)
    } else if(query == '*creator') {
        creator = true

        document.getElementById('settings').classList.add('animate__fadeOut')
        setTimeout(() => {
            document.getElementById('settings').classList.add('is-hidden')
            document.getElementById('settings').classList.remove('is-loading')

            document.getElementById('levels').insertAdjacentHTML('beforeend', 
            `<div class='box is-centered columns animate__animated animate__fadeInUpBig mt-1' id='custombox'>
                <div class="column box-content">
                    <input id='customs' class='input' placeholder="Enter the creator's name"></input>
                    <br><br>
                    <div id="startcustom" class="button is-success" onclick="startcustom()">Start</div>
                </div>
                
            </div>`)
        }, 250)
    } else if (query=='*demonlist') {
        document.getElementById('start').classList.add('is-loading')

        setTimeout(async () => {
            req = await axios.get(listapi)
            apilist = req.data

            apilist.shuffle()
    
            apilist = apilist.slice(0,100)
            getNextAPI();

            document.getElementById('settings').classList.add('animate__fadeOut')
            setTimeout(() => {
                document.getElementById('settings').classList.add('is-hidden')
                document.getElementById('settings').classList.remove('is-loading')
            }, 250)
        })
    } else if (query=='*challenge') {
        document.getElementById('start').classList.add('is-loading')

        console.log("Challenge")

        setTimeout(async () => {
            req = await axios.get(challengeapi)
            apilist = req.data
            

            apilist.shuffle()
    
            apilist = apilist.slice(0,100)
            getNextAPI();

            document.getElementById('settings').classList.add('animate__fadeOut')
            setTimeout(() => {
                document.getElementById('settings').classList.add('is-hidden')
                document.getElementById('settings').classList.remove('is-loading')
            }, 250)
        })

    } else {
        document.getElementById('start').classList.add('is-loading')

        setTimeout(async () => { // Because js is weird
            apiquery = api + query;

            req = await getPage(0)
            
            levels = req[0]["results"]


            for (i = 1; i <= levels; i++) {
                list.push(i)
            }

            list.shuffle()

            list = list.slice(0,100)

            getNextLvl()

            document.getElementById('settings').classList.add('animate__fadeOut')
            setTimeout(() => {
                document.getElementById('settings').classList.add('is-hidden')
                document.getElementById('settings').classList.remove('is-loading')
            }, 250)
        })
    }
}

async function startcustom() {

    if (creator) {
        creatortxt = document.getElementById('customs').value
        document.getElementById('startcustom').classList.add('is-loading')

        setTimeout(async () => { // Because js is weird
            req = axios.get('https://www.gdbrowser.com/api/profile/' + creatortxt)

            creatortxt = req.data['accountID']

            if (!creatortxt) {
                alert('Creator does not exist')
                document.getElementById('startcustom').classList.remove('is-loading')
                return
            }

            apiquery = api + '*?creators=' + creatortxt

            levels = 0
            amount = 10
            page = 0
            while (amount == 10) {
                req = await getPage(page)
                console.log(req)

                
                amount = req.length
                
                levels += amount
                page++

                console.log(amount)
            }

            for (i = 1; i <= levels; i++) { // I know this is super inefficient but the api doesn't show the amount of results for creator searches
                list.push(i)
            }

            list.shuffle()
            getNextLvl()

            document.getElementById('custombox').classList.add('animate__fadeOut')
            setTimeout(() => {
                document.getElementById('custombox').classList.add('is-hidden')
                document.getElementById('custombox').classList.remove('is-loading')

                
            }, 250)
        })
    } else {
        document.getElementById('startcustom').classList.add('is-loading')

        listtxt = document.getElementById('customs').value

        list = listtxt.split('\n')
        
        for (i = 0; i < list.length; i++) {
            list[i] = list[i].split(' ').join()
        }

        list.shuffle()
        list = list.slice(0, 100)

        getNextLvlCustom()

        document.getElementById('custombox').classList.add('animate__fadeOut')
        setTimeout(() => {
            document.getElementById('custombox').classList.add('is-hidden')
            document.getElementById('custombox').classList.remove('is-loading')

            
        }, 250)
    }
    

}

async function getNextLvlCustom() {
    

    leveln = list.slice(0, 1)[0]
    console.log(leveln)
    list = list.slice(1)
    await timeout()
    req = axios.get('https://www.gdbrowser.com/api/level/' + leveln)
    
    level = req.data
    console.log(level)
    
    if (level != undefined) { // If the servers goof up
        listnum++;
        document.getElementById('levels').insertAdjacentHTML('beforeend', 
        `<div class='box is-centered columns animate__animated animate__fadeInUpBig mt-1'>
            <div class="column box-content">
                <h1 class="title">#${listnum}: ${level.name}</h1>
                <h1 class="subtitle"><i>By ${level.author} (${level.id})</i></h1>
            </div>
            <div class="is-narrow column" id="temp">
                <input type="number" class="input" id="percent" placeholder="At least ${nextpercent}%">
                <div class="columns is-mobile mt-1">
                    <div class="column has-text-left">
                        <div class="button is-success" onclick="complete()" id="completion">Complete</div>
                    </div>
                    <div class="column has-text-right">
                        <div class="button is-danger" onclick="finish()">Give Up</div>
                    </div>
                </div>
            </div>
        </div>`)
        copy(level.id)
    } else {
        getNextLvlCustom()
    }
}

async function getNextLvl() {
    if (list.length == 0) {
        return
    }
    leveln = list.slice(0, 1)[0]
    console.log(leveln)
    list = list.slice(1)

    page = Math.floor((leveln-1)/10)

    req = await getPage(page)
    
    level = req[(leveln-1)%10]
    console.log(level)
    
    if (level != undefined) { // If the servers goof up
        listnum++;
        document.getElementById('levels').insertAdjacentHTML('beforeend', 
        `<div class='box is-centered columns animate__animated animate__fadeInUpBig mt-1'>
            <div class="column box-content">
                <h1 class="title">#${listnum}: ${level.name}</h1>
                <h1 class="subtitle"><i>By ${level.author} (${level.id})</i></h1>
            </div>
            <div class="is-narrow column" id="temp">
                <input type="number" class="input" id="percent" placeholder="At least ${nextpercent}%">
                <div class="columns is-mobile mt-1">
                    <div class="column has-text-left">
                        <div class="button is-success" onclick="complete()" id="completion">Complete</div>
                    </div>
                    <div class="column has-text-right">
                        <div class="button is-danger" onclick="finish()">Give Up</div>
                    </div>
                </div>
            </div>
        </div>`)
        copy(level.id)
    } else {
        getNextLvl()
    }
}

function getNextAPI() {

    if (apilist.length == 0) {
        return
    }

    
    level = apilist.slice(0, 1)[0]
    apilist = apilist.slice(1)
    console.log(level)

    
    
    if (level != undefined) { // If the servers goof up
        listnum++;
        if (level.video) {
            let vidID = level.video.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
            document.getElementById('levels').insertAdjacentHTML('beforeend', 
            `<div class='box is-centered animate__animated columns animate__fadeInUpBig mt-1 is-1'>
                    <div class="column is-narrow">
                        <figure class="image">
                            <a href="https://youtu.be/${vidID}" class="yt-thumb"><img src="https://i.ytimg.com/vi/${vidID}/mqdefault.jpg" class="yt-thumb"></a>
                        </figure>
                    </div>
                    <div class="column box-content">
                        <h1 class="title">#${level.position}: ${level.name}</h1>
                        <h1 class="subtitle"><i>By ${level.publisher.name} (Verified by ${level.verifier.name})</i></h1>
                    </div>
                    <div class="is-narrow column" id="temp">
                        <input type="number" class="input" id="percent" placeholder="At least ${nextpercent}%">
                        <div class="columns is-mobile mt-1">
                            <div class="column has-text-left">
                                <div class="button is-success" onclick="completeAPI()" id="completion">Complete</div>
                            </div>
                            <div class="column has-text-right">
                                <div class="button is-danger" onclick="finishAPI()">Give Up</div>
                            </div>
                        </div>
                    </div>
            </div>`)
        } else {
            document.getElementById('levels').insertAdjacentHTML('beforeend', 
            `<div class='box is-centered animate__animated columns animate__fadeInUpBig mt-1 is-1'>
                    <div class="column box-content">
                        <h1 class="title">#${level.position}: ${level.name}</h1>
                        <h1 class="subtitle"><i>By ${level.publisher.name} (${level.verifier.name})</i></h1>
                    </div>
                    <div class="is-narrow column" id="temp">
                        <input type="number" class="input" id="percent" placeholder="At least ${nextpercent}%">
                        <div class="columns is-mobile mt-1">
                            <div class="column has-text-left">
                                <div class="button is-success" onclick="completeAPI()" id="completion">Complete</div>
                            </div>
                            <div class="column has-text-right">
                                <div class="button is-danger" onclick="finishAPI()">Give Up</div>
                            </div>
                        </div>
                    </div>
            </div>`)
        }
        
    }
}

async function showFinalLevels() {
    let element = document.getElementById('show-remaining')
    element.removeAttribute('onclick')
    if (!creator) element.classList.add('is-loading')
    
    str = ''

    setTimeout(async () => { // Idk why but it doesn't set the loading thing correctly unless I do this.
        for (leveln of list) {
            
            nextpercent++;
            
            if (nextpercent > 100) {
                break
            }
    
            page = Math.floor((leveln-1)/10)
            
            page = await getPage(page)
    
            level = page ? page[(leveln-1)%10] : undefined

            
            if (level != undefined) { // If the servers goof up
                listnum++;
                str += `<div class='box is-centered columns animate__animated animate__fadeInUpBig mt-1'>
                    <div class="column box-content">
                        <h1 class="title">#${listnum}: ${level.name}</h1>
                        <h1 class="subtitle"><i>By ${level.author} (${level.id})</i></h1>
                    </div>
                    <div class="is-narrow column has-text-grey-light">
                        ${nextpercent}%
                    </div>
                </div>`
            } else {
                console.log(leveln)
            }
        }

        document.getElementById('levels').insertAdjacentHTML('beforeend', str)
        document.getElementById('rm').classList.add('is-hidden')
    })
}

function showFinalLevelsAPI() {
    let element = document.getElementById('show-remaining')
    element.removeAttribute('onclick')
    if (!creator) element.classList.add('is-loading')
    
    str = ''

    setTimeout(() => { // Idk why but it doesn't set the loading thing correctly unless I do this.
        for (level of apilist) {
            
            nextpercent++;
            
            if (nextpercent > 100) {
                break
            }
            
            if (level != undefined) { // If the servers goof up
                listnum++;
                if (level.video) {
                    let vidID = level.video.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
                    str += `<div class='box is-centered animate__animated columns animate__fadeInUpBig mt-1 is-1'>
                                <div class="column is-narrow">
                                    <figure class="image">
                                        <a href="https://youtu.be/${vidID}" class="yt-thumb"><img src="https://i.ytimg.com/vi/${vidID}/mqdefault.jpg" class="yt-thumb"></a>
                                    </figure>
                                </div>
                                <div class="column box-content">
                                    <h1 class="title">#${level.position}: ${level.name}</h1>
                                    <h1 class="subtitle"><i>By ${level.publisher.name} (Verified by ${level.verifier.name})</i></h1>
                                </div>
                                <div class="is-narrow column has-text-grey-light">
                                    ${nextpercent}%
                                </div>
                            </div>`
                } else {
                    str += `<div class='box is-centered animate__animated columns animate__fadeInUpBig mt-1 is-1'>
                                <div class="column box-content">
                                    <h1 class="title">#${level.position}: ${level.name}</h1>
                                    <h1 class="subtitle"><i>By ${level.publisher.name} (${level.verifier.name})</i></h1>
                                </div>
                                <div class="is-narrow column has-text-grey-light">
                                    ${nextpercent}%
                                </div>
                            </div>`
                }
                
            } else {
                console.log(level)
            }
        }

        document.getElementById('levels').insertAdjacentHTML('beforeend', str)
        document.getElementById('rm').classList.add('is-hidden')
    })
}

async function showFinalLevelsCustom() {
    let element = document.getElementById('show-remaining')
    element.removeAttribute('onclick')
    if (!creator) element.classList.add('is-loading')
    
    str = ''
    pages = {}

    setTimeout(async () => { // Idk why but it doesn't set the loading thing correctly unless I do this.
        for (leveln of list) {
            
            nextpercent++;
            
            if (nextpercent > 100) {
                break
            }
    
            await timeout()
            req = await axios.get('https://www.gdbrowser.com/api/level/' + leveln)
            
            level = req.data

            if (level != undefined) { // If the servers goof up
                listnum++;
                str += `<div class='box is-centered columns animate__animated animate__fadeInUpBig mt-1'>
                    <div class="column box-content">
                        <h1 class="title">#${listnum}: ${level.name}</h1>
                        <h1 class="subtitle"><i>By ${level.author} (${level.id})</i></h1>
                    </div>
                    <div class="is-narrow column has-text-grey-light">
                        ${nextpercent}%
                    </div>
                </div>`
            }
        }

        document.getElementById('levels').insertAdjacentHTML('beforeend', str)
        document.getElementById('rm').classList.add('is-hidden')
    })
}


function complete() {
    if (!creator) document.getElementById('completion').classList.add('is-loading')
    setTimeout(() => {
        percent = parseInt(document.getElementById('percent').value)
        console.log(percent >= nextpercent && percent < 100 && list.length > 0)

        if (percent < nextpercent || percent > 100 || document.getElementById('percent').value == '') {
            document.getElementById('completion').classList.remove('is-loading')
        } else if (percent >= nextpercent && percent < 100 && list.length > 0) {
            nextpercent = percent + 1

            old = document.getElementById('temp')
            old.id = ''
            old.innerHTML = `${percent}%`

            if (custom) {
                getNextLvlCustom()
            } else {
                getNextLvl()
            }
        } else if (percent == 100 || list.length == 0) {
            list.splice(0, 1)
            nextpercent = percent + 1
            listnum++;
            old = document.getElementById('temp')
            old.id = ''
            old.innerHTML = `${percent}%`
    
            finish()
        } 
    })
    
}

function completeAPI() {
    setTimeout(() => {
        percent = parseInt(document.getElementById('percent').value)
        console.log(percent >= nextpercent && percent < 100 && apilist.length > 0)

        if (percent < nextpercent || percent > 100 || document.getElementById('percent').value == '') {
            document.getElementById('completion').classList.remove('is-loading')
        } else if (percent >= nextpercent && percent < 100 && apilist.length > 0) {
            nextpercent = percent + 1

            old = document.getElementById('temp')
            old.id = ''
            old.innerHTML = `${percent}%`

            getNextAPI()
        } else if (percent == 100 || apilist.length == 0) {
            list.splice(0, 1)
            nextpercent = percent + 1
            listnum++;
            old = document.getElementById('temp')
            old.id = ''
            old.innerHTML = `${percent}%`
    
            finishAPI()
        } 
    })
    
}

function finish() {
    old = document.getElementById('temp')
    if (!diffstr.includes('Demon')) {
        diffstr = diffstr + ' Level'
    }

    diffstr = diffstr + 's'

    let buttonorno = ''

    if (nextpercent < 100 && list.length > 0 && custom) {
        buttonorno = `<span id='rm'><br><br><div class='button is-danger' onclick='showFinalLevelsCustom()' id='show-remaining'>Show Remaining Levels (This will take a minute)</div></span>`
    } else if (nextpercent < 100 && list.length > 0) {
        buttonorno = `<span id='rm'><br><br><div class='button is-danger' onclick='showFinalLevels()' id='show-remaining'>Show Remaining Levels (This will take a minute)</div></span>`
    }

    if (old) {
        old.innerHTML = `Given up (${nextpercent}%)`
    }
    document.getElementById('levels').insertAdjacentHTML('beforeend', 
    `<div class='box columns is-centered has-text-centered has-text-vcentered animate__animated animate__fadeInUpBig mt-1 mb-3'>
        <div class='column'>
            <h1 class="title">
                Results -${diffstr}
            </h1>
            <div class="content">
                Number of levels: ${listnum - 1}/${listnum + list.length}<br>
                Highest percent: ${nextpercent - 1}%
                ${buttonorno}
            </div>
        </div>
    </div>`)
}

function finishAPI() {
    old = document.getElementById('temp')

    diffstr = diffstr + 's'

    let buttonorno = ''

    if (nextpercent < 100 && apilist.length > 0) {
        buttonorno = `<span id='rm'><br><br><div class='button is-danger' onclick='showFinalLevelsAPI()' id='show-remaining'>Show Remaining Levels</div></span>`
    }

    if (old) {
        old.innerHTML = `Given up (${nextpercent}%)`
    }
    document.getElementById('levels').insertAdjacentHTML('beforeend', 
    `<div class='box columns is-centered has-text-centered has-text-vcentered animate__animated animate__fadeInUpBig mt-1 mb-3'>
        <div class='column'>
            <h1 class="title">
                Results -${diffstr}
            </h1>
            <div class="content">
                Number of levels: ${listnum - 1}/${listnum + apilist.length}<br>
                Highest percent: ${nextpercent - 1}%
                ${buttonorno}
            </div>
        </div>
    </div>`)
}

function copy(string) {
    var copyText = document.getElementById("copypaste");
    copyText.value = string
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
}

async function getPage(page, iter=0) {
    

    if (!pages.hasOwnProperty(`page-${page}`)) {
        await timeout()

        res = await axios.get(apiquery + '&page=' + page);
        console.log(res.data)
        pages[`page-${page}`] = res.data
        if (pages[`page-${page}`] == -1) {
            if (iter < 5) {
                page = await axios.get(apiquery + '&page=' + page, iter+1)
                return page
            } else {
                document.getElementById('down').innerHTML = 'Hey! GDBrowser is down which means you won\'t be able to use difficulties. You can still use list demons and challenges though!'
                document.getElementById('down').classList.add('is-active')
                throw new Error("Something went badly wrong!");
            }
            
        }

        
    }

    return (pages[`page-${page}`])
}

function timeout() {
    return new Promise(resolve => setTimeout(resolve, TIMEOUT));
}

Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;
 
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
 
    return min + rnd * (max - min);
}

// https://stackoverflow.com/a/6274381/9124836
Object.defineProperty(Array.prototype, 'shuffle', {
    value: function () {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.seededRandom() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
        return this;
    }
});