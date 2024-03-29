import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestoreDb } from ".";
import { Checkout } from "./interfaces";

export const getCheckout = async (checkoutId: string) => {
  const firebaseFirestore = await getFirestoreDb();
  // get checkout from shop
  return await getDoc(doc(firebaseFirestore, "checkouts", checkoutId));
};

export const getShop = async (shopId: string) => {
  const firebaseFirestore = await getFirestoreDb();
  // get shop from firestore
  return await getDoc(doc(firebaseFirestore, "shops", shopId));
};

export const setCheckout = async (checkoutId: string, checkout: Checkout) => {
  const firebaseFirestore = await getFirestoreDb();

  // set shop in firestore
  await setDoc(doc(firebaseFirestore, "checkouts", checkoutId), checkout);
};
