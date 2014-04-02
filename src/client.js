FileReaderObject = {
    previewImage: function(file, callback){
        var reader = new FileReader();
        reader.onload = function (e) {
            // check file
            if(!_.contains(FILEUPLOAD.IMG.TYPE, file.type)){
                callback(new Meteor.Error(412, "File format not supported. Please upload .jpg or .png"));
                return;
            }
            // check size
            if(file.size > FILEUPLOAD.IMG.MAXSIZE){
                callback(new Meteor.Error(412, "File is too large. 512kb size limit"));
                return;
            }
            file.result = e.target.result;
            callback(null, file);
        };
        reader.onerror = function () {
            callback(reader.error);
        };
        reader.readAsDataURL(file);
    }
};