import firebase from "./firebase.js";

export const errorPage404= ()=>{
    firebase.post.mockImplementationOnce(()=>
        Promise.reject(new Error("Erreur 404"))
        );
};

export const errorPage500= ()=>{
    firebase.post.mockImplementationOnce(()=>
        Promise.reject(new Error("Erreur 500"))
        );
};