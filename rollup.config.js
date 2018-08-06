import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { uglify } from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/lozad.js',
    output: {
      name: pkg.name,
      file: pkg.main,
      format: 'umd'
    },
    plugins: [
      license({
        banner:
          '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= moment().format("YYYY-MM-DD") + "\\n" %>' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= moment().format("YYYY") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n\n'
      }),
      babel({
        babelrc: false,
        presets: [
          [
            'env',
            {
              modules: false
            }
          ],
          'stage-0'
        ]
      }),
      filesize()
    ]
  },
  {
    input: 'src/lozad.js',
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      license({
        banner:
          '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= moment().format("YYYY-MM-DD") + "\\n" %>' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= moment().format("YYYY") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n\n'
      }),
      babel({
        babelrc: false,
        presets: [
          [
            'env',
            {
              modules: false
            }
          ],
          'stage-0'
        ]
      }),
      uglify({
        output: {
          comments: true
        }
      }),
      filesize()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/lozad.js',
    output: [
      // { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      license({
        banner:
          '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= moment().format("YYYY-MM-DD") + "\\n" %>' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= moment().format("YYYY") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n\n'
      }),
      filesize()
    ]
  }
];
