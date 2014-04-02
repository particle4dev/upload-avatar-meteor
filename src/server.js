Meteor.methods({
    updateAvatar: function(base64) {
        var id = this.userId;
        if (!id) {
            throw new Meteor.Error(403, "You must be logged in");
        }
        try {
            validateImgBase64(base64);
            return Meteor.users.update({_id: id},
                {$set: {'profile.image': base64, 'profile.upgraded': new Date()}}
            );
        }
        catch(e){
            throw new Meteor.Error(403, e.message);
        }    
        return true;
    }
});