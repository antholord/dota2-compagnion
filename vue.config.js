module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "./src/server/main.ts",
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
