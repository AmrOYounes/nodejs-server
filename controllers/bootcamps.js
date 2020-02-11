const path = require('path');
var fs = require('fs');
let myarray = null;
let finaldata= [];
var JSZip = require('jszip');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require("../modules/Bootcamp");
const React = require('react');
const ReactDOMServer = require('react-dom/server');


exports.getBootcamps = async (req, res, next) => {
  // res.status(200).json({ success: true, msg: "show all bootacamps"});
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`bootcamp not found with id = ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(400).json({ success: false });
    // next(new ErrorResponse(`bootcamp not found with id = ${req.params.id}`, 404));
    next(error);
  }
};

exports.createBootcamp = async (req, res, next) => {
  // console.log(req.body)

  // res.status(200).json({ success: true, msg: "create new bootcamp" });
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bootcamp) {
      return res.status(400).json({
        success: false
      });
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
};
const addtoArray = object => {
  myarray.push(object);
}

exports.uploadFile =  async (req, res, next) => {
if(!req.files){
  return next(new ErrorResponse(`please upload a file `, 400));
}
const file = req.files.file;
file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
  if(err){
    console.log(err);
    return next( new ErrorResponse('erroe man ', 400))
  }
})
res.status(200).json({
  success: true,
});


console.log(req);

};




exports.deleteBootcamp =  async (req, res, next) => {
  try {
    const bootcamp =  await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp){
      return  res
      .status(400)
      .json({success: false});
    }
    res
    .status(200)
    .json({ success: true});
  } catch (error) {
    res.status(400)
    .json({success: false});
  }
  res
    .status(200)
    .json({ success: true, msg: `delete bootcamp with id = ${req.params.id}` });
};

exports.downloadFile =  async (req, res, next) => {
  finaldata= [];
  // res.download(path.join(__dirname ,'../index.html'))
  // var html = ReactDOMServer.renderToString(
  //   React.createElement('h1', null ,'asadsadsad')
  // );
 console.log(path.join(__dirname ,'../public/uploads'))
 const filenames = await fs.promises.readdir(path.join(__dirname ,'../public/uploads'));
   const promises=  filenames.map(async filename => {
      // console.log(filename);
     const data = await fs.promises.readFile(path.join(__dirname ,`../public/uploads/${filename}`));
       
        // JSZip.loadAsync(data).then(zip =>{
        //   // var files= Object.keys(zip.files);
        // //  console.log(zip);
        // // //  fs.readFile(files[1], (err, data)=>{
        // //   var stu= JSON.parse(data);
        // //   console.log(stu)
        // //  })
        // })
        // console.log(data)
       const zip = await JSZip.loadAsync(data);
          var files = Object.keys(zip.files);
        // console.log(files)
          // console.log(files);
          let index = files.indexOf('package.json');
          // console.log(index);
         const content = await zip.file('package.json').async('string');
        //  console.log(JSON.parse(content));
          return JSON.parse(content)
        //  const data1 = await fs.promises.readFile(files[index]);
            // var jsonData = JSON.parse(data1);
            // console.log(jsonData);
            // console.log(myarray)
            // myarray.push(jsonData);
            // console.log(promises)
            // return jsonData
            // addtoArray(jsonData)
          //  return
    
          })
          
          
          
         
myarray = await Promise.all(promises);
// myarray.map(object => {
// finaldata.push(object.rainbow);
// })
for(let object of myarray){
  finaldata.push(object.rainbow)
}
console.log(myarray.length)
console.log(myarray)
// console.log(finaldata)
res.json(finaldata)
};