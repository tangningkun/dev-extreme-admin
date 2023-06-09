module.exports = {
    printWidth: 200, // 单行代码的最大长度
    tabWidth: 4, // 指定缩进的长度
    useTabs: false,
    semi: true,
    vueIndentScriptAndStyle: true,
    singleQuote: true,
    quoteProps: 'as-needed', // 只在需要的时候给对象属性加引号
    bracketSpacing: true,
    trailingComma: 'es5', // trailingComma 的默认值是 es5，所以会在对象最后一个属性加上逗号。
    arrowParens: 'always',
    insertPragma: false, // 是否在文件顶部插入一个 format 注释
    htmlWhitespaceSensitivity: 'strict',
    proseWrap: 'never',
    endOfLine: 'lf',
};
