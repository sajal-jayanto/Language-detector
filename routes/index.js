const express = require('express');
const DetectLanguage = require('detectlanguage');


const router = express.Router();

const detectLanguage = new DetectLanguage({
  key: '4509463b9693038dc5c0ca257e1f663d',
  ssl: true
});

let  list , language , can = true;

(() => {
    detectLanguage.languages( (error, result) => {
        list = result
    });
})();

router.get('/', (req, res, next) =>{
    can = !can;
    if(can) {
        language = null;
        can = !can;
        return res.render('index');
    }
    return res.render('index' , {
        language : language
    });
});

router.post('/' , async (req ,res , next) =>{

    let dataSimple = req.body.text;
    await detectLanguage.detect(dataSimple, (error, result) =>{
        if(error) return res.status(500).json({
            error : error.details[0].message
        });
        list.forEach(id =>{
            if(id.code === result[0].language) {
                language = {
                    txt : dataSimple,
                    name : id.name
                };
            }
        });
        can = !can;
        res.redirect('/');
    });
});

module.exports = router;
