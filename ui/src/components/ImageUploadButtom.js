import React from "react";
import { backend_api } from "../helper/ApiHelper";
import { Fab } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const ImageUploadButtom = () => {
    const fileUploadHandler = (event) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        backend_api.post("/images/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    return (
        <label htmlFor="contained-button-file">
            <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={fileUploadHandler}
            />
            <Fab component="span" size="small">
                <AddAPhotoIcon fontSize="small" />
            </Fab>
        </label>
    );
}

export default ImageUploadButtom;
