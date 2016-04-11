const _ = require('lodash');

const AVAILABLE_LANGUAGES = ['en', 'nl', 'fr'];

function ucfirst(str) {
    return str.replace(/^[a-z]/, l => l.toUpperCase());
}

function compileRegex() {
    const langSuffix = AVAILABLE_LANGUAGES
        .map(l => ucfirst(l))
        .join('|');

    return new RegExp(`(.+)(${langSuffix})$`);
}

function toLowerCase(key, value) {
    return key.toLowerCase();
}

function toPascalCase(key, value) {
    return ucfirst(key);
}

function Multilingual() {
    const regex = compileRegex();

    return this.match(regex)
        .group(regex, 1, 2)
        .map(p => p.rename(toLowerCase, toPascalCase));
}

module.exports = Multilingual;

// .match(matcher)
//  .group(regex, keyIndex, groupIndex)
//  .foreach(p =>
//      p.foreach(
//          p => p.rename(toLowerCase)
//      )
//  )
