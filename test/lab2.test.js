const fs = require('fs');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync('../index.html', 'utf-8');
const $ = cheerio.load(htmlContent);

let errors = [];

// 1.1 Check for for two p elements separated by hr
const p = $('p + hr + p');
if (p.length === 0) {
    errors.push('No two <p> elements separated by <hr> found');
}
// 1.2 Check for a link to cpit405.gitlab.io
const link = $('a[href="https://cpit405.gitlab.io"]');
if (link.length === 0) {
    errors.push('No link to https://cpit405.gitlab.io found');
}
// 1.3 Check for a clickable image
const img = $('a img');
if (img.length === 0) {
    errors.push('No clickable image found');
}

// 2. Check for a paragraph with the following child elements: <strong>, <em>, <sup>, <sub>, and <span>
const pElem = $('p');

// Check if <p> has all the required children
const hasStrong = pElem.children('strong').length > 0;
const hasEm = pElem.children('em').length > 0;
const hasSup = pElem.children('sup').length > 0;
const hasSub = pElem.children('sub').length > 0;
const hasSpan = pElem.children('span').length > 0;

if (!hasStrong || !hasEm || !hasSup || !hasSub || !hasSpan) {
    errors.push('<p> element does not have all the required children: <strong>, <em>, <sup>, <sub>, and <span>');
}


// 3. Check for h1, h2, and h3 elements
const h1 = $('h1');
const h2 = $('h2');
const h3 = $('h3');
if (h1.length === 0) {
    errors.push('No <h1> element found');
}
if (h2.length === 0) {
    errors.push('No <h2> element found');
}
if (h3.length === 0) {
    errors.push('No <h3> element found');
}


// 4.1 Check for ul with three li elements
const ul = $('ul');
if (ul.length === 0) {
    errors.push('No <ul> element found');
} else {
    ul.each(function () {
        if ($(this).find('li').length < 3) {
            errors.push('<ul> element does not have at least three <li> elements');
        }
    });
}

// 4.2 Check for ol with three li elements
const ol = $('ol');
if (ol.length === 0) {
    errors.push('No <ol> element found');
} else {
    ol.each(function () {
        if ($(this).find('li').length < 3) {
            errors.push('<ol> element does not have at least three <li> elements');
        }
    });
}

// 4.3 Check for dl element with 2 pairs of dt and dd elements
const dl = $('dl');
if (dl.length === 0) {
    errors.push('No <dl> element found');
} else {
    dl.each(function () {
        if ($(this).find('dt').length !== 2 || $(this).find('dd').length !== 2) {
            errors.push('<dl> element does not have exactly two <dt> and two <dd> elements');
        }
    });
}

// 5. Check for a table with a thead, three th columns, and tbody with three rows and three cells
const table = $('table');
if (table.length === 0) {
    errors.push('No <table> element found');
} else {
    table.each(function () {
        if ($(this).find('thead').length === 0) {
            errors.push('<table> element does not have a <thead> element');
        }
        if ($(this).find('th').length < 3) {
            errors.push('<table> element does not have at least three <th> elements');
        }
        if ($(this).find('tbody').length === 0) {
            errors.push('<table> element does not have a <tbody> element');
        } else {
            if ($(this).find('tbody tr').length < 3) {
                errors.push('<table> element does not have at least three <tr> elements');
            } else {
                $(this).find('tbody tr').each(function () {
                    if ($(this).find('td').length < 3) {
                        errors.push('<tr> element does not have at least three <td> elements');
                    }
                });
            }
        }
    });
}

// 6. Check for a form with two labels, text input, a password input, and submit button
const form = $('form');
if (form.length === 0) {
    errors.push('No <form> element found');
} else {
    if (form.find('label').length < 2) {
        errors.push('<form> element does not have at least two <label> elements');
    }
    if (form.find('input[type="text"]').length === 0) {
        errors.push('<form> element does not have a text input');
    }
    if (form.find('input[type="password"]').length === 0) {
        errors.push('<form> element does not have a password input');
    }
    if (form.find('input[type="submit"]').length === 0) {
        errors.push('<form> element does not have a submit button (<input> element)');
    }
}


if (errors.length > 0) {
    console.error('Error: Your submission did not meet the lab requirements. Errors: ');
    errors.forEach(error => console.error('- ' + error));
    process.exit(1);
} else {
    console.log('Success: Your submission meets the lab requirements');
}