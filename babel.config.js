module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './src/components',
            '@services': './src/services',
            '@views': './src/views',
            '@constants': './src/constants',
            '@zustand': './src/zustand',
            '@assets': './assets',
            '@navigation': './src/navigation',
            '@lang': './src/lang',
          },
        },
      ],
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          blacklist: null, // DEPRECATED
          whitelist: null, // DEPRECATED
          safe: true,
          allowUndefined: false,
          verbose: false,
        },
      ],
    ],
  }
}
