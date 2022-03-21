import React, { useState , useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom'
import './dashboard.css';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { TextField } from '@mui/material';
import { Progress } from 'antd';

export default function DashboardPage() {
  
  const navigate = useNavigate();

  const [file, setFile] = useState({});
  const [uploadPercetage, setUploadPercentage] = useState(0);
  const inputFiles = useRef(null);
  
  const handleFile = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
    
  }

   useEffect(() => {
    if (!localStorage.auth_token) {
      navigate('/');
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

   const uploadToAwsS3 = async () => {
    console.log("get_url_", "aaye hai")
    const { data } = await axios.post("/api/user_uploads/file", {
      fileName: file.name,
      fileType: file.type,
      directory: "upload/files"
    });

    const { post_url, get_url } = data.data;

    console.log("get_url_1", get_url)
    
    const options = {
      headers: {
        "Content-Type": file.type, 'acl': 'public-read',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total)
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        setUploadPercentage(percent)

        if( percent < 100 ){
          console.log("fewfe", percent);
        }
      }
    }
    console.log(post_url, get_url)
    const response = await axios.put(post_url, file, options);
     
    // return get_url;
    console.log("url",response, get_url);
  };


  const uploadFile = () => {
    inputFiles.current.click();
  };

  return (
    <div className="container">
      <div className="logout-button">
        <Button onClick={handleLogout} variant="outlined" startIcon={<LogoutIcon/>} >
          Logout
        </Button>
      </div>
      <div className="main">
        <div className='file-input'>
          <input type="file" name="images" id="imgid" className="imgcls" ref={inputFiles} onChange={handleFile} style={{display: 'none'}}/>
          <span onClick={uploadFile} className='button'>Choose</span>
          <label className='label'>{file.name ? file.name : "No file selected"}</label>
        </div>
        <div className='file-info'>
          <span className='file-info-input'>
            <TextField  id="standard-basic" label="Name" variant="standard" />
          </span>
          <div className='file-info-input'>
            <TextField  id="standard-basic" label="Description" variant="standard" />
          </div>
         
          <div className='upload-btn'>
            <Button onClick={uploadToAwsS3} variant="contained">Upload</Button>
          </div>
          <br />
          <br />
           <br/>
          <Progress type="circle" percent={uploadPercetage} />
        </div>
      </div>
    </div>
  )
}