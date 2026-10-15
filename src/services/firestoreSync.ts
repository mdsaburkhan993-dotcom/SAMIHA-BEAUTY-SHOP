import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase.js';

export async function uploadRecordToFirestore(collectionName: string, id: string, data: Record<string, any>) {
  try {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      syncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    // If not signed in or permissions error, log context
    console.warn(`Firestore sync note for ${collectionName}/${id}:`, error);
    return false;
  }
}

export async function fetchCollectionFromFirestore(collectionName: string): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn(`Could not fetch ${collectionName} from Firestore:`, error);
    return [];
  }
}

export function subscribeToCollection(collectionName: string, onUpdate: (items: any[]) => void) {
  try {
    return onSnapshot(
      collection(db, collectionName),
      snapshot => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      error => {
        console.warn(`Firestore snapshot subscription on ${collectionName}:`, error);
      }
    );
  } catch (err) {
    console.warn(`Failed to attach listener on ${collectionName}:`, err);
    return () => {};
  }
}
