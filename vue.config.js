module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ["node-window-manager"],
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
