module.exports = {
  pages: {
    app: {
      entry: "./src/renderer/main.ts",
      index: "./src/renderer/public/index.html"
    }
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "./src/server/background.ts",
      nodeIntegration: true,
      builderOptions: {
        publish: [
          "github"
        ],
        productName: "Dota 2 Timer",
        npmRebuild: false,
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        win: {
          target: [
            "nsis",
            "portable"
          ]
        },
        linux: {
          target: [
            "AppImage"
          ]
        }
      }
    }
  }
};
