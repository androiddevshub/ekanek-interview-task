import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function ShortUrl() {
  let { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  useEffect(() => {
    removeTempUrl();
    setLoading(true);
    axios
      .get(`/api/short_links/redirect/${slug}`, {
        headers: {
          "Auth-Token": localStorage.auth_token,
        },
      })
      .then((res) => {
        const data = res.data.data;
        console.log(data);
        setLoading(false);
        window.location = data.url;
      })
      .catch((err) => {
        const error = err.response.data;
        console.log(error);
        if ("logged_in" in error) {
          alert("Please login to access the url");
          localStorage.setItem("temp_short_url", window.location.href);
          navigate("/");
        } else {
          alert(error.message);
        }
        setLoading(false);
      });
  }, []);

  const removeTempUrl = () => {
    if (localStorage.temp_short_url) {
      localStorage.removeItem("temp_short_url")
    }
  }

  return (
    <div style={{}}>
      {loading ? <Spin indicator={antIcon} /> : "Close the current tab"}
    </div>
  );
}
