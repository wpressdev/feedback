var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
if(res.locals.loggedinUser)
{alert('sdsad');
    res.render('add_consultant', { title: 'Express' });
    $('#consultants').change(function() 
    { 
        var selectedValue = parseInt(jQuery(this).val());
        var testval = $('#consultants').val();
        
//        //Depend on Value i.e. 0 or 1 respective function gets called. 
//        switch(selectedValue){
//            case 0:
//                handlerFunctionA();
//                break;
//            case 1:
//                handlerFunctionB();
//                break;
//            //etc... 
//            default:
//                alert("catch default");
//                break;
//        }
    });

//    function handlerFunctionA(){
//        alert("do some stuff");    
//    }
}
else
{
    res.render('signin', {title: 'Signin'});
}
});
module.exports = router;
