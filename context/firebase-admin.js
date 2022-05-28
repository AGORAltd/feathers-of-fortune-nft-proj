import { getDatabase } from "firebase/database";

var admin = require("firebase/app");
var serviceAccount = require("../secure.json");

export function startFirebaseAdmin() {
  const config = {
    credential: admin.credential?.cert(serviceAccount),
    databaseURL: "https://feathers-c926c-default-rtdb.firebaseio.com",
  };
  const adminApp = admin.initializeApp(config, "adminDBApp");
  return getDatabase(adminApp);
}

// const { getDatabase } = require("firebase/database");

// var credential = require("../secure.json");

// const adminApp = admin.initializeApp(
//   {
//     credential: admin.credential?.cert(credential),
//     databaseURL: "https://feathers-c926c-default-rtdb.firebaseio.com",
//   },
//   "adminDbApp"
// );

// export const adminDb = getDatabase(adminApp);
