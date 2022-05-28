import { getDatabase } from "firebase/database";
import admin from "firebase-admin";
import credential from "../secure.json";

export function startFirebaseAdmin() {
  let adminApp;
  if (!admin.apps.length) {
    try {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(credential),
      });
    } catch (error) {
      console.log("Firebase admin initialization error", error.stack);
    }
  }

  return getDatabase(adminApp);
}
