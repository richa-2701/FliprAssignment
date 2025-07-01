import {v2 as cloudinary} from "cloudinary"
const cloudinaryConfig = () =>{
    try{ cloudinary.config({
        cloud_name: 'dcfend16u',
        api_key: '634834656848171',
        api_secret: 'MmzDN91RO2C6BxlvTVQrQaoffh0'
    });
        console.log("Connected with cloudinary");
    }catch(error){
        console.log("Error in connection with cloudinary");
    }
}

export default cloudinaryConfig;