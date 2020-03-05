class TimerEndOfDay {
    _date = new Date();

    constructor(elementId) {
        this.msg = ('0' + (23 - this._date.getHours())).slice(-2);
        this.element = document.getElementById(elementId);
    }

    getHours() {
        this.element.className = 'section-time';
        this.element.innerHTML = "<span class='locale-text_wrapper-section_time-count toTranslate'>" +
            "- EXPIRES IN </span> " +
            this.msg +
            " <span class='locale-text_wrapper-section_time-count toTranslate'> HOURS -</span>";
    }
}

class BlockSizeDependFromDPI {
    constructor() {
        this.windSize = this.WindSize();
        this.fontSize = this.getMainFontSize();
    }

    WindSize() {
        let dpi_define_element = document.createElement('div');
        dpi_define_element.setAttribute('id', 'testdiv');
        dpi_define_element.setAttribute('style', "height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;");
        let body = document.getElementsByTagName('body')[0];
        body.insertBefore(dpi_define_element, body.childNodes[0]);
        let screen = {
            dpi_x: dpi_define_element.offsetHeight * devicePixelRatio,
            dpi_y: dpi_define_element.offsetWidth * devicePixelRatio,
            devicePixelRatio: devicePixelRatio
        };
        body.removeChild(dpi_define_element);
        return screen;
    }

    getMainFontSize() {
        let re = /(dpi=)\d+/;
        let re_num = /\d+/;
        let langInGet = window.location.search.match(re);
        if (langInGet == null) {
            return this.windSize.dpi_x * 100 / 96;
        }
        return re_num.exec(langInGet)[0];
    }

    setMainFontSize(elementId) {
        this.element = document.getElementById(elementId);
        this.element.style.cssText = 'font-size: ' + this.fontSize + '%;';
    }
}

/*lang*/
class Lang {
    lang;

    constructor(defaultLang) {
        this.lang = defaultLang;
    }

    get lang() {
        return this.lang;
    }

    set lang(value) {
        this.lang = value;
    }
}

class CookieLang extends Lang {
    constructor(key) {
        super();
        this.lang = document.cookie.match(new RegExp(
            "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));// return array
        if (this.lang !== null) {
            this.lang = this.lang[1];// return string
        } else {
            this.lang = false;
        }
    }
}

class QueryLang extends Lang {
    constructor() {
        super();
        let regForLang = /(lang=)[a-z]{2}/;
        this.lang = regForLang.exec(window.location.href);// return array
        if (this.lang !== null) {
            this.lang = this.lang[0].substr(5);// return string
        } else {
            this.lang = false;
        }
    }
}

class BrowserLang extends Lang {
    constructor() {
        super();
        this.lang = navigator.languages || navigator.userLanguage;// return array
        if (!!this.lang) {
            this.lang = this.lang[1];// return string
        } else {
            this.lang = false;
        }
    }
}

class DataLang {
    constructor(url) {
        this.url = url;
    }
//scope - it is object thats given in callback. Langarray - it is a json file from server
    getLocale(scope, callback) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200) {
                let langArray = JSON.parse(httpRequest.responseText);
                callback.call(scope, langArray);
            }
        };
        httpRequest.open('GET', this.url);
        httpRequest.onerror = function () {
            console.log('error of XMLHttpRequest');
        };
        httpRequest.send();
    }
}

class LangManager {
    cookieKey = 'lang';
    defaultLang = 'en';
    url = '../lang/locale.json';
    constructor() {
        let cookieLang = new CookieLang(this.cookieKey);
        let queryLang = new QueryLang();
        let browserLang = new BrowserLang();
        if (cookieLang.lang) {
            this.lang = cookieLang.lang;
            return;
        }
        if (queryLang.lang) {
            this.lang = queryLang.lang;
            return;
        }
        if (browserLang.lang) {
            this.lang = browserLang.lang;
            return;
        }
        this.lang = this.defaultLang;
        console.log('defaultLang: ');
    }

    get() {
        console.log(this);
    }

    translate() {
        document.cookie = encodeURIComponent(this.cookieKey) + "=" + encodeURIComponent(this.lang);//immediately write the lang in cookie
        //this function launch translate in callback of ajax query
        let changeLang = function (data) {
            if (typeof this !== "object") {
                console.log('error of changeLang');
                return;
            }
            let locale = data[this.lang];
            if (!locale) {
                return console.log("no found language");
            } else {
                newLang('.toTranslate', data[this.lang]);
            }
            function newLang(className, jsonObject) {
                let domElements = document.querySelectorAll('.toTranslate');
                for (let key in jsonObject) {
                    for (let i = 0; i < domElements.length; i++) {
                        if (domElements[i].textContent == key) {
                            domElements[i].textContent = jsonObject[key];
                        }
                    }
                }
            }
        }
        this.DataLang = new DataLang(this.url);
        this.DataLang.getLocale(this, changeLang);
    }
}

/*--------Start 3d animation ------------------------------------------------------------------------------------*/
const cards = document.querySelector(".cards");
const images = document.querySelectorAll(".card__img");
const range = 20;
// const calcValue = (a, b) => (((a * 100) / b) * (range / 100) -(range / 2)).toFixed(1);
const calcValue = (a, b) => (a/b*range-range/2).toFixed(1); // thanks @alice-mx

let timeout;
document.addEventListener('mousemove', ({x, y}, event) => {
    if (timeout) {
        window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(() => {
        const yValue = calcValue(y, window.innerHeight);
        const xValue = calcValue(x, window.innerWidth);

        cards.style.transform = `rotateX(${yValue}deg) rotateY(${xValue}deg)`;

        [].forEach.call(images, (image) => {
            image.style.transform = `translateX(${-xValue}px) translateY(${yValue}px)`;
        });
    })
}, false);

// class MouseMoveAnimation {
//     cards = document.querySelector(".cards");
//     images = document.querySelectorAll(".card__img");
//     range = 20;
//     calcValue(a, b) { (a/b*range-range/2).toFixed(1)}
//     timeout;
//     constructor() {
//         document.addEventListener('mousemove', ({x, y}) => {
//             if (this.timeout) {
//                 window.cancelAnimationFrame(this.timeout);
//             }
//
//             this.timeout = window.requestAnimationFrame(() => {
//                 const yValue = this.calcValue(y, window.innerHeight);
//                 const xValue = this.calcValue(x, window.innerWidth);
//
//                 this.cards.style.transform = `rotateX(${yValue}deg) rotateY(${xValue}deg)`;
//
//                 [].forEach.call(this.images, (image) => {
//                     image.style.transform = `translateX(${-xValue}px) translateY(${yValue}px)`;
//                 });
//             })
//         }, false);
//     }
// }
// const animate = new MouseMoveAnimation();
/*--------End 3d animation ------------------------------------------------------------------------------------*/