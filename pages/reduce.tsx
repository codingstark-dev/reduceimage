import axios from "axios";
import b64toBlob from "b64-to-blob";
import Dropzone from "components/dropbox";
import Sidebar from "components/silder";
import fileDownload from "js-file-download";
import React, { useState } from "react";
import { FileWithPath } from "react-dropzone";
import Resizer from "react-image-file-resizer";
import { login, logout } from "../context/authcontext";

enum color {
  black = "000000",
  white = "ffffff",
  transparent = "0",
}
function reduce() {
  const [state, setState] = useState({
    file: null,
  });
  const [tempArr, settempArr] = useState<any[]>([]);

  const [metaImageData, setMetaImageData] = useState({
    bgcolor: color.transparent,
    quality: 100,
    lock: true,
    width: 0,
    height: 0,
    format: "png",
  });
  const [images, setImages] = useState<any[]>([]);

  const fileHandler = (e: FileWithPath[]) => {
    // console.log(e)
    console.log(e[0].name);
    setState({ ...state, file: e[0] });
  };
  const imageSelect = async (image: FileWithPath[]) => {
    const filteredImages = [];

    image.forEach((img) => {
      const s = new Image();
      s.src = URL.createObjectURL(img);
      s.addEventListener("load", () => {
        if (metaImageData.lock) {
          setMetaImageData({
            ...metaImageData,
            width: s.width,
            height: s.height,
          });
        }

        const width = Math.round((s.width * 70) / 100);
        const height = Math.round((s.height * 70) / 100);
        console.log(width, height);
        console.log(`${s.width}x${s.height}`);
        settempArr((e) => [
          ...e,
          { image: img, width: s.width, height: s.height },
        ]);
      });
    });
  };
  const fileUploader = () => {
    const formData = new FormData();

    formData.append("image", state.file, state.file.name);

    axios
      .post("http://localhost:3000/api/convert", formData)
      .then((res) => {
        const data = res.data;
        // console.log(data);
        const blob = b64toBlob(data.b64Data, data.contentType);
        // console.log(blob);
        const [fileName] = state.file.name.split(".");
        fileDownload(blob, `${fileName}-resized.${data.extension}`);
      })
      .catch((err) => {
        console.error(err);
      });

    // console.log(state.file)
  };
  // const resizeFile = (file) => {
  //   console.log(file);
  //   file.forEach((e) => {
  //     new Promise((resolve) => {
  //       Resizer.imageFileResizer(
  //         e,
  //         1000,
  //         1000,
  //         "PNG",
  //         100,
  //         0,
  //         (uri) => {
  //           console.log(uri);
  //           resolve(uri);
  //         },
  //         "base64"
  //       );
  //     });
  //   });
  // };

  const getReduceIMages = () => {
    tempArr.forEach((e) => {
      new Promise((resolve) => {
        const formData = new FormData();

        formData.append("image", e.image, e.image.name);
        axios
          .post(
            `http://localhost:3000/api/convert?format=${metaImageData.format}&color=${metaImageData.bgcolor}&quality=${metaImageData.quality}`,
            formData
          )
          .then((res) => {
            resolve(res.data);
            setImages((prev) => [...prev, res.data]);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    });
  };
  let finalFormat = ["jpeg", "jpg", "png", "webp", "heif", "gif", "tiff", "svg", "avif","heic"];
  return (
    <div>
      <button onClick={login}> Login </button>
      <button onClick={logout}> Logout </button>
      {/* <div className="flex flex-col items-center justify-center min-h-screen py-2">
      </div> */}
      {/* <Sidebar /> */}

      {/* create a div with purple  color */}
      <div
        title="ss"
        className="bg-split-white-black flex justify-center items-center py-10"
      >
        <Dropzone
          convertimgToJpg={imageSelect}
          ready={true}
          converting={false}
        />
      </div>

      <div className="flex flex-wrap justify-center">
        {tempArr.length != 0
          ? [...tempArr].map((item, index) => {
            return (
              <img
                key={index}
                src={item != null ? URL.createObjectURL(item["image"]) : ""}
                // width="750px"
                className=" w-40"
              />
            );
          })
          : ""}
      </div>
      <div>
        <div className=" mx-auto flex justify-center px-5">
          <div className="bg-white  w-full shadow-md border border-gray-200 rounded-lg  p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-6" >
              <h3 className="text-xl text-center font-medium text-gray-900 dark:text-white">
                Choose new size and format
              </h3>
              <div className="flex space-x-2 items-center">
                <div>
                  <div className="flex items-center pb-2">
                    <label className="text-base font-medium leading-none text-gray-800 dark:text-white pr-3">
                      Width{" "}
                    </label>

                    <input
                      defaultValue={metaImageData.width}
                      type="number"
                      placeholder="width"
                      className=" leading-none px-3 w-20 py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="text-base font-medium leading-none text-gray-800 dark:text-white pr-2">
                      Height{" "}
                    </label>

                    <input
                      type="number"
                      defaultValue={metaImageData.height}
                      placeholder="height"
                      className=" leading-none px-3 w-20 py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap flex-col">
                  <div
                    className={
                      metaImageData.lock == true
                        ? "!block div-border1"
                        : "!hidden div-border1"
                    }
                  ></div>
                  <div
                    className="lock-container"
                    onClick={() => {
                      setMetaImageData({
                        ...metaImageData,
                        lock: !metaImageData.lock,
                      });
                    }}
                  >
                    <img
                      className={
                        metaImageData.lock == false ? "!block" : "!hidden"
                      }
                      src="open.png"
                    />
                    <img
                      className={
                        metaImageData.lock == true ? "!block" : "!hidden"
                      }
                      src="lock.png"
                    />
                  </div>
                  <div
                    className={
                      metaImageData.lock == true
                        ? "!block div-border2"
                        : "!hidden div-border2"
                    }
                  ></div>
                </div>

                <div>
                  <select
                    className=" px-4 w-[120x] py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50    border-gray-300  text-white h-10 bg-blue-700   hover:border-gray-400"
                    defaultValue="Percent"
                  >
                    {/* <option disabled></option> */}
                    <option value="portrait">Percent</option>
                    <option value="landscape">Pixel</option>
                  </select>
                </div>
              </div>
              <hr />
              <div className="flex space-x-3">
                <div>
                  <label className="text-base text-center font-medium leading-none text-gray-800 dark:text-white py-2">
                    Final Format
                  </label>
                  <br />
                  <select
                    className=" px-4 w-[120x] py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50    border-gray-300  text-white h-10 bg-blue-700   hover:border-gray-400"
                    defaultValue="png"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setMetaImageData({
                        ...metaImageData,
                        format: e.target.value,
                      });
                    }}
                  >
                    {/* <option disabled></option> */}
                    {finalFormat.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-base text-center font-medium leading-none text-gray-800 dark:text-white py-2">
                    Quality{" "}
                  </label>
                  <br />
                  <input
                    type="number"
                    defaultValue={metaImageData.height}
                    placeholder="quality"
                    className=" leading-none px-3 w-14 h-10 py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50"
                  />
                  %
                </div>{" "}
                <div >
                  <label className="text-base text-center font-medium leading-none text-gray-800 dark:text-white py-2">
                    Background                  </label>
                  <div className="flex justify-center ">
                    <div
                      className={
                        metaImageData.bgcolor != color.white
                          ? "bg-white w-8 h-8  rounded-full border-2 shadow-xl"
                          : "bg-white w-8 h-8  rounded-full border-2 ring shadow-xl"
                      }
                      onClick={() => {
                        setMetaImageData({
                          ...metaImageData,
                          bgcolor: color.white,
                        });
                      }}
                    ></div>
                    <div
                      className={
                        metaImageData.bgcolor != color.black
                          ? "bg-black w-8 h-8  rounded-full border-2 shadow-xl"
                          : "bg-black w-8 h-8  rounded-full  border-2 ring shadow-xl"
                      }
                      onClick={() => {
                        setMetaImageData({
                          ...metaImageData,
                          bgcolor: color.black,
                        });
                      }}
                    ></div>
                  </div></div>
              </div>

              <hr />
              <button
                onClick={getReduceIMages}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Resize              </button>

            </div>
          </div>
        </div>
      </div>
      <div>
        {images.map((e, i) => {
          console.log(e["b64Data"]);
          return (
            <img
              src={`data:image/${e["extension"]};base64,` + e["b64Data"]}
              key={i}
              alt=""
            />
          );
        })}
        {/* {images.map((e) => {
          return <div>{e}</div>;
        })} */}
      </div>
    </div>
  );
}

export default reduce;
