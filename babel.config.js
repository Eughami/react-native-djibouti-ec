module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src/'],
          alias: {
            '@components': './src/components',
            '@services': './src/services',
            '@views': './src/views',
            '@constants': './src/constants',
            '@zustand': './src/zustand',
            '@assets': './assets',
            '@navigation': './src/navigation',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
