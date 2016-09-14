function ucfirst(str) {
    return str.replace(/^[a-z]/, l => l.toUpperCase());
}

function compileRegex(languages) {
    const langSuffix = languages
        .map(l => ucfirst(l))
        .join('|');

    return new RegExp(`(.+)(${langSuffix})$`);
}

function toLowerCase(key /* , value */) {
    return key.toLowerCase();
}

function toPascalCase(key /* , value */) {
    return ucfirst(key);
}

function MultilingualTransformer(languages) {
    languages = languages || this.getOption('multilingual.languages') || [];
    const regex = compileRegex(languages);

    return this.match(regex)
        .group(regex, 1, 2)
        .map(p => p.rename(toLowerCase, toPascalCase));
}

module.exports = MultilingualTransformer;
