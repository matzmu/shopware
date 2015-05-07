module.exports = function (grunt) {
    grunt.option.init({
        shopId: 1
    });

    var file = '../web/cache/config_' + grunt.option('shopId') + '.json',
        config = grunt.file.readJSON(file),
        lessTargetFile = {},
        jsFiles = [],
        jsTargetFile = {},
        content = '',
        variables = {
            'font-directory': '"../../themes/Frontend/Responsive/frontend/_public/src/fonts"',
            'OpenSansPath': '"../../themes/Frontend/Responsive/frontend/_public/vendors/fonts/open-sans-fontface"'
        };

    lessTargetFile['../' + config.lessTarget] = '../web/cache/all.less';

    config['js'].forEach(function (item) {
        jsFiles.push('../' + item);
    });
    jsTargetFile['../' + config.jsTarget] = jsFiles;

    config['less'].forEach(function (item) {
        content += '@import "../' + item + '";';
        content += "\n";
    });
    grunt.file.write('../web/cache/all.less', content);

    for (var key in config.config) {
        variables[key] = config.config[key];
    }

    grunt.initConfig({
        uglify: {
            production: {
                options: {
                    compress: true,
                    mangleProperties: true,
                    preserveComments: false
                },
                files: jsTargetFile
            },
            development: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true,
                    preserveComments: 'all'
                },
                files: jsTargetFile
            }
        },
        less: {
            production: {
                options: {
                    compress: true,
                    modifyVars: variables
                },
                files: lessTargetFile
            },
            development: {
                options: {
                    modifyVars: variables,
                    dumpLineNumbers: 'all',
                    sourceMap: true,
                    sourceMapFileInline: true
                },
                files: lessTargetFile
            }
        },
        watch: {
            less: {
                files: [
                    '../engine/Shopware/Plugins/**/*.less',
                    '../themes/Frontend/**/*.less'
                ],
                tasks: ['less:development']
            },
            js: {
                files: [
                    '../engine/Shopware/Plugins/**/*.js',
                    '../engine/Shopware/Plugins/**/src/js/**/*.js'
                ],
                tasks: ['uglify']
            }
        },
        jshint: {
            options: {
                browser: true,
                force: true,
                globals: {
                    jQuery: true,
                    StateManager: true
                }
            },
            src: [
                'Gruntfile.js',
                '../themes/Frontend/**/_public/src/js/*.js',
                '../engine/Shopware/Plugins/**/src/js/**/*.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('production', [ 'jshint', 'less:production', 'uglify:production' ]);
    grunt.registerTask('default', [ 'less:development', 'uglify:development', 'watch' ]);
};
