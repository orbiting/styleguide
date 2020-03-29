import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'

import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'

import { join } from 'path'

export default [['lib.js'], ['chart.js']].map(
  ([entryFile, locale, outputFile]) => ({
    input: join('src', entryFile),
    output: {
      file: join('build', outputFile || entryFile),
      format: 'amd'
    },
    plugins: [
      json(),
      babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**',
        presets: [
          '@babel/react',
          [
            '@babel/env',
            {
              targets: {
                browsers: ['last 2 versions', 'safari >= 7']
              },
              modules: false
            }
          ]
        ]
      }),
      alias({
        entries: [{ find: 'isomorphic-unfetch', replacement: 'unfetch' }]
      }),
      builtins(),
      resolve(),
      commonjs({
        namedExports: {
          'node_modules/body-scroll-lock/lib/bodyScrollLock.min.js': [
            'disableBodyScroll',
            'enableBodyScroll'
          ],
          'node_modules/react/index.js': [
            'Children',
            'createRef',
            'Component',
            'PureComponent',
            'createContext',
            'forwardRef',
            'lazy',
            'memo',
            'useCallback',
            'useContext',
            'useEffect',
            'useImperativeHandle',
            'useDebugValue',
            'useLayoutEffect',
            'useMemo',
            'useReducer',
            'useRef',
            'useState',
            'Fragment',
            'StrictMode',
            'Suspense',
            'createElement',
            'cloneElement',
            'createFactory',
            'isValidElement',
            'version',
            'unstable_ConcurrentMode',
            'unstable_Profiler'
          ]
        }
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': JSON.stringify({})
      }),
      uglify()
    ].filter(Boolean)
  })
)
