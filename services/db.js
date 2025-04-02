import { getFirestore, setDoc, doc, getDoc, deleteDoc, getDocs, collection } from "@firebase/firestore";
import { initializeApp } from "@firebase/app";
import { randomBytes } from "crypto";
import { firebaseConfig } from "../configuration.js";
import logger from "../helpers/log.js";
import util from "util";
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
/**
 * USERS is an object that provides methods for performing CRUD (Create, Read, Update, Delete)
 * operations on user data in the Firestore database.
 */
export const USERS = {
    /**
     * Adds a new user to the database.
     *
     * @param {IUSER} data - An object containing the user information to be added.
     * Must include the properties `sender` and `name`.
     * @returns {Promise<boolean>} Returns `true` if the user was successfully added,
     * or `false` if an error occurred.
     */
    add: async (data) => {
        try {
            await setDoc(doc(db, "users", data.sender), {
                ID: _ID(),
                name: data.name,
                sender: data.sender.split("@")[0],
                premium: false
            });
            return true;
        }
        catch (e) {
            logger.error(util.inspect(e));
            return false;
        }
    },
    /**
     * Retrieves user data based on the sender ID.
     *
     * @param {string} sender - The sender ID used to look up the user in the database.
     * @returns {Promise<IUSER | null>} Returns the user data if it exists,
     * or `null` if the user does not exist or an error occurred.
     */
    get: async (sender) => {
        try {
            const docSnap = await getDoc(doc(db, "users", sender));
            if (docSnap.exists()) {
                return docSnap.data();
            }
            else {
                return null;
            }
        }
        catch (e) {
            logger.error(util.inspect(e));
            return null;
        }
    },
    /**
     * Updates an existing user's data in the database.
     *
     * @param {string} sender - The sender ID of the user to be updated.
     * @param {Partial<IUSER>} data - An object containing the properties to be updated.
     * @returns {Promise<boolean>} Returns `true` if the user was successfully updated,
     * or `false` if an error occurred.
     */
    patch: async (sender, data) => {
        try {
            await setDoc(doc(db, "users", sender), data, { merge: true });
            return true;
        }
        catch (e) {
            logger.error(util.inspect(e));
            return false;
        }
    },
    /**
     * Deletes a user from the database.
     *
     * @param {string} sender - The sender ID of the user to be deleted.
     * @returns {Promise<boolean>} Returns `true` if the user was successfully deleted,
     * or `false` if an error occurred.
     */
    delete: async (sender) => {
        try {
            await deleteDoc(doc(db, "users", sender));
            return true;
        }
        catch (e) {
            logger.error(util.inspect(e));
            return false;
        }
    },
    /**
     * Checks if a user exists in the database.
     *
     * @param {string} sender - The sender ID of the user to check.
     * @returns {Promise<boolean>} Returns `true` if the user exists,
     * or `false` if the user does not exist or an error occurred.
     */
    exists: async (sender) => {
        try {
            const docSnap = await getDoc(doc(db, "users", sender));
            return docSnap.exists();
        }
        catch (e) {
            logger.error(util.inspect(e));
            return false;
        }
    },
    getAll: async () => {
        try {
            const users = [];
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach(doc => {
                users.push(doc.data());
            });
            return users;
        }
        catch (e) {
            logger.error(util.inspect(e));
            return [];
        }
    }
};
/**
 * Generates a random ID string of the specified length.
 *
 * @param {number} length - The length of the ID string to generate. Defaults to 10
 * @returns {string} The generated ID string.
 *
 */
export const _ID = (length = 10) => {
    return randomBytes(length).toString("hex").toUpperCase();
};
