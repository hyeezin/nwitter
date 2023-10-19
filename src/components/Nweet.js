import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want delete this nweet?");
        console.log(ok);
        if(ok){
            //delete nweet
            await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
            await deleteObject(ref(storageService, nweetObj.attachmentUrl));
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async(event) => {
        event.preventDefault();
        console.log(nweetObj, newNweet);
        await updateDoc(doc(dbService, `nweets/${nweetObj.id}`),{
            text: newNweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const { 
            target : { value },
        } = event;
        setNewNweet(value);
    }
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input 
                            type="text"
                            value={newNweet}
                            placeholder="Edit your nweet" 
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancle</button>
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img src={nweetObj.attachmentUrl}  width="50px" height="50px" />
                    )}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Nweet</button>
                            <button onClick={toggleEditing}>edit Nweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Nweet;