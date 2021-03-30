module.exports = {
  //https://cli.vuejs.org/config/
  productionSourceMap: false,
  //@vue/cli-plugin-pwa config
  pwa: {
    name: "Personal Assistant Suite",
    themeColor: "#cec0a1",
    msTileColor: "#17161c",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon-152x152.png",
      maskIcon: "",
      msTileImage: "img/icons/msapplication-144x144.png"
    },
    //https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
    workboxOptions: {
      importWorkboxFrom: "local",
      importScripts: ["sw-customconfig.js"],
      navigateFallback: "/index.html",
      navigateFallbackBlacklist: [],
      exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/,/img\/icons/,/img\/video/,/^robots/,/^sitemap/],
      runtimeCaching: []
    }
  }
};
