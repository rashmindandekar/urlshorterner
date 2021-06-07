require('dotenv').config();
var insafe = require('insafe');
const express = require('express');
const cors = require('cors');
const dns=require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;


var myurls=[];
const shortnums=[];
for(var i=0;i<5000;i++){
  shortnums[i]=i;
}

function getlongfromshort(urls,shortin){
  for(var i=0;i<urls.length;i++){
    if(urls[i].short_url ==  shortin) {
      return urls[i].original_url;
      }
  }
  return false;
}

function getshortfromlong(urls,longin){
  for (var i=0;i<urls.length;i++){
    if (urls[i].long == longin) {return urls[i].short;}
  }
  return false;
}

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));





function inputurl(req,res){
  console.log(req.body.url);
  if (is_url(req.body.url)){
  dns.lookup(req.body.url,(error)=>{
    if (error){
      return res.json({error:'invalid url'});
    }
    else{
      myurls.push({original_url:req.body.url, short_url:shortnums[myurls.length]});
      //console.log(myurls[myurls.length-1]);
      return res.json(myurls[myurls.length-1]);
    }
  });
  }
  else{
    return res.json({error:'invalid url'});
  }

}


app.post('/api/shorturl',inputurl);
app.get('/api/shorturl/:shorturl', (req,res)=>{
  var myshorturl=req.params.shorturl;
  var redirecturl=getlongfromshort(myurls,myshorturl);
  console.log(redirecturl);
  //res.json({out:myshorturl});
  res.redirect(redirecturl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

