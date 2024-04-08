import React, { useState, useEffect } from "react"
import MyTravelogList from "./components/MyTravelogList/MyTravelogList"
import MyTravelogHeader from "./components/MyTravelogHeader/MyTravelogHeader"
import MyTravelogFilter from "./components/MyTravelogFilter/MyTravelogFilter"
import { UpOutline, CloseCircleFill, StarFill, UploadOutlined } from "antd-mobile-icons"
import styles from "./MyTravelog.module.scss"
import { UserSpaceContentProvider } from "./UserSpaceContent"
import { UserContext } from "../../Context/UserContext"
import { card, Toast, Popup, Button, Slider } from "antd-mobile"
import "./MyTravelog.css"
import { $getMyTravelogs, $deleteTravelog } from "../../api/travelogApi"
import AvatarEditor from "react-avatar-editor"
import { $uploadAvatar, $getAvatar } from "../../api/userApi"

export default function MyTravelog() {
  const { UID, setUID, userName, setUserName } = React.useContext(UserContext)
  console.log(userName, UID)
  const [myTravelogList, setMyTravelogList] = useState([])
  const [totop, setTotop] = useState(true)
  const [visible, setVisible] = useState(false) //标志上传头像的弹出组件是否弹出
  const [avatarFile, setAvatarFile] = useState('')// 用于存储用户选择的头像文件
  const [avatarScale,setAvatarScale ] = useState(1)// 用于存放头像缩放倍率
  const [editor, setEditor] = useState(null);
  const MoMo = 'https://img1.baidu.com/it/u=1389873612,485301600&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1712682000&t=ff2af80b5ee2888d42c58c2aff22a8d3'
  //默认的头像地址(MOMO头像)

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(URL.createObjectURL(file)); // 将文件转换为 URL 并设置为 avatarFile
    }
  };

  const handleConfirm = () => {
    if (editor) {
      const canvas = editor.getImage();
      const croppedAvatarFile = canvas.toDataURL(); // 获取裁剪后的图像数据 URL
      // 此时 croppedAvatarFile 就是裁剪后的图像数据 URL
      console.log('url after cropping:', croppedAvatarFile);
    }
  };
  const handleChangeScale = (value) => {//修改图片缩放
    setAvatarScale(value * 0.01 + 1);
  };

  const changeAvatarComponent = (
    <div>
      <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
        <AvatarEditor
          ref={(ref) => setEditor(ref)}
          image={avatarFile}
          width={250}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={avatarScale}
          rotate={0}
          defaultValue={20}
        />
         
      </div>
      <input type="file" onChange={handleFileInputChange} style={{ display: "none" }} ref={(input) => input && input.setAttribute('accept', 'image/*')} />
      <Slider onAfterChange={handleChangeScale} />
      <Button
        block
        size="large"
        style={{ margin: "10px" }}
        onClick={() => document.querySelector('input[type="file"]').click()} // 点击按钮触发文件选择框
      >
        选择文件
      </Button>
      <Button
        block
        size="large"
        style={{ margin: "10px" }}
        onClick={handleConfirm}
      >
        确认
      </Button>
      <Button
        block
        size="large"
        style={{ margin: "10px" }}
        onClick={() => setAvatarFile('')}
      >
        取消
      </Button>
    </div>
  )
  // const [username, setUsername] = useState("MOMO")
  // const [uid, setUid] = useState("1145141919810")

  const [avatarUrl, setAvatarUrl] = useState(
    "https://img1.baidu.com/it/u=1389873612,485301600&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1712595600&t=76261ab2a1585815f46c7b306c6f66e3"
  )
  const loadingData = async () => {
    const res = await $getMyTravelogs()
    if (res.success) {
      setMyTravelogList(res.data)
    }
  }
  useEffect(() => {
    loadingData()
  }, [])

  //删除方法 传入id 返回bool 之后只从前端移除myTravelogList中对应项，不用重新请求、加载数据
  //通过props向下传
  const deleteTravelog = async id => {
    console.log("deleteTravelog", id)
    const res = await $deleteTravelog(id)
    console.log(res)
    if (res.success) {
      const newMyTravelogList = myTravelogList.filter(item => item._id !== id)
      setMyTravelogList(newMyTravelogList)
      Toast.show("删除成功")
    } else Toast.show("删除失败")
  }

  return (
    <>
      <UserSpaceContentProvider>
        <div className="background-image"></div>
        <MyTravelogHeader />
        <div className="user-space">
          <div className="content">
            <div className="avatar" onClick={() => setVisible(true)}>
              <Popup
                visible={visible}
                onMaskClick={() => {
                  setVisible(false)
                }}
                bodyStyle={{
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  minHeight: "40vh",
                }}>
                {changeAvatarComponent}
              </Popup>
              <img src={avatarUrl} alt="User Avatar" />
            </div>
            <div className="user-details">
              <div className="username">{userName ? userName : "MOMO"}</div>
              <div className="uid">UID: {UID ? UID : 1145141919810}</div>
              <div className="uid">tip:点击头像可以更换</div>
            </div>
          </div>
        </div>
        <MyTravelogFilter />
        <MyTravelogList myTravelogList={myTravelogList} deleteTravelog={deleteTravelog} />
        {totop ? (
          <div
            className={styles.totop}
            onClick={() => {
              // 点击后滚动到页面顶部
              window.scrollTo({
                top: 0,
                behavior: "smooth", // 平滑滚动
              })
            }}>
            <UpOutline style={{ fontSize: "1rem" }} />
          </div>
        ) : (
          <></>
        )}
      </UserSpaceContentProvider>
    </>
  )
}
