/**
 * HELPERS
 */
var x, // x position of crop image
y, // y position of crop image
width, // width of crop image
height, // height of crop image
error, // 
saveAvatarButton,
modal,
realImage,
displayImage, 
isShowCropAndButton = false;

var widthAvatar = 128,
heightAvatar = 128;

Template.editYourAvatarModalBody.image = function(){
    if(Meteor.user())
        return Meteor.user().profile.image
    else
        return AVATAR; 
};
Template.editYourAvatarModal.rendered = function(){
    var tmpl = this;
    // cache the dom
    modal = $(tmpl.find('#editYourAvatarModal'));
    error = $(tmpl.find('.error'));
    saveAvatarButton = $(tmpl.find('#saveAvatarButton'));
    propSaveAvatarButton(false);
    realImage = tmpl.find('#realImage');
    modal.on('hide.bs.modal', function () {
        clear();
    });
    modal.on('show.bs.modal', function () {
        loadImage(tmpl, Meteor.user().profile.image);
        $(function () {
            displayImage.imgAreaSelect({ aspectRatio: '1:1', handles: true,
            fadeSpeed: 200, onSelectChange: preview, parent: $('.modal-content') });
        });
    });
};
Template.editYourAvatarModalBody.rendered = function(){
    displayImage = $(this.find('#avatarUserImg'));
    $(function () {
        displayImage.imgAreaSelect({ aspectRatio: '1:1', handles: true,
        fadeSpeed: 200, onSelectChange: preview });
    }); 
};
/**
 * EVENTS
 */
Template.editYourAvatarModalBody.events({
    "change input[name=avatarFile]": function(evt, tmpl){
        evt.preventDefault();
        var input = tmpl.find('input[name=avatarFile]');
        if(input.files && input.files[0]){
            FileReaderObject.previewImage(input.files[0], function(err, file){
                if (err){
                    error.html(createAlertDanger(err.message));
                    Meteor.setTimeout(function(){
                        error.html('');
                    }, 5000);
                }
                else {
                    loadImage(tmpl, file.result);
                    $(function () {
                        displayImage.imgAreaSelect({ aspectRatio: '1:1', handles: true,
                        fadeSpeed: 200, onSelectChange: preview });
                    });
                }
            });
        }
    },
    'click #changeAvatarButton': function(evt, tmp){
        evt.preventDefault();
        tmp.find('input[name=avatarFile]').click();
    }
});
Template.editYourAvatarModal.events({
    'click #saveAvatarButton': function(evt, tmp){
        evt.preventDefault();
        processChangeAvatar(tmp);
    },
    'keypress': function(evt, tmp){
        if(evt.charCode == 13){
            evt.preventDefault();
            modal.modal('hide');
        }
    }
});
/**
 * FUNCTION CLASS DEFINE
 */
var processChangeAvatar = function(tmp){
        var canvas = document.createElement("canvas");
        canvas.width = widthAvatar;
        canvas.height = heightAvatar;
        var scaleX = realImage.width / displayImage.width();
        var scaleY = realImage.height / displayImage.height();
        var ctx = canvas.getContext("2d");
        ctx.drawImage(realImage, x*scaleX, y*scaleY, width*scaleX, height*scaleY, 0, 0, widthAvatar, heightAvatar);
        Meteor.call('updateAvatar', canvas.toDataURL(), function(err, res){
            if (err){
                error.html(createAlertDanger(err.message));
                Meteor.setTimeout(function(){
                    error.html('');
                }, 5000);
            }
            else {
                modal.modal('hide');
            }
        });
};
function preview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    var scaleX = widthAvatar / selection.width;
    var scaleY = heightAvatar / selection.height;
    $('#preview img').css({
        width: Math.round(scaleX * img.width),
        height: Math.round(scaleY * img.height),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    x = selection.x1;
    y = selection.y1;
    width = selection.width;
    height= selection.height;
    if(!isShowCropAndButton){
        open();
    }
};
function propSaveAvatarButton(bool){
    if(saveAvatarButton)
        saveAvatarButton.prop('disabled', !bool);
};
function loadImage(tmp, src){
    $(tmp.find('#avatarUserImg')).attr('src', src);
    $(tmp.find('#preview img')).attr('src', src);
    $(tmp.find('#realImage')).attr('src', src);
};
function open(){
    propSaveAvatarButton(true);
    $('#previewFrame').removeClass('hide');
    isShowCropAndButton = true;
};
function clear(){
    // hide crop area
    $('.imgareaselect-border1').parent().hide();
    $('.imgareaselect-outer').hide();
    isShowCropAndButton = false;
    $('#previewFrame').addClass('hide');
    // reset input
    //http://stackoverflow.com/questions/16452699/how-to-reset-a-form-using-jquery-with-reset-method
    var inputAvatar = $('input[name=avatarFile]');
    inputAvatar.wrap('<form>').closest('form').get(0).reset();
    inputAvatar.unwrap();
};