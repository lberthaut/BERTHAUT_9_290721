import {mockBills} from "./firebase.js";

export const errorPage404= async ()=>{
    await mockBills.post.mockImplementationOnce(()=>
        Promise.reject(new Error("Erreur 404"))
        );
};

export const errorPage500= async ()=>{
    await mockBills.post.mockImplementationOnce(()=>
        Promise.reject(new Error("Erreur 500"))
        );
};