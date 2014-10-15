Package.describe({
    summary: "simple upload avatar package for meteor",
    version: "1.1.0",
    name: "particle4dev:upload-avatar",
    git: "https://github.com/particle4dev/upload-avatar-meteor.git"    
});

// meteor test-packages ./
var both = ['client', 'server'];
var client = ['client'];
var server = ['server'];

Package.on_use(function (api) {
    api.versionsFrom("METEOR@0.9.3");

    api.use(['underscore', 'accounts-base', 'accounts-password'], both);
    api.use(['jquery', 'templating', 'mizzao:bootstrap-3@3.2.0_1'], client);

    //add file
    api.add_files([
        'src/helpers.js'
    ], both);

    api.add_files([
        'src/vendor/imgareaselect/border-anim-h.gif',
        'src/vendor/imgareaselect/border-anim-v.gif',
        'src/vendor/imgareaselect/imgareaselect-animated.css',
        'src/vendor/imgareaselect/jquery.imgareaselect.pack.js',
        'src/client.js',
        'src/template/editYourAvatarModal.html',
        'src/template/editYourAvatarModal.js',
        'src/template/editYourAvatarModal.css'
    ], client);

    api.add_files([
        'src/server.js',
    ], server);

    if (typeof api.export !== 'undefined') {
        //api.export('DEBUGX', both);
    }
});

Package.on_test(function (api) {
  api.use(['particle4dev:upload-avatar','accounts-password','tinytest'], both);
  api.add_files('tests/client.js', 'client');
  api.add_files('tests/server.js', 'server');
});