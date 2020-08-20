const api = 'https://www.gdbrowser.com/api/search/'
let apiquery = ''
let list = []
let listnum = 0
let nextpercent = 1
let diffstr = ""
let custom = false
let creator = false

let pages = {}

function startroulette() {
    const radios = document.getElementsByName('difficulty');
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
    } else {
        document.getElementById('start').classList.add('is-loading')

        setTimeout(() => { // Because js is weird
            apiquery = api + query;

            req = getPage(0)
            
            

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

function startcustom() {

    if (creator) {
        creatortxt = document.getElementById('customs').value
        document.getElementById('startcustom').classList.add('is-loading')

        setTimeout(() => { // Because js is weird
            req = new XMLHttpRequest();
            req.open("GET", 'https://www.gdbrowser.com/api/profile/' + creatortxt, false);
            req.send(null);

            creatortxt = JSON.parse(req.responseText)['accountID']

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
                req = getPage(page)
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

function getNextLvlCustom() {
    

    leveln = list.slice(0, 1)[0]
    console.log(leveln)
    list = list.slice(1)

    req = new XMLHttpRequest();
    req.open("GET", 'https://www.gdbrowser.com/api/level/' + leveln, false);
    req.send(null);
    
    level = JSON.parse(req.responseText)
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

function getNextLvl() {
    if (list.length == 0) {
        return
    }
    leveln = list.slice(0, 1)[0]
    console.log(leveln)
    list = list.slice(1)

    page = Math.floor((leveln-1)/10)

    req = getPage(page)
    
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

function showFinalLevels() {
    let element = document.getElementById('show-remaining')
    element.removeAttribute('onclick')
    if (!creator) element.classList.add('is-loading')
    
    str = ''

    setTimeout(() => { // Idk why but it doesn't set the loading thing correctly unless I do this.
        for (leveln of list) {
            
            nextpercent++;
            
            if (nextpercent > 100) {
                break
            }
    
            page = Math.floor((leveln-1)/10)
    
            page = getPage(page)
    
            level = page[(leveln-1)%10]
            
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

function showFinalLevelsCustom() {
    let element = document.getElementById('show-remaining')
    element.removeAttribute('onclick')
    if (!creator) element.classList.add('is-loading')
    
    str = ''
    pages = {}

    setTimeout(() => { // Idk why but it doesn't set the loading thing correctly unless I do this.
        for (leveln of list) {
            
            nextpercent++;
            
            if (nextpercent > 100) {
                break
            }
    
            req = new XMLHttpRequest();
            req.open("GET", 'https://www.gdbrowser.com/api/level/' + leveln, false);
            req.send(null);
            
            level = JSON.parse(req.responseText)

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

        if (percent < nextpercent || percent > 100) {
            alert('Nice try lmao')
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

function finish() {
    old = document.getElementById('temp')
    if (!diffstr.includes('Demon')) {
        diffstr = diffstr + ' Level'
    }

    diffstr = diffstr + 's'

    let buttonorno = ''

    if (nextpercent < 100 && list.length > 0 && custom) {
        buttonorno = `<span id='rm'><br><br><div class='button is-danger' onclick='showFinalLevelsCustom()' id='show-remaining'>Show Remaining Levels (this may take a while)</div></span>`
    } else if (nextpercent < 100 && list.length > 0) {
        buttonorno = `<span id='rm'><br><br><div class='button is-danger' onclick='showFinalLevels()' id='show-remaining'>Show Remaining Levels (this may take a while)</div></span>`
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

function copy(string) {
    var copyText = document.getElementById("copypaste");
    copyText.value = string
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
}

function getPage(page) {

    if (!pages.hasOwnProperty(`page-${page}`)) {
        req = new XMLHttpRequest();
        req.open("GET", apiquery + '&page=' + page, false);
        req.send(null);

        pages[`page-${page}`] = JSON.parse(req.responseText)
        if (pages[`page-${page}`] == -1) {
            pages[`page-${page}`] = [];
        }
    }

    return (pages[`page-${page}`])
}

// https://stackoverflow.com/a/6274381/9124836
Object.defineProperty(Array.prototype, 'shuffle', {
    value: function () {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
        return this;
    }
});

