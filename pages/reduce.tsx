import axios from "axios";
import b64toBlob from "b64-to-blob";
import Dropzone from "components/dropbox";
import Sidebar from "components/silder";
import fileDownload from "js-file-download";
import React, { useState } from "react";
import { FileWithPath } from "react-dropzone";
import Resizer from "react-image-file-resizer";
enum color {
  black = "000000",
  white = "ffffff",
}
function reduce() {
  const [state, setState] = useState({
    file: null,
  });
  const [tempArr, settempArr] = useState<any[]>([]);

  const [metaImageData, setMetaImageData] = useState({
    "Content-Type": "",
    bgcolor: color.white,
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
        console.log(`${s.width}x${s.height}`);
        settempArr((e) => [
          ...e,
          { image: img, width: s.width, height: s.height },
        ]);
      });
    });
  };
  console.log(tempArr);
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
        console.log(
          `http://localhost:3000/api/convert?format=png&color=${metaImageData.bgcolor}`
        );
        formData.append("image", e.image, e.image.name);
        axios
          .post(
            `http://localhost:3000/api/convert?format=png&color=${metaImageData.bgcolor}`,
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

  return (
    <div>
      {/* <div className="flex flex-col items-center justify-center min-h-screen py-2">
      </div> */}
      <Sidebar />

      {/* create a div with purple  color */}
      <div className="bg-split-white-black flex justify-center items-center py-10">
        <Dropzone
          convertimgToJpg={imageSelect}
          ready={true}
          converting={false}
        />
      </div>
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
      </div>
      {/* <div className="flex justify-center">
        <div className=" m-auto ">
          <div className="flex space-x-2  ">
            <div>
              <label className="text-xs font-medium leading-none text-gray-800 dark:text-white pl-1">
                Enter Margin. (optional)
              </label>
              <br />
              <input
                type="number"
                min={0}
                placeholder="Default: 0.5cm"
                className=" leading-none px-4 w-44 py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50"
              />
            </div>
            <div className="relative inline-flex">
              <div>
                <label className="text-xs font-medium leading-none text-gray-800 dark:text-white pl-1">
                  Paper Size. (optional)
                </label>
                <br />
                <select
                  className="leading-none px-4 w-[160px] py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50    border-gray-300  text-gray-600 h-10 pl-5  hover:border-gray-400  appearance-none"
                  defaultValue="A4"
                >
                  <option disabled>Choose PaperSize</option>
                  {/* {listOFpaperSize.map((e) => {
                    return (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    );
                  })} 
                </select>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {" "}
            <div>
              <label className="text-xs font-medium leading-none text-gray-800 dark:text-white pl-1">
                File Name. (optional)
              </label>
              <br />
              <input
                type="text"
                placeholder="Default: Export.pdf"
                className=" leading-none px-4 w-44 py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="text-xs font-medium leading-none text-gray-800 dark:text-white pl-1">
                Orientation. (optional)
              </label>
              <br />
              <select
                className="leading-none px-4 w-[160px] py-2 rounded-lg border dark:border-gray-500 dark:text-white dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-gray-500 focus:ring-opacity-50    border-gray-300  text-gray-600 h-10 pl-5  hover:border-gray-400  appearance-none"
                defaultValue="portrait"
              >
                <option disabled>Choose Orientation</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
        </div>{" "}
      </div> */}
      <div className="flex flex-wrap">
        {tempArr.length != 0
          ? [...tempArr].map((item, index) => {
              return (
                <img
                  key={index}
                  src={item != null ? URL.createObjectURL(item["image"]) : ""}
                  // width="750px"
                  className=" w-2/6"
                />
              );
            })
          : ""}
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

      <button onClick={getReduceIMages}>get</button>
    </div>
  );
}

export default reduce;
