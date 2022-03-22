import React, { useState , useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom'
import './dashboard.css';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { TextField } from '@mui/material';
import { Progress } from 'antd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Table, Tag, Space } from 'antd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Popconfirm, message } from 'antd';


export default function Dashboard() {
  
  const navigate = useNavigate();
  const [fileInfo, setFileInfo] = useState({ name: "", description: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [file, setFile] = useState({});
  const [uploadPercetage, setUploadPercentage] = useState(0);
  const inputFiles = useRef(null);

  const [uploadsData, setUploadsData] = useState([]);
  
  const handleFile = (e) => {
    console.log(e.target.files);
    const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
    if (fileSize > 1024) {
      alert('File size exceeds 1 GB');
    } else {
      setFile(e.target.files[0]);
    }
    
    
  }

  useEffect(() => {
    if (!localStorage.auth_token) {
      navigate('/');
    }
    getUserUploads();
    
  }, []);

  const getUserUploads = () => { 
    axios.get(`/api/user_uploads/${localStorage.user_id}`)
      .then(res => {
        setUploadsData(res.data.data)
      }).catch(err => {
      console.log(err)
    })
  };
  
  

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const uploadToAwsS3 = async () => {
    if (file && fileInfo.name && fileInfo.description) {
      setUploading(true);
      const { data } = await axios.post("/api/user_uploads/generate_presigned_url", {
        fileName: file.name,
        fileType: file.type,
        directory: "upload/files"
      });
      const { post_url, get_url, key } = data.data;
    
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
          setUploadPercentage(percent)
        }
      }
      console.log(post_url, get_url)
      const response = await axios.put(post_url, file, options);
      
      if (response.status === 200) {
        const res = await axios.post("/api/user_uploads", {
          user_id: localStorage.user_id,
          name: fileInfo.name,
          description: fileInfo.description,
          key: key,
          url: get_url,
          file_type: file.type,
        });
        getUserUploads();
        setOpenDialog(false);
        setUploading(false)
      }
    } else {
      alert("Please fill out all field")
    }
  };


  const uploadFile = () => {
    inputFiles.current.click();
  };

  const handleClose = () => { 
    setOpenDialog(false)
  };

  const handleDeleteFile = (obj) => {
    axios.delete(`/api/user_uploads/${obj.id}`, {
      data: {
        key: obj.key
      }
    })
      .then(res => {
        getUserUploads();
      }).catch(err => {
      console.log(err)
    })
  }


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
    },
     {
      title: 'Type',
      dataIndex: 'file_type',
      key: 'file_type',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <VisibilityIcon onClick={() => {
            window.open(record.url, '_blank').focus();
          }} />
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={()=>handleDeleteFile(record)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
             <a>Delete</a>
          </Popconfirm>
         
        </Space>
      ),
    },
  ];

  const handleDialogOpen = () => { 
    setOpenDialog(true);
    setFileInfo({ name: "", description: "" });
    setUploadPercentage(0)
    setFile({});
  };

  return (
    <div className="container">
      <div className="logout-button">
        <Button onClick={handleLogout} variant="outlined" startIcon={<LogoutIcon/>} >
          Logout
        </Button>
      </div>
      <div className="new-upload-button">
        <Button onClick={handleDialogOpen} variant="contained"  >
          New Upload
        </Button>
      </div>
      <div className="main">
        <Table columns={columns} dataSource={uploadsData} />
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Upload a new file</DialogTitle>
          <DialogContent>
            <div className='file-input'>
              <input type="file" name="images" id="imgid" className="imgcls" ref={inputFiles} onChange={handleFile} style={{display: 'none'}}/>
              <span onClick={uploadFile} className='button'>Choose</span>
              <label className='label'>{file.name ? file.name : "No file selected"}</label>
            </div>
            <div className='file-info'>
              <TextField
                value={fileInfo.name}
                onChange={(e) => setFileInfo(prevState => ({ ...prevState, name: e.target.value }))}
                id="standard-basic" label="Name"
                variant="standard" />
              <br/>
              <TextField
                value={fileInfo.description}
                onChange={(e) => setFileInfo(prevState => ({ ...prevState, description: e.target.value }))}
                id="standard-basic"
                label="Description"
                variant="standard" />
            
              <div className='upload-btn'>
                <Button onClick={uploadToAwsS3} disabled={uploading} variant="contained">{uploading ? "Uploading" : "Upload"}</Button>
              </div>
              <br />
              <br />
              <br/>
              <Progress type="circle" percent={uploadPercetage} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={uploading}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}