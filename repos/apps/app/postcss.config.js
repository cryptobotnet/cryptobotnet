module.exports = {
  plugins: [
    [
      'postcss-preset-env',
      {
        browsers: 'last 2 versions, IE 11, not dead',
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 2,
        features: {
          'nesting-rules': true,
          'custom-properties': { disableDeprecationNotice: true },
          'custom-media-queries': true
        },
        importFrom: ['src/lib/styles/variables.css']
      }
    ]
  ]
}
