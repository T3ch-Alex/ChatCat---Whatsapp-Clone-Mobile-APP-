import { View, Text } from 'react-native'
import React, { useEffect, useContext } from 'react'
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { auth, db } from "../firebase";
import GlobalContext from '../context/Context';
import ContactsFloatingIcon from '../components/ContactsFloatingIcon';

export default function Chats() {
  const { currentUser } = auth;
  const { rooms, setRooms } = useContext(GlobalContext);
  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser.email)
  )

  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => { //onSnapshot listens to the changes in the document
      const parsedChats = querySnapshot.docs //querySnapshot will contain the docs that can be accessed via an array
        .filter((doc) => doc.data().lastMessage) //.filter() that will only show a chat that already has a message
        .map((doc) => ({ //.map() a new array of the data we really want
          ... doc.data(), //The ... dots will "copy" or "spread" all of the doc data (because it already has some) but we will only change the id and userB
          id: doc.id,
          userB: doc //.find() a user that is not the currentUser
            .data()
            .participants.find((p) => p.email !== currentUser.email),
        }));
        setRooms(parsedChats);
    });
    return () => unsubscribe();
  }, [])
  return (
    <View style={{flex: 1, padding:5, paddingRight: 10}}>
      <Text>Chats</Text>
      <ContactsFloatingIcon />
    </View>
  );
}