const SNAKE_CASE = 'SNAKE_CASE';
const CAMEL_CASE = 'CAMEL_CASE';

function ucfirst(str) {
    return str.replace(/^[a-z]/, l => l.toUpperCase());
}

function createLanguageSuffix(language, casing) {
    if (casing === CAMEL_CASE)
        language = ucfirst(language);
    else if (casing === SNAKE_CASE)
        language = '_' + language;

    return language;
}

function restoreLanguageSuffix(suffix, casing) {
    if (casing === CAMEL_CASE)
        suffix = suffix.toLowerCase();
    else if (casing === SNAKE_CASE)
        suffix = suffix.replace(/^_/, '');

    return suffix;
}

function compileRegex(languages, suffixer) {
    const langSuffix = languages
        .map(l => suffixer(l))
        .join('|');

    return new RegExp(`(.+)(${langSuffix})$`);
}

function createRestorer(casing) {
    return function(suffix) {
        return restoreLanguageSuffix(suffix, casing);
    };
}

function createSuffixer(casing) {
    return function(language) {
        return createLanguageSuffix(language, casing);
    };
}

function MultilingualTransformer(languages, languageCase) {
    languages = languages || this.getOption('multilingual.languages') || [];
    languageCase = languageCase || this.getOption('multilingual.languageCase') || CAMEL_CASE;

    const suffixer = createSuffixer(languageCase);
    const restorer = createRestorer(languageCase);
    const regex = compileRegex(languages, suffixer);

    return this.match(regex)
        .group(regex, 1, 2)
        .map(p => p.rename(restorer, suffixer));
}

MultilingualTransformer.SNAKE_CASE = SNAKE_CASE;
MultilingualTransformer.CAMEL_CASE = CAMEL_CASE;

module.exports = MultilingualTransformer;
