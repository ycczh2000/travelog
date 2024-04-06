/*
 * @Author: Sueyuki 2574397962@qq.com
 * @Date: 2024-03-27 18:42:58
 * @LastEditors: Sueyuki 2574397962@qq.com
 * @LastEditTime: 2024-04-03 20:45:43
 * @FilePath: \frontend\src\pages\Publish\Publish.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Publish.js

import React, { useState, useRef, useEffect } from "react"
import "./Publish.css"
import ImageUpload, { getFileList } from "../../components/ImageUpload/ImageUpload"
import Editing from "../../components/Editing/Editing"
import { LeftOutline } from "antd-mobile-icons"
import { Button, Modal, Toast } from "antd-mobile"
import { DownlandOutline, EyeOutline } from "antd-mobile-icons"
import { sendTraveLogToServer } from "../../api/userApi"
import {
  $createEditTravelog,
  $updateEditTravelog,
  $hasEditTravelog,
  $getEditTravelog,
  $publishEditTravelog,
} from "../../api/travelogApi"

const Publish = () => {
  const [fileList, setFileList] = useState([])
  const [editingData, setEditingData] = useState({})
  const imageUploadRef = useRef(null)
  const editingRef = useRef(null)
  const [editId, setEditId] = useState("")

  const loadEditTravelog = async () => {
    await Modal.alert({
      content: "人在天边月上明",
    })
    Toast.show({ content: "已关闭", position: "bottom" })
  }

  //自动加载编辑状态的游记
  const hasEditTravelog = async () => {
    const res = await $hasEditTravelog()
    console.log("$hasEditTravelog", res)
    const editId = res.data?.editId
    console.log("editId", editId)
    if (editId) {
      setEditId(editId)
      const result = await $getEditTravelog()
      const editData = result.data?.edit
      setEditingData(editData)
    } else {
      const result = await $createEditTravelog()
      console.log("createEditTravelog", result)
      const editId = result.data?.newEdit?._id
      setEditId(editId)
    }
  }

  //初始加载时，判断是否有编辑状态的游记
  useEffect(() => {
    hasEditTravelog()
  }, [])

  // useEffect(() => {}, [editId])

  const getEditTravelog = async () => {
    //确认有无编辑状态的游记 返回 游记id
    const res = await $hasEditTravelog()
    console.log("$hasEditTravelog", res)
    // const result = await $createEditTravelog()
    // if (result.data?.newEdit?._id) {
    //   setEditId(result.data?.newEdit?._id)
    // }
    // console.log(result)
  }

  const handlePublishClick2 = async () => {
    const editingData = editingRef.current.getEditingData()

    if (editingData.title.length < 1 || editingData.title.length > 20) {
      alert("Title length should be between 1 and 20 characters.") // 使用alert弹出消息提示
      return
    }
    const result = await $publishEditTravelog({ editId: editId })
    console.log("handlePublishClick2", result)
  }
  // const handlePublishClick = async () => {
  //   const imageUploadInstance = imageUploadRef.current
  //   const fileList = await imageUploadInstance.getFileList()
  //   console.log(fileList)

  // const editingData = editingRef.current.getEditingData()

  // if (editingData.title.length < 1 || editingData.title.length > 20) {
  //   alert("Title length should be between 1 and 20 characters.") // 使用alert弹出消息提示
  //   return
  // }
  //   const convertedFiles = fileList.map((file, index) => {
  //     return {
  //       key: "image" + (index + 1), // 使用索引来生成唯一的key，如image1, image2, ...
  //       type: "file",
  //       src: file.url, // 假设File对象有一个"url"属性表示文件路径
  //     }
  //   })

  //   const imgInfo = {
  //     key: "imgInfo",
  //     value: JSON.stringify(convertedFiles.map(file => file.key)), // 将key值列表转换为JSON字符串
  //     type: "text",
  //   }

  //   // 输出转换后的文件列表
  //   // console.log(convertedFiles);
  //   // for (const key in fileList) {
  //   //   if (Object.hasOwnProperty.call(fileList, key)) {
  //   //     console.log(`${key}:`, fileList[key]);
  //   //   }
  //   // }

  //   // console.log(fileList, editingData);
  //   // // 将处理后的数据传输到服务端
  //   console.log("Publish clicked!", convertedFiles, imgInfo, editingData)
  //   sendTraveLogToServer(convertedFiles, imgInfo, editingData)
  //   // 发布游记后，销毁本地存储中的草稿数据
  //   localStorage.removeItem("draftData")
  // }

  const handleSaveDraftClick = async () => {
    const fileList = imageUploadRef.current.getFileList()
    const editingData = editingRef.current.getEditingData()
    const result = await $updateEditTravelog({ editData: editingData, editId: editId })
    console.log(editingData)
    console.log(result)
    setEditingData(result.data)
    const draftData = JSON.stringify({ fileList, editingData })
    localStorage.setItem("draftData", draftData)
    console.log("Draft saved!")
  }
  // useEffect(() => {
  //   const draftData = localStorage.getItem("draftData")
  //   if (draftData) {
  //     const { fileList, editingData } = JSON.parse(draftData)
  //     setFileList(fileList)
  //     setEditingData(editingData)
  //     console.log("draft loaded")
  //     console.log(fileList, editingData)
  //   }
  // }, [])
  return (
    <div style={{ margin: "10px" }}>
      {" "}
      {/* 添加外边距 */}
      <div>
        <Button
          style={{ background: "transparent", border: "none" }}
          onClick={() => {
            /* 透明按钮的点击事件 */
          }}>
          <LeftOutline />
        </Button>
      </div>
      <div style={{ margin: "10px", marginTop: "0px" }}>
        <ImageUpload ref={imageUploadRef} fileList={fileList} />
        <Editing ref={editingRef} editingData={editingData} />
      </div>
      <div style={{ position: "absolute", bottom: "10px", left: "0", right: "0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
          <Button onClick={handleSaveDraftClick} style={{ background: "transparent", border: "none" }}>
            <DownlandOutline /> 存草稿
          </Button>
          <Button style={{ background: "transparent", border: "none" }}>
            <EyeOutline /> 预览
          </Button>
          <Button
            onClick={handlePublishClick2}
            style={{ backgroundColor: "red", color: "white", borderRadius: "20px", flex: "1", marginLeft: "10px" }}>
            发布游记
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Publish
