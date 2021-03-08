module.exports = ({ file, options, env }) => ({
  ident: "postcss",
  plugins: [
    require("@cloudsuite/postcss-google-font"),
    require("autoprefixer")({ ...options }),
  ],
});
