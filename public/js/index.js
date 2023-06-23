function convertImgToBase64(url, callback, outputFormat) {
  return new Promise((resolve) => {
    var canvas = document.createElement("CANVAS"),
      ctx = canvas.getContext("2d"),
      img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL(outputFormat || "image/png");
      resolve(dataURL);
    };
    img.src = url;
  });
}
async function getData(image) {
  const { data } = await axios.post(
    "https://aip.baidubce.com/rest/2.0/ocr/v1/table?access_token=24.1c18f781a5dc8afe89eff09834e6d0b0.2592000.1689241254.282335-34773198",
    {
      image,
      cell_contents: true,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data.tables_result[0].body;
}

function getTestCount(wordArr) {
  return wordArr.filter((item) => item.words.includes("单元")).length;
}
