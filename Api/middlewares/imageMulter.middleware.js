const multer=require("multer");
const util=require('util')
const path=require("path");
const num=1000000;
	const storage= multer.diskStorage({
	    destination:"ShopImages",
        filename:async(req,file,cb)=>
		 cb(null,`${file.fieldname}${Math.floor(Math.random() * num)}_${Date.now()}${path.extname(file.originalname)}`)
	    
	});

    const checkFileType1=(req,file,cb)=>{
        const imageExtTypes = [ '.jpg','.jpeg','.png','.gif'];
        const imageFileTypes = 'image/'
        const extName=imageExtTypes.includes(path.extname(file.originalname).toLowerCase())
        const mimeType=(file.mimetype.startsWith(imageFileTypes));
       req.isFileValid=extName && mimeType  
        if(req.isFileValid===false){
            return cb(null,req.isFileValid)
        }
         else {
         return cb(null,true)
         }
        };
  
         const upload=multer({
            storage:storage,
            fileFilter:(req,file,cb)=>{
                checkFileType1(req,file,cb);
            },
            limits:{
                fileSize:2 * 1024 * 1024, 
            }
        })

        module.exports={upload,checkFileType1};
