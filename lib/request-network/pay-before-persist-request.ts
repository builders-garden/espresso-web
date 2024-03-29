// import { RequestNetwork } from "@requestnetwork/request-client.js";
// import { normalizeKeccak256Hash } from "@requestnetwork/utils";
// import { createRequestParameters } from "./create-request";

// export const UsePayBeforePersistRequest = async (
//   requestNetwork: RequestNetwork,
//   payerAddress: string
// ) => {
//   const requestCreateParameters = createRequestParameters(requestParams);
//   console.log("Getting request client...");

//   const { requestParameters, topics, paymentNetwork } =
//     await requestNetwork.prepareRequestParameters(parameters);

//   // Contents of RequestLogic.createRequest()

//   const { action, requestId, hashedTopics } =
//     await requestNetwork.requestLogic.createCreationActionRequestIdAndTopics(
//       requestParameters,
//       payerAddress,
//       topics
//     );
//   RequestLogicCore.applyActionToRequest(
//     null,
//     action,
//     Date.now(),
//     requestNetwork.advancedLogic
//   ); // This line is impossible because advancedLogic is still private

//   // Contents of TransactionManager.persistTransaction()

//   let transaction: TransactionTypes.IPersistedTransaction = {};
//   let channelEncryptionMethod: string | undefined;

//   // compute hash to add it to the topics
//   const hash = MultiFormat.serialize(
//     normalizeKeccak256Hash(JSON.parse(transactionData))
//   );

//   // Need to create a new channel (only the first transaction can have the hash equals to the channel id)
//   if (channelId === hash) {
//     if (encryptionParams.length === 0) {
//       // create a clear channel
//       transaction = await TransactionsFactory.createClearTransaction(
//         transactionData
//       );
//     } else {
//       // create an encrypted channel
//       transaction =
//         await TransactionsFactory.createEncryptedTransactionInNewChannel(
//           transactionData,
//           encryptionParams
//         );
//       channelEncryptionMethod = transaction.encryptionMethod;
//     }

//     // Add the transaction to an existing channel
//   } else {
//     const resultGetTx = await this.dataAccess.getTransactionsByChannelId(
//       channelId
//     );

//     const { channelKey, channelType, encryptionMethod } =
//       await this.channelParser.getChannelTypeAndChannelKey(
//         channelId,
//         resultGetTx.result.transactions
//       );

//     if (channelType === TransactionTypes.ChannelType.UNKNOWN) {
//       throw new Error(`Impossible to retrieve the channel: ${channelId}`);
//     }

//     if (channelType === TransactionTypes.ChannelType.CLEAR) {
//       // add the transaction to a clear channel
//       transaction = await TransactionsFactory.createClearTransaction(
//         transactionData
//       );
//     }

//     if (channelType === TransactionTypes.ChannelType.ENCRYPTED) {
//       if (!channelKey) {
//         throw new Error(
//           `Impossible to decrypt the channel key of: ${channelId}`
//         );
//       }

//       transaction = await TransactionsFactory.createEncryptedTransaction(
//         transactionData,
//         channelKey,
//         encryptionParams
//       );

//       channelEncryptionMethod = encryptionMethod;
//     }
//   }
// };
