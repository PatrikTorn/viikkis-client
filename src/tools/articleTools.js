import marked from '../editor/helpers/marked'

export const formatTitle = (fi, en) => {
    return en ? `${fi} - ${en}` :  `${fi}`
}

export const lastEdited = (editedAt) => {
    let templates = {
        prefix: "",
        suffix: " sitten",
        seconds: "alle minuutti",
        minute: "noin minuutti",
        minutes: "%d minuuttia",
        hour: "noin tunti",
        hours: "noin %d tuntia",
        day: "päivä",
        days: "%d päivää",
        month: "noin kuukausi",
        months: "%d kuukautta",
        year: "noin vuosi",
        years: "%d vuotta"
    };

    let time = editedAt;

    let template = function(t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

        if (time === '0000-00-00 00:00:00') return 'Ei muokattu';
        time = time.replace(/\.\d+/, ""); // remove milliseconds
        time = time.replace(/-/, "/").replace(/-/, "/");
        time = time.replace(/T/, " ").replace(/Z/, " UTC");
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
        time = new Date(time * 1000 || time);

        let now = new Date();
        let seconds = ((now.getTime() - time) * .001) >> 0;
        let minutes = seconds / 60;
        let hours = minutes / 60;
        let days = hours / 24;
        let years = days / 365;

        return 'muokattu ' + templates.prefix + (
            (seconds < 45 && template('seconds', seconds)) ||
            (seconds < 90 && template('minute', 1)) ||
            (minutes < 45 && template('minutes', minutes)) ||
            (minutes < 90 && template('hour', 1)) ||
            (hours < 24 && template('hours', hours)) ||
            (hours < 42 && template('day', 1)) ||
            (days < 30 && template('days', days)) ||
            (days < 45 && template('month', 1)) ||
            (days < 365 && template('months', days / 30)) ||
            (years < 1.5 && template('year', 1)) ||
            template('years', years)
        ) + templates.suffix;
}


const massReplace = (text, replacementArray) => {
    let results = text;
    for (let [regex, replacement] of replacementArray) {
      results = results.replace(regex, replacement);
    }
    return results;
  }

export const convertMarkdownToHtml = (value, topValue, bottomValue) => {
    return marked(
        topValue + massReplace(value,
            [[/^###(.*)/gm, '<h3>$1</h3>'],
            [/^##(.*)/gm, '<h2>$1</h2>'],
            [/^#(.*)/gm, '<h1>$1</h1>'],
            [/\?\[(.+?)\]\((.*\))/g, '<button class="customButton" href="$2">$1</button>']]
        ) + bottomValue
    )
}

export const createMarkdownTOC = (value) => {
    let _1 = 0;
    let _2 = 0;
    let _3 = 0;
    return value
        .replace('\n\n', '\n')
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0)
        .reduce((acc, str) => {

            if (str.substring(0, 3) === "###") {
                _3 = _3 + 1;
                return acc + `    - [${_1}.${_2}.${_3}. ${str.replace('###', '')}](javascript:void(0);)\n`
            }

            else if (str.substring(0, 2) === "##") {
                _3 = 0;
                _2 = _2 + 1;
                return acc + `  - [${_1}.${_2}. ${str.replace('##', '')}](javascript:void(0);)\n`

            }

            else if (str.substring(0, 1) === "#") {
                _3 = 0;
                _2 = 0;
                _1 = _1 + 1;
                return acc + `- [${_1}. ${str.replace('#', '')}](javascript:void(0);)\n`
            }
            else return acc
        }, [])
}