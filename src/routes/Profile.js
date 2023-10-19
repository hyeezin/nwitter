import { authService, dbService } from "fbase";
import { collection, getDocs, orderBy, query, where } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

const Profile = ( { refreshUser, userObj } ) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };
    const getMyNweets = async() => {
        const q = await query(collection(dbService, "nweets"), where("cretorId", "==", userObj.uid), orderBy("createdAt"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    }
    const onChange = (event) => {
        const {
            target : { value },
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(userObj,{ displayName : newDisplayName });
        }
        refreshUser();
    }
    useEffect(() => {
        getMyNweets();
    }, [])
    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                    onChange={onChange}
                    type="text" 
                    placeholder="Display name" 
                    value={newDisplayName}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;