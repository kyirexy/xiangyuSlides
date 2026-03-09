const fs = require('fs');
let html = fs.readFileSync('public/create.html', 'utf8');

// Fix the sendMessage function - remove auth check
html = html.replace(/if \(!state\.user\) \{\s*\$('authModal'\)\.classList\.add\('active'\);[\s\S]*?return;[\s\S]*?\}/,
    '// No auth required - local mode');

// Also remove the usage limit check since it's unlimited now
html = html.replace(/if \(!state\.user\.isPro && state\.usage\.used >= state\.usage\.limit\) \{\s*showToast\('本月次数已用完，请升级付费版', 'error'\);[\s\S]*?return;[\s\S]*?\}/,
    '// Unlimited usage');

// Clean up
html = html.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync('public/create.html', html);
console.log('Fixed sendMessage!');
