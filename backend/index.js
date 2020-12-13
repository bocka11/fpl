const fetch = require('node-fetch');
const mongoose = require('mongoose');
const average = require('./model.js');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3333;
const playermodel = require('./playermodel.js');

const fpl_bootstrap_url = "https://fantasy.premierleague.com/api/bootstrap-static/";

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/fpl'

var data;

try{
    mongoose.connect(db_url, {useNewUrlParser: true});
    console.log("Connected to db");
}catch(err){
    console.log(err);
}


const HEADERS = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
  }

async function fetchBootstrap(){
    const response = await fetch(fpl_bootstrap_url,{headers:{...HEADERS}});
    const data = await response.json();
    console.log(Object.keys(data.events['0']));
    data.events.forEach(async (value)=>{
        if(value.finished){
            let pom = {};
            pom['gameweek'] = value.id;
            pom['average_points'] = value.average_entry_score;
            const dalipostoi = await average.findOne({gameweek:value.id});
           
            if(dalipostoi){
                console.log("Vekje postoi");
            }else{
            const average_entry = new average(pom);
            const created_entry =  await average_entry.save();
            console.log(created_entry);}
        }
    })
}

//fetchBootstrap();

async function fetchPlayerData(url){

    const response = await fetch(fpl_bootstrap_url,{headers:{...HEADERS}});
    const data = await response.json();
    //var pom = {};
    //console.log(Object.keys(data.elements[0]));
    //console.log(data.elements[0].firstname);
    data.elements.forEach(val=>{
        console.log(val);
    })
    data.elements.forEach(async (value)=>{
        let pom ={};
        let arr = [];
        pom['id']=value.id;
        pom['team']=value.team;
        pom['name']=value.web_name;
        //console.log(pom);
        let res = await fetch(`https://fantasy.premierleague.com/api/element-summary/${pom['id']}/`,{headers:{...HEADERS}});
        let fetchPlayerData = await res.json();
        //console.log(fetchPlayerData.history);
        arr = fetchPlayerData.history.map(value=>{
            let p = {};
            p['gameweek'] = value['round'];
            p['totalpoints'] = value.total_points;
            return p;
        });
        pom['points'] = arr;
        //const dalipostoi = playermodel.findOne({id:value.id});
        //console.log(dalipostoi);
        
        
            const player_entry = await new playermodel(pom);
            const created_entry = await player_entry.save();
            console.log("Zacuvan",created_entry);
        
    })
}


app.listen(port,()=>{
    console.log('Server started at ',port);
});

app.use(cors());

app.get('/average',async (req,res)=>{
    const records = await average.find();
    console.log(records);
    res.send(records);
})
app.get('/players',async (req,res)=>{
    const records = await playermodel.find();
    res.send(records);
})


