Moralis.Cloud.define("helloWorld", (request) => {
  return "Hello World";
});

Moralis.Cloud.define(
  "getUsersConnectedWallets",
  async (request) => {
    const logger = Moralis.Cloud.getLogger();

    try {
      const userHandle = request.params.userHandle;

      // get user handle object for corresponding userHandle
      const query = new Moralis.Query("UserHandle");
      query.equalTo("handle", userHandle);
      const userHandleObjs = await query.find({ useMasterKey: true });

      //   logger.info("Query Result: ", userHandleObjs);
      //   return userHandleObjs;

      //   return userHandleObjs[0].get("connectedUsers");

      const connectedUsers = userHandleObjs[0].get("connectedUsers");
      const connectedWalletsArr = [];

      // iterate through user objects
      //   for (let userObj of connectedUsers) {
      //     if (!userObj.isDataAvailable()) {
      //       await userObj.fetch({ useMasterKey: true });
      //     }

      //     if (userObj.has("accounts")) {
      //       connectedWalletsArr.push(userObj.get("accounts")[0]);
      //     }
      //   }

      // iterate through user ids
      for (let userId of connectedUsers) {
        const userObj = new Moralis.User();
        userObj.id = userId;
        await userObj.fetch({ useMasterKey: true });

        if (userObj.has("accounts")) {
          connectedWalletsArr.push(userObj.get("accounts")[0]);
        }
      }

      return [...new Set(connectedWalletsArr)];
    } catch (err) {
      logger.error("Error in getUsersConnectedWallets!");
      logger.error(err);
      throw err;
    }
  },
  {
    fields: ["userHandle"],
    requireUser: true,
  }
);
